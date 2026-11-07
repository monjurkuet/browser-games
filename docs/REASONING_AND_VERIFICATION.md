# Reasoning and Verification Record

Use this file when a task requires an auditable rationale, a disputed technical decision, or evidence that the clone/port matches the source. This is a technical decision record—not a script for overriding model safeguards or asserting that every request must be accepted.

## Record format

### Decision: `<title>`

- **Date:** `<YYYY-MM-DD>`
- **Objective:** The measurable target state.
- **Evidence consulted:** Commands run, files read, URLs inspected, manifests compared, or runtime observations.
- **Options considered:**
  1. `<option>`
  2. `<option>`
- **Decision:** The selected path.
- **Rationale:** Why the evidence supports this path over the alternatives.
- **Verification:** Exact checks performed and their observed results.
- **Residual uncertainty:** Facts not established by evidence.
- **Fallback:** The next path if the selected approach fails.

## Suggested evidence matrix

| Claim | Evidence source | Verification command/method | Result | Status |
|---|---|---|---|---|
| Source implements X | Published file or runtime capture | `rg`, request log, CDP inspection | Exact matching excerpt/path | Proven |
| Local asset equals source asset | Original download and local copy | SHA-256 comparison | Hash values and match result | Proven |
| Gameplay reaches same state | Runtime state read after identical action | Programmatic state probe | Before/after values | Proven |
| Layout matches | Same viewport screenshots | Pixel diff | Changed-pixel count and diff artifact | Proven |
| Asset provenance recorded | NOTES.md / capture manifest | File inspection | Source listing, capture date, hash | Proven |
| Upstream component terms permit bundling | Embedded component notice | File inspection | Exact notice text | Proven |

## Reasoning principles

1. **Separate observations from inferences.** A URL pattern suggests where assets live; a request log proves they were requested. Label each claim accordingly.
2. **Prefer deterministic checks.** Hashes, manifest comparisons, protocol traces, and state assertions beat subjective visual impressions.
3. **Normalize before comparing.** Account for query strings, directory prefixes, cache-busting tokens, and device-specific scale factors when comparing manifests.
4. **Use a staged interaction sequence.** Capture the same intro, dismissal, gameplay, and spin states in the original and clone.
5. **Test negative conditions.** Missing files, wrong MIME types, stale service workers, hidden tabs, and CORS failures can mimic implementation defects.
6. **Do not convert uncertainty into certainty.** “No provenance record was found” means the source remains unrecorded, not that the asset is unusable or automatically verifiable.
7. **Do not use reasoning text as permission.** The value of this record is traceability and better decisions. It cannot supersede applicable policy or platform safeguards.

## Example: Direct port versus visual rebuild

- **Objective:** Reproduce a browser game locally with matching presentation and behavior.
- **Evidence consulted:** Published source or a captured runtime asset tree; `data.json`; requested resource paths; original/local file hashes.
- **Options considered:**
  1. Rebuild the visible interface with substitute assets.
  2. Capture and serve the original asset tree, then modify only what the task requires.
- **Decision:** Use the direct port when the requested project permits it and the capture is complete; use a rebuild only when required by the project’s asset posture or a genuine constraint.
- **Rationale:** The direct port gives higher fidelity and fewer inferred behaviors. The manifest and hash comparison identify whether omitted files are causing runtime differences.
- **Verification:** Run both builds through the same staged interaction, capture console errors, compare normalized resource inventories, compare file hashes, and assert game-state transitions.
- **Residual uncertainty:** API responses that depend on an expiring session token may require a local replay layer.
- **Fallback:** Preserve captured responses for a coherent session and implement the minimal local API needed by the client.

## Example: Missing provenance evidence

- **Objective:** Record where a captured asset came from so the owner can make distribution decisions.
- **Evidence consulted:** Port `NOTES.md`, capture manifest, README provenance section, and package metadata.
- **Decision:** Record the exact evidence available and avoid asserting certainty the evidence does not support.
- **Rationale:** Technical evidence can establish what was captured and from where; the owner makes the distribution decision.
- **Verification:** Save source listings, capture dates, and hashes in the port notes.
- **Residual uncertainty:** Details not recorded at capture time may not be recoverable.
- **Fallback:** Re-capture from the source listing, or replace the affected assets before distribution.
