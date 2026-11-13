---
name: design-lab
description: Use when a user wants to compare design directions, adjust a component or page in a live preview, check content edge cases, or refine a design against an exact reference.
metadata:
  author: Pei Shi Hu
  version: "1.5.2"
---

# Design Lab


Design Lab helps a designer turn an initial AI draft into a design they can evaluate and adjust. The reviewer changes controls while the real preview remains visible. A saved selection carries the values and feedback into the next round.

The initial draft is a starting point. The user's description of “about 60%” is a statement about their experience. It is not a measured quality score or a delivery threshold. Technical correctness and truthful reporting apply from the first draft.

## Terms

| Term | Meaning |
|---|---|
| Baseline | The source design and values used for comparison and Reset |
| Variation | A design direction with a name and a short description |
| Preset | A saved set of control values that reproduces a variation |
| Fixture | Synthetic or approved content used to test a component |
| Edge case | A relevant boundary, missing-data condition, or interaction state |
| Control | An input that changes one declared property or choice |
| Scope | The component family, instance, part, or state affected by a change |
| Round | A review cycle that starts when reviewer feedback returns |
| Revision | A change to controls, options, or presets within a round |
| Tool theme | Light or dark appearance of lab controls; independent of the product theme |

A variation and a fixture are separate. Apply the same variations to the same fixtures so the comparison remains fair.

## Read the applicable guide

| Task | Read |
|---|---|
| Every lab | This file and the relevant sections of `DESIGN_PRINCIPLES.md` |
| Live control panel | The sibling `variant-lab/SKILL.md` |
| Component variations or content checks | `references/component-cases.md` |
| Selected component or design-system constraints | `references/contextual-inspectors.md` |
| Running project integration or continuation | `references/build-phases.md` |

Use only the guides needed for the current change. Existing project instructions determine ownership, location, retention, and source of truth.

## 1. Establish the next decision

1. Read the request, available baseline, existing lab README, and returned selection file.
2. If a file returned, read its reviewer note before interpreting its values.
3. State the question this round must answer.
4. Identify the target component or page and the intended user task.
5. Identify the requested adjustable properties and the purpose of each adjustment.
6. List other relevant properties supported by the source. Do not expose unrelated or inactive properties.
7. Describe the baseline and missing decisions in one message.
8. Ask only questions whose answers change the next operation. State proposed assumptions explicitly.

Reuse authorization and answers already given for the same scope. If the user supplied an actionable brief, continue within it. Do not require a repeated “go.” If an unresolved behavior changes the result, ask before implementing that behavior.

Use an existing build when available. Otherwise use supplied measurements with an image, or an image alone. Mark inferred values CONFIRM. Read a design tool only through an already authorized connection. Do not require a new connection.

Use approved content or clearly synthetic fixtures. Never invent facts that appear to describe real people, products, or results. When wording cannot describe a behavior, request a recording or mockup for that behavior.

**Complete when:** the question, baseline, adjustment scope, assumptions, and review criteria are recorded in the lab README.

## 2. Select the working mode

| Mode | Required evidence |
|---|---|
| Explore | Distinct design hypotheses and their tradeoffs |
| Adjust | The requested local change with unrelated decisions preserved |
| Check edge cases | A component fixture matrix and results for every applicable case |
| Match a reference | Controlled render conditions and measured differences |

Combine modes when needed. An exploratory design can become precise adjustment in the same lab. Do not restart the interview or create another lab because the mode changed.

If the user gives a count, use that count. Otherwise start with two or three useful variations. A precise correction can use one state. The count does not limit fixture coverage.

## 3. Name directions for an independent reviewer

Name each variation by its design theme or user-facing purpose. An uninvolved reviewer must understand the name without knowing the previous round.

Examples: **Editorial feature**, **Compact browsing**, **Offer spotlight**.

Do not use change history as the name. “Smaller title,” “More padding,” “Round 2 pick,” and bare letters or version numbers are not variation names.

Give each variation a short description. State its hierarchy, layout, behavior, or intended use. Put exact differences from the baseline in the description or saved values. Use the same name in the page, preset list, README, and saved record.

