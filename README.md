# Design Lab

Turn an initial AI draft into a design you can inspect and adjust. Compare named directions on a live component or page. Test short, long, missing, and conditional content. Save the selected values and your note for the next review round.

The first draft is a starting point, not a measured quality score. Precise matching needs a reference, known conditions, and rendered checks.

## Requirements

- An AI agent that can read and write local files.
- A browser that can run local HTML and JavaScript.
- A local server when the browser blocks local scripts or reads.
- Node.js 20 or newer for optional command-line tests. The tests were verified with Node 20.20.2. The browser demo does not require Node.

A regular web chat without file access cannot install or operate this pack. Windows and independent first-user setup remain unverified.

## Install

Keep `design-lab` and `variant-lab` beside each other. Open the unpacked folder in your agent. Ask:

> Install these two skills in the location this client supports. Preserve existing instructions and installed customizations. Ask before overwriting them. Report the installed paths and verify that both skills load.

If the agent has no skill mechanism, ask it to read `design-lab/SKILL.md` for each lab. Do not assume every client automatically loads the same file.

## Start a lab

> Use Design Lab. Target: [component or page]. Question: [decision]. Baseline: [source, screenshot, or measurements]. Adjust: [properties]. Purpose: [what the adjustment must improve]. Check: [content and interaction cases]. Precision: [reference and known values, if needed].

The agent identifies relevant properties, controls, fixtures, and open decisions. It should not expose every possible CSS property or invent exact measurements.

## Review

1. Open the preview and its floating gear icon.
2. Select a variation by its theme or purpose name. Read its short description.
3. Adjust values while the preview stays visible. Use exact numeric input when needed.
4. For components, inspect the case gallery or fixture selector. Check short and long text, missing information, and optional parts such as badges.
5. Use Light or Dark for the tools. Tool theme does not change the product theme.
6. Open Note. Write why you chose the state and what should change next.
7. Use Save selection. Give the JSON file back to the agent for the next round.

Use Command+Z (macOS) or Ctrl+Z to undo the last selection. A changed control shows a small restore icon for that control only. The header Undo icon provides the same undo action. Text fields keep their native undo. Selection history lasts only until reload.

Hold B or the Hold button to compare with baseline. Use Load saved to restore a file. Reset returns to baseline. Saving and selecting do not approve production changes.

## Open the example

Open `variant-lab/assets/example.html`. It demonstrates the bundled panel and state behavior. It is not a complete component-case example for every requirement in this version.

If double-clicking does not run scripts, ask the agent to serve the folder locally and verify its address. Do not infer a working preview from the HTML source alone.

## Share a selection

Send the lab folder and saved JSON together. The folder contains the page, runtime, fixture manifest, and README. The recipient opens that lab and uses Load saved. A local address or JSON file alone is insufficient.

The agent validates the lab ID and values, reads the note, restores the declared state, and continues in the same lab. Keep the README as the review history.

## What is included

- `design-lab/`: workflow, component-case guide, inspector rules, project continuation, and review defaults.
- `variant-lab/`: runtime guide, panel reference, HTML/CSS/JavaScript assets, example, and tests.
- `CHANGELOG.md` and `LICENSE`.

The public candidate uses system fonts. Figma is the interface inspiration; this is not an official Figma product or specification.

## Capability boundaries

The runtime provides a floating panel, basic controls, presets, Light/Dark tools, and selection save/load. The agent must build and verify component cases, control bindings, stricter domain validation, visible help, and responsive adapters when required. The runtime does not automatically measure pixel fidelity or serialize arbitrary application objects.

Test the runtime with `node --test variant-lab/assets/variant-lab-export.test.cjs`. Browser checks are in `variant-lab/assets/selftest.html`; serve the folder if local reads are blocked. Test both tool themes. A passing state test does not verify visual fidelity or all device conditions.

## Maintainer and license

Maintained by Pei Shi Hu. See `CHANGELOG.md` for version history.

The [MIT License](LICENSE) covers this package. Preserve required notices for dependencies you add. This is a beta release. Validation includes a generated 288-case card lab, state tests, and Light/Dark browser checks on macOS. Other operating systems, virtual keyboards, and automatic loading by every client are not verified.

Saved JSON contains a relative selection fragment rather than the page origin, local path, or query string. Share the lab folder and JSON together.
