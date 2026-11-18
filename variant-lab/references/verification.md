# Verify and hand over

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
