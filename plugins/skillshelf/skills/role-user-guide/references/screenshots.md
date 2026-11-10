# Screenshots

## Taking them

- Use the built-in browser or Playwright against the running copy. Fix the viewport for the whole guide (for example 390×844 for phone, 1440×900 for desktop) so images look consistent.
- Wait until data, fonts and images have loaded. Close toasts that are not part of the step.
- Capture the part of the page the step is about, with enough context to find it: the control plus the header or section title above it. A full page is right only for "this is the screen" overviews.
- For a step that opens a dialog, capture the dialog, not the page behind it.

## Framing the control

Draw a red frame around the one control the step tells the person to press:
1. Before the screenshot, add a temporary outline to the element through the page script, e.g. `el.style.outline = '3px solid #e11d48'; el.style.outlineOffset = '3px';`.
2. Take the screenshot.
3. Remove the outline before the next step.

Do not frame more than one control per image. If a step involves two controls, split it into two steps.

## Files

- Name files by role and step: `employee-03-add-to-cart.png`.
- Use PNG or WebP, at most about 1600 px wide and a few hundred kilobytes each. Large images break exports and slow the document.
- Keep a list of which file belongs to which step, so a screenshot can be retaken later without re-reading the whole guide.

## Check each image

- The frame is on the right control and fully visible.
- The image shows the state the step describes, not the state before it.
- No real personal data, real credentials or internal URLs that should not be shared.
- Test-only warnings visible in the image (yellow health checks, demo banners) are explained in a note, or the image is retaken without them.
