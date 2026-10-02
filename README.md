# Universal Credit Compass

A small React application being built one step at a time. This independent
project aims to explain confusing Universal Credit situations and suggest what
to check next. It is not an official government service or a replacement for
specialist advice.

## Current step

A working first journey for “My payment is lower than expected”, plus a short
route for someone worried by a message. The guide covers England, Scotland and
Wales and links to Northern Ireland support. It remains a local development
version, with no entitlement calculations or definitive decisions about claims.

## Publishing the testing version

GitHub Pages publishes the `dist` build using `.github/workflows/deploy.yml`.
Pushes to `main` first run the tests and build; deployment runs only if they pass.
In the repository's Settings → Pages, the source must be **GitHub Actions**.
The workflow can also be started manually from the Actions tab.

The app uses relative asset paths so it works under the repository's Pages URL.
The testing notice asks visitors to use fictional details. A `noindex` meta tag
asks search engines not to index the prototype; it does not restrict public access.
Only source files, dependency metadata and deployment configuration belong in
the repository. Research PDFs, credentials, local tooling and dependencies are excluded.

## Guide behaviour

The payment route asks about access to a statement, then lets the user choose
one area: earnings, repayments, another benefit, or uncertainty. Radio buttons
allow only one choice, and Back lets the user check another area. Someone without a statement gets help accessing it.
The message route asks about a deadline. Yes, no visible deadline and uncertainty
each have their own explanation, action and draft. A missing visible date is not
treated as proof that no action or deadline applies.

Browser Back and Forward work alongside the in-page Back button. History stores
only screen metadata; answers and drafts stay in React memory. Start again or
refresh invalidates earlier navigation entries so cleared journeys cannot be
restored. Forward after editing an answer resolves against the current answers.
The skip link focuses the main content without adding an extra history entry.

Selecting repayments adds one question about the statement label: an advance,
an overpayment, rent/service-charge arrears, another type, or uncertainty. The
result includes checks and suggested wording for that type. The user can check
one deduction at a time and go Back to choose another. No amounts are calculated.

One final question asks what help is needed: understanding the deduction,
checking something that looks wrong, affording the repayment, or uncertainty.
It leads straight to the result, with two relevant actions and optional message
wording. Switching away from repayments clears its details. Changing the deduction
type clears the need so an earlier choice cannot silently carry across.
There are no further follow-up questions or AI calls in this step.

Results also offer an optional “Already asked? Get help following up” section
between the explanation and the main action. No reply,
an unclear reply and conflicting information each provide practical follow-up
steps and a reviewed draft. Choosing a follow-up replaces the main action with
“Your follow-up step” and changes the one visible editor, rather than leaving
the original first-contact action above a separate follow-up instruction;
the original and each follow-up's edits are kept separately in page memory.
Switching between them or going Back without changing answers preserves edits.
Changing any journey answer, starting again or refreshing clears all drafts.
Closing the section leaves the selected follow-up draft visible with a reminder
that it is not a formal challenge and does not extend deadlines. The section
includes independent advice and DWP service-complaint guidance, with a separate
instruction for people who already made a formal complaint. No AI call is made.

Results lead with a short explanation for the selected area, one main action
with a brief contact instruction, and an editable message. Someone unsure where
to find their statement sees Payments navigation and a sign-in link first;
someone unable to access it gets contact support. Relevant deadline guidance
stays visible. A single “More help and details” section holds checks, staff-role
explanations, additional actions, account navigation, complaints, independent
help and sources. It uses headings rather than nested expandable sections.

A visible message draft uses the existing reviewed templates, not AI. Users can
edit and copy it themselves; Compass never sends it. The draft survives Back if
answers are unchanged, but changing an answer, starting again or refreshing clears
the edits. Copy is disabled for blank messages and asks users to replace bracketed
placeholders. If clipboard access fails, the text is selected for manual copying.
Each draft explains where to use it, matching the contact guidance above it.
Each journey covers one payment area. The deduction view uses the debt contact;
other calculation views use UC. There is no multi-area result switcher.

