# Walkthrough 03 — What data is saved and what is not

**Target duration:** 80–90 seconds
**Format:** Presenter voice with account, consent, and privacy screen capture
**Recording data:** Use a fictional identity and fictional problem details only

## 00:00–00:09 — Open on the consent gate

**Shot cue:** Show the signed-out gate, then the problem-brief consent checkbox. Keep all fields empty.

**On screen:** `SAVE WITH CONSENT · MINIMUM USEFUL CONTEXT`

**Spoken copy:** “Here is what the initial Systems Desk release saves, what it only processes, and what you should never enter.”

## 00:09–00:24 — Account data

**Shot cue:** Show the sign-up form with fictional text blurred or masked. Highlight the Supabase Auth notice beneath the password field.

**On screen:** `SUPABASE AUTH · RAW PASSWORD NOT STORED BY AIXCEL`

**Spoken copy:** “Your email is handled as the account identifier by Supabase Auth. Supabase processes and hashes the password; AiXCEL does not receive or store the raw password. The profile saves your full name, company name, and role.”

## 00:24–00:45 — Problem brief

**Shot cue:** Move through the blank problem form. Highlight each field group, then the required consent checkbox.

**On screen:** `PROFILE + BUSINESS CONTEXT + PROBLEM + DESIRED OUTCOME`

**Spoken copy:** “After you consent, the saved problem brief includes business type, team size, urgency, the bottleneck, how the workflow runs today, current tools, and the desired outcome. It also records the account link, consent version and time, status, and creation and update timestamps.”

## 00:45–00:57 — Usage counters

**Shot cue:** Show the daily-capacity card. Use a simple counter graphic; do not display database identifiers.

**On screen:** `USER ID + UTC DATE + QUESTION COUNT`

**Spoken copy:** “A daily usage counter stores the user ID, UTC date, and question count to enforce capacity. It does not store the question text in that counter.”

## 00:57–01:17 — Chat processing versus chat storage

**Shot cue:** Show a fictional question moving from the browser to the server, saved problem brief, approved evidence, and OpenRouter. Do not show a provider dashboard or claim a provider retention setting.

**On screen:** `PROCESSED FOR THE ANSWER ≠ SAVED AS ACCOUNT HISTORY`

**Spoken copy:** “The current question and recent browser-held conversation context are sent through AiXCEL’s server, with the saved problem brief and approved evidence, to a selected free model on OpenRouter. The initial release does not write that chat transcript into account history. Not saved as chat history does not mean not processed.”

## 01:17–01:29 — Close on the privacy boundary

**Shot cue:** Open `/privacy` and highlight the Systems Desk section and contact route.

**On screen:** `DO NOT ENTER SECRETS OR SENSITIVE CLIENT DATA`

**Spoken copy:** “Never enter passwords, credentials, health information, payment data, or confidential client records. Use the privacy contact if you need to request access, correction, or deletion where applicable.”
