# Panel controls and runtime values

This guide describes the bundled runtime and integration requirements. Its properties-panel structure references Figma to reduce learning effort. Figma is an interface reference, not the author or an implied endorsement. Values below describe this implementation, not an official Figma specification. Follow the project design system for product values.

## Existing runtime

| Element | Runtime value or behavior |
|---|---|
| Panel | Floating; 300px wide; 13px radius; shadow; viewport-height bound |
| Header | 40px; title, About, Undo, tool theme, close |
| Tool icon | 36px circle; 20px gear graphic; bottom-right placement |
| Text | 11px minimum in the panel; public pack uses system fonts |
| Fields | 24px height; 5px radius |
| Sections | Collapsible logical groups; independent body scrolling |
| Dropdown | One selected value; descriptions for presets; search over twelve option entries |
| Checkbox list | One column; independent values; truncated long labels retain a tooltip |
| Switch | Immediate on/off; 26×14px track; 10px knob |
| Numeric row | Number field and slider; unit; min and max; exact field entry |
| Note | Collapsible textarea; content saved as reviewerNote |
| Individual restore | Visible beside a changed control; restores that control to baseline |
| Footer | Reset, Load saved, Save selection |
| Themes | Light and Dark for tool UI only |
| Status marks | Star for recommendation; dot for new; star wins when both apply |

## Tool tokens

Use `--b-*` values from `assets/variant-lab.css`. Do not copy product tokens into tools for visual matching.

| Token family | Purpose |
|---|---|
| `--b-font` | Tool font stack |
| `--b-bg`, `--b-bg2`, `--b-surface` | Tool surfaces |
| `--b-ink`, `--b-muted`, `--b-faint` | Text levels |
| `--b-line`, `--b-line-strong` | Field and section boundaries |
| `--b-blue`, `--b-blue-text` | Tool accent and readable accent text |
| `--b-menu-*` | Menu surfaces, text, and states |
| `--b-shadow`, `--b-menu-shadow` | Floating surface separation |

Read installed CSS for exact colors. Check actual text/background contrast in both themes. A faint token name does not establish text suitability.

## Additional controls

The stock runtime does not mount these controls. Add them only for declared adjustments. Provide state, validation, labels, keyboard use, reset, and export/import.

| Need | Control and requirement |
|---|---|
| Short choices visible together | Single-select segmented control with group label and non-color selected cue |
| Color/token choice | Labeled swatches or token picker; preserve token identity and alpha scope |
| Free text | Text field with a deliberate commit policy and meaningful length constraints |
| Width/height or paired coordinates | Two named numeric fields with units and explicit linking behavior |
| Visual option set | Keyboard-operable tiles with visible labels and selected state |
| Large searchable list | Searchable selection with active-option and dismissal behavior |
| Persistent explanation | Associated short help or a keyboard-accessible disclosure |
| Recommendation plus newness | Combined accessible description or About entry; do not imply two stock icons |

Keep added controls in the same logical sections and tool theme. Test every state-entry path. Inputs outside declared state do not export automatically.

## Geometry requirements

Check panel bounds against the visible viewport, not document height. Fixed width and `100vh` do not establish virtual-keyboard or narrow-screen support.

Keep header, close, active control, footer, and open menu reachable. Add a scoped visible-viewport sizing/clamping adapter when needed. Keep page and panel scroll separate. Preserve product viewport and wrapping.

Use a compact icon launcher with adequate activation area and visible focus. Distinguish tools from product controls. Do not replace live adjustment with a full-screen configuration page.
