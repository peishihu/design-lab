---
name: variant-lab
description: Use when a user needs a live control panel, named design presets, saved selections, or mix-and-match adjustments on a component or page.
metadata:
  author: Pei Shi Hu
  version: "1.5.2"
---

# Variant Lab


Use the bundled panel to adjust a preview in place. Read the sibling `design-lab/SKILL.md` for the review workflow. For components, use its `references/component-cases.md` before declaring edge-case coverage.

## Runtime and generated integration

The runtime provides four control types, presets, grouped sections, a floating launcher, tool themes, baseline comparison, and selection save/load.

The generated lab must provide the component, fixtures, property bindings, appropriate validation, and verification. The runtime does not discover adjustable properties, generate edge cases, enforce project tokens, measure fidelity, or promote production changes.

Use `references/panel-controls.md` for runtime tokens and additional-control requirements. `references/figma-ui3-components.md` remains a compatibility pointer.

## Build procedure

1. Read the question, baseline, target, requested adjustments, and existing decisions.
2. Inventory relevant properties as Exposed, Fixed, Unsupported, or Excluded. Give a reason for every property not exposed.
3. Separate design controls, fixture selection, viewport settings, and edit scope. The stock preset action restores a full state, including any declared fixture or scope selectors. For independent design switching, add a scoped preset adapter that preserves fixture and scope. Define Reset context behavior explicitly. Save full context even when design switching preserves it.
4. Create or resume the lab in the project's existing location. Keep one README and one preview per question.
5. Reuse the source implementation. Use a standalone page only when appropriate to the baseline.
6. Copy `lab-chrome.css`, `lab-chrome.js`, `variant-lab.css`, and `variant-lab.js` beside a standalone page. Load lab-chrome before variant-lab for each file type.
7. Use system fonts in the public pack. If a project explicitly requires bundled fonts, include their required licenses and verify font loading.
8. Define controls and complete presets. Supply stable `id` and `render(state)` values to `VariantLab.mount`.
9. Bind events through a stable parent if rendering replaces child elements. Check existing class names before adding lab classes.
10. Reserve space required by the design itself. Opening the tool panel must not reserve or remove product space.
11. Operate every binding, case, input path, and saved-state path before handover.

Use approved content or clearly synthetic fixtures. Preserve the product's locale. Do not invent real-looking names, metrics, or claims.

## Directions, descriptions, and history

Use theme or purpose names an independent reviewer can understand. Examples: Editorial feature, Compact browsing, Offer spotlight. Put property differences in `presetInfo[name].note`. Do not name new variations after edits or round numbers.

First preset is the baseline and Reset target. Store complete values in new presets. Do not duplicate an unchanged selected preset; mark it preferred instead. Use one active preset per distinct state.

Order baseline, preferred pick, explorations, then archive. The first round has no preferred pick unless the user supplies one. Keep baseline and preferred presets out of `archivePresets`. Preserve requested-again options and values in `picked`.

Preserve names and keys used by saved files. Add a replacement identity rather than silently renaming an old one. Removing a declared control can make old files incompatible; provide a tested migration or keep the key. Do not promise automatic compatibility.

The README owns question, focus, status, and history. Copy these fields into `about`. Use `r<round>.<revision>`. Increase revision after controls, options, or presets change. Start a new round when feedback returns; record the returned filename and reset revision to zero. History is oldest first.

Use Active, Chosen, Parked, or Rejected. A saved file retains top-level `status: 'unapproved'` even when the lab's review status is Chosen.

## Controls and groups

| Configuration | Meaning | Values |
|---|---|---|
| `options` | One named choice | `[label, {value: label}]` |
| `checks` | Independent inclusions | Same declaration shape; canonical state is a comma-separated string |
| `switches` | One immediate on/off setting | Label or `{label}`; state is `on` or `off` |
| `ranges` | Number field and slider | `label`, `min`, `max`, optional `step`, `unit`, `value` |
| `groups` | Logical collapsible section | `[label, [controlKeys]]` |

