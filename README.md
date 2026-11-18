# Design Lab

Inspect and adjust an AI draft. Compare named directions on a live component or page. Test short, long, missing, and conditional content. Save values and your note for the next round.

The first draft is a starting point, not a measured quality score. Precise matching requires a reference, known conditions, and rendered checks.

## Requirements

- An AI agent that can read and write local files.
- A browser that can run local HTML and JavaScript.
- A local server when the browser blocks local scripts or reads.
- Node.js 20 or newer for optional command-line tests. The tests were verified with Node 20.20.2. The browser demo does not require Node.

A regular web chat without file access cannot install or operate this pack. Windows and independent first-user setup remain unverified.

## Install

Keep `design-lab` and `variant-lab` beside each other. Open the unpacked folder in your agent. Ask:

> Install these two skills in the location this client supports. Preserve existing instructions and installed customizations. Ask before overwriting them. Report the installed paths and verify that both skills load.

Without a skill mechanism, ask the agent to read `design-lab/SKILL.md` for each lab. Do not assume automatic loading across clients.

## Start a lab

> Use Design Lab. Target: [component or page]. Question: [decision]. Baseline: [source, screenshot, or measurements]. Adjust: [properties]. Purpose: [what the adjustment must improve]. Check: [content and interaction cases]. Precision: [reference and known values, if needed].

The agent identifies relevant properties, controls, fixtures, and open decisions. It should not expose all CSS properties or invent exact measurements.

## Review

1. Open the preview and its floating gear icon.
2. Select a variation by its theme or purpose name. Read its short description.
3. Adjust values while the preview stays visible. Use exact numeric input when needed.
4. For components, inspect the case gallery or fixture selector. Check short and long text, missing information, and optional parts such as badges.
5. Use Light or Dark for the tools. Tool theme does not change the product theme.
6. Open Note. Write why you chose the state and what should change next.
7. Use Save selection. Give the JSON file back to the agent for the next round.

Use Command+Z (macOS), Ctrl+Z, or header Undo for selection undo. Each changed control has its own restore icon. Text fields keep native undo. Reload clears selection history.

Hold B or the Hold button to compare with baseline. Use Load saved to restore a file. Reset returns to baseline. Saving and selecting do not approve production changes.

## Open the example

Open `variant-lab/assets/example.html` for bundled panel and state behavior. It does not demonstrate every component-case requirement in this version.

If double-clicking does not run scripts, ask the agent to serve the folder locally and verify its address. HTML source alone does not prove the preview works.

## Share a selection

Send the lab folder and saved JSON together. Include page, runtime, fixture manifest, and README. The recipient opens the lab and uses Load saved. A local address or JSON alone is insufficient.

The agent validates lab ID and values, reads the note, restores state, and continues in the same lab. Keep review history in the README.

## What is included

- `design-lab/`: workflow, component-case guide, inspector rules, project continuation, and review defaults.
- `variant-lab/`: runtime guide, panel reference, HTML/CSS/JavaScript assets, example, and tests.
- `CHANGELOG.md` and `LICENSE`.

The public candidate uses system fonts. Figma is the interface inspiration; this is not an official Figma product or specification.

## Panel integration

Interactive labs must reuse the bundled panel and keep product styles separate from tool styles. Follow [the integration contract](variant-lab/references/panel-integration.md), declare `panel-contract.json`, and run `node variant-lab/scripts/check-panel.mjs <lab>/panel-contract.json`. Inspect the open panel separately; the source check does not prove appearance or interaction quality. Existing labs need integration review after updating these skills.

## Capability boundaries

The runtime provides a floating panel, basic controls, presets, Light/Dark tools, and selection save/load. The agent must build and verify required component cases, bindings, stricter validation, visible help, and responsive adapters. The runtime cannot automatically measure pixel fidelity or serialize arbitrary application objects.

Run `node --test variant-lab/assets/variant-lab-export.test.cjs variant-lab/scripts/check-panel.test.mjs`. Run browser checks in `variant-lab/assets/selftest.html`; serve the folder if local reads are blocked. Test both tool themes. State tests do not prove fidelity or all device conditions.

## Maintainer and license

Maintained by Pei Shi Hu. See `CHANGELOG.md` for version history.

The [MIT License](LICENSE) covers this package. Preserve required notices for dependencies you add. This is a beta release. Validation includes a generated 288-case card lab, state tests, and Light/Dark browser checks on macOS. Other operating systems, virtual keyboards, and automatic loading by every client are not verified.

Saved JSON contains a relative selection fragment rather than the page origin, local path, or query string. Share the lab folder and JSON together.
