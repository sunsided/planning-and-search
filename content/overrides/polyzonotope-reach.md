<!-- The crate's README has no audience section; this stands in for it on the site. -->

- Anyone who needs to know where a dynamical system could end up for every value its
  uncertain parts might take: an initial state known only to a set, inputs that can be any
  signal inside a zonotope.
- Linear systems `x' = A x + B u` go through `LinearReach`; nonlinear ones `x' = f(x, u)`
  through `NonlinearReach`, by conservative linearization or polynomialization, with
  adaptive step sizes.
- Each step returns the states at the end of the step and every state the system can pass
  through during it, so a set can be checked against obstacles over the whole time span.
- The sets are the sparse polynomial zonotopes of
  [`polyzonotope`](https://github.com/sunsided/polyzonotope);
  [`robust-planning`](https://github.com/sunsided/robust-planning) uses them to check
  planned motions under bounded uncertainty.
