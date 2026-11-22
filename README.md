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

`task sync` (`scripts/sync.ts`) snapshots the released crates from crates.io into
`src/lib/data/`. The deploy workflow runs it before every build and every night, so a release
reaches the site by the next morning. The snapshot is committed for offline work.

- The crate list, its categories and their colours are in `src/lib/registry.ts`.
- The sparse index gives each crate's latest release and its dependencies on the others. The
  published `.crate` gives the description, licence, MSRV, keywords, repository and README.
- A crate page shows the README's "Who this is for" section. It shows
  `content/overrides/<crate>.md` instead where one exists, and the README's opening prose for
  a release that has no such section.
- `content/algorithms.json` is the curated algorithm list: name, aliases, kind, references,
  and per crate the public items that run it. The sync keeps an implementation only if its
  items are public in the released source, so the list can run ahead of a release.
  It lists what a crate offers its users; test baselines and oracles (a reference
  Dijkstra, an exact h\* for checking heuristics) stay out.
- The rest of each README (`readmes.json`) feeds search as a weaker signal. It is loaded
  when the search palette first opens.

The sync fails on a section the site would show with schedule wording ("roadmap", "not yet",
"pre-release", …). On the nightly run, that leaves the last deploy in place.

## Layout

- `src/lib/design/` holds the tokens (primitives and semantic `light-dark()` pairs) and the
  element defaults.
- `src/lib/components/` is organised as atoms, molecules, organisms and templates, each with
  its stories. Routes only resolve links and pass data into templates.
- The theme is `auto` by default and follows the system; a pinned light or dark choice is
  stored in `localStorage` and applied before first paint by the script in `src/app.html`.

## License

The code is licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE))
- MIT license ([LICENSE-MIT](LICENSE-MIT))

at your option.

The page text under `content/` (algorithm descriptions, pseudocode and crate overrides) is
licensed under [Creative Commons Attribution 4.0 International](LICENSE-CC-BY-4.0). The crate
data in `src/lib/data/` is taken from the crates' published READMEs and metadata and stays
under each crate's own license.
