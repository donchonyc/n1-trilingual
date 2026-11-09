/* Data integrity check — run: node scripts/validate.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

["js/i18n.js", "js/data/grammar.js", "js/data/grammar-2.js",
 "js/data/grammar-n1.js", "js/data/grammar-n2.js", "js/data/grammar-n3.js",
 "js/data/vocab-1.js", "js/data/vocab-2.js", "js/data/vocab-3.js",
 "js/data/vocab-4.js", "js/data/vocab-5.js", "js/data/deck.js", "js/data/deck-full.js", "js/data/reading.js"].forEach((f) => {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox, { filename: f });
});

const { GRAMMAR = [], VOCAB = [], READING = [], I18N, TAGS, tagLabel } = sandbox.window;
const errors = [];
const warn = [];
const check = (cond, msg) => { if (!cond) errors.push(msg); };

const has = (s) => typeof s === "string" && s.trim().length > 0;
const hangul = /[\uAC00-\uD7A3]/;
const kana = /[\u3040-\u30FF]/;
const kanji = /[\u4E00-\u9FFF]/;

console.log(`Grammar: ${GRAMMAR.length}   Vocabulary: ${VOCAB.length}`);

check(GRAMMAR.length === 596, `expected 596 grammar points, found ${GRAMMAR.length}`);
check(VOCAB.length === 4144, `expected 4144 vocabulary entries, found ${VOCAB.length}`);

/* i18n parity */
const langs = Object.keys(I18N);
const keys = Object.keys(I18N.ko).sort();
langs.forEach((l) => {
  const missing = keys.filter((k) => !(k in I18N[l]));
  const extra = Object.keys(I18N[l]).filter((k) => !keys.includes(k));
  check(missing.length === 0, `i18n.${l} missing: ${missing.join(", ")}`);
  check(extra.length === 0, `i18n.${l} extra: ${extra.join(", ")}`);
});
console.log(`i18n: ${keys.length} keys × ${langs.length} languages`);

/* grammar checks */
const gIds = new Set();
const patterns = new Set();
GRAMMAR.forEach((g, i) => {
  const tag = g.id || `#${i}`;
  const level = g.level || "N1";
  check(has(g.id) && !gIds.has(g.id), `${tag}: missing/duplicate id`);
  gIds.add(g.id);
  check(has(g.pattern), `${tag}: pattern`);
  check(["N1", "N2", "N3"].includes(level), `${tag}: invalid level ${level}`);
  check(!patterns.has(g.pattern), `${tag}: duplicate pattern ${g.pattern}`);
  patterns.add(g.pattern);
  check(has(g.core), `${tag}: core`);
  check(TAGS.grammar[g.tag], `${tag}: unknown tag ${g.tag}`);
  ["ja", "en", "ko"].forEach((l) => {
    check(has(g.meaning && g.meaning[l]), `${tag}: meaning.${l}`);
    check(has(g.formation && g.formation[l]), `${tag}: formation.${l}`);
    if (g.note) check(has(g.note[l]), `${tag}: note.${l}`);
  });
  check(hangul.test(g.meaning.ko || ""), `${tag}: ko meaning has no Hangul`);
  check(kanji.test(g.meaning.ja || "") || kana.test(g.meaning.ja || ""), `${tag}: ja meaning has no Japanese`);
  check(/[A-Za-z]/.test(g.meaning.en || ""), `${tag}: en meaning has no Latin text`);
  check(Array.isArray(g.examples) && g.examples.length > 0, `${tag}: examples`);
  (g.examples || []).forEach((ex, j) => {
    ["ja", "en", "ko"].forEach((l) => check(has(ex[l]), `${tag}: example ${j + 1} missing ${l}`));
    check(kanji.test(ex.ja) || kana.test(ex.ja), `${tag}: example ${j + 1} ja looks wrong`);
    check(hangul.test(ex.ko), `${tag}: example ${j + 1} ko has no Hangul`);
  });
  if (g.quiz !== false && g.examples && g.examples[0]) {
    const target = g.blankTarget || g.core;
    check(g.examples[0].ja.includes(target),
      `${tag}: target "${target}" is not in the first example (quiz would be skipped)`);
  }
});

