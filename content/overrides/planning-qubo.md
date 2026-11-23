<!-- planning-qubo 0.1.0's README section says export "is planned" and QAOA "is planned in quantum-planning"; this is the section without those two sentences. Remove once a release drops them. -->

- **People with access to a quantum annealer or a QAOA setup** who need planning,
  scheduling or assignment problems as QUBO or Ising models. The penalty builder turns
  named variables and constraints (exactly-one, at-most-one, linear with slack bits) into
  a model, and the decoders map a sample back to a plan and name each violated
  constraint. The assignment problem has a ready encoder; other problems are built from
  the same constraints.
- **Researchers comparing samplers on the same model**: the exhaustive sampler gives the
  exact optimum of small models, and simulated annealing, with a seeded RNG and a
  configurable schedule, shows how close a heuristic gets. Both stop on a work budget and
  resume later, so runs can be time-sliced and measured by the work they did.
- **Exact experiments and teaching**: `i64` models keep every penalty and every
  QUBO-to-Ising conversion exact, so results can be checked against brute force.

It is not for solving these problems fast on a classical machine. A direct solver beats a
QUBO encoding there: see [task-allocation](https://github.com/sunsided/task-allocation) for
assignment, [constraint-search](https://github.com/sunsided/constraint-search) for
constraint satisfaction, [mapf-search](https://github.com/sunsided/mapf-search) for
multi-agent path finding and [heuristic-search](https://github.com/sunsided/heuristic-search)
for pathfinding.
