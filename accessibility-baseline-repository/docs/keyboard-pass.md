# Keyboard-Only Navigation Pass

## Purpose

Validate the public-service interface without a mouse using only a keyboard.

## Test sequence

- [ ] Load the homepage and press `Tab` repeatedly from the browser address bar/page start.
- [ ] Confirm a visible **Skip to Content** or equivalent bypass mechanism appears.
- [ ] Confirm every navigation item receives focus.
- [ ] Confirm language controls can be reached and activated.
- [ ] Confirm text-size controls can be reached and activated.
- [ ] Confirm search input and search submit control can be reached and used.
- [ ] Confirm theme/high-contrast controls can be reached and activated.
- [ ] Confirm every “Read More” control is reachable and its destination is understandable.
- [ ] Confirm `Enter` activates links.
- [ ] Confirm `Space` activates buttons.
- [ ] Confirm `Shift+Tab` reverses focus in a logical order.
- [ ] Confirm focus is always visible.
- [ ] Confirm no keyboard trap occurs inside menus, dialogs, carousels, or custom widgets.
- [ ] Confirm focus is restored logically after closing overlays.
- [ ] Repeat the pass at 200% browser zoom.

## Evidence to capture

1. Screenshot showing the first visible keyboard focus.
2. Screenshot showing the search control in focus.
3. Screenshot showing a content-card link in focus.
4. Screenshot after opening/closing any menu or dialog.
5. Lighthouse accessibility report after remediation.

## Current status

**Needs manual verification:** The supplied audit identifies keyboard-navigation opportunities but does not provide a complete pass/fail log. This document deliberately keeps those checks open rather than inventing results.
