<!-- The README section ends with a pointer to its roadmap; the site shows it without. -->

`sas-plus` provides building blocks for planning heuristics and search in Rust, in the spirit of crates like `tower`: small pieces you can reason about one at a time. It is not a planner itself, but meant for people who write or test such algorithms.

`Task` and `LabeledTransitionSystem` are plain structs with public fields: a task is its variables, operators, initial state, goal and axioms, and a transition system is a list of labeled transitions with a goal flag per state. The one abstraction on top is the `Abstraction` trait, which maps a concrete state to a state of a transition system; anything that implements it, a `Projection` or a type of your own, can stand in wherever a heuristic needs abstract goal distances. The crate has no required dependencies and is `no_std`; it only needs `alloc`.

For testing, `Task::perfect_heuristic()` computes the exact goal distance h\* on small tasks, and `random::random_task` generates reproducible tasks from a seed, so a heuristic can be checked against h\* over as many seeds as you care to run. On top of that, the `fdr` module reads Fast Downward's translator output, which brings real benchmark domains in without writing a grounder.

There is no search algorithm and no PDDL parser. To ground PDDL into a SAS+ task, the `sas-plus` feature of [`pddl`](https://github.com/sunsided/pddl-rs) does that.