Use only meaningful choices. Do not invent three values for a binary domain. A requested count takes priority. Otherwise keep initial option lists short; five or fewer is a starting guideline, not a domain constraint. The runtime adds search when an options list exceeds twelve entries.

Group by task, component part, or text role. Aim for fewer than eight visible rows per group. Place a switch inside a logical group so the group can collapse. Preserve intentional open/closed state on resume.

Use each role's own font, weight, style, size, tracking, and line-height controls. Show an explicit link control for shared values. Hide controls for absent anatomy. Show dependent values only when their parent is enabled.

For numeric fields, preserve editable partial input. Commit on Enter, blur, or established arrow behavior. Escape restores the applied value. Show units and a domain-specific error. A valid precise value must not be blocked by arbitrary exploratory increments.

### Validation limits

The bundled range validator checks numeric finiteness and bounds. It does not enforce `step`, semantic tokens, allowed multiples, or approved exceptions. `lab.set` is not a complete validation boundary. Invalid URL values may fall back to defaults. Invalid preset values warn and are ignored.

When the task requires stricter behavior, add a scoped adapter before every state entry path: control commits, programmatic changes, presets, URL restoration, imports, resets, and application. Preserve the last valid state and show the cause. A post-render correction alone is not validation. Report any unresolved path as a gap.

The runtime stores flat scalar control values. It does not export arbitrary per-instance objects. Use declared stable keys or a tested adapter for fixture, scope, or override state. Do not insert private application objects into the selection.

## Descriptions, notes, and markers

Preset descriptions are visible in the open preset list. `notes[key]` appears in the row's native tooltip and saved JSON. A note containing CONFIRM adds a question marker. This is not persistent adjacent help.

If a setting needs visible help, render a short associated description in its group or a keyboard-accessible disclosure. Keep the label and input association. Do not rely on hover for required instructions. Use an adapter when the bundled markup does not provide that help.

The Note section stores the reviewer's reason and next request. It starts collapsed. Keep Reset, Load saved, and Save selection reachable in the footer.

A star means AI recommendation. A dot means new this round. The runtime displays one marker per item; the star takes precedence. When both facts apply, retain both in metadata and add a combined accessible description or a concise About entry. Do not claim that the stock runtime shows both markers. `fresh[key]=['range']` marks a numeric row; `['on']` marks an enabled switch. Presets use `recommended` and current `round` metadata.

## Floating tools and themes

Use the runtime's compact gear icon. The visible circle is 36px. Preserve its accessible name, tooltip, focus, and normal cursor. If the target device requires a larger activation area, enlarge the hit area without increasing visual clutter.

The panel starts closed unless a resumed session intentionally kept it open. It overlays the page. It must not dock, narrow the preview, change wrapping, or alter aspect ratio. `dock` is ignored; `lab.dock()` is a compatibility no-op.

Keep the panel nonmodal. Do not lock page scroll or trap focus. Keep panel scrolling independent and avoid wheel-driven numeric changes. Do not steal focus after each adjustment. Keep launchers outside transformed or scrolling preview content.

The stock CSS uses a 300px panel and a viewport-height bound. At or below its 700px media breakpoint, it uses automatic width and a 60vh height bound. This does not guarantee fit under narrow viewports, zoom, or virtual keyboards. Verify visible bounds and menu clipping. Add a scoped responsive adapter when required. Keep header, close action, active field, and footer reachable. Collapse or deliberately reposition tools when they obscure the target. Do not move them unexpectedly while typing.

Use Light and Dark for the tool theme. `theme: 'light'|'dark'` and the header theme icon affect tools only. Preserve the product theme unless it has its own explicit control. Theme is stored in `lab-theme`, not exported as design state by default.

## Keyboard and clean captures

Hold B temporarily shows baseline. Releasing it restores the current edit without changing selection. Use another one-character `compareKey` or `null` when the product uses B. The Hold button works when the keyboard shortcut is disabled.