const levelCounts = {};
GRAMMAR.forEach((g) => { const l = g.level || "N1"; levelCounts[l] = (levelCounts[l] || 0) + 1; });
check(levelCounts.N1 === 250, `expected 250 N1 grammar points, found ${levelCounts.N1 || 0}`);
check(levelCounts.N2 === 163, `expected 163 N2 grammar points, found ${levelCounts.N2 || 0}`);
check(levelCounts.N3 === 183, `expected 183 N3 grammar points, found ${levelCounts.N3 || 0}`);
console.log("grammar levels:", JSON.stringify(levelCounts));

/* vocabulary checks */
const vIds = new Set();
const kanjiSet = new Set();
VOCAB.forEach((v, i) => {
  const tag = `v${i + 1}`;
  check(!vIds.has(tag), `${tag}: duplicate id`);
  vIds.add(tag);
  check(has(v.kanji), `${tag}: kanji/word`);
  check(has(v.kana), `${tag}: kana`);
  check(has(v.romaji), `${tag}: romaji`);
  check(!kanji.test(v.kana), `${tag}: kana contains kanji (${v.kana})`);
  check(kana.test(v.kana) || /[a-z]/i.test(v.kana), `${tag}: kana looks wrong`);
  check(has(v.pos), `${tag}: pos`);
  check(TAGS.vocab[v.tag], `${tag}: unknown tag ${v.tag}`);
  const wordKey = v.kanji + "|" + v.kana;
  check(!kanjiSet.has(wordKey), `${tag}: duplicate word ${v.kanji} (${v.kana})`);
  kanjiSet.add(wordKey);
  ["ja", "en", "ko"].forEach((l) => {
    check(has(v.meaning && v.meaning[l]), `${tag}: meaning.${l}`);
  });
  check(has(v.example && v.example.ja), `${tag}: example.ja`);
  check(has(v.example && v.example.en), `${tag}: example.en`);
  check(has(v.example && v.example.ko), `${tag}: example.ko`);
  check(hangul.test(v.meaning.ko || ""), `${tag}: ko meaning has no Hangul`);
  check(kanji.test(v.meaning.ja || "") || kana.test(v.meaning.ja || ""), `${tag}: ja meaning has no Japanese`);
  check(/[A-Za-z]/.test(v.meaning.en || ""), `${tag}: en meaning has no Latin text`);
  check(hangul.test(v.example.ko || ""), `${tag}: ko example has no Hangul`);
  const stem = v.kanji.replace(/[ぁ-ん]+$/, "");
  const probe = stem || v.kanji.slice(0, Math.max(1, v.kanji.length - 2));
  const kanaStem = v.kana.length > 2 ? v.kana.slice(0, -1) : v.kana;
  check(v.example.ja.includes(v.kanji) || v.example.ja.includes(v.kana) ||
    v.example.ja.includes(kanaStem) || (probe.length > 0 && v.example.ja.includes(probe)),
    `${tag}: word does not appear in its example sentence`);
});

