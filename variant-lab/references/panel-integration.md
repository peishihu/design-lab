# Required panel integration

Follow this guide for every new or resumed interactive lab. The bundled runtime owns the Figma-inspired tools. Product rules own the preview. Figma is a reference, not an official dependency or endorsement.

## Before implementation

1. Read variant-lab/SKILL.md and panel-controls.md.
2. Reuse existing panel integration when present.
3. Load lab-chrome.css before variant-lab.css. Load lab-chrome.js before variant-lab.js.
4. Bind through VariantLab.mount. Keep runtime files unchanged. Put geometry, validation or event adapters in separate files.
5. Use runtime --b-* tokens for tool typography, spacing, fields, buttons, surfaces and themes. Product tokens do not authorize tool restyling.

Small scope, deadlines, React, native inputs, passing product tests and screenshot requests are not exceptions. Do not replace shell, gear, sections, footer or selection system with custom markup. Product references change the preview, not tools. Add unsupported controls through scoped adapters inside the panel. Do not add a second panel.

Only an explicit user request to change the tool panel authorizes another design. Record its exact scope first. Identify inapplicable bundled-contract checks. Verify the replacement separately. Do not claim bundled-panel conformity. A generic product redesign request is not tool-panel authorization.

If runtime files are missing, find installed sibling assets. If unavailable, report the dependency. Continue independent preview work. Do not call a substitute compliant.

## Source check

Create panel-contract.json beside the lab entry. Use paths relative to that file:

```json
{
  "entry": "index.html",
  "binding": "main.jsx",
  "runtimeDir": "runtime",
  "adapters": ["panel-adapter.css"]
}
```

Declare existing files only. Without adapters, use an empty array. Entry, binding and adapters must reference all four runtime files. Mount VariantLab in binding or an adapter. Reuse shared runtime paths, including relative parent paths. Do not duplicate runtime to satisfy this check. List its loading sources in binding or adapters.

Run with Node20 or newer:

```sh
node <installed-variant-lab>/scripts/check-panel.mjs <lab>/panel-contract.json
```

The checker requires four installed runtime files, exact hashes, declared source references and VariantLab.mount. Missing or changed input returns nonzero. This lexical check cannot certify a panel. Review comments, unused references, load order, execution, CSS cascade and visual quality separately.

Add this command to existing lab verification. Run it before claiming readiness. A failing custom panel remains an integration defect. Do not waive it or relabel its CSS as an adapter.

## Rendered check

Open the actual panel. Record entry URL, viewport, runtime paths, adapter paths and screenshots in the existing README or verification record.

- Confirm the runtime gear, header, grouped controls and footer render. Exclude duplicate custom panels and launchers.
- Inspect tool font, field geometry, spacing, radius and surfaces against assets/selftest.html under the same tool theme. Check computed styles for product CSS leakage.
- Switch Light/Dark tools. Product theme, width, wrapping and scroll position must stay unchanged.
- Check independent scrolling, narrow and short viewports, focus, nested Escape and reachable menus/footer.
- Test state bindings, undo, individual restore and JSON recovery in the actual lab.

Report source integration, rendered panel conformity and product behavior separately. List untested conditions. JSON tests and correct product screenshots do not prove tool conformity.

## Handoff

Record these fields in the existing README; do not create a second status report:

| Field | Required evidence |
| --- | --- |
| Runtime | Four actual paths and source-check result |
| Adapters | Paths, limited purpose and remaining gaps |
| Tool appearance | Open-panel screenshots and computed-style checks |
| Interaction | Operated controls, recovery and viewport results |
| Limits | Conditions not tested; explicit tool-design authorization if present |

Do not claim full application with a required layer missing. Source checks can catch known integration failures. Later real tasks must show whether the workflow reduces recurrence.
