# Test catalogue

Pick what applies to the area under test. Each line is a question to turn into one or more concrete cases.

## Input

- Empty, only spaces, very long (500+ characters), leading or trailing spaces.
- Names with apostrophes in all their forms (`'`, `’`, `ʼ`), hyphens, Cyrillic and Latin mixed, emoji.
- Numbers: 0, negative, decimal with comma and with dot, huge, not a number, leading zeros in codes.
- Phone and e-mail in every format people actually type; a valid one in an unusual format.
- Text starting with `=`, `+`, `-` or `@` that later ends up in a CSV or Excel export (formula injection).
- HTML or script in text fields, shown back anywhere.

## Files and imports

- The expected file; the same file twice; an empty file; a file with only headers.
- Columns in a different order, renamed, missing, extra.
- Formula errors in cells (`#REF!`, `#N/A`, `#ЗНАЧ!`), merged cells, hidden rows, several sheets.
- Duplicate keys inside one file; keys that already exist in the database.
- A very large file; a file of the wrong type renamed to the right extension.
- After import: counts shown match the data; what happened to records that were not in the file.

## Permissions and sessions

- Every page and action as each role, and signed out. Direct URL and direct API call without the right role (expect 401/403, not data).
- Another user's record by changing the ID in the URL or request.
- Role removed or password reset while the user is signed in: does the old session still work?
- Two sessions of the same user; two admins at once; session expiry in the middle of a form.

## States and transitions

- Every status a record can have, and every allowed transition between them.
- Forbidden transitions: act on a cancelled, completed or already-processed record.
- Transitions started by someone else while the user has the page open.
- What happens when the user ignores a request for action: does anything time out or proceed without them?
- Time windows: before start, during, after end, exactly at the boundary, with the server's time zone.

## Repeats and races

- Double click on every submit button. Two tabs submitting the same thing.
- Back button after submitting; refresh during a request; resubmitting a form from history.
- Two users taking the last unit of stock at the same moment.
- The same item twice in one request.

## Numbers that must add up

- Totals, quantities and stock after add, change, remove, cancel and partial confirmation.
- Stock returned exactly once when something is cancelled or removed, even if cancelled twice.
- Rounding of money; currency formatting.

## Notifications and integrations

- Each e-mail or message: right recipients, nobody extra, correct content, links work.
- Delivery failure: does it retry only the failed ones, is it logged, can it be resent without duplicating the successful ones.
- The external system is down or slow: what the user sees, whether data is left half-written.

## Layout and devices

- Phone width (375-390 px), tablet (768), desktop (1280+). No horizontal page scroll, nothing cut off, buttons reachable.
- Long names and large numbers in tables and cards.
- Empty states: no data, no results, nothing in the cart.

## After the release

- Database migration on an existing database, not only a fresh one.
- Old data created before the change still displays and can be edited.
