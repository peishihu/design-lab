# Selected-part controls

Use this guide when controls depend on the selected component or when a design system restricts values.

## Record each binding

Inspect source, rendered elements, computed styles, and conditional data. Record this contract beside the control configuration:

| Field | Required value |
|---|---|
| Identity | Stable component, instance, part, and state identifiers |
| Source | File, export, property, token, and scoped rendered target |
| Presence | Condition under which the target exists |
| Capability | Supported edit and any dependent values |
| Current | Source value and resolved value with unit |
| Default | System default and inherited value when applicable |
| Domain | Allowed tokens, variants, numeric values, and permitted Off state |
| Scope | Family, instance, part, or state affected by edit and reset |
| Status | Within system, Existing violation, Approved exception, or Unverified |

Verify the rendered target. A source field alone does not prove that the part exists. Recompute controls after changing selection, fixture, variation, or state.

If a part is absent, hide its property controls. To add anatomy, use an explicitly requested variation or fixture capability. If the part exists but its fill or border is disabled, retain the enable control and hide dependent color, alpha, or width fields until enabled.

Inventory relevant properties as Exposed, Fixed, Unsupported, or Excluded with a reason. Do not equate “all adjustable properties” with a universal CSS catalog. Retain each requested property or report its implementation gap.

## Preserve edit scope

Label the selected part and affected scope. Use family-level edits for reusable variations across fixtures. Use instance overrides only when requested. Preserve unrelated overrides and restore them when returning to that selection.

Keep independently styled surfaces independent. A container fill must not change the nested action fill. Fill alpha changes the fill color only. Whole-element opacity is a separate property. Disabling a decorative border must not remove keyboard focus visibility.

Reset must identify its destination: system default, inherited value, or source baseline. Reset only the labeled scope. A global reset requires an explicit global action. Restoring a source violation retains its status label.

Use shared source components, tokens, and behavior. Add scoped exploration adapters instead of a separately styled replica. The generic panel does not discover scope or serialize object overrides automatically.

## Enforce the actual design system

Derive permitted values from the intersection of project rules and component capabilities. Preserve semantic token identity even when two tokens resolve to the same number. A component that accepts named padding variants cannot accept every multiple of a spacing unit.

Offer Off, None, or zero only when that property and component support it. Distinguish disabling an effect, removing an override, and disabling system enforcement.

Show the rule source, current value, system default, allowed domain, and status. If sources conflict, mark the domain Unverified and resolve the conflict before claiming compliance. Do not invent a scale or infer a default from the first preset.

Apply a common validator before every state-entry path: control commit, programmatic update, preset, URL restoration, import, reset, recommendation, export, and application. The generic runtime's min/max checks are insufficient for token, step, and exception rules. Follow the runtime guide's adapter requirements.

For invalid input, show the violated rule and valid alternatives. Keep the last applied state. Do not silently clamp, round, replace a token, or discard a saved configuration. Preserve an existing invalid source state as a labeled baseline rather than a permitted new choice.

## Handle an explicit exception

Before applying an out-of-system value, show:

1. Property, token or value, and affected scope.
2. Violated rule and its source.
3. A useful compliant alternative.
4. Expected benefit and tradeoff.
5. The decision needed to allow this experiment.

Reuse prior approval only for the same scope. “Be creative” or “pixel-perfect” is not exception approval. Turning enforcement off requires the same explicit decision.

While the exception is active, show Experimental / outside design system. Save its reason, scope, rule version when available, and decision record in the lab's supported model. A URL flag is not evidence of approval. The stock selection exporter does not capture arbitrary exception metadata; provide a tested extension or include the decision record with the lab.

An exception cannot bypass type validity, security, or accessibility. A lab exception does not change global tokens or authorize production work.

Before restoring enforcement, revalidate custom values. Offer a compliant mapping and obtain a valid choice. Keep the experimental state visible until the conflict is resolved. Do not silently snap or erase it. Revalidate when theme, system, component, or scope changes.

## Use controls that match the decision

Use switch for one reversible on/off setting, checkboxes for independent inclusions, and a dropdown for one named value. Use segmented choices only when simultaneous visibility helps. Tabs change the visible section; they are not property values.

Use numeric entry for precision and a slider for useful bounded exploration. Set unit, range, step, and base from the actual domain. Keep partial drafts editable. Commit according to Enter/blur behavior. Escape restores the applied value. Prevent panel scrolling from changing numeric values.

Use labeled swatches or token inputs for visual tokens. Preserve non-color selection cues and precise values. Use buttons for actions. Reuse native or accessible existing primitives. Do not replace every question with a slider.

Maintain focused fields during preview updates. Preserve cursor position. Expensive updates may commit on release when that behavior is explained. Provide keyboard step changes and non-drag alternatives.

## Keep controls and target reachable

Use one persistent floating launcher per tool. Mount launchers in the stable shell, outside transformed or scrolling content. Give each an accessible name, tooltip, focus state, and activation target. Keep the panel initially closed unless the resumed state is intentionally open.

Keep groups logical and collapsible. Keep the panel nonmodal: no full-page dimmer, scroll lock, or focus trap. Give the launcher `aria-expanded` and `aria-controls`. Close the active inner layer before its parent. Restore focus when closing from within a panel.

Keep target, focus indicator, header, close action, active field, and footer inside the visible viewport. Provide a collapse or explicit position change when tools cover the target. Preserve user placement during edits. Recheck after selection changes, resize, zoom, rotation, and virtual keyboard changes.

Keep panel and page scroll independent. Contain overscroll. Menus must remain visible without clipping or blocking dismissal. A full-canvas action may collapse tools on small screens while retaining state. Do not change product width, breakpoint, aspect ratio, or wrapping to make room.

If the runtime does not fit the visible viewport, add and test a responsive adapter. If a requested modal is necessary, implement its actual focus and dismissal rules; do not call a nonmodal panel modal. Dragging requires keyboard/touch alternatives and position bounds.

Keep Light/Dark tool theme separate from product theme. Hide tools for reference captures without changing viewport, scale, scroll, fixture, or selected values.

## Verify the inspector

Operate every visible control. Inspect the target and confirm unrelated instances and parts remain unchanged. Reset and repeat after a fixture or selection change. Use the component case matrix.

Test long page and panel scrolling, obscured targets, close/reopen, narrow width, zoom, supported virtual keyboard, nested menus, Escape, focus restoration, partial input, and saved overrides. Report unavailable device conditions as Not tested.

Test invalid values through every supported entry path. Include an unlisted token, unsupported zero, forbidden numeric increment, legacy source violation, approved exception, enforcement restoration, and changed theme/system. Adapt the values to the actual rules; do not invent a universal even-number requirement.

Check these anatomy cases when supported:

| Case | Required behavior |
|---|---|
| Card with action and no badge | Action controls exist; badge controls do not |
| Image-only component | No text or action controls |
| Subtitle changes from absent to present | Relevant controls appear only when the target exists |
| Outline disabled | Color and width stay hidden; focus remains visible |
| Another instance has overrides | Selected-part edit/reset preserves the other instance |

Completion requires a verified binding for each visible control and a recorded result for each applicable case. A schema audit or control count alone is insufficient.
