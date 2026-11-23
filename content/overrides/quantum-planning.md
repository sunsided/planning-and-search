<!-- quantum-planning 0.1.0's README section ends on the algorithms that "are planned, not built yet"; this is the section without that sentence. Remove once a release drops it. -->

- **Researchers, students and teachers of quantum speedups for search**: exact Grover search
  with a known number of solutions and BBHT exponential search with an unknown number, on a
  state-vector simulator. The oracle is an ordinary validity check on a candidate, such as
  "is this plan valid", so the same predicate serves a classical and a quantum search.
- **Honest query-count comparisons**: every phase-oracle application and every classical
  check of a measured candidate counts as one query. Put these counts next to a classical
  scan over the same oracle, and the `√N` against `N` gap shows on real instances, not
  only in the formula.
- **`no_std` demos**: the crate needs only `alloc`, so it runs in WebAssembly, for example
  in a browser page that shows the amplitudes change from one Grover iteration to the next.

It is a simulator: its memory doubles with each qubit and stops at 24 qubits, so it finds no
solution faster than a classical search does. To solve plans, use
[heuristic-search](https://github.com/sunsided/heuristic-search) for state-space search,
[constraint-search](https://github.com/sunsided/constraint-search) for constraint problems
and [game-tree-search](https://github.com/sunsided/game-tree-search) for two-player games.
