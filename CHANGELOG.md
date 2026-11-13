# Changelog

## 1.5.2 (2026-11-12)

- Export relative selection context instead of page addresses, preventing automatic inclusion of local paths, origin credentials or query strings.
- Complete bounded source/asset review and an agent first-use pilot with 288 declared card cases. State tested platform and remaining limits for beta use.

## 1.5.1 (2026-11-12)

- Put author metadata and maintainer information after the quick start instead of before it.
- State the verified Node version for optional command-line tests.
- Use theme-based example presets and gear-icon instructions. Preserve prior preset identities as archived aliases.

## 1.5.0 (2026-11-12)

- Added session-local selection Undo with Command+Z / Ctrl+Z and a header action. Text editing retains native undo.
- Added per-control baseline restore icons. Restores, full Reset, presets and successful imports are undoable.
- Grouped continuous slider gestures and held adjustment keys into one action. Retained the latest 100 committed actions.
- Preserved notes edited after import and rejected invalid import metadata before mutation.
- Added regression tests and real-browser recovery checks. JSON schema remains version 1; history is not exported.

## 1.4.0 (2026-11-12)

- Rewrote workflow and runtime guides using controlled-English principles. Standardized terms and observable completion criteria.
- Added the component-case contract, finite supported combinations, case coverage records, and family-versus-instance edit scope.
- Replaced delta-based variation names with theme or purpose names and short descriptions. Preserved legacy saved identities.
- Applied fidelity checks to screenshot and standalone labs. Defined the initial draft as subjective readiness, not a numeric completion score.
- Specified floating, collapsible, viewport-bounded controls and independent Light/Dark tool themes.
- Documented runtime limits for strict validation, fixture context, persistent help, marker precedence and JSON metadata. Runtime files and schema remain unchanged.
- Replaced the old UI reference prose with a guide to observed runtime values. The old filename remains a compatibility pointer. Source-history evidence remains in the local project review.

## 1.3.1 (2026-11-12)

- Replaced the legacy build-phase reference with a project continuation guide based on the current lab workflow: resume a saved selection, bind scoped controls, verify the review path, carry feedback into the next round, and apply a choice only with authorization.
- Removed the fixed lettered variant menu, synthesis questionnaire, framework inventory, and automatic cleanup sequence from that reference.
- Retained runtime APIs, saved-file format, baseline and preferred-state behavior. No runtime code changed.

Versions: MAJOR.MINOR.PATCH. Bump PATCH for fixes, MINOR for new guidance or features that keep old labs working, MAJOR when old labs or exported JSON stop working. Update the version line in README.md too.

## 1.3.0 (2026-11-10)
Old labs and saved files keep working; `groups` is optional and layout only.
- New `groups: { gid: [label, ['key', ...]] }`: one collapsible section holds several controls. Members stay open, without their own chevron or divider. The group sits where its first member is in the order. Not part of the saved state or `configHash`.
- Long dropdowns (more than 12 values) get a search field at the top of the menu: type to filter, Down to enter the list, Enter picks the first match. Built for a font lab with 1,798 installed fonts.
- Guidance: preview labs from a local server when the browser pane shows `file://` as a static snapshot; served labs use installed font names, not `file://` font URLs.
- Learning log: `design-lab/LEARNINGS.md` records each workflow learning with a status (open, verified, promoted, reverted); promotion updates the skill and the CHANGELOG and rebuilds the pack with `design-lab/scripts/build_pack.py`. The log stays out of the shared pack.
- Guidance (variant-lab and design-lab): type and editorial labs get one group per type role (Display / H1, H2, H3, Body, Meta, Numbers), each with font, weight, style, size, tracking and line height. A control changes one role only; a shared value is a visible switch, never a hidden coupling.

