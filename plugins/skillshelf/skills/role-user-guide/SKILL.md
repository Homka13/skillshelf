---
name: role-user-guide
description: Write a detailed, screenshot-driven user guide for a web app, split by role (customer, employee, admin, operator…), by actually walking every scenario in a running copy of the app. Every step gets a screenshot with the control to press framed in red, plus what appears next and what to do when it goes wrong. Use when the user asks for user instructions, a manual, onboarding docs, a how-to or help pages for their app or for specific roles ("інструкція для користувачів", "інструкція по ролях", "мануал", "як користуватися сайтом"). Not for developer or API documentation.
---

# Role-based user guide

The guide must let a person who has never seen the app finish each task alone, looking only at the guide. Write it for that person, in the user's language, in plain words.

## 1. Find the roles and their tasks

1. Read routes, navigation, role checks and permission code to list every role and what each can see and do. Include roles that only appear for some accounts, such as role switchers or super-admins.
2. For each role, list tasks from the person's point of view ("place an order", "upload the price list", "give someone a new password"), not by screen. Include the unhappy paths people really hit: error messages, disabled buttons, "access denied", being logged out, items out of stock.
3. Only document what a person can reach from the interface. If code exists but no button leads to it, leave it out and tell the user so. If a button exists but does nothing useful in production, leave it out too.
4. Show the user the role → task outline before writing everything, if the app is large.

## 2. Run a copy with believable data

- Run the app locally (or on a test environment the user names) with realistic test data: real-looking catalogue, several orders in different states, more than one user. Empty screens make useless screenshots.
- Never use production or real people's data in screenshots. Invent names and phone numbers.
- Never enter real credentials. Use generated test passwords and keep them in a local file, not in the guide or the chat.
- Steps that cannot be run locally (third-party sign-in, real e-mail, ERP files, payments) are written from the code and marked as not exercised.

## 3. Walk every scenario and capture it

Follow [references/screenshots.md](references/screenshots.md). In short:
- One screenshot per step, taken right after the state the step describes.
- Frame the control to press in red, and only that control.
- Use the viewport the role really uses: phone for employees ordering on the go, desktop for admin back-offices. Say which in the guide.
- Capture every dialog and confirmation the step triggers, and the success and error messages.

## 4. Write the guide

Use [references/guide-template.md](references/guide-template.md). Rules:
- One action per step. Name buttons and fields exactly as on screen, in quotes.
- Say where the control is ("top right, next to the cart"), what appears after pressing it, and what to do if something else appears.
- Put the screenshot directly under the step it belongs to.
- Put warnings before the step, not after. A destructive or irreversible action gets a visible warning block that says exactly what will be lost.
- Explain every status, badge and banner the role can see, in one line each.
- End each role with a "Common situations" table: problem → why → what to do (disabled buttons, logged out, access denied, nothing found, wrong data).
- Say at the top that screenshots come from a test copy, so names, amounts and numbers will differ.

## 5. Verify before delivering

The most dangerous mistakes in a guide are wrong statements about behaviour, not wrong button names.
- Check every claim of the form "this will…", "only…", "all…" against the code: what an import replaces, what a button deletes, who gets notified, what can be undone.
- Check every label and message against the code or the screen.
- Open every screenshot: the red frame is on the right control and not cropped, the image matches the step, no real personal data is visible.
- Re-walk two or three scenarios following only the written guide.

## 6. Deliver per role

- Split the guide by role: separate tabs or separate documents. Each role then gets only its part, and exports stay within image limits (Google Docs export drops images past roughly 35 per export, so keep a tab well under that, about 25).
- Prefer the user's document tool if one is connected; otherwise Markdown or HTML with images as separate files, not inline base64.
- In the closing message say what was exercised live and what was written from code only.

Clean up afterwards: stop servers, remove temporary databases and worktrees, reset the browser viewport.
