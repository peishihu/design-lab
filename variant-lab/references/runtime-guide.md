
# Variant Lab runtime guide

Paths in code spans are relative to `variant-lab/` unless stated otherwise. All behavior requirements remain binding. The skill entries own loading. Older “main skill” or “this file” wording identifies the rule owner; it does not require loading this whole manual. Read the sections selected by the entry before acting.

Use the bundled panel for live adjustments. Before creating or repairing controls, follow [Required panel integration](panel-integration.md). It requires source checks and open-panel inspection. A custom shell is not equivalent. Read sibling `design-lab/SKILL.md` for review. For component coverage, follow its `references/component-cases.md`.

## Runtime and generated integration

The runtime provides four control types, presets, groups, a floating launcher, tool themes, baseline comparison, and selection save/load.

Provide the component, fixtures, property bindings, validation, and verification. The runtime does not discover adjustable properties, generate edge cases, enforce project tokens, measure fidelity, or promote production changes.

Use `references/panel-controls.md` for runtime tokens and additional-control requirements. `references/figma-ui3-components.md` remains a compatibility pointer.

## Build procedure

1. Read the question, baseline, target, requested adjustments, and prior decisions.
2. Classify relevant properties: Exposed, Fixed, Unsupported, or Excluded. Explain each unexposed property.
3. Separate design controls, fixtures, viewport settings, and edit scope. Stock presets restore full state, including declared fixture/scope selectors. For independent design switching, add a scoped preset adapter that preserves fixture and scope. Define Reset context behavior. Always save full context.
4. Create or resume the lab in its existing project location. Keep one README and one preview per question.
5. Reuse the source implementation. Use a standalone page only when appropriate to the baseline.
6. Copy `lab-chrome.css`, `lab-chrome.js`, `variant-lab.css`, and `variant-lab.js` beside a standalone page. Load lab-chrome before variant-lab for each file type.
7. Use system fonts in the public pack. If a project explicitly requires bundled fonts, include their required licenses and verify font loading.
8. Define controls and full presets. Supply stable `id` and `render(state)` values to `VariantLab.mount`.
9. Bind events through a stable parent if rendering replaces child elements. Check existing class names before adding lab classes.
10. Reserve space for the design itself. Opening tools must not add or remove product space.
11. Operate every binding, case, input path, and saved-state path before handover.

Use approved content or clearly synthetic fixtures. Preserve product locale. Do not invent real-looking names, metrics, or claims.

## Directions, descriptions, and history

Name variations by theme or purpose for independent reviewers. Examples: Editorial feature, Compact browsing, Offer spotlight. Put property differences in `presetInfo[name].note`. Do not use edits or round numbers as new names.

The first preset is baseline and Reset target. Store full values in new presets. Mark an unchanged selected preset preferred; do not duplicate it. Keep one active preset per distinct state.

Order baseline, preferred pick, explorations, then archive. The first round has no preferred pick unless the user supplies one. Keep baseline and preferred presets out of `archivePresets`. Preserve requested-again options and values in `picked`.

Preserve names and keys used by saved files. Add a replacement identity instead of silently renaming one. To remove a declared control, provide a tested migration or keep its key. Do not promise automatic compatibility.

Keep question, focus, status, and history in the README. Copy them into `about`. Use `r<round>.<revision>`. Increase revision after control, option, or preset changes. When feedback returns, start a new round, record its filename, and reset revision to zero. Order history oldest first.

Use Active, Chosen, Parked, or Rejected. A saved file retains top-level `status: 'unapproved'` even when the lab's review status is Chosen.

## Controls and groups

| Configuration | Meaning | Values |
|---|---|---|
| `options` | One named choice | `[label, {value: label}]` |
| `checks` | Independent inclusions | Same declaration shape; canonical state is a comma-separated string |
| `switches` | One immediate on/off setting | Label or `{label}`; state is `on` or `off` |
| `ranges` | Number field and slider | `label`, `min`, `max`, optional `step`, `unit`, `value` |
| `groups` | Logical collapsible section | `[label, [controlKeys]]` |

Use meaningful choices. Do not invent three values for a binary domain. Follow requested counts. Otherwise start with short lists; five or fewer is guidance, not a domain limit. Search appears above twelve option entries.

Group by task, component part, or text role. Aim for fewer than eight visible rows per group. Place a switch inside a logical group so the group can collapse. Preserve intentional open/closed state on resume.

