# Test report template

Write in the user's language.

---

**What was tested:** scope, roles, commit or branch, environment (local copy, test data, which services were mocked).

**Result:** N cases: X passed, Y failed, Z blocked, W not run. One sentence on overall state ("ready except BUG-1", "not ready: data loss in BUG-1 and BUG-2").

**Not covered:** what could not be tested and why (real sign-in, real e-mail, ERP, production data volume).

## Bugs

### BUG-1 · <short title stating the wrong behaviour>

- **Severity:** critical (data loss, security, money, blocks the main task) / major (a task fails or gives wrong data, with a workaround) / minor (works, but wrong in a detail) / trivial.
- **Where:** role, page, state.
- **Steps:**
  1. …
  2. …
- **Expected:** …
- **Actual:** …
- **Reproduced:** 2 of 2 from a clean state.
- **Evidence:** screenshot, response or log line, database value.
- **Suspected cause:** `path/file.ts:123`, only if found; otherwise leave out.

## UX notes

Works as built, but confusing or slow for the person. One line each with where it happens.

## Questions

Behaviour that may be intended. One line each: what happens and the two possible intentions.

## Checklist

The executed cases with ID and pass / fail / blocked / not run, so the run can be repeated.
