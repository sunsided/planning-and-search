# Planning & Search in Rust

The overview site for the planning and search crates: one page per crate at
`/crates/<name>/`, each pointing to the crate's repository, crates.io and docs.rs, grouped by
topic on the front page. Static SvelteKit, prerendered and served from GitHub Pages at
<https://sunsided.github.io/planning-and-search/>, with its design system in Storybook at
`/storybook/`.

## Working on it

Node 26 (`.nvmrc`) with Yarn 4 through Corepack, and [Task](https://taskfile.dev):

```sh
corepack enable
task dev          # site on :5173
task storybook    # components on :6006
task ci           # lint, type check, tests, build (site + Storybook into build/)
```

## Where the content comes from

`src/lib/data/crates.json` is a snapshot, committed, because CI has no crate checkouts.
`task sync` rebuilds it from the local repositories (`PLANNING_DIR`, default
`~/dev/mine/rust/planning`):

- the crate list and the dependency edges between crates from `plan/crates.json`,
- description, licence, MSRV, keywords and workspace siblings from `cargo metadata`,
- the "Who this is for" section of each README, or `content/overrides/<crate>.md` where a
  README has none or says something the site should not.

The sync fails on a crate without an audience section, and on schedule wording ("roadmap",
"not yet", "pre-release", …). Categories, their order and their colours live in
`src/lib/registry.ts`; the tests fail when a crate is in no category.

## Layout

- `src/lib/design/` holds the tokens (primitives and semantic `light-dark()` pairs) and the
  element defaults.
- `src/lib/components/` is organised as atoms, molecules, organisms and templates, each with
  its stories. Routes only resolve links and pass data into templates.
- The theme is `auto` by default and follows the system; a pinned light or dark choice is
  stored in `localStorage` and applied before first paint by the script in `src/app.html`.