/* reading comprehension */
const rIds = new Set();
let rqTotal = 0;
check(READING.length === 5, `expected 5 reading sets, found ${READING.length}`);
READING.forEach((set, i) => {
  const tag = set.id || `r#${i}`;
  check(has(set.id) && !rIds.has("set:" + set.id), `${tag}: missing/duplicate set id`);
  rIds.add("set:" + set.id);
  check(has(set.passage), `${tag}: passage`);
  check(!hangul.test(set.passage), `${tag}: passage contains Korean`);
  check(["ja", "en", "ko"].every((l) => has(set.title && set.title[l])), `${tag}: trilingual title`);
  check(Array.isArray(set.questions) && set.questions.length > 0, `${tag}: questions`);
  (set.questions || []).forEach((q, j) => {
    rqTotal++;
    const qt = `${tag} q${j + 1}`;
    check(has(q.id) && !rIds.has(q.id), `${qt}: missing/duplicate id`);
    rIds.add(q.id);
    check(has(q.question), `${qt}: question`);
    check(!hangul.test(q.question), `${qt}: question contains Korean`);
    check(Array.isArray(q.options) && q.options.length === 4, `${qt}: needs 4 options`);
    check(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `${qt}: answer index`);
    (q.options || []).forEach((o, k) => {
      check(has(o), `${qt}: option ${k + 1}`);
      check(!hangul.test(o), `${qt}: option ${k + 1} contains Korean`);
      check(kana.test(o) || kanji.test(o), `${qt}: option ${k + 1} has no Japanese`);
    });
    ["ja", "en", "ko"].forEach((l) => {
      check(has(q.explain && q.explain[l]), `${qt}: explain.${l}`);
    });
    check(hangul.test(q.explain.ko || ""), `${qt}: ko explanation has no Hangul`);
    check(kana.test(q.question) || kanji.test(q.question), `${qt}: question has no Japanese`);
  });
});
console.log(`Reading: ${READING.length} passages, ${rqTotal} questions`);
check(rqTotal === 11, `expected 11 reading questions, found ${rqTotal}`);

/* tag coverage */
const gTags = new Set(GRAMMAR.map((g) => g.tag));
const vTags = new Set(VOCAB.map((v) => v.tag));
console.log("grammar tags:", [...gTags].join(", "));
console.log("vocab tags:  ", [...vTags].join(", "));
[...gTags].forEach((x) => check(TAGS.grammar[x], `grammar tag ${x} missing labels`));
[...vTags].forEach((x) => check(TAGS.vocab[x], `vocab tag ${x} missing labels`));

/* quiz feasibility: grammar needs 3 usable distractors */
const quizPool = GRAMMAR.filter((g) => g.quiz !== false && (g.blankTarget || g.core) &&
  g.examples[0].ja.includes(g.blankTarget || g.core));
quizPool.forEach((g) => {
  const target = g.blankTarget || g.core;
  const idx = g.examples[0].ja.indexOf(target);
  const blank = g.examples[0].ja.slice(0, idx) + "＿＿＿" + g.examples[0].ja.slice(idx + target.length);
  const usable = quizPool.filter((x) => x.core !== g.core && !blank.includes(x.core));
  const unique = new Set(usable.map((x) => x.core));
  check(unique.size >= 3, `${g.id}: only ${unique.size} distinct distractors usable`);
});
console.log(`quiz-ready grammar items: ${quizPool.length} / ${GRAMMAR.length}`);

/* vocabulary label collisions per tag (quiz distractors rely on distinct labels) */
["ja", "en", "ko"].forEach((l) => {
  const seen = new Map();
  VOCAB.forEach((v) => {
    if (v.auto) return;
    const m = v.meaning[l];
    if (seen.has(m)) warn.push(`duplicate ${l} meaning: "${m}" (${v.kanji} / ${seen.get(m)})`);
    else seen.set(m, v.kanji);
  });
});

const VOWELS = { ko: hangul, ja: kana };
Object.keys(VOWELS).forEach((l) => {
  const msg = `sample ${l}: ${Object.values(I18N[l])[0]}`;
  check(has(I18N[l].navGrammar), `i18n.${l}.navGrammar missing`);
});

console.log(`\nErrors: ${errors.length}`);
errors.slice(0, 40).forEach((e) => console.log("  ✗ " + e));
if (errors.length > 40) console.log(`  … ${errors.length - 40} more`);

console.log(`Warnings: ${warn.length}`);
[...new Set(warn)].slice(0, 20).forEach((w) => console.log("  ! " + w));

process.exit(errors.length ? 1 : 0);