Ignore compare while typing or when tools are hidden. With the panel closed, B can also reach the product. Keep other tool input from triggering product actions.

Escape dismisses the active inner layer before the panel: dropdown, About, active Note or numeric draft, then panel as applicable. Verify actual focus and restoration. Escape in tools must not navigate the product back.

Mark lab-only elements `data-lab`. `?lab=0` hides tool chrome for captures. L hides tools but leaves a return tab. Keep hash state separate from in-page anchor navigation. Use `LabChrome.mount` as a launcher strip only on pages without this panel; do not add a second control home.

For fixed-screen products, keep target size separate from fit-to-window scale. A TV example uses 1920×1080 and an approximately 5% safe area, 96px horizontally and 54px vertically. These are examples, not universal device rules. Test arrows, OK, Back, and immediate focus visibility when that input model applies.

## Undo and individual restore

The header Undo icon and `lab.undo()` restore the previous selection. Command+Z or Ctrl+Z triggers this action when tools are enabled and focus is not in a text, numeric, select, or editable field. Native text undo and Shift-modified redo chords remain untouched. The shortcut also works with the panel closed.

One preset, Reset, individual restore, or successful import is one undo action. A continuous slider drag or held adjustment key is one action. Checkbox, switch, dropdown, programmatic `set`, and external URL-state changes are also recorded. No-op changes, failed imports, theme changes, and Hold baseline comparison do not create actions.

A changed control displays a restore icon. The icon restores that control's first-preset value. It hides when the value matches baseline. A checkbox list restores the entire declared set, not an individual checkbox. The footer Reset remains global. Restores and resets can be undone.

The runtime retains the latest 100 committed selection actions in memory. A pending slider gesture can temporarily add one draft entry. History is discarded on reload and excluded from JSON. Redo is not implemented.

Import undo restores state and source-file context. It restores the earlier reviewer note only if the note has not been edited since import. Other selection undo preserves the current note. Invalid metadata is rejected before selection or history changes.

Returned members include `undo()` (boolean), `canUndo` (boolean), and `resetControl(key)` (boolean). Unknown keys and controls already at baseline return false from `resetControl`. A no-op `undo()` returns false.

## Save and restore

Always supply a stable lab ID across machines and rounds. Values serialize as strings. Numeric preset declarations are accepted. Checkbox arrays become canonical comma-separated strings.

Save selection writes schema version 1 with these fields:

| Field | Content |
|---|---|
| `lab` | `id`, `title`, `version`, `round`, `revision`, review `status`, `configHash` |
| `state`, `baseline` | Full declared current and baseline values |
| `changes` | Changed controls with `from` and `to` |
| `preset` | `current`, `nearest`, `diffFromNearest`, `baseline` |
| `fileName`, `basedOn` | Current export name and last loaded filename or null |
| `reviewerNote`, `notes`, `feedback` | Explicit review text only |
| `previewUrl`, `exportedAt` | Relative selection fragment and timestamp; no page origin, path, or query |
| `status` | `unapproved` |

The runtime does not export complete `presetInfo`, `about.history`, `recommend`, `fresh`, tool theme, or section layout. Keep those in the lab folder. Include the fixture manifest there. Declare fixture/scope selectors as controls when reproduction requires them.

File pattern: `<id>_<version>_<nearest preset>[+<up to 3 changed keys>]_<local date>.json`. Nearest means fewest different controls; declaration order breaks ties. This is a filename rule, not a naming policy for design themes.

Load checks schema, lab ID, known keys, and supported values. Invalid files are rejected as a whole. Newly added controls use the current baseline. Removing or changing old domains needs a tested migration. Verify failed imports preserve the current edit and note. A changed `configHash` reports compatibility context; it does not prove equivalent rendering.

Export only declared design values and intentional notes. Fixture selectors use synthetic IDs. Never pass stores, DOM, profiles, credentials, or chat history. Save and load never authorize production work.