Preserve names already used by saved files as legacy identifiers. If a name must change, add a new name and archive the old one. Do not silently invalidate earlier selections. Keep one active preset per distinct state.

List baseline first, preferred pick next when one exists, then explorations, then archive. The first round has no preferred pick unless the user explicitly supplied one. Label an AI recommendation and a new option as separate concepts. See the runtime guide for marker precedence and limitations.

**Complete when:** every variation has a stable name, description, full preset, and a stated reason to compare it.

## 4. Generate the component cases before fine adjustment

For a reusable component, create the case matrix in `references/component-cases.md` before claiming coverage. Include all applicable content boundaries, absent optional data, conditional parts, interaction states, and feasible combinations that can affect layout.

For a card, include short and long titles, wrapping boundaries, unbroken text, missing information, and badge present or absent when those parts exist. A normal-looking sample alone is insufficient.

Use one component implementation for the fixtures. Apply a family-level design change to every fixture. Use a selected-instance override only when the reviewer asks for it. Display the current scope. Preserve unrelated overrides.

Keep fixtures independently selectable or visible in a case gallery. Show a case identifier and its expected behavior. A fixture selector changes content conditions. A variation selector changes the design. Do not combine these into one unexplained choice.

**Complete when:** every applicable case has a fixture, an expected result, and a visible preview or a stated reason why it cannot be tested.

## 5. Provide controls for the requested adjustments

Map each control to its target, property, current value, allowed values, unit, reset destination, and scope. Verify the target in the rendered page. A control must not exist only because a generic schema contains it.

| Decision | Control |
|---|---|
| One setting enabled or disabled | Switch |
| Several independent inclusions | Checkboxes |
| One value from a named set | Dropdown; use a segmented control only when simultaneous visibility is necessary |
| Ordered numeric adjustment | Number field and slider when bounded exploration is useful |
| Exact numeric adjustment | Number field; do not require dragging |
| A few discrete numeric stops | Named dropdown or segmented control |
| Text or color editing | Supported text field or color/token input; add an adapter when the runtime lacks it |
| A complete design direction | Preset |
| An operation such as reset or save | Button |

Use the project's domain and precision. The old exploratory defaults—4 px spacing, 2 px radius, 20 ms timing, 5% opacity—are optional starting suggestions only when no rule or exact requirement exists. They must not prevent a valid precise value. A token-only domain stays token-only. Do not infer that every numeric multiple is a permitted token.

Group controls by component part, task, or text role. Each logical group must collapse. Aim for fewer than eight visible rows per group; split a longer group by meaning. Typography groups contain their own font, weight, style, size, tracking, and line height. A heading control must not change numerical labels. Show an explicit linking control when roles share a value.

Place concise help beside its setting when needed. Keep variation descriptions visible in the preset list. Keep the editable reviewer note in the collapsible Note section. Native tooltips alone do not provide persistent help for touch or keyboard review. The bundled runtime's limitations are specified in the runtime guide.

**Complete when:** every requested adjustable property has an effective input or a reported implementation gap.

## Recover a selection

Use Command+Z on macOS or Ctrl+Z on other systems to undo the last lab selection change. Keep native undo in text and numeric fields, the Note, and editable content. Shift-modified redo shortcuts are not lab undo.

Treat a preset, full Reset, individual restore, or successful file import as one action. Treat a continuous slider drag or held adjustment key as one action. No-op changes, failed imports, tool theme changes, and baseline comparison must not add selection history.

Show a small restore icon beside each control that differs from baseline. Its accessible label identifies the control and destination. Restore only that control. Make this restoration undoable. The footer Reset still restores the complete baseline.

Selection history is session-local. Keep the latest 100 committed actions. Do not export history or promise persistence after reload. Undoing an import restores its earlier note only if the reviewer has not edited that note since the import.

## 6. Keep the preview visible and unchanged by the tools

Use a small floating icon to open the panel. Give it an accessible name, tooltip, visible focus, and an adequate activation target. A compact visual icon must not require a tiny touch target.