The main action includes a short contact instruction. Payment questions use the
journal payment category; access problems show UC helpline and accessible
contact options. Messages use any instructions from the sender, with a brief
distinction between payment and work-search questions. Deduction routes retain
the official finder, explaining the distinction between repayment contacts,
the office responsible for a decision and landlord rent records. A visible UC
contact fallback is available if the user cannot use the journal or finder.
No additional questions are needed. The app does not assign a named staff member
or assume that a work coach handles all claim or debt questions.

Under “More help and details”, account guidance explains Payments and
Journal for payment results, or Journal and the to-do list for message results.
It links to official sign-in and accessible contact options, including for people
who cannot sign in. Deduction results retain the debt-specific contact finder.
This adds no questions, account access, data collection or AI integration.

Answers exist only in React memory; refresh or Start again clears them. There
are no accounts, analytics, uploads, external fonts or remote answer storage.
External links open a separate tab so this page can stay open.

## Run locally

Use Node.js 22.12 or newer (this project was set up with Node.js 24).

```sh
npm install
npm run dev
```

Open the local address shown in the terminal. To check the production build:

```sh
npm run build
npm test
```

## Files to start with

- `src/App.jsx` holds the current screen and answers with `useState`.
- `src/components/QuestionCard.jsx` displays labelled choices and validates a selection.
- `src/components/Results.jsx` displays the main action and optional supporting details.
- `src/components/ResultDetails.jsx` groups supporting guidance under one optional section.
- `src/components/MessageDraft.jsx` displays editable wording and handles copying.
- `src/components/FollowUpHelp.jsx` offers the optional follow-up choices and next steps.
- `src/data/followUpGuidance.js` contains the three reviewed follow-up templates.
- `src/data/paymentQuestions.js` contains the question wording and options.
- `src/data/paymentGuidance.js` separates general facts, possible explanations and checks.
- `src/data/deductionGuidance.js` contains the three specific deduction explanations.
- `src/data/deductionNeeds.js` contains actions, checks and wording for the three needs.
- `src/data/accountGuidance.js` contains short account-navigation steps and their sources.
- `src/data/contactGuidance.js` contains contact responsibilities, action links and draft destinations.
- `src/data/resources.js` contains source links, scope and the source-check date.
- `src/rules/paymentRules.js` selects explanations and determines the next/back screen.
- `src/rules/paymentRules.test.js` tests branching, combinations and uncertain answers.
- `src/rules/journeyHistory.js` handles browser navigation and rejects stale routes.
- `src/rules/journeyHistory.test.js` tests Back/Forward, resets and history privacy.
- `src/data/messageGuidance.js` holds distinct guidance for the three deadline answers.
- `src/styles.css` controls spacing, colour, typography and responsive layout.
- `src/main.jsx` attaches the React application to the HTML page.
- `vite.config.js` enables React support in Vite.

`useState` remembers choices while the page is open. Props pass those choices
and click handlers to the question component. The rules are ordinary JavaScript
functions, so Node can test them without a browser or additional test packages.
`useRef` and `useEffect` put keyboard/screen-reader focus on each new heading.
The expandable information still uses native HTML `details` and `summary`.

## Manual checks

- Check at a narrow phone width (320px) and on a desktop.
- Use Tab to reach the skip link and expandable information; press Enter to open it.
- Zoom to 200% and check that text remains readable without horizontal scrolling.
- Confirm that the prototype status and independent-service notice are clear.
- Submit a question without answering and check that its error receives focus.
- Select wages then repayments, and reverse the order: only one radio can remain
  selected. Wages goes straight to results; repayments adds the deduction questions.
  Go Back and confirm the single choice is preserved.
- Go back to the statement question and change Yes to No: old areas must not appear
  in the result. Returning to Yes should start those later choices afresh.
- Try every “I’m not sure” option and all three message deadline answers. Confirm
  their headings, actions and drafts differ and no answer promises there is no deadline.
- On message and repayment journeys, mix browser Back/Forward with the in-page
  Back button. Preserve selections, original drafts and follow-up edits unless an
  answer changes. Changing an answer must clear drafts and obsolete deduction details.
- After Start again or refresh, Back/Forward must not restore cleared answers or
  drafts. Check browser navigation in Firefox as well as a Chromium browser.
- Select repayments and confirm that the extra question appears. Try every type,
  then go Back and remove repayments: the old type must not affect the result.
- Try all four deduction-need answers. Back preserves the selected need; changing
  the deduction type or removing repayments clears it. Affordability must not
  promise reduced repayments, and asking for an explanation must not be presented
  as a formal challenge to a decision.
