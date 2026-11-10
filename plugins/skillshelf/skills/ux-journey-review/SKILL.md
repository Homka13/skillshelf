---
name: ux-journey-review
description: Walk an existing product's real user journeys end to end and find where it makes people's lives harder — steps the system could do itself, decisions with only one sensible answer, irreversible actions without a guard, statuses or terms that duplicate or confuse, missing "what happens next / where / when", internal jargon, and content pushed below the fold. Use when the user asks for a UX review, usability or flow review, wants to simplify a flow, says users are confused, or worries their own ideas overcomplicate things ("я ускладнюю життя користувачам", "огляд UX", "спростити сценарій"). Not for visual polish, branding or building new UI.
---

# UX journey review

Find friction by doing what a user does, step by step, in the running product. The most valuable finding is usually a step, status or decision that can be **removed**, not one that needs better wording.

The work is read-only. Change code only if the user asks for fixes after the report.

## 1. Map the journeys

1. Identify the roles (customer, employee, admin, operator…) and each role's top two or three jobs. Read routes, navigation, README and docs; ask the user once only if the jobs are genuinely unclear.
2. Find every state a user can see: status enums, labels, banners, badges, notification texts. Grep the code for them. Each visible state is a stop on some journey.
3. Find what moves a user between states, especially actions by **someone else** (admin, warehouse, import, scheduled job, external system). Those transitions are where users get surprised.
4. Write the journey list: the happy path first, then the unhappy paths (shortage, rejection, cancellation, expiry, error). Keep it to what real users hit.

## 2. Run it for real

- Run the app locally against a throwaway database with realistic test data (a real catalogue or fixture file is better than three dummy rows). Never use production, real people's data or real credentials; generate test values.
- Start at phone width (375 px), then check desktop. Most friction shows up on the phone first.
- Use the account type a real user has. If you must enter through an admin or a role switch, say so in the report, because the header and menus may differ.
- Trigger the states other people cause (through the admin UI, an API call or a test endpoint) and look at each one **as the user sees it**.
- If the app cannot run, do a walkthrough from code and say clearly that nothing was observed live.

## 3. Interrogate every step

At each screen note: what the user came to do, what they must read, decide, type and remember, and what can go wrong. Then ask the questions in [references/checklist.md](references/checklist.md). The core ones:

- Could the system do this step itself?
- Is this a "decision" with only one sensible answer?
- After this action, does the user know what happens next, when, and what they must do?
- Is this action irreversible, and is it guarded (confirmation or undo)? Who can reverse it?
- Do two labels name one state, or one label cover two states?
- Is a text instruction compensating for a design problem?
- Is internal vocabulary leaking out (system names, internal codes, "valid", IDs)?
- How much must a phone user scroll before the first useful thing?

## 4. Check in code what the screen cannot show

Confirm each suspicion before reporting it: is there a confirmation dialog or undo; can an admin revert the action; what happens if the user ignores a request (does anything time out, does the order still go out); is the field editable when it should not be; does a value get remembered between visits. Cite `file:line`.

## 5. Rank and report

Rank by cost to the user × how many users hit it. Prefer fixes that **remove** a step, state or text over fixes that add explanation. Mark a finding "owner decision" when the fix changes a business rule rather than the interface.

Write the report in the user's language, using [references/report-template.md](references/report-template.md). Every finding needs:
- where it happens (journey, screen, state) and how you saw it (live or code);
- the question it makes a user ask, in their words;
- the simplest fix, preferably a removal;
- the evidence (`file:line` or the observed screen).

Do not pad the report. Five real findings beat twenty generic ones. Leave out visual taste, colour and spacing unless they block a task.

State the limits of the review at the top: test data, missing images, role used, flows not exercised, login not tested.

## Afterwards

Clean up what you started: stop local servers, remove temporary worktrees and databases, close browser tabs, reset any emulated viewport.
