# N1–N3 三言語 — JLPT grammar, vocabulary & reading, trilingual

An interactive, dependency-free study site for **JLPT N1–N3 grammar** and **N1 vocabulary and
reading**. Every grammar point and word carries a Japanese definition, an English gloss and a
Korean translation, plus example sentences in all three languages. Reading questions and answer
choices are in Japanese, with trilingual explanations.

No framework or build step. Content lives in plain JS files. Progress works offline in
`localStorage` and, when the site is served by the included Node server, syncs a **single
server-side user** across browsers, devices and app-server instances.

## Features

- **596 grammar points (N1–N3)** — 65 hand-curated N1 entries plus 531 N1/N2/N3 points imported
  from `EnglishGrammarN1N2N3N4N5.apkg`. Each has a pattern, trilingual meaning, formation and
  translated example. Grammar study and grammar quiz can be filtered by **N1 / N2 / N3 / All**;
  the choice is remembered in `localStorage`.
- **4,144 N1 vocabulary items** — 160 hand-curated core entries (nouns, verbs, adjectives,
  adverbs and four-character idioms), 575 hand-reviewed high-frequency words from the
  *eggrolls JLPT10k v3.5* Anki deck, and **3,409 bulk entries** completing its full N1 list.
  The 3,409 bulk meanings and example translations are machine-assisted (`auto: true`) and were
  not individually proofread; the original 735 entries keep their hand-reviewed translations.
- **Single-user server sync** — one fixed user (`learner-1`) with a server-side state record,
  revision counter and sync status in the app bar. `localStorage` remains the offline cache.
  For multiple app servers, point them at one PostgreSQL database (or a shared `DATA_DIR`).
- **Daily goal dashboard** — a home progress ring and today's review/quiz/study counts, a
  selectable daily goal (10 / 20 / 30 / 50 / 100), a goal streak, and a 14-day chart where
  goal-reaching days are highlighted. Goal changes sync with the single user.
- **Trilingual UI** — switch between 한국어 / English / 日本語 at any time. Study cards and
  explanations show meanings in all three languages, with the selected language highlighted first;
  quiz prompts and options are Japanese-only.
- **Exam-style vocabulary quizzes** — Japanese-only: kanji → reading (okurigana masked, with
  plausible misreadings and same-ending distractors), reading → kanji, contextual blank
  (文脈規定), and Japanese definition → word (言い換え). Options are always Japanese; the
  explanation appears only after answering, in the selected UI language.
- **Grammar quizzes** — a sentence with a blank, four same-category grammar choices
  (文法形式の判断) from the selected level, so the options look like the real exam rather than
  random patterns.
- **Reading comprehension** — 5 original N1 passages and 11 questions in exam formats:
  short passages (内容理解), information retrieval (情報検索), integrated understanding
  (統合理解), and text grammar (文章の文法). The question and options are Japanese; the
  explanation is trilingual.
- **Spaced review (Leitner boxes)** — every answer schedules the item again, from 10 minutes to
  30 days. Review cards are due when the interval expires. Vocabulary review fronts ask for the
  reading (or give a Japanese definition for kana-only words); meanings appear on the back.
- **Flashcards** — flip-style card deck with keyboard support.
- **Search & filters** — search any script (kanji, kana, English, Korean), filter grammar by
  level, tag or study status (unstudied, completed, starred, previously missed), sort by kana.
- **Progress dashboard** — completion bars, mastery, quiz accuracy, streak, 14-day activity.
- **Comfort details** — dark/light theme, Japanese text-to-speech on every example
  (`speechSynthesis`), keyboard shortcuts, responsive layout, reduced-motion support.

## Question coverage

| JLPT section | Status |
| --- | --- |
| 漢字読み | ✅ kanji → reading, okurigana masked, plausible misreading variants |
| 文脈規定 | ✅ contextual blank with same-POS choices |
| 言い換え類義 | ✅ Japanese definition → word |
| 用法 | — not yet (needs several usage sentences per word) |
| 文法形式の判断 | ✅ sentence blank with same-category grammar choices |
| 文の組み立て | — not yet (star/ordering questions) |
| 文章の文法 | ✅ one text-grammar passage with three blanks |
| 読解 | ✅ short passage, information retrieval, integrated understanding |

The reading passages are **original** texts written for this site in the style of the N1 exam,
not copied from the past papers you supplied.

## Design system

