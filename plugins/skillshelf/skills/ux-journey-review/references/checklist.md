# Friction checklist

Ask these at every step of a journey. Each pattern has a typical fix; prefer the fix that removes something.

## Steps the system could do itself

- **Decision with one answer.** The user must press a button, but every alternative is worse or impossible. Example: an item is out of stock (0 of 1) and the only options are "remove item" or "cancel whole order". Fix: do it automatically and notify; ask only when there is a real choice (1 of 2 available).
- **Confirming what the system already knows.** The user marks something done that another party records anyway (e.g. "I picked it up" when the warehouse hands it over). Fix: take the fact from the source of truth; keep the button only as a fallback.
- **Re-typing known data.** Name, email, department, phone from the last order. Fix: prefill or show read-only.
- **Choice with one option.** A selector or card that looks like a choice but has a single value. Fix: show it as plain text, or hide it.

## States and words

- **Two names for one state.** A status says one thing, the banner under it another ("confirmed" vs "ready for pickup"). Fix: one name, the one that tells the user what to do.
- **States that mean the same thing to the user.** Internal stages ("changes confirmed", "processing", "submitted") that all mean "wait". Fix: collapse them in the user's view; keep them internally if needed.
- **Internal vocabulary.** ERP or system names, internal codes, "valid/invalid", database IDs, warehouse jargon. Fix: remove it, or translate it into what the user can do.
- **Ambiguous labels.** "Until: 2030-05-01" — until what? Fix: say what the date means, in a local date format.
- **Duplicate badges.** The same category or tag printed twice on a card.

## Next step, place and time

- **No "what next" after an action.** "Sent to the system" without saying when to expect a reply, whether an email comes, or whether the order can still be changed.
- **Ready but not told where or when.** "Your order is ready" without address, room, hours, deadline, or what to bring.
- **Stuck without knowing it.** A state that waits for the user, with no reminder and no deadline, while the process silently moves on without them. Check in code what happens if they never act.

## Safety of actions

- **Irreversible without a guard.** One tap finalises or deletes, with no confirmation and no undo, and nobody (not even an admin) can revert it.
- **Destructive next to primary.** "Clear cart" right above "Place order", or "Delete everything" between everyday admin buttons. Fix: confirmation or undo, and distance from the primary action.
- **Editable when it should not be.** Identity fields taken from the account but still editable (also a data-integrity issue).

## Attention and space

- **Distance to first useful content on a phone.** Count screens of scrolling before the first product, form or answer. Sticky headers, presence counters, breadcrumbs in a three-tab app, banners saying "there are no limits", and instructions all push it down.
- **Banners that state an absence.** "No restrictions apply" repeated on every page. Show a banner only when something applies.
- **Instructions instead of design.** "The [+] button becomes inactive when…" Fix: make the disabled state explain itself (tooltip, "max 3"), drop the paragraph.
- **Empty filters.** Filter chips that show 0 for every value in normal use.
- **Numbers without context.** "Available" without how many, totals that still count removed lines.

## Admin and operator screens

- **Daily and rare actions mixed.** Group by the order work actually happens in (prepare → collect → confirm → hand over → close), and put each notification or export at its stage.
- **Dangerous actions among routine ones.** Separate them visually and require a deliberate confirmation.
- **Status that needs a manual push.** If an admin must press a button to move everyone to the next state, check whether an event (file import, date) could do it, and whether pressing it early misleads users.
