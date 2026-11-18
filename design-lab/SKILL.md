---
name: design-lab
description: Use when a user wants to compare design directions, adjust a component or page in a live preview, check content edge cases, or refine a design against an exact reference.
metadata:
  author: Pei Shi Hu
  version: "1.5.4"
---

# Design Lab


Use Design Lab to evaluate and adjust an AI draft. Keep the real preview visible during adjustment. Save values and feedback for the next round.

The draft is a starting point. “About 60%” describes user experience, not measured quality or a delivery threshold. Require technical correctness and truthful reporting from the first draft.

## Required tool panel route

Before creating or repairing an interactive panel, read the sibling [variant-lab/SKILL.md](../variant-lab/SKILL.md). Follow its [panel integration contract](../variant-lab/references/panel-integration.md). Reuse the bundled runtime and Figma-inspired styles. Small scope, React, or existing native inputs do not permit a custom panel.

Use product tokens for the preview and runtime --b-* tokens for tools. Product references do not authorize tool changes. Keep runtime files unchanged. Add scoped adapters only for missing declared capabilities. Preserve review and recovery requirements.

Before handoff, run the source integration check and inspect the open panel. Record source integration, rendered tool conformity, and product behavior separately in the README. Product or JSON tests do not prove panel conformity. Missing panel evidence blocks panel readiness. Use the integration contract for commands, fields, and limits.

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

Keep variations and fixtures separate. Compare variations with the same fixtures.

## Read the applicable guide

| Task | Read |
|---|---|
| Every lab | This file and the relevant sections of `DESIGN_PRINCIPLES.md` |
| Live control panel | The sibling `variant-lab/SKILL.md` |
| Component variations or content checks | `references/component-cases.md` |
| Selected component or design-system constraints | `references/contextual-inspectors.md` |
| Running project integration or continuation | `references/build-phases.md` |

Read only applicable guides. Follow project ownership, location, retention, and source-of-truth rules.

## 1. Establish the next decision

1. Read the request, available baseline, existing lab README, and returned selection file.
2. If a file returned, read its reviewer note before interpreting its values.
3. State the question this round must answer.
4. Identify the target component or page and the intended user task.
5. Identify the requested adjustable properties and the purpose of each adjustment.
6. List other relevant properties supported by the source. Do not expose unrelated or inactive properties.
7. Describe the baseline and missing decisions in one message.
8. Ask only questions that change the next operation. State proposed assumptions.

Reuse prior authorization and answers for the same scope. Continue within an actionable brief without another “go.” Ask before implementing unresolved behavior that changes the result.

Use the existing build when available. Otherwise use an image with supplied measurements, or an image alone. Mark inferred values CONFIRM. Use only authorized design-tool connections. Do not require a new connection.

Use approved content or clearly synthetic fixtures. Do not invent facts that appear to describe real people, products, or results. If wording cannot describe a behavior, request a recording or mockup.

**Complete when:** the question, baseline, adjustment scope, assumptions, and review criteria are recorded in the lab README.

## 2. Select the working mode

| Mode | Required evidence |
|---|---|
| Explore | Distinct design hypotheses and their tradeoffs |
| Adjust | The requested local change with unrelated decisions preserved |
| Check edge cases | A component fixture matrix and results for every applicable case |
| Match a reference | Controlled render conditions and measured differences |

Combine modes as needed. Continue exploration as precise adjustment in the same lab. Do not restart the interview or create another lab because the mode changed.

Use the requested variation count. Otherwise start with two or three useful variations. A precise correction can use one state. Keep fixture coverage independent of this count.

## 3. Name directions for an independent reviewer

Name variations by design theme or user-facing purpose. Names must be clear without prior-round context.

Examples: **Editorial feature**, **Compact browsing**, **Offer spotlight**.

Do not name variations after change history. “Smaller title,” “More padding,” “Round 2 pick,” and bare letters or version numbers are not variation names.

Describe each variation's hierarchy, layout, behavior, or use briefly. Record exact baseline differences in the description or saved values. Use one name across page, preset list, README, and saved record.

Preserve names used by saved files as legacy identifiers. To rename, add a new name and archive the old one. Keep earlier selections valid and one active preset per distinct state.

List baseline first, preferred pick next when one exists, then explorations, then archive. The first round has no preferred pick unless the user explicitly supplied one. Label an AI recommendation and a new option as separate concepts. See the runtime guide for marker precedence and limitations.

**Complete when:** every variation has a stable name, description, full preset, and a stated reason to compare it.

## 4. Generate the component cases before fine adjustment

For reusable components, build the matrix in `references/component-cases.md` before claiming coverage. Include applicable content boundaries, absent optional data, conditional parts, interaction states, and feasible combinations that can affect layout.

For a card, include short and long titles, wrapping boundaries, unbroken text, missing information, and badge present or absent when those parts exist. A normal-looking sample alone is insufficient.

Use one component implementation across fixtures. Apply family changes to every fixture. Use instance overrides only when requested. Show current scope. Preserve unrelated overrides.

Provide independent fixture selection or a case gallery. Show case IDs and expected behavior. Fixture selectors change content; variation selectors change design. Do not combine them without explanation.

**Complete when:** every applicable case has a fixture, an expected result, and a visible preview or a stated reason why it cannot be tested.

## 5. Provide controls for the requested adjustments

Map each control to target, property, current value, domain, unit, reset destination, and scope. Verify its rendered target. Do not add controls only because a generic schema contains them.

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

