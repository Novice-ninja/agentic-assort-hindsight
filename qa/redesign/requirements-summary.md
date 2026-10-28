# Full redesign requirements and acceptance

Read all 67 pages. This matrix covers the full local functional redesign, rather than only the two-day minimum. It is planning evidence; no requirement is marked implemented or tested.

## Scope

- 90 page-linked requirements.
- 28 required screen/workspace surfaces.
- 12 end-to-end workflows.
- 30 metric invariants.
- 87 stable KPI register entries.
- 28 failure/responsive states.

## Build order

1. Lock the canonical data/scope/route/metric-state contract.
2. Build shared shell and atomic filters alongside Item/Store/Pair navigation.
3. Complete original PLR, supply, mix and case workflows on the same selectors.
4. Add versioned rules, permissions, configuration, contextual Iris and failure scenarios.
5. Validate both full journeys, exports, metric edge cases and keyboard/narrow screens.

## Production boundaries

The frontend must work locally with labeled sample facts and simulations. Real identity/master data, source metric definitions, fiscal mapping, member history, approved PLR versions, supply feeds, entitlements and execution acknowledgements remain external dependencies. Missing inputs must produce truthful states, not invented records or live capability claims.

The JSON is the authoritative page-linked matrix, including dependency IDs, concrete actions/results, screen inventory, scenarios and source hashes.
