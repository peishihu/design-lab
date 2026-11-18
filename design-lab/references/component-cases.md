# Component cases

Use this guide for every reusable-component comparison. Build cases before fine adjustment. Separate fixture content from variation values.

## Define the coverage boundary

1. Inspect the component's actual fields, conditional parts, supported states, and layout rules.
2. Identify required and optional fields. Distinguish missing, null, empty, and whitespace-only values when the component handles them differently.
3. Identify constraints such as title limit, line clamp, image ratio, badge count, and minimum width.
4. List each applicable case below. Mark an absent capability Not applicable and give a reason.
5. Generate the finite set of supported combinations that can affect the design. Exclude impossible combinations using the source contract.

“All cases” means the declared component contract, not every string or unrelated CSS property. Samples are not exhaustive. Paginate or select cases when the supported matrix cannot render at once. Before reducing requested verification to samples, record untested combinations and obtain agreement.

## Content and state matrix

| Dimension | Cases when applicable | Expected behavior to define |
|---|---|---|
| Main text | One-character or shortest valid value; typical value; longest valid value; overflow beyond the limit | Wrapping, truncation, minimum height, accessible full value |
| Wrapping | Just below and above a line break; unbroken token or URL | No accidental overflow or hidden action |
| Secondary text | Present; absent; empty; long | Collapse or reserve space according to the component contract |
| Required information | Missing or invalid required value | Defined placeholder, error, or omission behavior |
| Image | Normal; missing; failed request; unusual supported ratio | Fallback, crop, reserved space, alternative text |
| Badge | Present; absent; shortest label; long label; multiple badges if supported | Wrapping, collision, placement, overflow |
| Other optional parts | Metadata, price, rating, progress, action, or icon present and absent where supported | Layout and hierarchy remain intentional |
| Interaction | Default; hover where supported; focus; pressed; selected; disabled | Distinguishable states and usable input |
| Async content | Loading; empty; error; success where supported | Stable geometry and a recovery path |
| Language | Long translated text; relevant non-Latin script; RTL if supported | Correct direction, wrapping, and reading order |
| Display | Minimum supported width; target width; relevant zoom/text-size condition | Controls, labels, and focus remain reachable |

Use real limits from the project. If a limit is unknown, label the proposed test value CONFIRM. State the string and its count. Use Unicode code points for counts unless the project specifies another measure. State whether spaces are included. A count alone does not predict wrapping; test the rendered string with the target font and width.

## Required card combinations

For a card with optional subtitle, image, and badge, include these independently and in valid combinations:

- Shortest valid title with badge present and absent.
- Longest valid title with badge present and absent.
- Unbroken title with badge present and absent.
- Subtitle absent with short and long title.
- Image missing or failed with short and long title.
- Required information missing, using the defined recovery behavior.
- Long badge with long title at the minimum supported width.
- Combined missing optional fields when the source permits that state.

Add combinations for other interacting dimensions. Do not invent badge support. Declare badge addition as a separate design requirement.

## Render and edit rules

Use one component implementation. Render multiple fixtures from data or provide a case selector. Give every case a stable ID and a visible label. Keep the same case set across design variations. Preserve the active fixture and edit scope when a design preset changes. The stock full-state preset action needs a scoped adapter for this behavior; it does not preserve that context automatically.

Default a reusable design adjustment to component-family scope. Apply it across all cases. If the reviewer requests an instance edit, show Selected instance and identify it. Preserve other instance overrides. If the generic runtime cannot store those overrides, add an explicit supported state adapter or report the limit.

Hide controls for parts absent from the selected fixture. Retain a supported property's enable control when the part exists but the property is disabled. A fixture selector can change anatomy; a style slider must not silently create missing data.

Keep focus, selection, and edits stable when switching cases. Declare a fixture ID and scope as controls when saved selections need them. Include the fixture manifest in the lab folder. A JSON file containing an ID cannot reproduce content without that manifest.

## Coverage record

Maintain this table in the lab README or a linked case file:

| Case ID | Input condition | Expected result | Rendered | Operated | Result or gap |
|---|---|---|---|---|---|

Record Pass, Fail, Not tested, or Not applicable with a reason. Generated does not mean verified. Recheck every affected case after shared design changes. One normal sample or state-only test cannot prove all cases pass.
