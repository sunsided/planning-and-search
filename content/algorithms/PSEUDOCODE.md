# The site's pseudocode

Every algorithm page writes its pseudocode in one notation, so a reader who has seen one
listing can read them all. `src/lib/pseudo.ts` parses it; the tests parse every file, and the
build fails on anything outside these rules.

## Shape

```
algorithm A*(s₀, h)
  input: start state s₀, heuristic h
  output: a cheapest path to a goal, or failure
  g[s₀] ← 0
  OPEN ← {s₀}                              ▷ ordered by f = g + h
  while OPEN ≠ ∅ do
    s ← extract-min(OPEN)
    if goal(s) then
      return path-to(s)
    for each (s′, c) in succ(s) do
      if g[s] + c < g[s′] then
        g[s′] ← g[s] + c
        parent[s′] ← s
        insert(OPEN, s′)
  return failure
```

- One header line, `algorithm Name(parameters)`. More routines follow as
  `procedure Name(parameters)` (returns nothing) or `function Name(parameters)` (returns a
  value), each starting at column 0 with its body indented.
- Blocks are indentation, two spaces per level, never tabs. There is no `end`.
- `input:` and `output:` lines, in that order, may follow a header.
- A line that opens a block ends in `then`, `do`, or is `else`, `repeat`, or a header:
  `if … then`, `else if … then`, `else`, `while … do`, `for … do`, `for each … in … do`,
  `repeat` (its block is closed by `until …` at the same indentation), `in parallel do`.
- Statements: `x ← expr` (assignment; several targets as `a, b ← …`), `return …`, `yield …`,
  `break`, `continue`, `skip`, a call `name(args)`, `error "…"`.

## Words and symbols

- Keywords, lowercase: `algorithm procedure function input output if then else while do for
each in repeat until return yield break continue skip and or not true false nil failure
error parallel`.
- Comments start with `▷` and run to the end of the line, on their own line or after code.
- Sets and queues are written in capitals (`OPEN`, `CLOSED`, `T`), functions and helpers in
  lowercase with hyphens (`extract-min`, `path-to`), variables in short lowercase or Greek
  (`s`, `g`, `ε`, `w`).
- Mathematics in Unicode: `← ≠ ≤ ≥ ∞ ∅ ∈ ∉ ∪ ∩ ∖ ⊆ ⊂ × · ∑ ∀ ∃ ¬ ∧ ∨ ⟨ ⟩ ⌈ ⌉ ⌊ ⌋ ′ ″ ₀–₉`,
  subscripts as Unicode where they read better (`s₀`), otherwise `x_i`.
- Plain-text operators that look like code are not allowed: `:=`, `==`, `!=`, `<=`, `>=`,
  `&&`, `||`, `//`, `#`, a `{` that ends a line or a `}` on its own line, `end`, `endif`,
  `endwhile`.

## Writing it

Write each listing from the crate's implementation and the paper it cites, in your own
words and structure; do not copy a listing from a paper. Keep it to the algorithm's core
(about 8–40 lines): configuration, statistics and budget checks stay out unless they are the
point. Name the helpers the way the crate's items are named where that reads well.
