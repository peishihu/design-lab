# Design review defaults

Use defaults only without applicable project rules. Approved baselines and explicit user requirements take priority. Read only relevant sections.

## Decision quality

Check whether the user can identify the next action, see state, recover from mistakes, and complete the task with the available input method. Use one clear primary action when the task has one. Group related information. Prefer recognition to recall.

Give prompt input feedback. Approximately 100ms is a responsiveness target, not proof of task completion. Show status during longer operations. Explain failures and recovery.

State destructive-action consequences. Use safe defaults and undo when feasible. Confirmation dialogs do not replace clear operations.

## Visual structure

Use the project's type, spacing, color, radius, and elevation scales. Without a scale, start with one or two font families and a small set of consistent values. A 4/8px spacing rhythm is an optional starting point, not a required domain.

Size text for its role and viewing distance. Keep line length readable. Check the longest and shortest strings, missing fields, and translated content. Text growth of 30–40% can be a useful stress case when no translation is available; it is not a guarantee for every language.

Use color with another cue when it communicates state. Use text contrast of at least 4.5:1, or 3:1 for qualifying large text, and 3:1 for relevant non-text UI boundaries. Verify actual rendered pairs. Respect any stronger project requirement.

Use concise result-based action labels and consistent terms. Describe errors and remedies. Do not invent factual sample content.

## Component cases

Use `references/component-cases.md`; a typical sample is insufficient. Compare variations with the same fixtures. Give each a theme or purpose name and short description. Separate content from design changes.

Evaluate applicable default, hover, focus, pressed, selected, disabled, loading, empty, error, and success states. Define missing-data behavior. Report unsupported or untested states explicitly.

## Input and focus

Make each action reachable using the product's actual input method. Do not hide required information behind hover. Maintain visible focus and predictable movement. Preserve return focus where the task requires it.

For touch, use 44×44px as a starting activation-target recommendation unless the platform or project defines another requirement. A compact tool icon can have a larger invisible hit area.

For directional input, test every row edge, first/last item, wrapping or stopping rule, delayed content, and return path. Test fast repeated input. Focus must remain immediately visible even when animation duration is zero.

## Motion

Use movement only when it explains state or helps orientation. Frequent actions need little or no motion. Start with these ranges only when the project has no motion rules:

| Use | Starting duration |
|---|---|
| Micro feedback | 100–150ms |
| Small surface | 150–250ms |
| Large surface | 200–300ms |
| Full view | 300–400ms |
| Stagger between items | 30–50ms |

Enter or exit with ease-out when that trajectory fits. Move between positions with ease-in-out. Use simple easing for color changes and linear timing for a continuous loop. An exit can be 20–30% shorter than an entrance when the behavior remains clear. These are suggestions, not test thresholds.

Support interruption and rapid repeated actions. Do not queue focus transitions. Respect reduced motion with an appropriate fade or no movement. Verify the final state after an interrupted animation.

## Evidence

Check empty, minimum, maximum, failed, and missing content. Resize quickly and interrupt transitions. Operate the lab with the required input method. A code read does not verify a rendered result.

For precise matching, use the main skill's controlled-reference procedure. Record remaining mismatches, missing assets, untested conditions, and next useful action.
