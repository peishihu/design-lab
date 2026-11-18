---
name: variant-lab
description: Add a live control panel, named presets, saved selections or mixed adjustments to a component or page.
metadata:
  author: Pei Shi Hu
  version: "1.6.0"
---

# Variant Lab

Reuse the bundled Figma-inspired panel. The runtime supplies controls, presets, tool themes, baseline comparison and save/load. The lab supplies source bindings, fixtures, strict validation and evidence. Runtime and selection APIs are unchanged.

Read the sibling [Design Lab entry](../design-lab/SKILL.md) for task selection. Its optional section reader includes this entry; run it once, not recursively. Without Node, read its listed sections manually. All detailed rules remain binding.

Always read [shared rules](../design-lab/references/core.md), [panel integration](references/panel-integration.md) and [verification](references/verification.md). Read [runtime guide](references/runtime-guide.md) sections for the operation:

| Operation | Required runtime sections |
|---|---|
| Preset or round change | Directions, descriptions, and history |
| New or changed binding/control | Build procedure; Controls and groups; Descriptions, notes, and markers; API reference |
| Layout, theme, input or geometry change | Floating tools and themes; Keyboard and clean captures; [panel controls](references/panel-controls.md) |
| Undo, restore or history change | Undo and individual restore |
| Save, import, compatibility or schema work | Save and restore; Undo and individual restore; API reference |

For controls or saved-state changes, also read dependent recovery, validation and tool-interaction rules selected by the reader. For component coverage, include [component cases](../design-lab/references/component-cases.md). For strict domains or selected parts, include [inspector rules](../design-lab/references/contextual-inspectors.md). Missing runtime requires dependency recovery, not a substitute panel.

Use the stock assets unchanged. Keep product styles in the preview. Add scoped adapters separately. Preserve existing saved-file identities, native editing and full-state recovery. Save/load does not authorize production. Source checks never replace open-panel inspection or required behavioral checks.
