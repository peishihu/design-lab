# Required panel integration

Use this guide for every new or resumed lab with interactive design controls. The bundled runtime owns the Figma-inspired tool panel. Product design rules own the preview. Figma is an interface reference, not an official dependency or endorsement.

## Before implementation

1. Read variant-lab/SKILL.md and panel-controls.md.
2. Find the existing panel integration. Reuse it if present.
3. Load lab-chrome.css before variant-lab.css. Load lab-chrome.js before variant-lab.js.
4. Bind controls through VariantLab.mount. Keep runtime files unchanged. Put needed geometry, validation or event adapters in separate files.
5. Keep tool typography, spacing, fields, buttons, surfaces and themes under the runtime's --b-* tokens. Product tokens do not authorize restyling tools.

A small lab, a deadline, React, existing native inputs, passing product tests or a screenshot request is not an exception. Do not replace the shell, gear launcher, sections, footer or selection system with custom markup. A product reference changes the preview; it does not change tool chrome. An unsupported control needs a scoped adapter inside the existing panel, not a second panel. Only an explicit user request to change the tool panel can authorize a different design. Record its exact scope before applying it. Under that explicit instruction, identify which bundled-contract checks no longer apply and verify the requested replacement separately. Do not claim bundled-panel conformity. A generic product redesign request is not tool-panel authorization.

If runtime files are unavailable, locate the installed sibling assets. If they cannot be found, report the missing dependency. Continue independent preview work. Do not describe a substitute panel as compliant.

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

Declare existing files only. Use an empty adapters array when no adapter is needed. Entry, binding and adapters must reference all four runtime files. Mount VariantLab in the binding or adapter. Reuse shared runtime paths when present; relative parent paths are supported. Do not copy a second runtime solely to satisfy a check. List source files that load it in binding or adapters.

Run with Node20 or newer:

```sh
node <installed-variant-lab>/scripts/check-panel.mjs <lab>/panel-contract.json
```

The checker requires the four installed runtime files, exact file hashes, declared source references and a VariantLab.mount call. It exits nonzero on missing or changed input. It is a lexical source check. Comments, unused references, load order, runtime execution, CSS cascade and visual quality still require review. A green result alone cannot certify a panel.

Wire this command into the lab's existing verification command. Run it before claiming a lab is ready. An existing custom panel that fails this contract remains an integration defect; do not add a waiver or relabel its CSS as an adapter.

## Rendered check

Open the actual panel. Record the entry URL, viewport, runtime source paths, adapter paths and screenshots in the existing lab README or verification record.

- Confirm the runtime gear, header, grouped controls and footer render. Exclude duplicate custom panels and launchers.
- Inspect tool font, field geometry, spacing, radius and surfaces against assets/selftest.html under the same tool theme. Check computed styles for product CSS leakage.
- Switch Light/Dark tools. Product theme, width, wrapping and scroll position must stay unchanged.
- Check independent scrolling, narrow and short viewports, focus, nested Escape and reachable menus/footer.
- Test state bindings, undo, individual restore and JSON recovery in the actual lab.

Mark source integration, rendered panel conformity and product behavior separately. List untested conditions. Neither passing JSON tests nor a correct product screenshot proves tool conformity.

## Handoff

Record these fields in the existing README; do not create a second status report:

| Field | Required evidence |
| --- | --- |
| Runtime | Four actual paths and source-check result |
| Adapters | Paths, limited purpose and remaining gaps |
| Tool appearance | Open-panel screenshots and computed-style checks |
| Interaction | Operated controls, recovery and viewport results |
| Limits | Conditions not tested; explicit tool-design authorization if present |

Do not say the skill was fully applied when any required layer is missing. Source checks can catch known integration failures. Later real tasks must show whether the workflow reduces recurrence.