Use project domains and precision. Without rules or exact requirements, optional starting steps are 4 px spacing, 2 px radius, 20 ms timing, and 5% opacity. Permit valid precise values. Keep token-only domains token-only. Numeric multiples are not automatically valid tokens.

Group by component part, task, or text role. Make each group collapsible. Aim for fewer than eight visible rows; split longer groups by meaning. Give each typography group its own font, weight, style, size, tracking, and line-height controls. Heading controls must not change numeric labels. Provide an explicit link control for shared values.

Place needed help beside its setting. Show variation descriptions in the preset list. Keep the editable reviewer note in the collapsible Note section. Native tooltips are not persistent touch or keyboard help. See the runtime guide for limits.

**Complete when:** every requested adjustable property has an effective input or a reported implementation gap.

## Recover a selection

Use Command+Z on macOS or Ctrl+Z elsewhere for selection undo. Preserve native undo in text, numeric, Note, and editable fields. Do not use Shift-modified redo shortcuts for lab undo.

Record each preset, Reset, individual restore, or successful import as one action. Group a continuous slider drag or held adjustment key as one action. Exclude no-ops, failed imports, theme changes, and baseline comparison.

Show a small restore icon beside each changed control. Its accessible label identifies control and destination. Restore only that control and allow undo. Footer Reset restores the complete baseline.

Keep the latest 100 committed actions for the session only. Do not export history or promise reload persistence. Import undo restores the earlier note only if it remains unedited since import.

## 6. Keep the preview visible and unchanged by the tools

Use a small floating launcher with an accessible name, tooltip, visible focus, and adequate activation target. Keep the touch target large enough despite the compact icon.

Overlay the panel. Do not reserve space, dock, change the product viewport, or open a separate adjustment screen. Preserve preview scroll, proportions, and selection.

Keep header, close action, active field, menus, and footer inside the visible viewport. Scroll panel content independently. Recheck narrow screens, zoom, rotation, and the virtual keyboard when applicable. If the existing runtime does not meet these conditions, add a scoped adapter and verify it. Do not claim automatic support.

Allow collapse or movement of obstructing controls without losing edits. Keep the selected component visible. Do not move the panel automatically during editing.

Use a Figma-inspired properties panel. Distinguish tools through the floating launcher, tool styles, and optional theme. Name themes only **Light** and **Dark**. Tool-theme changes must not change product theme.

## 7. Verify fidelity and behavior

For reference matching, record reference, viewport, device-pixel ratio, scale, fonts, assets, fixture, interaction state, and animation position. Define tolerances from the task or ask when they determine acceptance.

Render before and after under the same conditions. Compare geometry, alignment, wrapping, colors, and states using measurements and aligned captures where available. Test the same accepted design across the fixture matrix.

Screenshots alone do not establish exact source measurements. Report missing fonts and unavailable rendering as gaps. Do not call unrendered drafts or rough matches “pixel-perfect.”

Operate every control, reset scope, numeric-entry path, preset, fixture, and relevant interaction. Check first and last items, repeated input, return navigation, loading, empty, error, and reduced motion where applicable. Check that tool input does not trigger product shortcuts.

Run relevant code checks. Broaden tests for affected shared consumers or failures. JSON tests do not prove fidelity, rendered fixtures, or viewport access.

**Complete when:** each requested check has a result or an explicit untested condition, and remaining mismatches are listed.

## 8. Save the decision for the next round

Use Save selection for complete declared-state JSON. Include unchanged defaults, baseline, changes, preset identity, nearest preset, round, revision, note, and explicit review context. Screenshots or URLs alone are insufficient.

Export only design controls and deliberate review notes. Use synthetic fixture identifiers. Export preview context as a selection fragment, not the page origin, path, or query string. Never serialize account data, stores, DOM trees, secrets, or chat history. Save a fixture or scope selection as a declared control when it is needed to reproduce the review.

Use a stable lab ID. Load a saved preset plus an independent edit in a fresh instance. Reproduce state and note. Reject incompatible files without erasing selection. Report download failures and recovery.

Keep the README as the round-record source. Copy it into About. Increase revision after a control, option, or preset change. When feedback returns, record the file and prior decision, increase round, and reset revision to zero. Read the returned note first. Preserve baseline, preferred state, and options the reviewer still requests.

Saving, selecting, or recommending does not approve production work. Record Active, Chosen, Parked, or Rejected with a reason. Apply chosen values outside the lab only within explicit authorization. For an image baseline, return a changed-value specification with units. For a code baseline, apply only authorized deltas and verify their destination.

## Retain the record and improve the method

Keep one folder per question and one current preview. Follow project location and status rules. Preserve source, feedback, selections, and integration changes. Stopping does not authorize deletion.

On resume, read the current brief and affected files. Reuse components, assets, fixtures, routes, and panel code. Patch only requested scope. Read more only for specific unknowns. Report changes and open questions without repeating the brief. Word counts do not prove efficiency.

Record actionable learning with date, evidence, scope, and status. Keep project taste in the project. If a private LEARNINGS.md exists, consult relevant entries. Do not require that private file in an exported pack.

Promote a workflow rule only after explicit cross-project instruction or repeated verified evidence. Record the change, scenario-test it, update the version and changelog, run runtime tests, and rebuild the pack. Keep hypotheses separate from verified rules. Reverse ineffective adjustments. If skill writes are unavailable, save a proposed change and report that limitation. No background monitoring is implied.

End with exact file links, a working preview address when verified, the saved-selection path when present, performed checks, remaining gaps, and the next decision. For a local lab, explain that sharing requires the lab folder and saved selection together.