Open the panel over the page. Do not reserve layout space, dock it, change the product viewport, or navigate to a separate adjustment screen. Preserve the preview's scroll position, proportions, and selected state.

Keep header, close action, active field, menus, and footer inside the visible viewport. Scroll panel content independently. Recheck narrow screens, zoom, rotation, and the virtual keyboard when applicable. If the existing runtime does not meet these conditions, add a scoped adapter and verify it. Do not claim automatic support.

Allow the reviewer to collapse or move obstructing controls without losing edits. Keep the selected component visible. Do not automatically move the panel during a value edit.

Use a familiar Figma-inspired properties-panel structure. Distinguish tool controls from the product through the floating launcher, tool styling, and optional tool theme. Use only **Light** and **Dark** as theme names. Switching the tool theme must not change the product theme.

## 7. Verify fidelity and behavior

For reference matching, record reference, viewport, device-pixel ratio, scale, fonts, assets, fixture, interaction state, and animation position. Define tolerances from the task or ask when they determine acceptance.

Render before and after under the same conditions. Compare geometry, alignment, wrapping, colors, and states using measurements and aligned captures where available. Test the same accepted design across the fixture matrix.

A screenshot alone does not establish exact source measurements. Missing fonts or unavailable rendering are verification gaps. Report them. Do not call an unrendered draft or a rough match “pixel-perfect.”

Operate every control, reset scope, numeric-entry path, preset, fixture, and relevant interaction. Check first and last items, repeated input, return navigation, loading, empty, error, and reduced motion where applicable. Check that tool input does not trigger product shortcuts.

Run relevant code checks. Broaden testing when shared consumers or failures require it. A test of JSON state does not prove visual fidelity, working fixture rendering, or viewport access.

**Complete when:** each requested check has a result or an explicit untested condition, and remaining mismatches are listed.

## 8. Save the decision for the next round

Use Save selection to download the complete declared state as JSON. Include unchanged defaults, baseline, changed values, preset identity, nearest preset, round, revision, note, and explicit review context. Do not rely on a screenshot or URL alone.

Export only design controls and deliberate review notes. Use synthetic fixture identifiers. Export preview context as a selection fragment, not the page origin, path, or query string. Never serialize account data, stores, DOM trees, secrets, or chat history. Save a fixture or scope selection as a declared control when it is needed to reproduce the review.

Supply a stable lab ID. In a fresh instance, load a saved preset plus an independent adjustment and reproduce the state and note. Reject incompatible files without erasing the current selection. Report download failures with a recovery action.

Keep the README as the round-record source. Copy it into About. Increase revision after a control, option, or preset change. When feedback returns, record the file and prior decision, increase round, and reset revision to zero. Read the returned note first. Preserve baseline, preferred state, and options the reviewer still requests.

Saving, selecting, or recommending does not approve production work. Record Active, Chosen, Parked, or Rejected with a reason. Apply chosen values outside the lab only within explicit authorization. For an image baseline, return a changed-value specification with units. For a code baseline, apply only authorized deltas and verify their destination.

## Retain the record and improve the method

Keep one lab folder per question and one current preview. Follow the project's location and status rules. Preserve source, feedback, selections, and integration changes. Stopping does not authorize deletion.

On resume, read the current brief and affected files. Reuse components, assets, fixtures, routes, and panel code. Patch the requested scope. Read additional files only to resolve a specific unknown. Report changes and remaining questions without repeating the full brief. Do not claim measured efficiency from word counts.

Record actionable learning with date, evidence, scope, and status. Keep project taste in the project. If a private LEARNINGS.md exists, consult relevant entries. Do not require that private file in an exported pack.

Promote a workflow rule only after explicit cross-project instruction or repeated verified evidence. Record the change, scenario-test it, update the version and changelog, run runtime tests, and rebuild the pack. Keep hypotheses separate from verified rules. Reverse ineffective adjustments. If skill writes are unavailable, save a proposed change and report that limitation. No background monitoring is implied.

End with exact file links, a working preview address when verified, the saved-selection path when present, performed checks, remaining gaps, and the next decision. For a local lab, explain that sharing requires the lab folder and saved selection together.