## API reference

```js
const lab = VariantLab.mount({
  id: 'card-review', title: 'Card review',
  about: { question: 'Which card supports this task?', round: 1,
    revision: 0, status: 'Active', focus: 'Hierarchy and content cases', history: [] },
  options: { titlePlacement: ['Title placement', { below: 'Below image', over: 'Over image' }] },
  checks: { extras: ['Optional content', { badge: 'Badge', subtitle: 'Subtitle' }] },
  switches: { shadow: 'Shadow' },
  ranges: { radius: { label: 'Corner radius', min: 0, max: 24, step: 1, unit: 'px', value: 8 } },
  order: ['titlePlacement', 'extras', 'shadow', 'radius'],
  groups: { surface: ['Surface', ['shadow', 'radius']] },
  presets: {
    'Current design': { titlePlacement: 'below', extras: ['badge'], shadow: 'off', radius: 8 },
    'Editorial feature': { titlePlacement: 'over', extras: ['badge'], shadow: 'on', radius: 12 }
  },
  presetInfo: {
    'Current design': { note: 'The supplied card.' },
    'Editorial feature': { note: 'Image-led hierarchy for featured content.', by: 'ai', recommended: true, round: 1 }
  },
  notes: { radius: 'CONFIRM: source radius has not been measured.' },
  recommend: { shadow: ['on'] }, fresh: {}, picked: {},
  archive: {}, archivePresets: [], feedback: '',
  open: false, theme: 'light', compareKey: 'b',
  render(state) { /* Bind declared values to the source component and fixtures. */ }
});
```

This configuration demonstrates the API. It omits fixture and scope selectors. It is not a complete fixture matrix or strict-domain validator. When adding those selectors, implement independent design-preset switching as specified above. Adapt its values to the real component contract.

Returned members: `undo()`, `canUndo`, `resetControl(key)`, `state`, `set(values)`, `note`, `setNote(text)`, `exportJSON()`, `downloadJSON()`, `importJSON(text)`, `loadMessage`, `configHash`, `fileName()`, `open(bool)`, and `theme('light'|'dark')`. `dock()` remains a no-op. `VariantLab.viewport()` reports window size. `lab:layout` fires for panel open/close.

`configHash` is eight hexadecimal characters. It reflects control domains and presets, not labels, notes, groups, or order. `groups` affects layout only. Section state uses `lab-sec:<id>`; note and About state are stored per lab. Browser storage is a convenience, not the handover artifact.

## Verify and hand over

1. Operate every control and all applicable fixtures. Check intended and unrelated targets.
2. Check presets, Reset, partial/invalid numeric entry, nested Escape, baseline comparison, descriptions, note, and marker meanings.
3. Check long panel/page scrolling, menu edges, desktop and narrow widths, required zoom, and supported keyboard/touch use.
4. Save a preset plus one independent edit. Inspect JSON. Load it in a fresh instance. Test invalid/wrong-lab input and failed download recovery.
5. Run `node --test assets/variant-lab-export.test.cjs` with Node 20 or newer (verified on 20.20.2).
6. Run `assets/selftest.html` in Light and Dark. Serve the folder when local reads are blocked. Headless file tests may need `--allow-file-access-from-files`.
7. Capture contrasting variations under the target conditions with tools hidden. Report untested fidelity or device conditions.

Give exact links to the HTML, configuration, README, and saved file when present. State the verified preview URL and whether a server must run. Explain Note and footer actions. For local sharing, send the lab folder and saved selection together. A local URL alone will not open on another computer.

For later rounds, read the note first, update history, preserve the pick, and add only requested or justified adjustments. Archive unneeded choices without deleting baseline, preferred state, or requested-again values. Add a comment for new round options. New control defaults determine old-file fallback; choose them deliberately.

Apply a state outside the lab only with explicit authorization. For code, apply scoped deltas and verify. For an image baseline, return values and units with the source selection filename. Keep the lab as the review record.