- Start again or refresh and confirm that previous answers are cleared.
- On results, check short explanations appear before the main action and link.
  The explanation should match the single selected area without expanding details.
  Additional guidance should not repeat it.
  For an unsure statement answer, check visible Payments directions and sign-in;
  for an inaccessible statement, check contact support. Both still skip questions
  about statement contents.
- Check “More help and details” is closed initially and opens with the keyboard.
  Supporting guidance and sources remain available under headings. Deadline
  reminders for messages, disputed deductions and rent requests remain outside it.
- Open “More help and details” on a payment and message result: each must show the
  relevant navigation steps, sign-in link and a way to get help without signing in.
- Check results and outbound links with a screen reader and real phone before release.
- Check the short contact instruction and draft destination for payments, messages, statement
  access, each deduction type and uncertainty. Payment messages should link to
  official sign-in, with a visible helpline alternative. Deductions retain the
  DWP finder; a decision dispute must not be presented as only a repayment query.
- Switch from repayments to earnings using Back: clear the deduction details
  and show the UC payment contact, with no repayment questions or result switcher.
- Edit a draft and copy it: clipboard text must match the edited text. Clear the
  field to check Copy is disabled, and try a bracketed placeholder. If clipboard
  access is unavailable, check that manual-copy instructions appear.
- Back then Continue without changing answers preserves edits. Change an answer
  and verify the new template appears; Start again and refresh clear edits.
- Open “Already asked? Get help following up” and try all three choices. Confirm
  the main action changes to the selected follow-up, with no repeated first-contact
  action. Collapsing the choices must keep the action and selected draft visible.
  Return to the original step and confirm its action and edited draft are restored.
  Confirm the editor
  title and suggested wording change, contact guidance still matches the issue,
  and placeholders must be completed before copying. Edit each draft, switch
  choices and return to the original: each should retain its own edits. Back
  without changing answers preserves the selection; changing an answer clears it.
- Collapse the follow-up section: the selected draft and deadline reminder stay
  visible. Confirm keyboard access to the summary, radio choices and return button.

## Sources and release boundary

The general guidance was checked against the linked GOV.UK/DWP pages on
11 September 2026: earnings, deductions, other benefits, account access, contact
options and challenging a decision. Links and the check date are in
`src/data/resources.js`. MoneyHelper provides additional reading and support.
Deduction, advance, overpayment and deduction-contact sources were checked again
on 13 September 2026 for the follow-up question. The result shows each source's
check date so an update does not imply that unrelated sources were rechecked.
No rates, thresholds or challenge deadlines are calculated or hardcoded.
The deductions and overpayments pages were rechecked on 13 September 2026 for
the need-specific actions. Affordability points to the official contact finder;
it does not decide eligibility for a repayment reduction or hardship support.
Account-navigation wording was checked on 14 September 2026 against Turn2us's
account/journal and common-tasks guides, DWP's managing-your-claim guide, the
deductions page (statement navigation) and the official UC contact page. New
source entries have their own dates; this does not refresh unrelated guidance.

Contact-route wording was checked on 18 September 2026 against DWP's claim
management, deductions, benefit overpayments and UC contact pages, and Turn2us's
common-tasks guide (journal payment category). Their source dates are updated.
The DWP contact finder could not be loaded during this review, so its previous
check date is retained; the current DWP deductions page still links to it. The
app provides a UC contact fallback and does not reproduce the finder's outcomes.

Follow-up guidance was checked on 18 September 2026 against DWP's account,
contact, mandatory reconsideration and complaints pages, plus MoneyHelper's UC
problems guide. Journal waiting-time wording is not a promised reply deadline.
Drafts are clarification requests, not complaints or mandatory reconsiderations.

Before publishing, recheck the guidance and links against current official
sources and have a welfare-rights adviser review the wording and scope. The
recorded check date is not a claim of professional or legal approval.

The user-supplied forum examples informed the uncertainty options, message route,
neutral language and optional wording for contacting UC. They are qualitative
research, not verified policy or evidence of how common a problem is. No forum
usernames or personal stories are included in the app. Sanction decisions, claim
reviews, savings, housing emergencies and detailed health rules are outside this step.
