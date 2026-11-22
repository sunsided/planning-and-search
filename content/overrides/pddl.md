<!-- pddl 0.5.0 was released before its README had this section; every feature it names (macros, codegen, sas-plus) is in that release. Remove once a release carries the section. -->

- Planner and tool authors who need to read PDDL in Rust and would rather match on typed goal descriptions and effects than walk an S-expression tree.
- People writing or teaching PDDL, who get a language server for their editor ([`pddl-lsp`](https://github.com/sunsided/pddl-rs/tree/main/pddl-lsp)) and a validator that explains why a plan fails ([`pddl-validate`](https://github.com/sunsided/pddl-rs/tree/main/pddl-validate)).
- Rust developers who ship PDDL with their program and want syntax errors to fail the build, or a domain compiled into typed planning code instead of interpreted at run time.
- Researchers who want Fast Downward's `output.sas` format from PDDL without leaving Rust, for example to feed [`sas-plus`](https://github.com/sunsided/sas-plus) heuristics.
- If you want a planner rather than a parser, [`miniplan`](https://github.com/sunsided/miniplan) grounds and solves PDDL tasks on top of this crate.