## 1.2.0 (2026-11-09)
The panel now looks like a Figma UI3 properties panel (version G of the style comparison). Old labs and saved files keep working; the config is unchanged.
- Look: Inter 11/16 (bundled, SIL OFL) replaces Space Grotesk and JetBrains Mono; 24 px controls with 5 px radius, 13 px panel radius, 40 px section headers, white / #2c2c2c surfaces.
- Single choices are dropdowns (also for two values); archived values sit in an "Archive" group inside the menu. One menu is open at a time; Esc closes it and returns focus to its field.
- Menus follow the mode (white in day, #1e1e1e in night) and share the field's 5 px radius. A menu opens above its field when there is more room there, so the footer never covers it, and scrolls inside itself when neither side fits.
- Marks are icons only: a four-point star = AI pick, a small blue dot = new this round, each with a tooltip.
- Every option is a collapsible section; open / closed is remembered per lab. Lines between sections run full width.
- The note is a collapsible **Note** section (closed at start, opens when a loaded file has a note). Footer: Reset · Load saved · Save selection, none of them blue.
- Number field and slider sit on one line; checkboxes are one column, one line each, with an ellipsis.
- Selected, checked and on states are neutral (ink, white, grey). Blue stays only for the floating button, slider fill, focus rings and the marks.
- The floating button is a 36 px blue circle with a white gear and no word; the gear turns a little while the panel is open.
- New reference: `variant-lab/references/figma-ui3-components.md` lists Figma UI3 values and the components to build when a lab needs a control the panel does not have yet.
- Tests: selftest (64 checks) covers dropdowns, menu colour per mode, sections, marks, footer and the round button; the export unit tests match the new markup.

## 1.1.1 (2026-11-09)
Fixes from a dry run (a fresh agent followed the skill on a simple card-row page) and from Pei's review of the panel. Old labs and saved files keep working.
- Quieter panel (review, 2026-11-09): only two tags remain, **AI PICK** (recommended) and **NEW** (new this round), at most one per item. The baseline circle, the "your pick" square, the AI / YOU and R2 tags and the slider's "today" tick and label are gone (`picked`, `by` and `round` stay in the config and the file). A custom mix reads just "Custom mix", without the "based on … · N changes" lines. The archive reads "Archive (n)".
- The note box is hidden until **Add note** (in the footer, next to Reset) is pressed; the button then reads Hide note, and Edit note once a note exists. Esc in the note closes it.
- Slider min and max sit at the two ends of the bar, on its line, instead of in a row under it.
- Scrollbars in the panel (body, About drawer, preset list, note box) are a thin 3 px rounded indicator with no track or arrows, faint at rest and darker on hover, in both modes. The page's own scrollbars are left alone (they belong to the design).
- The panel only floats: "Pin to right side" is removed, because docking changed the page's width and ratio. `dock: true` is ignored with a console warning; `lab.dock()` is a no-op.
- Dark mode is a softer charcoal (#222 paper, #2b2b2e controls, off-white #d6d6d2 ink, fainter grid and outlines) instead of near-black with bright white, so it is calmer to look at; text still reaches 4.5:1.
- The items below were written on 2026-11-08; where they mention the slider pick square or tooltips on AI / YOU / R2, the entry above replaces them.
- Guidance: "describe first" and the brief questions go out as one message. The user's option count always wins over the usual 3; two positions of one thing (under / over) are a two-option button group, not a switch. Slider steps now include 2 px for corner radius.
- Presets: in round 1 there is no Preferred preset yet. One preset per state: when the reviewer picks an existing preset unchanged, mark it `preferred` instead of copying it under a new name. Options the reviewer's note asks for stay active instead of moving to the archive.
- New "Apply the pick" step: with a code baseline, apply the chosen state to the real page once the user says so; with a screenshot baseline, hand back a short spec list of changed values for the design file.
- `picked` now marks switches and sliders too (on a slider the square sits on the track at the picked value, which is in its tooltip); `fresh: { key: ['range'] }` marks a slider row NEW. `archive` stays for button groups and checkboxes (documented).
- Panel shows no explanatory text: per-row `notes` are no longer drawn under the controls. A note is now the row name's tooltip and still goes into the saved file; a note with `CONFIRM` shows a small "?" marker. Preset names and descriptions no longer say "round 1 pick" (the example's "Sticky menu (round 1 pick)" is now "Sticky menu", marked preferred). Reasons live in the README and About.
- The legend at the bottom of the panel is gone; every marker (baseline, pick, recommended, NEW, AI / YOU, R2, ?) has a tooltip instead.
- "Hold to compare" now reads **Hold B to compare** (or the configured key; "Hold to compare" when `compareKey: null`). Pressing and holding it with a mouse did nothing in 1.1.0: the "Showing baseline" bar appeared, pushed the button out from under the pointer and ended the hold at once. It now captures the pointer, so mouse, pen and touch holds last until release; Space or Enter held on the focused button works too.
- Hold B works with the panel closed as well, with a small "Showing baseline" tag above the LAB button. It stays off while lab UI is hidden with L or `?lab=0` (the "what ships" view gets every key as it would ship), and never fires while typing in a field.
- `?lab=0` now hides the small LAB tab as well, so screenshots are clean; L still leaves the tab as the way back.
- Bug: a number field that only had focus could write its old value over a newer selection (from `lab.set`, a hash change or a load) when it was left. It now applies on leaving only after typing, and shows the new value while focused.
- The load message shows the save date as the local calendar day (as in the file name), and no longer says "0 controls filled from baseline" when nothing was filled.
- Both SKILL files say that headless Chrome or Edge needs `--allow-file-access-from-files` to run `selftest.html` from `file://`. New self-test and unit checks cover the fixes above.

## 1.1.0 (2026-11-07)
Old labs and saved files keep working (schemaVersion stays 1; every new field is optional when loading).
- Floating button now reads **LAB** (solid blue). The panel header shows only the lab title (cut with "…" when long) and icons; **About this lab** moved to an info icon that opens a drawer under the header (open state remembered per lab).
- Sliders show a real "today" tick at the baseline value. The number field applies on Enter, on leaving the field, or with the arrow keys, not while typing.
- A custom mix shows what differs from the nearest preset ("Based on … · N changes"). Saved files are named `<lab>_<version>_<nearest preset>[+changes]_<date>.json`.
- **Hold B** (or the "Hold to compare" button) shows the baseline until you let go; `compareKey: 'c'` or `null` changes or turns it off. The legend names every marker.
- Lab version `r<round>.<revision>` and status in the config (`about.revision`, `about.status`), history entries can name their file, `lab.configHash` fingerprints controls and presets. Saved files carry `lab`, `fileName`, `basedOn` and `preset.nearest` / `diffFromNearest`; loading says which file, version and basis it came from and lists controls that changed since. Top-level `round` / `focus` in saved files are kept for this version and deprecated.
- Your note sits under the preset box. Larger click targets, no panel text under 11 px, footer buttons without subtitles.
- Contrast: small blue text uses its own token (`--b-blue-text`: #2846e0 light, #3d7aff dark) to reach 4.5:1; error red #9e2416 in light. LAB button, slider thumbs and marks keep #3557ff.
- New `variant-lab/assets/selftest.html`: checks the panel in the browser and runs the unit tests, no Node needed.

## 1.0.0 (2026-11-07)
First shared version, by Pei Shi Hu, MIT license.
- Works with any agent that can read and write files, any OS, any modern browser, any design tool. Lab locations are up to the user or project.
- `design-lab`: core workflow (one question, real baseline, describe, ask once, variants as presets, press through, share and decide). `DESIGN_PRINCIPLES.md` cut to one page of generic, platform-neutral defaults.
- `variant-lab`: Options panel with four control kinds (button group, checkboxes, switch, slider + number field), presets as a dropdown (baseline, preferred, explorations, archive; each with a description and who proposed it), "About this lab" round record, reviewer note, Reset, Save selection / Load saved selection (JSON schemaVersion 1, checked against a stable lab `id`, file named by lab, round and change), pin to right side / float, L or `?lab=0` hides lab UI.
- `design-lab`: "which control for which question" based on published guidance (sources listed), naming rules for presets, the round record and saved files.
- Lab chrome look: minimal blueprint (grid paper, black / white / grey + electric blue, thin line icons, no decoration), Space Grotesk + JetBrains Mono bundled in `variant-lab/assets/fonts/` (OFL). Light mode (grey paper, white controls) and dark mode, switched with the sun/moon icon.
- Robustness: labels and notes are escaped, preset typos warn in the console, numbers in presets match slider values, keys inside the panel don't reach the page, Esc closes the panel before the page sees it, visible keyboard focus, panel stays above page overlays and page-wide styles.