Give each role its own font, weight, style, size, tracking, and line-height controls. Provide an explicit link control for shared values. Hide absent-anatomy controls. Show dependent values only when their parent is enabled.

Preserve partial numeric input. Commit on Enter, blur, or established arrow behavior. Escape restores the applied value. Show units and domain-specific errors. Arbitrary exploratory increments must not block valid precise values.

### Validation limits

The range validator checks finite numbers and bounds, not `step`, semantic tokens, allowed multiples, or approved exceptions. `lab.set` does not fully validate state. Invalid URL values can use defaults. Invalid preset values produce warnings and are ignored.

For stricter validation, add a scoped adapter before every state entry: control commits, programmatic changes, presets, URL restoration, imports, resets, and application. Keep the last valid state. Show the error cause. Post-render correction alone is not validation. Report unresolved paths.

The runtime stores flat scalar values, not arbitrary per-instance objects. Use declared stable keys or a tested adapter for fixture, scope, or override state. Exclude private application objects.

## Descriptions, notes, and markers

The open preset list shows descriptions. `notes[key]` appears in the row's native tooltip and saved JSON. A note containing CONFIRM adds a question marker. This does not provide persistent adjacent help.

For visible help, add a short associated group description or keyboard-accessible disclosure. Preserve label/input association. Required instructions must not depend on hover. Add an adapter if bundled markup cannot provide the help.

Note stores the reviewer's reason and next request. It starts collapsed. Keep footer Reset, Load saved, and Save selection reachable.

A star means AI recommendation. A dot means new this round. The runtime displays one marker per item; the star takes precedence. When both facts apply, retain both in metadata and add a combined accessible description or a concise About entry. Do not claim that the stock runtime shows both markers. `fresh[key]=['range']` marks a numeric row; `['on']` marks an enabled switch. Presets use `recommended` and current `round` metadata.

## Floating tools and themes

Use the runtime gear: a 36px visible circle. Preserve its accessible name, tooltip, focus, and normal cursor. Enlarge its hit area for the target device when needed. Do not add visual clutter.

Start closed unless a resumed session intentionally kept the panel open. Overlay the page. Do not dock, narrow the preview, change wrapping, or alter aspect ratio. `dock` is ignored. `lab.dock()` is a compatibility no-op.

Keep the panel nonmodal with independent scrolling. Do not lock page scroll, trap focus, change numbers by wheel, or steal focus after adjustments. Keep launchers outside transformed or scrolling preview content.

The stock CSS uses a 300px panel and a viewport-height bound. At or below its 700px media breakpoint, it uses automatic width and a 60vh height bound. This does not guarantee fit under narrow viewports, zoom, or virtual keyboards. Verify visible bounds and menu clipping. Add a scoped responsive adapter when required. Keep header, close action, active field, and footer reachable. Collapse or deliberately reposition tools when they obscure the target. Do not move them unexpectedly while typing.

Name tool themes Light and Dark. `theme: 'light'|'dark'` and the header theme icon affect tools only. Preserve product theme without an explicit product control. `lab-theme` stores tool theme. It is not exported as design state by default.

## Keyboard and clean captures

Hold B to show baseline. Release it to restore the edit without changing selection. If the product uses B, choose another one-character `compareKey` or `null`. Hold works with the shortcut disabled.

Ignore compare while typing or when tools are hidden. With the panel closed, B can also reach the product. Keep other tool input from triggering product actions.

Escape dismisses the active inner layer before the panel: dropdown, About, active Note or numeric draft, then panel as applicable. Verify actual focus and restoration. Escape in tools must not navigate the product back.

Mark lab-only elements `data-lab`. `?lab=0` hides tool chrome for captures. L hides tools but leaves a return tab. Keep hash state separate from in-page anchor navigation. Use `LabChrome.mount` as a launcher strip only on pages without this panel; do not add a second control home.

For fixed-screen products, keep target size separate from fit-to-window scale. A TV example uses 1920×1080 and an approximately 5% safe area, 96px horizontally and 54px vertically. These are examples, not universal device rules. Test arrows, OK, Back, and immediate focus visibility when that input model applies.

## Undo and individual restore

The header Undo icon and `lab.undo()` restore the previous selection. Command+Z or Ctrl+Z triggers this action when tools are enabled and focus is not in a text, numeric, select, or editable field. Native text undo and Shift-modified redo chords remain untouched. The shortcut also works with the panel closed.

