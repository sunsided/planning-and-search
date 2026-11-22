"""Keep the "Planning & Search" GitHub project in sync with the planning repositories.

Adds every issue, and every human pull request opened since `since`, from the repositories in
`config.json` to the project, and fills its fields:

- Area: from the repository (one area per repository in `config.json`).
- Kind: Epic for titles starting with "Epic:", otherwise inferred from labels and the title.
- Status: Done when closed or merged, In Progress for open pull requests, Todo for open issues.
- Start / Target: creation date, and closing or merge date once done.

Items already in the project keep their Area, Kind and Start; only Status and Target follow
state changes (closing, merging, reopening). Epic status is left as set by hand while open.
Pull requests closed without merging are not added, but items added while they were open are
marked Done like any other closed item.

A failing repository or item is reported and counted, and the run continues with the rest;
the job fails at the end if anything failed. Area and Kind names are checked against the
project's options before anything is written.

Needs `gh` authenticated with a token that has the `project` and `repo` scopes (GH_TOKEN).
"""

import json
import pathlib
import re
import subprocess
import sys

CONFIG = json.loads((pathlib.Path(__file__).parent / "config.json").read_text(encoding="utf-8"))
OWNER = CONFIG["owner"]
NUMBER = str(CONFIG["project"])
KINDS = ("Epic", "Feature", "Research", "Fix", "Infrastructure", "Release")
BOT = re.compile(r"dependabot|release-plz|github-actions|^app/")


def gh(*args):
    """Run gh and return its standard output."""
    return subprocess.run(["gh", *args], capture_output=True, text=True, check=True).stdout


def gh_json(*args):
    """Run gh and parse its JSON output."""
    return json.loads(gh(*args))


def kind_of(title, labels):
    """Infer the Kind of a new item from its title and labels."""
    t, labels = title.lower(), {label.lower() for label in labels}
    if t.startswith("epic:"):
        return "Epic"
    if t.startswith("release "):
        return "Release"
    if "research" in labels or t.startswith("research:"):
        return "Research"
    if "bug" in labels or re.search(r"\b(fix|panic|crash|wrong|ignored|never|swallows|broken)\b", t):
        return "Fix"
    if re.search(r"\b(reserve the crate name|harden|ci\b|lint|cargo\.lock|dependabot|sbom|code security"
                 r"|link the crate|readme|workflow|toolchain|msrv)\b", t):
        return "Infrastructure"
    return "Feature"


def main():
    """Sync all configured repositories into the project."""
    project_id = gh_json("project", "view", NUMBER, "--owner", OWNER, "--format", "json")["id"]
    fields = {f["name"]: f for f in gh_json("project", "field-list", NUMBER, "--owner", OWNER, "--format", "json")["fields"]}
    items = {i["content"].get("url"): i for i in gh_json("project", "item-list", NUMBER, "--owner", OWNER,
                                                         "--limit", "5000", "--format", "json")["items"]}

    def option(field, name):
        found = next((o["id"] for o in fields.get(field, {}).get("options", []) if o["name"] == name), None)
        if found is None:
            raise LookupError(f"project has no {field} option named {name!r}")
        return found

    for area in CONFIG["areas"]:
        option("Area", area)
    for kind in KINDS:
        option("Kind", kind)

    def set_single(item, field, name):
        gh("project", "item-edit", "--id", item, "--project-id", project_id, "--field-id", fields[field]["id"],
           "--single-select-option-id", option(field, name))

    def set_date(item, field, value):
        gh("project", "item-edit", "--id", item, "--project-id", project_id, "--field-id", fields[field]["id"],
           "--date", value)

    def clear(item, field):
        gh("project", "item-edit", "--id", item, "--project-id", project_id, "--field-id", fields[field]["id"],
           "--clear")

    added = updated = failed = 0
    for area, repos in CONFIG["areas"].items():
        for repo in repos:
            full = f"{OWNER}/{repo}"
            try:
                issues = gh_json("issue", "list", "-R", full, "--state", "all", "--limit", "1000",
                                 "--json", "url,title,state,createdAt,closedAt,labels")
                prs = [p for p in gh_json("pr", "list", "-R", full, "--state", "all", "--limit", "1000",
                                          "--json", "url,title,state,createdAt,mergedAt,closedAt,author,headRefName,labels")
                       if not BOT.search(p["author"]["login"]) and not p["headRefName"].startswith("release/")
                       and p["createdAt"][:10] >= CONFIG["since"]]
            except subprocess.CalledProcessError as err:
                failed += 1
                print(f"FAILED {full}: {err.stderr.strip()[:200]}", file=sys.stderr, flush=True)
                continue
            for entry, is_pr in [(i, False) for i in issues] + [(p, True) for p in prs]:
                url = entry["url"]
                done = entry["state"] in ("CLOSED", "MERGED")
                end = entry.get("mergedAt") or entry.get("closedAt")
                epic = entry["title"].lower().startswith("epic:")
                status = "Done" if done else ("In Progress" if is_pr else "Todo")
                try:
                    if url in items:
                        current = items[url].get("status")
                        if done and current != "Done":
                            set_single(items[url]["id"], "Status", "Done")
                            if end:
                                set_date(items[url]["id"], "Target", end[:10])
                            updated += 1
                        elif not done and current == "Done":
                            set_single(items[url]["id"], "Status", status)
                            clear(items[url]["id"], "Target")
                            updated += 1
                        continue
                    if is_pr and entry["state"] == "CLOSED":
                        continue
                    item = gh_json("project", "item-add", NUMBER, "--owner", OWNER, "--url", url, "--format", "json")["id"]
                    labels = [label["name"] for label in entry.get("labels", [])]
                    set_single(item, "Status", status)
                    set_single(item, "Area", area)
                    set_single(item, "Kind", "Epic" if epic else kind_of(entry["title"], labels))
                    set_date(item, "Start", entry["createdAt"][:10])
                    if done and end:
                        set_date(item, "Target", end[:10])
                    added += 1
                    print(f"added {status:11} {area:26} {url}", flush=True)
                except (subprocess.CalledProcessError, LookupError) as err:
                    failed += 1
                    detail = err.stderr.strip()[:200] if isinstance(err, subprocess.CalledProcessError) else err
                    print(f"FAILED {url}: {detail}", file=sys.stderr, flush=True)
    print(f"added {added}, updated {updated}, failed {failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
