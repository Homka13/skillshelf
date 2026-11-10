# Report template

Write in the user's language. Keep each finding to two or three sentences. Use these sections; drop a section that has nothing in it.

---

**Limits of this review** — one or two sentences: where it ran (local copy, test data), role used, what was not exercised (login, emails, images, real users).

**Overall** — one sentence: is the main path short or long, and where most of the extra work for users comes from.

## For <role 1>

Ordered by impact. For each finding:

1. **<Short name of the problem>.** What happens and where (journey → screen → state; seen live or read in code). The question it makes a user ask: "…?". Simplest fix, preferably a removal. Evidence: `path/file.tsx:123` or the observed screen. Add "owner decision" if the fix changes a business rule.

## For <role 2>

Same format. Say explicitly if this part was reviewed only briefly.

## Quick wins

Up to five fixes that are small to make and remove a step, a state or a confusing word. Reference the findings by number.

## Needs an owner decision

Findings whose fix changes policy (who may cancel, when an order is final, what happens when the user does not respond). One line each.
