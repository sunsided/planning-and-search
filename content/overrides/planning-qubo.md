<!-- planning-qubo 0.2.1's README section ends with "QAOA … is planned in quantum-planning"; this is the section without that sentence. Remove once a release drops it. -->

- **Anyone who wants a planning problem as a QUBO or Ising model.** Encoders turn
  assignment, constraint satisfaction, time-indexed scheduling, multi-agent path finding
  and routing problems into models, and decoders map a sample back to a plan and name
  each violated constraint. The penalty builder covers other problems with the same
  constraints (exactly-one, at-most-one, linear with slack bits), and `penalty` picks the
  weights. The models feed any QUBO solver: the samplers here, quantum-inspired
  hardware, or a quantum annealer.
- **Researchers comparing samplers on the same model.** The exhaustive sampler gives the
  exact optimum of small models. Simulated annealing, tabu search and parallel tempering,
  each with a seeded RNG, show how close a heuristic gets. All of them stop on a work
  budget and resume later, so runs can be time-sliced and measured by the work they did.
  `sample_parallel` runs several at once.
- **People with access to a D-Wave annealer.** The `dwave` module writes models in the
  Solver API's format and reads the returned samples back for the decoders. Submitting
  them over the network is left to a separate adapter.
- **Exact experiments and teaching.** `i64` models keep every penalty and every
  QUBO-to-Ising conversion exact, so results can be checked against brute force.

It is not for solving these problems fast on a classical machine. A direct solver beats a
QUBO encoding there: see [task-allocation](https://github.com/sunsided/task-allocation) for
assignment, [constraint-search](https://github.com/sunsided/constraint-search) for
constraint satisfaction, [mapf-search](https://github.com/sunsided/mapf-search) for
multi-agent path finding and [heuristic-search](https://github.com/sunsided/heuristic-search)
for pathfinding.