The UI follows **[Material Design 3](https://m3.material.io/)** (Material You) rather than a
component library — it is implemented directly in CSS and a small amount of JavaScript:

- **Color**: M3 color roles (`primary`, `primary-container`, `secondary-container`, `tertiary`,
  `error`, `surface-container-*`, `outline`, `inverse-surface`, custom `success`), with separate
  light and dark schemes. The seed palette is indigo with a vermilion tertiary accent.
- **Type**: M3 display / headline / title / body / label proportions, 400–500 weights, and
  Roboto-first stacks with Japanese and Korean system fallbacks.
- **Shape**: 4 / 8 / 12 / 16 / 28 dp corner tokens and full-round buttons.
- **Elevation & surfaces**: tonal surface containers plus M3 elevation levels 1–3.
- **Components**: primary top-app-bar tabs, segmented buttons, filter chips, filled / outlined /
  text buttons, M3 switch, outlined cards, filled cards, snackbar, extended FAB, M3 dialog,
  search bar.
- **States & motion**: hover/pressed state layers, pointer ripples, 3 dp focus rings, 4 dp
  spacing grid, 48 dp touch targets, and reduced-motion support.

The site stays dependency-free and offline-friendly: no Material Symbols font or MDC package is
loaded; icons are Unicode and typography uses installed fonts.

## Run it

Open `index.html` directly in a browser — everything works from `file://`.

Or serve it locally (recommended, and required if you want to use browser dev tools):

```bash
npm start          # http://127.0.0.1:4173
# or
node scripts/serve.js 8080
```

## Keyboard shortcuts

| Context | Key | Action |
| --- | --- | --- |
| Quiz | `1`–`4` | Choose an answer |
| Quiz | `Enter` | Next question |
| Review | `Space` / `Enter` | Reveal the answer |
| Review | `1` / `2` / `3` | Again / Hard / Good |
| Flashcards | `Space` / `Enter` | Flip the card |

## Project layout

```
index.html              markup shell (all views)
assets/styles.css       design system, layout, dark/light themes
assets/favicon.svg
js/i18n.js              UI strings (ko/en/ja), tag labels, t() / tagLabel()
js/data/grammar.js      curated N1 grammar 1–33
js/data/grammar-2.js    curated N1 grammar 34–65
js/data/grammar-n1.js   imported N1 grammar (185)
js/data/grammar-n2.js   imported N2 grammar (163)
js/data/grammar-n3.js   imported N3 grammar (183)
js/data/vocab-1.js      nouns 1–40
js/data/vocab-2.js      nouns 41–80
js/data/vocab-3.js      verbs 81–115
js/data/vocab-4.js      adjectives & adverbs 116–150
js/data/vocab-5.js      four-character idioms 151–160
js/data/deck.js         N1 high-frequency deck import (575 words)
js/data/deck-full.js    full N1 deck bulk import (3,409 machine-assisted words)
js/data/reading.js      N1 reading passages & questions (original)
js/app.js               navigation, rendering, quiz engine, SRS, storage
scripts/serve.js        static server + single-user sync API
scripts/store.js        file/PostgreSQL store for the single user
.data/                  runtime user state (gitignored, not served)
scripts/validate.js     dataset integrity checker
```

## Data format

Add a grammar point:

```js
{
  id: "g66",
  pattern: "〜を皮切りに",          // display form
  core: "を皮切りに",               // answer option / pattern form
  blankTarget: "を皮切りに",         // optional: exact form to blank in example 1
  reading: "をかわきりに",           // optional
  level: "N1",                      // N1 | N2 | N3
  quiz: true,                       // false to exclude from cloze quizzes
  tag: "time",                      // see TAGS.grammar in js/i18n.js
  meaning:   { ja: "...", en: "...", ko: "..." },
  formation: { ja: "...", en: "...", ko: "..." },
  examples:  [{ ja: "...", en: "...", ko: "..." }],
  note:      { ja: "...", en: "...", ko: "..." }, // optional
  similar:   ["〜をはじめ"]                       // optional
}
```

Add a word:

```js
{
  kanji: "曖昧", kana: "あいまい", romaji: "aimai",
  pos: "na-adj",                    // noun | verb | i-adj | na-adj | adverb | idiom | expression
  tag: "abstract",                  // see TAGS.vocab in js/i18n.js
  auto: true,                       // optional: machine-assisted bulk entry
  meaning: { ja: "...", en: "...", ko: "..." },
  example: { ja: "...", en: "...", ko: "..." }
}
```

Vocabulary ids are assigned automatically (`v1`, `v2`, …) in load order. Grammar ids must be
unique.

Add a reading set:

```js
{
  id: "r6",
  type: "short",                    // short | info | integrated | textgrammar
  title: { ja: "...", en: "...", ko: "..." },
  passage: "本文（日本語）",
  questions: [{
    id: "r6q1",
    question: "設問（日本語）",
    options: ["...", "...", "...", "..."],
    answer: 0,                      // correct option index
    explain: { ja: "...", en: "...", ko: "..." }
  }]
}
```

Run the checker after editing:

```bash
npm run validate
```

It verifies counts (596 grammar: 250 N1 / 163 N2 / 183 N3; 4,144 vocabulary; 5 reading passages;
11 reading questions), ids, required translations, Hangul/Japanese/Latin sanity, duplicate
words (same headword + reading), tag coverage, quiz blankability and distractor availability,
reading answer indices, and i18n key parity across the three languages.

## Deck import

`js/data/deck.js` holds the 575 hand-reviewed words from the supplied Anki deck
`egg_rollsJLPT_N1N5__v35NO_ENGLISH.apkg` — specifically its `5-N1::1-高频` (high-frequency N1)
subdeck of 598 words, 23 of which already existed in the curated set.

`js/data/deck-full.js` adds the remaining **3,409 mid/low-frequency N1 words**, bringing the site
to **4,144 vocabulary entries**. The full deck contains 4,045 N1 entries whose definitions are
Simplified/Traditional Chinese only and which have no Korean or English. The first 735 entries
(160 curated + 575 high-frequency) were translated individually. The 3,409 bulk entries use
machine-assisted Korean/English/Japanese glosses and English/Korean example translations, marked
`auto: true`; they were not individually proofread. Japanese headwords, readings, POS and example
sentences come from the deck; romaji is generated automatically. Twelve malformed prefix/suffix
cards were skipped, and 46 examples that used a synonym or spelling variant were rewritten.

## Grammar import

`js/data/grammar-n1.js`, `grammar-n2.js` and `grammar-n3.js` add **531 new grammar points** from
the supplied `EnglishGrammarN1N2N3N4N5.apkg` (毎日のんびり日本語教師の文法). The source has 827
notes across N0–N5; the N1–N3 subset was deduplicated against the curated set and within the deck
(84 overlaps/duplicates removed), leaving 185 N1 + 163 N2 + 183 N3 new entries.

Japanese explanations, formation strings and example sentences come from the deck; the deck also
provided English example translations. Its meanings are Chinese-only and it has no Korean data,
so concise English/Korean glosses and Korean example translations were written for this site.
N4/N5 entries are not imported.

## User tracking and sync

The site tracks **one fixed user**, `learner-1` / “Learner”. There are no accounts or login
screens; the single user is created automatically by the server:

- **Browser cache** — `n1-trilingual-v1` in `localStorage` keeps the app usable offline.
- **Server record** — when served over HTTP, the client calls `GET/PUT /api/state` and the
  server stores the user’s complete state (progress, SRS, stars, quiz totals, activity, language,
  theme, daily goal and grammar levels) with a revision counter.
- **Default storage** — `.data/users/learner-1.json` (blocked from static serving).
- **Status** — the “Learner” chip in the top bar shows `Local only`, `Synced`, `Syncing`,
  `Offline` or `Key needed`. Open it for the user ID, storage backend, last sync, sync key and a
  manual **Sync now** button.
- **Offline changes** — saves are written locally first and queued; a server pull is skipped when
  the local cache has unsynced changes, then the local state is pushed.

### Run it

```bash
npm start
# → http://127.0.0.1:4173
```

Opening `index.html` directly as `file://` still works, but stays local-only because there is no
HTTP API to sync to.

### Across multiple servers

The Node server is stateless; the user record is the only persistent state.

- **PostgreSQL (recommended for multiple servers):**
  ```bash
  npm install pg
  DATABASE_URL=postgres://user:pass@host/db HOST=0.0.0.0 npm start
  ```
  Every app-server instance connects to the same database. The server creates
  `trilingual_user (id, name, state jsonb, revision, created_at, updated_at)` automatically.
- **Shared filesystem:** set `DATA_DIR` to the same mounted directory on every instance.
  This is simpler but relies on the filesystem supporting atomic renames and locking.
- **Optional sync key:** set `SYNC_TOKEN=...`; the API then requires `x-sync-token`. The user
  dialog shows a key field on first sync. Use HTTPS and a token for any public deployment.
- **User identity:** override `USER_ID` and `USER_NAME` if you want a different single user.

The state contains study progress, not credentials. It is not encrypted at rest by this app.

## Storage

Progress is saved under `n1-trilingual-v1` in `localStorage` and, when the HTTP server is used,
mirrored to the single user above. “진도 → 기록 초기화” clears the learning records but keeps
your level and theme preferences. Resetting also queues a server update, so the reset follows the
user across devices.

## Notes

- Grammar: 65 curated N1 points plus 531 imported N1–N3 points (250 N1 / 163 N2 / 183 N3 total).
  JLPT does not publish an official grammar list; treat the selection as study material rather
  than an exam syllabus.
- Vocabulary: 4,144 entries — 160 curated, 575 hand-reviewed high-frequency deck words, and
  3,409 machine-assisted bulk deck words. The deck's 4,045 N1 entries are all represented except
  twelve malformed prefix/suffix cards; same-headword homographs with different readings are kept.
- Bulk vocabulary (`auto: true`) uses machine-assisted glosses and example translations and may
  contain awkward translations. The curated and high-frequency entries remain the most reliable
  set.
- Speech uses the browser's installed Japanese voice. If none is available the button reports
  that speech is unsupported.
