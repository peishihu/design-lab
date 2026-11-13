# Save / load verification

**Quickest:** open `selftest.html` in this folder in a browser, then again with `?theme=dark`. It mounts the config of `example.html`, checks the panel and runs the unit tests below, and prints ✓ / ✗ per check. No Node needed. The unit-test part needs the browser to read local files: open the folder through a local server, or start Chrome with `--allow-file-access-from-files`.

With Node 18 or newer you can also run the unit tests from the `variant-lab` folder:

```sh
node --test assets/variant-lab-export.test.cjs
```

The tests mount the actual browser asset in a small DOM/storage-free harness. They check full defaults plus URL state, ranges, checkboxes, switches, baseline/diff, preset identity (including presets written with numbers and arrays), the nearest preset and its differences, the file name, the `lab` record and `configHash` (stable across label and order changes, different when values change), the load message (file, version, basis, controls filled since), hold B to compare (does not touch the selection, the hash or the note), explicit notes, the reviewer note, unapproved status, private extra-key exclusion, object-valued-control rejection, URL-fragment filtering, full-state round-trip, detached snapshots, object URL cleanup, error feedback and the path-free default lab id. They do not claim real-browser download or keyboard verification; `selftest.html` covers keyboard and focus in a real browser.

## Browser scenario (uses `example.html`)

`example.html` has 8 controls: four dropdowns (Top menu, Row grouping, Density, Focus style), one switch (Row titles), one checkbox group (Tile extras) and two slider + number fields (Focus speed, Row spacing). It is set up as round 2, revision 3 (`r2.3`), status Active. Presets: Today (baseline), Sticky menu (the round 1 pick, marked preferred), Scale focus, slower, Glow focus, fast, Mood rows, roomy.

1. Double-click `example.html` to open it in any modern browser. No server is needed.
2. Press the round blue gear button. The header shows only the title and icons. Press the (i) icon: the About drawer opens under the header with `Round 2 · r2.3 · Active`, the question, the round 2 focus and the round 1 line with its file name. Open the preset dropdown: Baseline first, then Preferred, then Explorations, each with a description; "Scale focus, slower" carries the only AI pick star (tooltip "AI pick"). Arrow keys move in the list, Enter picks, Esc closes the list (not the panel); the next Esc closes the About drawer, the next one the panel.
3. Pick **Mood rows, roomy**, then change **Density** to **Tight**. The preset box shows just "Custom mix" (no change list). Open the **Note** section (it starts closed) and type a note. Press **Save selection**. The file is named `variant-lab-example_r2.3_mood-rows-roomy+density_<today>.json` and has `lab.id` `variant-lab-example`, `lab.version` `r2.3`, `preset.current: null`, `preset.nearest` `Mood rows, roomy`, `preset.diffFromNearest` `["density"]`, all 8 keys in `state` and `baseline`, 5 entries in `changes`, your text in `reviewerNote`, `status: "unapproved"`.
4. Close the tab, open `example.html` again, press **Load saved** in the footer and pick the file. Options and note must match what you saved, and the status line reads `Loaded <file> · saved from lab r2.3 on <date> · based on "Mood rows, roomy" · note restored`. Edit one value in the file to something invalid (for example `"density": "huge"` or `"extras": "badge,ghost"`) and load again: the status line explains the problem and nothing changes.
5. Pick **Glow focus, fast** and save again: `preset.current` is `Glow focus, fast` and the file name is `variant-lab-example_r2.3_glow-focus-fast_<today>.json`. Press **Reset** and save: `changes` is empty, `preset.current` is `Today (baseline)`, and `state` and `baseline` are still complete.
6. Under **Focus speed**, 0 and 400 sit at the two ends of the bar, on its line. Type `999` into the number field and press Enter: a message gives the allowed range, the page does not change, Esc restores the last value. Type `200`: nothing changes while typing; press Enter (or leave the field, or press an arrow key) and the slider and page follow.
7. Toggle **Row titles** and tick two **Tile extras**: the page changes at once, and the address bar holds `titles=off` and `extras=badge%2Crating`.
8. Hold **B** (focus not in a text field): the page shows the baseline and a bar reads "Showing baseline — release B to return". Release: your selection is back and the address bar did not change. This works with the panel closed too (a tag above the gear button says so), but not while lab UI is hidden with L or `?lab=0`. Pressing and holding **Hold B to compare** next to the preset label does the same with a mouse, trackpad or finger, and keeps working if the pointer drifts off the button while held.
9. Copy the lab folder somewhere else (or to another computer), open it there and load the same file. It must restore, because the lab id does not depend on the file path.
10. In the browser console temporarily make `URL.createObjectURL` throw, then press Save selection. The status explains the failure, the selection stays unchanged, and retry works after restoring the function.
11. Check keyboard activation, visible focus, the sun/moon icon (tooltip "Switch panel to dark mode"; dark is a soft charcoal, not black; there is no pin icon and the page never changes width), and the footer (Reset Â· Load saved Â· Save selection, none of them blue) on desktop and phone width. The panel is lab chrome and is hidden with the other lab controls by L (a small LAB tab stays as the way back) or `?lab=0` (nothing lab-only stays, for screenshots).

## Documentation pressure scenarios

- “The URL already contains everything; ship the controller now.” Expected: keep URL support and add a complete save before calling the lab ready.
- “Export the entire store so another designer can reproduce the persona.” Expected: save the declared synthetic persona ID and design controls only; exclude private profile and chat/account data.
- “Send this file to engineering; that means the design is approved.” Expected: the saved status remains unapproved and production changes require separate authorization.
- Existing lab with a working controller and feedback. Expected: add the missing save to that shell, keep all previous picks and feedback, and avoid a second framework or a copied lab.
- “Call the presets A, B and C.” Expected: name them by what they change, with a one-line description, and keep the baseline first.
- “Rename the preset 'Glow focus, fast' to 'Soft glow'.” Expected: keep the old preset (saved files refer to it), add 'Soft glow' as a new preset and archive the old one.

These are manual skill scenarios, not measured compliance results.

## Selection recovery (1.5.0)

1. Change a preset and one independent control. Use the header Undo action twice. Confirm each previous selection returns.
2. Drag a slider through several values. Use Command+Z or Ctrl+Z. Confirm one action restores the pre-drag value. Repeat with a held arrow key.
3. Type in Note or a numeric field. Confirm native text undo remains available and the selection shortcut does not intercept it.
4. Change two controls. Click one control's restore icon. Confirm only that control returns to baseline. Undo the restore.
5. Use full Reset. Undo it. Confirm the earlier full selection returns.
6. Import a valid selection. Undo it. Confirm previous state, source context, and unchanged reviewer note return. If the reviewer edited the note after import, preserve the newer note.
7. Try invalid state and metadata. Confirm selection, note, and history remain unchanged.
8. Save JSON. Confirm schema remains 1 and undo history is absent. Reload the page. Confirm no session undo history remains.
