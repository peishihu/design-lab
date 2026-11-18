---
name: design-lab
description: Compare design directions, adjust a component or page in a live preview, test content boundaries, or match a reference.
metadata:
  author: Pei Shi Hu
  version: "1.6.0"
---

# Design Lab

Use a live preview to adjust an AI draft and save values with feedback. A draft is a starting point, not a quality score. Preserve behavior and constraints while reading only relevant guidance.

## Read by task

Before any implementation or repair, read the sibling [Variant Lab entry](../variant-lab/SKILL.md). Then select the operation below. Read the shared rules, panel integration and verification guides on every task. They are mandatory; a small change is not an exception.

Optional Node.js20+ reader:

```sh
node <design-lab>/scripts/read-guide.mjs --task adjust --target component
```

Use `--target page` for pages. Add `--system` for selected parts, project tokens, exceptions or uncertain domains. Add `--reference` when matching a source. Combine flags with any task. Unknown scope requires the relevant additional guide, not a smaller route.

| Task | Additional reading |
|---|---|
| `adjust` | Workflow: next decision, mode, names, save, continuation; runtime: preset history |
| `build` | Both complete manuals; panel controls; project integration |
| `controls` | Workflow controls; runtime build, controls, help, tools, keyboard, recovery, save and API; panel controls |
| `selection` | Workflow recovery/save; runtime history, recovery, save and API |
| `match` | Adjustment route plus controlled-reference checks |
| `verify` | Verification and fidelity rules |
| `apply` | Save, continuation and authorized-application rules |
| `full` | All manuals and guides; use only when scope needs them |

For components, always include [component cases](references/component-cases.md). For project integration, read [build phases](references/build-phases.md). Read relevant [design defaults](DESIGN_PRINCIPLES.md) only when no stronger rule applies. Read [inspector rules](references/contextual-inspectors.md) for `--system` scope.

Without Node, read the same sections manually from [workflow](references/workflow.md) and [runtime guide](../variant-lab/references/runtime-guide.md). Entry text is not a substitute. Do not read whole runtimes, tests or unrelated guides by default. Reuse unchanged rules already in current context. Recheck changed inputs.

Always read: [shared rules](references/core.md), [panel integration](../variant-lab/references/panel-integration.md), [verification](../variant-lab/references/verification.md). For learning changes, read workflow “Retain the record and improve the method”. Record and test workflow promotions as specified there.
