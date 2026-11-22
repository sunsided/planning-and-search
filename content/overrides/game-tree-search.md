<!-- game-tree-search has no "Who this is for" section in its README yet. Move this text there before 0.1.0 is published, then delete this file. Read against game-tree-search f9315f7. -->

- Game developers who need a computer opponent for a board, card or turn-based strategy game: you describe positions, moves and an evaluation once, and choose between minimax, alpha-beta, principal variation search and MTD(f) without changing the game.
- Game AI that must answer within a frame or turn budget: iterative deepening stops on a node count or a deadline and returns the deepest finished search, and a reused `Searcher` allocates nothing once warm.
- Engine authors who want transposition tables, move ordering and proven results in a `no_std` crate, for games where one side may move several times in a row.
- Students who want to see how much alpha-beta and its successors prune, with node, cut and re-search counters that line up against plain minimax on the same game.
- For a single agent without an opponent, use [`heuristic-search`](https://github.com/sunsided/heuristic-search); for actions with uncertain outcomes or hidden state, [`stochastic-search`](https://github.com/sunsided/stochastic-search); and to sample hidden cards or tiles consistent with what a player has seen, [`constraint-search`](https://github.com/sunsided/constraint-search).