One preset, Reset, individual restore, or successful import is one undo action. A continuous slider drag or held adjustment key is one action. Checkbox, switch, dropdown, programmatic `set`, and external URL-state changes are also recorded. No-op changes, failed imports, theme changes, and Hold baseline comparison do not create actions.

A changed control displays a restore icon. The icon restores that control's first-preset value. It hides when the value matches baseline. A checkbox list restores the entire declared set, not an individual checkbox. The footer Reset remains global. Restores and resets can be undone.

Keep the latest 100 committed selection actions in memory. A pending slider gesture can add one temporary draft. Reload discards history. JSON excludes it. Redo is not implemented.

Import undo restores state and source-file context. It restores the earlier reviewer note only if the note has not been edited since import. Other selection undo preserves the current note. Invalid metadata is rejected before selection or history changes.

Returned members include `undo()` (boolean), `canUndo` (boolean), and `resetControl(key)` (boolean). Unknown keys and controls already at baseline return false from `resetControl`. A no-op `undo()` returns false.

## Save and restore

Keep lab ID stable across machines and rounds. Values serialize as strings. Numeric preset declarations are valid. Checkbox arrays become canonical comma-separated strings.

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

The runtime does not export complete `presetInfo`, `about.history`, `recommend`, `fresh`, tool theme, or section layout. Keep them and the fixture manifest in the lab folder. Declare fixture/scope selectors as controls when needed for reproduction.

File pattern: `<id>_<version>_<nearest preset>[+<up to 3 changed keys>]_<local date>.json`. Nearest means fewest different controls; declaration order breaks ties. This is a filename rule, not a naming policy for design themes.

Load validates schema, lab ID, known keys, and supported values. It rejects invalid files in full. New controls use current baseline values. Test migrations for removed or changed old domains. Verify failed imports preserve edit and note. A changed `configHash` gives compatibility context, not rendering equivalence.

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

This API example omits fixture/scope selectors, a full fixture matrix, and strict-domain validation. Add independent design-preset switching with those selectors as specified above. Adapt values to the real component contract.

Returned members: `undo()`, `canUndo`, `resetControl(key)`, `state`, `set(values)`, `note`, `setNote(text)`, `exportJSON()`, `downloadJSON()`, `importJSON(text)`, `loadMessage`, `configHash`, `fileName()`, `open(bool)`, and `theme('light'|'dark')`. `dock()` remains a no-op. `VariantLab.viewport()` reports window size. `lab:layout` fires for panel open/close.

`configHash` is eight hexadecimal characters. It reflects control domains and presets, not labels, notes, groups, or order. `groups` affects layout only. Section state uses `lab-sec:<id>`; note and About state are stored per lab. Browser storage is a convenience, not the handover artifact.

## Verify and hand over

Follow [panel-integration.md](panel-integration.md) for source checks and rendered evidence. Add its check to lab verification. Fix missing-runtime and custom-shell defects before claiming readiness. Also run these checks:

1. Operate every control and all applicable fixtures. Check intended and unrelated targets.
2. Check presets, Reset, partial/invalid numeric entry, nested Escape, baseline comparison, descriptions, note, and marker meanings.
3. Check long panel/page scrolling, menu edges, desktop and narrow widths, required zoom, and supported keyboard/touch use.
4. Save a preset plus one independent edit. Inspect JSON. Load it in a fresh instance. Test invalid/wrong-lab input and failed download recovery.
5. Run `node --test assets/variant-lab-export.test.cjs` with Node 20 or newer (verified on 20.20.2).
6. Run `assets/selftest.html` in Light and Dark. Serve the folder when local reads are blocked. Headless file tests may need `--allow-file-access-from-files`.
7. Capture contrasting variations under the target conditions with tools hidden. Report untested fidelity or device conditions.

Link the HTML, configuration, README, and saved file when present. Give the verified preview URL and server requirement. Explain Note and footer actions. Share the lab folder and saved selection together. A local URL alone does not open on another computer.

In later rounds, read the note first. Update history and preserve the pick. Add only requested or justified adjustments. Archive unneeded choices. Keep baseline, preferred state, and requested-again values. Comment on new round options. Choose new defaults deliberately: old files use them as fallback.

Apply a state outside the lab only with explicit authorization. For code, apply scoped deltas and verify. For an image baseline, return values and units with the source selection filename. Keep the lab as the review record.
