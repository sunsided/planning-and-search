<!-- constraint-search has no "Who this is for" section in its README yet. Move this text there before 0.1.0 is published, then delete this file. Read against constraint-search c8025cd. -->

- Puzzle game developers who generate or check Sudoku, nonogram, KenKen, Kakuro or logic-grid puzzles: count solutions with an early stop to prove a puzzle is unique, and grade its difficulty by the hardest technique a solve needed.
- Hint and tutorial systems that explain a step the way a person would: cost-ordered rules such as naked and hidden subsets or locked candidates give the next deduction and answer "why can this cell not be 4?".
- Card and deduction game AI with hidden information: the values certain in every solution, each value's probability, and random consistent solutions to hand to a game-tree search.
- Anyone with a small finite-domain problem (map colouring, timetabling, small schedules) who wants propagation, backtracking and dancing links in Rust, with a budget and resumable search so the work can be spread across frames.
- For adversarial games, use [`game-tree-search`](https://github.com/sunsided/game-tree-search); for paths on a grid or a graph, [`heuristic-search`](https://github.com/sunsided/heuristic-search); and for planning tasks in PDDL, [`miniplan`](https://github.com/sunsided/miniplan).
