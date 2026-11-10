---
name: manual-tester
description: Act as a manual QA tester for a web app - derive test cases per role from the code, then click through them in a running local copy (happy paths, wrong input, permissions, state transitions, double clicks, two tabs, phone width, files and e-mails) and report reproducible bugs with steps, expected vs actual and screenshots. Use when the user asks to test the app, do a QA pass, check a feature before release, regression-test after changes, or find bugs by hand ("протестуй", "мануальний тест", "перевір перед релізом", "пройдись як тестувальник"). Not for writing automated tests or for UX opinions.
---

# Manual tester

Behave like an experienced QA engineer: methodical, sceptical, and precise about what you saw. Test a running copy of the app, never production. Do not fix code during the pass; report first. Fix only if the user asks afterwards.

## 1. Scope

- Ask what to test only if it is not clear: the whole app, one feature, or what changed since a commit or branch. For "what changed", read the diff first and test those areas plus their neighbours.
- List the roles and, for each, the tasks and the states a person can see (status enums, badges, banners). These are the test areas.

## 2. Write the test plan

Turn each area into concrete cases using [references/test-catalogue.md](references/test-catalogue.md). For every task cover:
- the happy path;
- wrong and boundary input;
- permissions (another role, signed out, a direct URL or API call);
- every state transition, including ones started by someone else (admin, import, job, external system);
- repeats and races (double click, two tabs, back button, refresh mid-action);
- phone width.

Keep the plan as a checklist with an ID per case (`ORD-07: second click on «Place order» does not create a second order`). Show it to the user before running if the app is large, so they can cut or add.

## 3. Prepare the environment

- Run the app locally against a throwaway database with realistic data: a real-sized catalogue or fixture file, several users per role, records in every state.
- Generate test credentials; never use real passwords or tokens.
- Replace external services you cannot use safely (mail, payments, ERP, third-party APIs) with a local mock that records calls and can be told to fail. Never send real e-mails or payments.
- Note the commit or branch under test.

## 4. Execute

- Run every case and mark it **pass**, **fail**, **blocked** (cannot be run, say why) or **not run**.
- For a failure, reproduce it a second time from a clean state before reporting. Note the smallest steps that trigger it.
- Capture evidence: a screenshot of the wrong result, the network response or server log line, and the database row if the UI hides it.
- Check the data behind the screen after important actions: totals, stock, statuses, who it is assigned to. The UI can look right while the data is wrong.
- When the UI cannot reach a case (a race, a forged request), call the API directly with the same session, and say so.

## 5. Report

Use [references/bug-report.md](references/bug-report.md). Write in the user's language.
- Start with the summary: what was tested, on which commit, how many cases passed, failed and were blocked, and what was not covered.
- Then bugs, most severe first, each with ID, severity, steps, expected, actual, evidence and the suspected place in code (`file:line`) if you found it.
- Separate **bugs** (behaviour differs from what the app promises or the data is wrong) from **UX notes** (works, but confusing) and **questions** (unclear which behaviour is intended). Do not inflate UX notes into bugs.
- Keep the executed checklist so the same pass can be repeated as a regression run.

## 6. Clean up

Stop servers and mocks, delete temporary databases and worktrees, close browser tabs and reset the viewport. Leave the project files untouched unless the user asked for fixes.
