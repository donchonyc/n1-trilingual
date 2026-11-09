/* N1 三言語 — application */
(function () {
  "use strict";

  const DAY = 86400000;
  const STORE_KEY = "n1-trilingual-v1";
  const SYNC_TOKEN_KEY = "n1-sync-token";
  const SYNC_DIRTY_KEY = "n1-sync-dirty";
  const SYNC_LAST_KEY = "n1-sync-last";
  const BOX_DAYS = [0.007, 1, 2, 4, 7, 14, 30]; // box 0 ≈ 10 minutes

  const GRAMMAR = (window.GRAMMAR || []).slice();
  const VOCAB = (window.VOCAB || []).slice();
  const READING = (window.READING || []).slice();
  GRAMMAR.forEach(function (g, i) { g.id = g.id || "g" + (i + 1); g.kind = "grammar"; g.level = g.level || "N1"; });
  VOCAB.forEach(function (v, i) { v.id = "v" + (i + 1); v.kind = "vocab"; });

  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  const esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ── state ─────────────────────────────── */

  const DEFAULTS = {
    lang: "ko",
    theme: "dark",
    grammarLevel: "N1",
    quizGrammarLevel: "N1",
    dailyGoal: 20,
    known: {},
    starred: {},
    srs: {},
    quiz: { asked: 0, correct: 0 },
    activity: {}
  };

  function normalizeState(saved) {
    const merged = JSON.parse(JSON.stringify(DEFAULTS));
    Object.keys(saved || {}).forEach(function (k) {
      if (saved[k] && typeof saved[k] === "object" && !Array.isArray(saved[k]) && merged[k] && typeof merged[k] === "object") {
        Object.assign(merged[k], saved[k]);
      } else {
        merged[k] = saved[k];
      }
    });
    return merged;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      return normalizeState(JSON.parse(raw));
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  const state = loadState();
  if (!I18N[state.lang]) state.lang = "ko";
  if (state.theme !== "light" && state.theme !== "dark") state.theme = "dark";
  if ([10, 20, 30, 50, 100].indexOf(Number(state.dailyGoal)) === -1) state.dailyGoal = 20;
  // Older activity records have quiz/review counts but no per-day correct count.
  // If all quiz answers so far belong to today, backfill today's correct count.
  backfillTodayCorrect();

  const APP = { state: state };
  window.APP = APP;

  const SYNC = {
    enabled: location.protocol === "http:" || location.protocol === "https:",
    status: "local",
    backend: "none",
    last: 0,
    token: "",
    user: { id: "learner-1", name: "Learner" },
    timer: null,
    busy: false,
    pending: false
  };
  try {
    SYNC.token = localStorage.getItem(SYNC_TOKEN_KEY) || "";
    SYNC.last = Number(localStorage.getItem(SYNC_LAST_KEY) || 0) || 0;
  } catch (e) { /* file:// or private mode */ }

  function saveLocalOnly() {
    APP.state = state;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore quota */ }
  }

  function markDirty() {
    try { localStorage.setItem(SYNC_DIRTY_KEY, "1"); } catch (e) { /* ignore */ }
  }

  function clearDirty() {
    try { localStorage.removeItem(SYNC_DIRTY_KEY); } catch (e) { /* ignore */ }
  }

  function saveLastSync(at) {
    SYNC.last = at || Date.now();
    try { localStorage.setItem(SYNC_LAST_KEY, String(SYNC.last)); } catch (e) { /* ignore */ }
  }

  function save() {
    saveLocalOnly();
    markDirty();
    queueSync();
  }

  function syncHeaders() {
    const h = { "Content-Type": "application/json" };
    if (SYNC.token) h["x-sync-token"] = SYNC.token;
    return h;
  }

  function setSyncStatus(status) {
    SYNC.status = status;
    updateSyncUI();
  }

  function syncStatusLabel() {
    return t({
      local: "syncLocal",
      syncing: "syncSyncing",
      synced: "syncSynced",
      offline: "syncOffline",
      auth: "syncAuth"
    }[SYNC.status] || "syncLocal");
  }

  function updateSyncUI() {
    const statusEl = $("#syncStatus");
    const chip = $("#userChip");
    const label = syncStatusLabel();
    const chipName = $("#userChipName");
    if (chipName) chipName.textContent = SYNC.user.name;
    const dialogName = $("#userNameDialog");
    if (dialogName) dialogName.textContent = SYNC.user.name;
    const dialogId = $("#userDialogId");
    if (dialogId) dialogId.textContent = SYNC.user.id;
    if (statusEl) statusEl.textContent = label;
    if (chip) {
      chip.dataset.sync = SYNC.status;
      chip.title = t("userTitle") + " · " + label;
    }
    const statusText = $("#userStatusText");
    if (statusText) statusText.textContent = label;
    const storage = $("#userStorage");
    if (storage) {
      storage.textContent = SYNC.backend === "none" || !SYNC.enabled ?
        t("storageBrowser") : t("storageServer") + " · " + SYNC.backend;
    }
    const last = $("#userLastSync");
    if (last) {
      last.textContent = SYNC.last ?
        new Date(SYNC.last).toLocaleString(state.lang === "ja" ? "ja-JP" : state.lang === "en" ? "en-US" : "ko-KR") :
        "—";
    }
    const keyRow = $("#syncKeyRow");
    if (keyRow) keyRow.hidden = SYNC.status !== "auth";
    const syncBtn = $("#syncNowBtn");
    if (syncBtn) syncBtn.disabled = !SYNC.enabled;
    const note = $("#progressStorageNote");
    if (note) {
      const server = SYNC.backend !== "none" && SYNC.status !== "local" && SYNC.status !== "offline";
      note.textContent = t(server ? "savedServer" : "savedLocally");
    }
  }

  function applyRemoteState(remote) {
    const next = normalizeState(remote);
    Object.keys(state).forEach(function (k) { delete state[k]; });
    Object.assign(state, next);
    backfillTodayCorrect();
    if (!I18N[state.lang]) state.lang = "ko";
    if (state.theme !== "light" && state.theme !== "dark") state.theme = "dark";
    if (LEVELS.indexOf(state.grammarLevel) !== -1) ui.grammar.level = state.grammarLevel;
    if (LEVELS.indexOf(state.quizGrammarLevel) !== -1) ui.quiz.grammarLevel = state.quizGrammarLevel;
    saveLocalOnly();
    clearDirty();
    applyTheme();
    applyI18n();
    renderCurrentView();
  }

  function queueSync() {
    if (!SYNC.enabled) return;
    clearTimeout(SYNC.timer);
    SYNC.timer = setTimeout(function () { syncPush(); }, 900);
  }

  function syncPush() {
    if (!SYNC.enabled) return;
    if (SYNC.busy) { SYNC.pending = true; return; }
    SYNC.busy = true;
    setSyncStatus("syncing");
    fetch("/api/state", {
      method: "PUT",
      headers: syncHeaders(),
      cache: "no-store",
      body: JSON.stringify({ state: state })
    }).then(function (r) {
      if (r.status === 401) {
        setSyncStatus("auth");
        return null;
      }
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (data) {
      if (!data) return;
      if (data.backend) SYNC.backend = data.backend;
      if (data.user) SYNC.user = data.user;
      saveLastSync();
      clearDirty();
      setSyncStatus("synced");
    }).catch(function () {
      setSyncStatus(SYNC.status === "auth" ? "auth" : "offline");
    }).finally(function () {
      SYNC.busy = false;
      if (SYNC.pending) {
        SYNC.pending = false;
        queueSync();
      }
    });
  }

  function syncPull() {
    if (!SYNC.enabled) {
      setSyncStatus("local");
      return;
    }
    setSyncStatus("syncing");
    fetch("/api/state", { headers: syncHeaders(), cache: "no-store" })
      .then(function (r) {
        if (r.status === 401) {
          setSyncStatus("auth");
          return null;
        }
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data) return;
        if (data.backend) SYNC.backend = data.backend;
        if (data.user) SYNC.user = data.user;
        const dirty = (function () {
          try { return localStorage.getItem(SYNC_DIRTY_KEY) === "1"; } catch (e) { return false; }
        })();
        if (data.state && !dirty) {
          applyRemoteState(data.state);
          saveLastSync();
          setSyncStatus("synced");
        } else {
          syncPush();
        }
      })
      .catch(function () {
        setSyncStatus(SYNC.status === "auth" ? "auth" : "offline");
      });
  }

  function syncNow() {
    if (!SYNC.enabled) {
      setSyncStatus("local");
      return;
    }
    if (SYNC.status === "auth") {
      const input = $("#syncKeyInput");
      if (input) input.focus();
      return;
    }
    syncPull();
  }

  const ui = {
    grammar: { q: "", tag: "all", status: "all", sort: "default", limit: 30, level: "N1" },
    vocab: { q: "", tag: "all", status: "all", sort: "default", mode: "list", limit: 30 },
    quiz: { type: "mixed", count: 10, weak: false, grammarLevel: "N1" }
  };

  const LEVELS = ["all", "N1", "N2", "N3"];
  if (LEVELS.indexOf(state.grammarLevel) !== -1) ui.grammar.level = state.grammarLevel;
  if (LEVELS.indexOf(state.quizGrammarLevel) !== -1) ui.quiz.grammarLevel = state.quizGrammarLevel;

  let flashIndex = 0;
  let flashFlipped = false;
  let quiz = null;
  let review = null;

  /* ── helpers ───────────────────────────── */

  const LANG_ORDER = ["ja", "en", "ko"];

  function langOrder() {
    return [state.lang].concat(LANG_ORDER.filter(function (l) { return l !== state.lang; }));
  }

  function dateKey(d) {
    d = d || new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function activityOf(key) {
    const a = state.activity[key] || {};
    return {
      quiz: Number(a.quiz) || 0,
      review: Number(a.review) || 0,
      study: Number(a.study) || 0,
      correct: typeof a.correct === "number" ? a.correct : null
    };
  }

  function backfillTodayCorrect() {
    const key = dateKey();
    const a = state.activity && state.activity[key];
    if (a && Number(a.quiz) > 0 && a.correct == null && state.quiz.asked === Number(a.quiz)) {
      a.correct = Number(state.quiz.correct) || 0;
    }
  }

  function dailyTotal(a) {
    a = a || {};
    return (Number(a.quiz) || 0) + (Number(a.review) || 0) + (Number(a.study) || 0);
  }

  function dailyGoalValue() {
    const n = Number(state.dailyGoal);
    return [10, 20, 30, 50, 100].indexOf(n) === -1 ? 20 : n;
  }

  function todayActivity() {
    return activityOf(dateKey());
  }

  function addActivity(kind, n) {
    const key = dateKey();
    if (!state.activity[key]) state.activity[key] = { quiz: 0, review: 0, study: 0, correct: 0 };
    if (kind === "correct") {
      state.activity[key].correct = (Number(state.activity[key].correct) || 0) + (n == null ? 1 : n);
    } else {
      state.activity[key][kind] = (Number(state.activity[key][kind]) || 0) + (n == null ? 1 : n);
    }
  }

  function goalMetFor(key) {
    return dailyTotal(activityOf(key)) >= dailyGoalValue();
  }

  function goalStreak() {
    let count = 0;
    const d = new Date();
    if (goalMetFor(dateKey(d))) {
      count = 1;
      d.setDate(d.getDate() - 1);
    } else {
      d.setDate(d.getDate() - 1);
    }
    while (goalMetFor(dateKey(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  function todayAccuracy(act) {
    act = act || todayActivity();
    if (!act.quiz) return null;
    if (act.correct != null) return Math.round((act.correct / act.quiz) * 100);
    if (state.quiz.asked === act.quiz) return Math.round((state.quiz.correct / act.quiz) * 100);
    return null;
  }

  function allItems() {
    return GRAMMAR.map(function (g) { return { kind: "grammar", item: g }; })
      .concat(VOCAB.map(function (v) { return { kind: "vocab", item: v }; }));
  }

  function byId(id) {
    return GRAMMAR.filter(function (g) { return g.id === id; })[0] ||
      VOCAB.filter(function (v) { return v.id === id; })[0] || null;
  }

  function isWeak(id) {
    const s = state.srs[id];
    return !!(s && s.wrong > 0);
  }

  function isMastered(id) {
    const s = state.srs[id];
    return !!(s && s.box >= 4);
  }

  function inStudyLevel(x) {
    if (x.kind !== "grammar") return true;
    const lvl = x.item.level || "N1";
    return ui.grammar.level === "all" || lvl === ui.grammar.level;
  }

  function dueList() {
    const now = Date.now();
    return allItems().filter(function (x) {
      const s = state.srs[x.item.id];
      return s && s.due <= now && inStudyLevel(x);
    }).sort(function (a, b) {
      return (state.srs[a.item.id].due) - (state.srs[b.item.id].due);
    });
  }

  function newList() {
    return allItems().filter(function (x) {
      return !state.srs[x.item.id] && inStudyLevel(x);
    });
  }

  function streak() {
    let count = 0;
    const d = new Date();
    if (dailyTotal(activityOf(dateKey(d))) === 0) d.setDate(d.getDate() - 1);
    while (dailyTotal(activityOf(dateKey(d))) > 0) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  function accuracy() {
    if (!state.quiz.asked) return 0;
    return Math.round((state.quiz.correct / state.quiz.asked) * 100);
  }

  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function dayIndex(len) {
    const d = new Date();
    const n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
    return len ? ((n % len) + len) % len : 0;
  }

  function currentTranslation(obj) {
    return obj[state.lang] || obj.en || obj.ja || "";
  }

  function exampleTranslation(ex) {
    if (!ex || state.lang === "ja") return "";
    return ex[state.lang] || ex.en || "";
  }

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("is-visible"); }, 1900);
  }

  /* ── speech ────────────────────────────── */

  let jaVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    jaVoice = voices.filter(function (v) { return /^ja/i.test(v.lang); })[0] || null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) { toast(t("toastAudioOff")); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.92;
      if (jaVoice) u.voice = jaVoice;
      window.speechSynthesis.speak(u);
    } catch (e) { toast(t("toastAudioOff")); }
  }

  /* ── rendering: shared bits ────────────── */

  function tagsOf(kind) {
    const used = {};
    const pool = kind === "grammar" ? grammarByLevel(ui.grammar.level) : VOCAB;
    pool.forEach(function (x) { used[x.tag] = true; });
    return Object.keys(window.TAGS[kind] || {}).filter(function (k) { return used[k]; });
  }

  function meaningRows(item) {
    return langOrder().map(function (l, i) {
      return '<p class="m-row' + (i === 0 ? " is-primary" : "") + '">' +
        '<span class="lang-chip">' + l.toUpperCase() + "</span>" +
        "<span>" + esc(item.meaning[l] || "") + "</span></p>";
    }).join("");
  }

  function exampleHTML(ex, opts) {
    opts = opts || {};
    const langs = ["en", "ko"].sort(function (a) { return a === state.lang ? -1 : 0; });
    return '<div class="ex">' +
      '<p class="ex-ja"><span class="txt">' + esc(ex.ja) + "</span>" +
      '<button class="speak" data-speak="' + esc(ex.ja) + '" title="' + esc(t("audio")) + '" aria-label="' + esc(t("audio")) + '">▶</button></p>' +
      langs.map(function (l) {
        if (!ex[l]) return "";
        return '<p class="ex-tr"><span class="lang-chip">' + l.toUpperCase() + "</span><span>" + esc(ex[l]) + "</span></p>";
      }).join("") +
      "</div>";
  }

  function speakButton(text) {
    return '<button class="speak" data-speak="' + esc(text) + '" title="' + esc(t("audio")) + '" aria-label="' + esc(t("audio")) + '">▶</button>';
  }

  function statusValue(item) {
    return state.known[item.id] ? "done" : "new";
  }

  /* ── grammar view ──────────────────────── */

  function grammarHaystack(g) {
    const bits = [g.pattern, g.reading, g.meaning.ja, g.meaning.en, g.meaning.ko,
      g.formation.ja, g.formation.en, g.formation.ko, window.tagLabel("grammar", g.tag, state.lang)];
    g.examples.forEach(function (ex) { bits.push(ex.ja, ex.en, ex.ko); });
    (g.similar || []).forEach(function (s) { bits.push(s); });
    return bits.join(" ").toLowerCase();
  }

  function grammarByLevel(level) {
    if (!level || level === "all") return GRAMMAR;
    return GRAMMAR.filter(function (g) { return (g.level || "N1") === level; });
  }

  function filteredGrammar() {
    const f = ui.grammar;
    const q = f.q.trim().toLowerCase();
    let list = grammarByLevel(f.level).filter(function (g) {
      if (f.tag !== "all" && g.tag !== f.tag) return false;
      if (f.status === "done" && !state.known[g.id]) return false;
      if (f.status === "new" && state.known[g.id]) return false;
      if (f.status === "star" && !state.starred[g.id]) return false;
      if (f.status === "weak" && !isWeak(g.id)) return false;
      if (q && grammarHaystack(g).indexOf(q) === -1) return false;
      return true;
    });
    if (f.sort === "reading") {
      list = list.slice().sort(function (a, b) {
        return (a.reading || a.pattern).localeCompare(b.reading || b.pattern, "ja");
      });
    }
    return list;
  }

  function grammarCardHTML(g) {
    const done = !!state.known[g.id];
    const starred = !!state.starred[g.id];
    return '<article class="card gcard' + (done ? " is-done" : "") + (starred ? " is-starred" : "") + '" data-id="' + g.id + '">' +
      '<div class="gcard-top"><div><h3 class="pattern">' + esc(g.pattern) + "</h3>" +
      (g.reading ? '<p class="reading">' + esc(g.reading) + "</p>" : "") + "</div>" +
      '<div class="card-badges"><span class="badge lvl">' + esc(g.level || "N1") + "</span>" +
      '<span class="badge tag">' + esc(window.tagLabel("grammar", g.tag, state.lang)) + "</span></div></div>" +
      '<div class="meanings">' + meaningRows(g) + "</div>" +
      '<p class="formation"><span class="k">' + esc(t("formation")) + "</span><span>" +
      esc(g.formation[state.lang] || g.formation.en) + "</span></p>" +
      '<details class="more"><summary>' + esc(t("examples")) + (g.note ? " · " + esc(t("note")) : "") + "</summary>" +
      '<div class="examples">' + g.examples.map(function (ex) { return exampleHTML(ex); }).join("") + "</div>" +
      (g.note ? '<p class="note"><span class="k">' + esc(t("note")) + "</span><span>" +
        esc(g.note[state.lang] || g.note.en) + "</span></p>" : "") +
      (g.similar && g.similar.length ? '<p class="similar"><span class="k">' + esc(t("similar")) + "</span><span>" +
        esc(g.similar.join("  ·  ")) + "</span></p>" : "") +
      "</details>" +
      '<div class="card-actions">' +
      '<button class="btn tiny' + (done ? " is-done" : "") + '" data-act="done">' + esc(t(done ? "unmarkDone" : "markDone")) + "</button>" +
      '<button class="btn tiny ghost' + (starred ? " is-starred" : "") + '" data-act="star">' + esc(starred ? "★ " + t("unstar") : "☆ " + t("star")) + "</button>" +
      '<button class="btn tiny ghost" data-act="quiz">' + esc(t("practice")) + "</button>" +
      "</div></article>";
  }

  function moreButton(kind, rest) {
    return '<button class="btn ghost load-more" data-more="' + kind + '">' +
      esc(t("loadMore")) + " (" + rest + ")</button>";
  }

  function renderGrammar() {
    const list = filteredGrammar();
    const shown = list.slice(0, ui.grammar.limit);
    const wrap = $("#grammarList");
    wrap.innerHTML = shown.length ?
      shown.map(grammarCardHTML).join("") + (list.length > shown.length ? moreButton("grammar", list.length - shown.length) : "") :
      '<p class="empty-note">' + esc(t("emptyGrammar")) + "</p>";
    $("#grammarCount").textContent = t("found", { n: list.length });
    $$("#grammarLevel button").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.level === ui.grammar.level);
    });
    renderTags("grammar", $("#grammarTags"));
    if ($("#grammarSearch").value !== ui.grammar.q) $("#grammarSearch").value = ui.grammar.q;
  }

  function renderTags(kind, container) {
    const cur = kind === "grammar" ? ui.grammar.tag : ui.vocab.tag;
    const tags = tagsOf(kind);
    const html = ['<button class="chip' + (cur === "all" ? " is-active" : "") + '" data-tag="all">' +
      esc(t("tagAll")) + "</button>"].concat(tags.map(function (tag) {
        return '<button class="chip' + (cur === tag ? " is-active" : "") + '" data-tag="' + tag + '">' +
          esc(window.tagLabel(kind, tag, state.lang)) + "</button>";
      }));
    container.innerHTML = html.join("");
  }

  function syncCardState(card, item) {
    if (!card) return;
    const done = !!state.known[item.id];
    const starred = !!state.starred[item.id];
    card.classList.toggle("is-done", done);
    card.classList.toggle("is-starred", starred);
    const doneBtn = card.querySelector('[data-act="done"]');
    if (doneBtn) {
      doneBtn.classList.toggle("is-done", done);
      doneBtn.textContent = t(done ? (item.kind === "grammar" ? "unmarkDone" : "unmarkKnown") : (item.kind === "grammar" ? "markDone" : "markKnown"));
    }
    const starBtn = card.querySelector('[data-act="star"]');
    if (starBtn) {
      starBtn.textContent = starred ? "★ " + t("unstar") : "☆ " + t("star");
      starBtn.classList.toggle("is-starred", starred);
    }
  }

  /* ── vocabulary view ───────────────────── */

  function vocabHaystack(v) {
    return [v.kanji, v.kana, v.romaji, v.meaning.ja, v.meaning.en, v.meaning.ko,
      window.tagLabel("vocab", v.tag, state.lang), t("pos" + posKey(v.pos)),
      v.example.ja, v.example.en, v.example.ko].join(" ").toLowerCase();
  }

  function posKey(pos) {
    return { noun: "Noun", verb: "Verb", "i-adj": "IAdj", "na-adj": "NaAdj", adverb: "Adverb", idiom: "Idiom", expression: "Expression" }[pos] || "Noun";
  }

  function posLabel(v) { return t("pos" + posKey(v.pos)); }

  function filteredVocab() {
    const f = ui.vocab;
    const q = f.q.trim().toLowerCase();
    let list = VOCAB.filter(function (v) {
      if (f.tag !== "all" && v.tag !== f.tag) return false;
      if (f.status === "done" && !state.known[v.id]) return false;
      if (f.status === "new" && state.known[v.id]) return false;
      if (f.status === "star" && !state.starred[v.id]) return false;
      if (f.status === "weak" && !isWeak(v.id)) return false;
      if (q && vocabHaystack(v).indexOf(q) === -1) return false;
      return true;
    });
    if (f.sort === "reading") {
      list = list.slice().sort(function (a, b) { return a.kana.localeCompare(b.kana, "ja"); });
    }
    return list;
  }

  function vocabCardHTML(v) {
    const known = !!state.known[v.id];
    const starred = !!state.starred[v.id];
    return '<article class="card vcard' + (known ? " is-done" : "") + (starred ? " is-starred" : "") + '" data-id="' + v.id + '">' +
      '<div class="v-top"><div><h3 class="v-word">' + esc(v.kanji) + "</h3>" +
      '<p class="v-kana">' + (v.kana !== v.kanji ? esc(v.kana) + " " : "") + "<span>" + esc(v.romaji) + "</span></p></div>" +
      '<span class="badge tag" data-tag="' + esc(v.tag) + '">' + esc(window.tagLabel("vocab", v.tag, state.lang)) + "</span></div>" +
      '<div class="meanings">' + meaningRows(v) + "</div>" +
      '<div class="v-ex">' + exampleHTML(v.example) + "</div>" +
      '<div class="card-actions">' +
      '<button class="btn tiny' + (known ? " is-done" : "") + '" data-act="done">' + esc(t(known ? "unmarkKnown" : "markKnown")) + "</button>" +
      '<button class="btn tiny ghost' + (starred ? " is-starred" : "") + '" data-act="star">' + esc(starred ? "★ " + t("unstar") : "☆ " + t("star")) + "</button>" +
      '<button class="btn tiny ghost" data-act="quiz">' + esc(t("practice")) + "</button>" +
      "</div></article>";
  }

  function renderVocab() {
    const list = filteredVocab();
    const isCards = ui.vocab.mode === "cards";
    $("#vocabList").hidden = isCards;
    $("#flashWrap").hidden = !isCards;
    $$("#vocabMode button").forEach(function (b) { b.classList.toggle("is-active", b.dataset.mode === ui.vocab.mode); });

    if (isCards) {
      renderFlash(list);
    } else {
      const shown = list.slice(0, ui.vocab.limit);
      $("#vocabList").innerHTML = shown.length ?
        shown.map(vocabCardHTML).join("") + (list.length > shown.length ? moreButton("vocab", list.length - shown.length) : "") :
        '<p class="empty-note">' + esc(t("emptyVocab")) + "</p>";
    }
    $("#vocabCount").textContent = t("found", { n: list.length });
    renderTags("vocab", $("#vocabTags"));
    if ($("#vocabSearch").value !== ui.vocab.q) $("#vocabSearch").value = ui.vocab.q;
  }

  function renderFlash(list) {
    list = list || filteredVocab();
    const card = $("#flashcard");
    const controls = $(".flash-controls");
    const meta = $(".flash-meta");
    const dotsEl = $("#flashDots");
    const emptyEl = $("#flashEmpty");
    if (!list.length) {
      card.hidden = true;
      controls.hidden = true;
      meta.hidden = true;
      dotsEl.hidden = true;
      emptyEl.hidden = false;
      emptyEl.textContent = t("emptyVocab");
      return;
    }
    card.hidden = false;
    controls.hidden = false;
    meta.hidden = false;
    dotsEl.hidden = false;
    emptyEl.hidden = true;
    if (flashIndex >= list.length) flashIndex = 0;
    const v = list[flashIndex];
    flashFlipped = false;
    card.classList.remove("is-flipped");
    $("#flashTag").textContent = window.tagLabel("vocab", v.tag, state.lang) + " · " + posLabel(v);
    $("#flashWord").textContent = v.kanji;
    $("#flashKana").textContent = v.kana !== v.kanji ? v.kana : v.romaji;
    $("#flashBackWord").textContent = v.kanji;
    $("#flashBackKana").textContent = v.kana !== v.kanji ? v.kana + " · " + v.romaji : v.romaji;
    $("#flashPos").textContent = (flashIndex + 1) + " / " + list.length;
    $("#flashMeanings").innerHTML = langOrder().map(function (l, i) {
      return '<li class="' + (i === 0 ? "is-primary" : "") + '"><span class="lang-chip">' + l.toUpperCase() +
        "</span><span>" + esc(v.meaning[l]) + "</span></li>";
    }).join("");
    $("#flashEx").textContent = v.example.ja;
    $("#flashTr").textContent = exampleTranslation(v.example);
    const knownBtn = $("#flashKnown");
    const starred = !!state.starred[v.id];
    const known = !!state.known[v.id];
    knownBtn.textContent = t(known ? "unmarkKnown" : "markKnown");
    knownBtn.classList.toggle("is-done", known);
    $("#flashStar").textContent = starred ? "★ " + t("unstar") : "☆ " + t("star");

    const dots = $("#flashDots");
    if (list.length <= 60) {
      dots.innerHTML = list.map(function (x, i) {
        return '<i class="' + (i === flashIndex ? "is-now" : (state.known[x.id] ? "is-seen" : "")) + '"></i>';
      }).join("");
    } else {
      dots.innerHTML = "";
    }
  }

  function flashCurrentList() { return filteredVocab(); }

  function bindFlashButtons() {
    const card = $("#flashcard");
    const flip = function () {
      flashFlipped = !flashFlipped;
      card.classList.toggle("is-flipped", flashFlipped);
    };
    card.addEventListener("click", function (e) {
      if (e.target.closest(".speak")) return;
      flip();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    });
    $("#flashPrev").addEventListener("click", function () {
      const list = flashCurrentList();
      if (!list.length) return;
      flashIndex = (flashIndex - 1 + list.length) % list.length;
      renderFlash(list);
    });
    $("#flashNext").addEventListener("click", function () {
      const list = flashCurrentList();
      if (!list.length) return;
      flashIndex = (flashIndex + 1) % list.length;
      renderFlash(list);
    });
    $("#flashKnown").addEventListener("click", function () {
      const list = flashCurrentList();
      const v = list[flashIndex];
      if (!v) return;
      toggleKnown(v);
      renderFlash(list);
    });
    $("#flashStar").addEventListener("click", function () {
      const list = flashCurrentList();
      const v = list[flashIndex];
      if (!v) return;
      toggleStar(v);
      renderFlash(list);
    });
    $("#flashSpeak").addEventListener("click", function () {
      const text = $("#flashEx").textContent;
      if (text) speak(text);
    });
  }

  /* ── toggles ───────────────────────────── */

  function toggleKnown(item) {
    if (state.known[item.id]) {
      delete state.known[item.id];
      toast(t(item.kind === "grammar" ? "toastUndone" : "toastUnknown"));
    } else {
      state.known[item.id] = true;
      addActivity("study", 1);
      toast(t(item.kind === "grammar" ? "toastDone" : "toastKnown"));
    }
    save();
  }

  function toggleStar(item) {
    if (state.starred[item.id]) {
      delete state.starred[item.id];
      toast(t("toastUnstar"));
    } else {
      state.starred[item.id] = true;
      toast(t("toastStar"));
    }
    save();
  }

  /* ── home ──────────────────────────────── */

  function goalStatHTML(value, label) {
    return '<div class="goal-stat"><strong>' + esc(String(value)) + "</strong><small>" + esc(label) + "</small></div>";
  }

  function dailyGoalCardHTML() {
    const a = todayActivity();
    const done = dailyTotal(a);
    const goal = dailyGoalValue();
    const met = done >= goal;
    const p = Math.min(100, Math.round((done / goal) * 100));
    const remaining = Math.max(0, goal - done);
    const acc = todayAccuracy(a);
    const due = dueList().length;
    const newCount = Math.min(10, newList().length);
    const gs = goalStreak();
    return '<div class="daily-goal-inner' + (met ? " is-met" : "") + '">' +
      '<div class="goal-ring-wrap">' +
      '<div class="goal-ring" style="--p:' + p + '%" role="img" aria-label="' +
      esc(t("dailyGoalTitle") + ": " + done + " / " + goal) + '">' +
      '<span class="goal-ring-inner"><strong>' + done + "</strong><small>/ " + goal + "</small></span></div>" +
      (met ? '<span class="goal-check" aria-hidden="true">✓</span>' : "") +
      "</div>" +
      '<div class="goal-copy">' +
      '<div class="goal-head"><div><h3>' + esc(t("dailyGoalTitle")) + "</h3>" +
      '<p class="goal-sub">' + esc(t("dailyGoalSub")) + "</p></div>" +
      '<span class="goal-badge' + (met ? " is-met" : "") + '">' +
      esc(met ? t("goalMet") : t("goalRemaining", { n: remaining })) + "</span></div>" +
      '<div class="goal-stats">' +
      goalStatHTML(a.review, t("todayReview")) +
      goalStatHTML(a.quiz, t("todayQuiz")) +
      goalStatHTML(a.study, t("todayStudy")) +
      goalStatHTML(gs, t("goalStreak")) +
      "</div>" +
      '<p class="goal-meta">' +
      esc(acc == null ? (a.quiz ? t("todayAccuracyNA") : t("todayNoQuiz")) : t("todayAccuracy", { n: acc })) +
      " · " + esc(t("goalStreakHint")) +
      "</p>" +
      '<div class="goal-actions">' +
      '<button class="btn small primary" data-go="review">' +
      esc(due ? t("reviewDue", { n: due }) : t("reviewNew", { n: newCount })) + "</button>" +
      '<button class="btn small ghost" data-go="quiz">' + esc(t("heroStart")) + "</button>" +
      '<button class="btn small ghost" data-go="progress">' + esc(t("goalChange")) + "</button>" +
      "</div></div></div>";
  }

  function renderDailyGoalCard() {
    const el = $("#dailyGoalCard");
    if (el) el.innerHTML = dailyGoalCardHTML();
  }

  function dailyProgressHTML() {
    const a = todayActivity();
    const done = dailyTotal(a);
    const goal = dailyGoalValue();
    const met = done >= goal;
    const p = Math.min(100, Math.round((done / goal) * 100));
    const remaining = Math.max(0, goal - done);
    const acc = todayAccuracy(a);
    const due = dueList().length;
    const gs = goalStreak();
    const options = [10, 20, 30, 50, 100].map(function (n) {
      return '<button data-daily-goal="' + n + '" class="' + (n === goal ? "is-active" : "") + '">' + n + "</button>";
    }).join("");
    return '<div class="goal-head"><div><h3>' + esc(t("todayProgress")) + "</h3>" +
      '<p class="goal-sub">' + esc(t("dailyGoalSub")) + "</p></div>" +
      '<div class="segmented goal-options" role="group" aria-label="' + esc(t("dailyGoalSet")) + '">' +
      options + "</div></div>" +
      '<div class="daily-meter">' +
      '<div class="daily-meter-top"><strong>' + done + "</strong><small>/ " + goal + "</small>" +
      '<span class="goal-badge' + (met ? " is-met" : "") + '">' +
      esc(met ? t("goalMet") : t("goalRemaining", { n: remaining })) + "</span></div>" +
      '<div class="bar daily-bar"><span style="width:' + p + '%"></span></div></div>' +
      '<div class="daily-progress-stats">' +
      goalStatHTML(a.review, t("todayReview")) +
      goalStatHTML(a.quiz, t("todayQuiz")) +
      goalStatHTML(a.study, t("todayStudy")) +
      goalStatHTML(acc == null ? "—" : acc + "%", t("todayAccuracyLabel")) +
      goalStatHTML(due, t("statDue")) +
      goalStatHTML(gs, t("goalStreak")) +
      "</div>";
  }

  function renderDailyProgress() {
    const el = $("#dailyProgress");
    if (el) el.innerHTML = dailyProgressHTML();
  }

  function statCard(label, value, unit, percent, hint) {
    return '<div class="stat"><span class="stat-label">' + esc(label) + "</span>" +
      '<span class="stat-value">' + value + (unit ? "<small>" + esc(unit) + "</small>" : "") + "</span>" +
      (percent != null ?
        '<span class="stat-foot"><span class="bar"><span style="width:' + percent + '%"></span></span>' +
        '<span class="hint">' + percent + "%</span></span>" :
        '<span class="stat-foot"><span class="hint">' + esc(hint || "") + "</span></span>") +
      "</div>";
  }

  function renderHome() {
    renderDailyGoalCard();
    const a = todayActivity();
    const acc = todayAccuracy(a);
    const due = dueList().length;
    const newCount = Math.min(10, newList().length);
    $("#homeStats").innerHTML =
      statCard(t("statDue"), due, "", null, due ? t("todayDueHint", { n: due }) : t("reviewEmptyPill")) +
      statCard(t("todayQuiz"), a.quiz, "", null, acc == null ? (a.quiz ? t("todayAccuracyNA") : t("todayNoQuiz")) : t("todayAccuracy", { n: acc })) +
      statCard(t("todayNew"), newCount, "", null, t("todayNewHint", { n: newCount })) +
      statCard(t("statGoalStreak"), goalStreak(), t("statUnitDay"), null, t("goalStreakHint"));

    const dailyGrammarPool = grammarByLevel(ui.grammar.level);
    const g = dailyGrammarPool[dayIndex(dailyGrammarPool.length)] || GRAMMAR[0];
    const ex = g.examples[0];
    $("#dailyGrammar").innerHTML =
      '<div class="panel-head"><h3>' + esc(t("todayGrammar")) + '</h3><span class="panel-note">' +
      esc(g.level || "N1") + " · " + esc(window.tagLabel("grammar", g.tag, state.lang)) + "</span></div>" +
      '<div class="daily-pattern">' + esc(g.pattern) + "</div>" +
      '<p class="daily-meaning">' + esc(currentTranslation(g.meaning)) + "</p>" +
      '<blockquote class="daily-ex">' + esc(ex.ja) + "<small>" + esc(exampleTranslation(ex)) + "</small></blockquote>" +
      '<div class="daily-actions"><button class="btn small primary" data-quiz-focus="' + g.id + '">' +
      esc(t("practice")) + '</button><button class="btn small ghost" data-go="grammar">' + esc(t("viewAll")) + "</button></div>";

    const v = VOCAB[dayIndex(VOCAB.length)];
    $("#dailyWord").innerHTML =
      '<div class="panel-head"><h3>' + esc(t("todayWord")) + '</h3><span class="panel-note">' +
      esc(posLabel(v)) + "</span></div>" +
      '<div class="daily-word-row"><span class="daily-word">' + esc(v.kanji) + '</span>' +
      '<span class="daily-kana">' + (v.kana !== v.kanji ? esc(v.kana) + " · " : "") + esc(v.romaji) + "</span></div>" +
      '<div class="daily-meanings">' + langOrder().map(function (l) {
        return "<p><span class=\"lang-chip\">" + l.toUpperCase() + "</span>" + esc(v.meaning[l]) + "</p>";
      }).join("") + "</div>" +
      '<blockquote class="daily-ex">' + esc(v.example.ja) + "<small>" + esc(exampleTranslation(v.example)) + "</small></blockquote>" +
      '<div class="daily-actions"><button class="btn small primary" data-quiz-focus="' + v.id + '">' +
      esc(t("practice")) + '</button><button class="btn small ghost" data-go="vocab">' + esc(t("viewAll")) + "</button></div>";
  }

  /* ── quiz ──────────────────────────────── */

  function grammarPool(level) {
    return GRAMMAR.filter(function (g) {
      if (g.quiz === false) return false;
      if (level && level !== "all" && (g.level || "N1") !== level) return false;
      const ex = g.examples && g.examples[0];
      if (!ex) return false;
      const target = g.blankTarget || g.core;
      return !!target && ex.ja.indexOf(target) !== -1;
    });
  }

  function vocabPool() { return VOCAB.slice(); }

  function readingQuestionPool() {
    const out = [];
    READING.forEach(function (set) {
      (set.questions || []).forEach(function (q) {
        out.push({
          kind: "reading", id: q.id, set: set, question: q.question,
          options: q.options, answerIndex: q.answer, correctIndex: q.answer,
          explain: q.explain, passage: set.passage, title: set.title
        });
      });
    });
    return out;
  }

  function limitToWeak(pool) {
    const weak = pool.filter(function (x) { return isWeak(x.id); });
    return weak.length >= 4 ? weak : pool;
  }

  function pickDistractors(g, pool, blankText) {
    const cands = pool.filter(function (x) {
      return x.core !== g.core && blankText.indexOf(x.core) === -1;
    }).map(function (x) {
      let score = Math.random() * 2;
      if (x.tag === g.tag) score += 3;
      if (x.core.charAt(0) === g.core.charAt(0)) score += 2;
      if (Math.abs(x.core.length - g.core.length) <= 2) score += 1;
      return { x: x, score: score };
    }).sort(function (a, b) { return b.score - a.score; });
    const out = [];
    const seen = {};
    for (let i = 0; i < cands.length && out.length < 3; i++) {
      if (seen[cands[i].x.core]) continue;
      seen[cands[i].x.core] = true;
      out.push(cands[i].x);
    }
    return out;
  }

  function grammarQuestion(g, pool) {
    const ex = g.examples[0];
    const target = g.blankTarget || g.core;
    const idx = ex.ja.indexOf(target);
    if (idx === -1) return null;
    const blank = ex.ja.slice(0, idx) + "＿＿＿" + ex.ja.slice(idx + target.length);
    const distract = pickDistractors(g, pool, blank);
    if (distract.length < 3) return null;
    const options = shuffle([g.core].concat(distract.map(function (d) { return d.core; })));
    return {
      kind: "grammar", type: "blank", item: g, blank: blank, example: ex,
      options: options, answer: g.core, correctIndex: options.indexOf(g.core)
    };
  }

  function vocabLabel(v, type) {
    return type === "reading" ? v.kana : v.kanji;
  }

  function canQuizVocab(v) {
    return /[\u4E00-\u9FFF]/.test(v.kanji) && v.kanji !== v.kana;
  }

  function maskedReadingWord(v) {
    return v.kanji.replace(/[\u3040-\u30FF]+/g, "〇");
  }

  function definitionPrompt(v) {
    let text = v.meaning.ja || "";
    if (v.kanji) text = text.split(v.kanji).join("〇");
    if (v.kana && v.kana !== v.kanji) text = text.split(v.kana).join("〇");
    return text;
  }

  function hasHomophone(v) {
    return VOCAB.some(function (x) { return x.id !== v.id && x.kana === v.kana; });
  }

  function readingVariants(v, n) {
    const reading = v.kana;
    if (!/^[\u3040-\u30FF]+$/.test(reading) || reading.length < 3) return [];
    const kanjiTail = tailKana(v.kanji, 3);
    const suffixLen = kanjiTail ? Math.min(2, kanjiTail.length) : 1;
    const suffix = reading.slice(-suffixLen);
    const prefix = reading.slice(0, -suffixLen);
    if (!prefix) return [];
    const out = [];
    const seen = {};
    seen[reading] = true;
    const add = function (s) {
      if (!s || seen[s] || !/^[\u3040-\u30FF]+$/.test(s)) return;
      if (s.length < 3 || s.length > reading.length + 1) return;
      if (/っ[あいうえお]/.test(s) || /っ[がぎぐげござじずぜぞだぢづでどばびぶべぼ]/.test(s)) return;
      if (/ん[あいうえお]/.test(s)) return;
      seen[s] = true;
      out.push(s);
    };
    const last = prefix.slice(-1);
    if ("おこそとのほもよろごぞどぼぽ".indexOf(last) !== -1) add(prefix + "う" + suffix);
    if ("えけせてねへめれげぜでべぺ".indexOf(last) !== -1) add(prefix + "い" + suffix);
    const pairs = [
      ["か", "が"], ["き", "ぎ"], ["く", "ぐ"], ["け", "げ"], ["こ", "ご"],
      ["さ", "ざ"], ["し", "じ"], ["す", "ず"], ["せ", "ぜ"], ["そ", "ぞ"],
      ["た", "だ"], ["ち", "ぢ"], ["つ", "づ"], ["て", "で"], ["と", "ど"],
      ["は", "ば"], ["ひ", "び"], ["ふ", "ぶ"], ["へ", "べ"], ["ほ", "ぼ"],
      ["は", "ぱ"], ["ひ", "ぴ"], ["ふ", "ぷ"], ["へ", "ぺ"], ["ほ", "ぽ"]
    ];
    for (let i = 0; i < pairs.length; i++) {
      const idx = prefix.indexOf(pairs[i][0]);
      if (idx !== -1) add(prefix.slice(0, idx) + pairs[i][1] + prefix.slice(idx + 1) + suffix);
    }
    const suffixFirst = suffix.charAt(0);
    if ("かきくけこさしすせそたちつてとはひふへほ".indexOf(suffixFirst) !== -1) add(prefix + "っ" + suffix);
    if (prefix.indexOf("っ") !== -1) add(prefix.replace("っ", "") + suffix);
    add(prefix + "ん" + suffix);
    return out.slice(0, n);
  }

  function blankContext(v) {
    const s = v.example.ja || "";
    if (!s) return null;
    const forms = [v.kanji, v.kana, (v.kanji || "").replace(/[ぁ-ん]+$/, ""),
      (v.kana || "").replace(/[るうくすつぬぶむぐず]$/, "")].filter(Boolean);
    forms.sort(function (a, b) { return b.length - a.length; });
    for (let i = 0; i < forms.length; i++) {
      const f = forms[i];
      const idx = s.indexOf(f);
      if (idx === -1) continue;
      const blanked = s.slice(0, idx) + "＿＿＿" + s.slice(idx + f.length);
      const rest = blanked.replace("＿＿＿", "").replace(/[\s。、！？「」『』（）]/g, "");
      if (rest.length < 6) continue;
      return blanked;
    }
    return null;
  }

  function pickVocabType(v) {
    if (!canQuizVocab(v)) {
      return blankContext(v) && Math.random() < 0.5 ? "context" : "definition";
    }
    if (hasHomophone(v)) return Math.random() < 0.6 ? "reading" : "context";
    const types = ["reading", "reading", "reading", "context", "context", "kanji", "definition"];
    return types[Math.floor(Math.random() * types.length)];
  }

  function readingSimilarity(base, cand) {
    let score = Math.random();
    if (cand.tag === base.tag) score += 2;
    if (cand.pos === base.pos) score += 1;
    score += Math.max(0, 4 - Math.abs(cand.kana.length - base.kana.length));
    if (cand.kanji === base.kanji) score -= 100;
    return score;
  }

  function tailKana(text, n) {
    const m = String(text || "").match(/[\u3040-\u30FF]+$/);
    if (!m) return "";
    return m[0].slice(-n);
  }

  function suffixCandidates(base, type, pool) {
    const textOf = function (x) { return type === "reading" ? x.kana : x.kanji; };
    const baseText = textOf(base);
    const tails = [tailKana(baseText, 3), tailKana(baseText, 2), tailKana(baseText, 1)];
    for (let i = 0; i < tails.length; i++) {
      const tail = tails[i];
      if (!tail) continue;
      const matches = pool.filter(function (x) {
        return x.id !== base.id && textOf(x) !== baseText && textOf(x).endsWith(tail);
      });
      const unique = {};
      matches.forEach(function (x) { unique[textOf(x)] = true; });
      if (Object.keys(unique).length >= 3) return matches;
    }
    return pool;
  }

  function vocabQuestion(v, type, pool) {
    const valid = ["reading", "kanji", "context", "definition"];
    if (valid.indexOf(type) === -1) return null;
    if ((type === "reading" || type === "kanji") && !canQuizVocab(v)) return null;
    if (type === "kanji" && hasHomophone(v)) return null;
    if (type === "context" && !blankContext(v)) return null;

    if (type === "reading") {
      const labels = [];
      const seenLabel = {};
      seenLabel[v.kana] = true;
      const addLabel = function (s) {
        if (!s || seenLabel[s] || !/^[\u3040-\u30FF]+$/.test(s)) return;
        seenLabel[s] = true;
        labels.push(s);
      };
      readingVariants(v, 2).forEach(addLabel);
      suffixCandidates(v, "reading", pool).forEach(function (x) { addLabel(x.kana); });
      if (labels.length < 3) {
        pool.slice().sort(function (a, b) {
          return Math.abs(a.kana.length - v.kana.length) - Math.abs(b.kana.length - v.kana.length);
        }).forEach(function (x) { addLabel(x.kana); });
      }
      if (labels.length < 3) return null;
      const correct = v;
      const opts = [correct].concat(labels.slice(0, 3).map(function (x) {
        return { kanji: x, kana: x };
      }));
      const shuffled = shuffle(opts);
      return {
        kind: "vocab", type: "reading", item: v, options: shuffled, answer: v,
        prompt: null, correctIndex: shuffled.indexOf(correct)
      };
    }

    const samePos = pool.filter(function (x) { return x.id !== v.id && x.pos === v.pos; });
    const samePosTag = samePos.filter(function (x) { return x.tag === v.tag; });
    const usable = type === "kanji" ? pool.filter(canQuizVocab) : pool;
    let cands;
    if (type === "kanji") {
      cands = suffixCandidates(v, type, usable)
        .sort(function (a, b) { return readingSimilarity(v, b) - readingSimilarity(v, a); })
        .filter(function (x) { return x.kana !== v.kana; });
    } else if (type === "context") {
      cands = shuffle(samePosTag).concat(shuffle(samePos.filter(function (x) { return x.tag !== v.tag; })));
      if (cands.length < 3) {
        cands = cands.concat(shuffle(pool.filter(function (x) { return x.id !== v.id; })));
      }
    } else {
      cands = shuffle(samePosTag).concat(shuffle(usable.filter(function (x) {
        return x.id !== v.id && x.tag !== v.tag;
      })));
    }
    const options = [v];
    const seen = {};
    seen[vocabLabel(v, type)] = true;
    for (let i = 0; i < cands.length && options.length < 4; i++) {
      const label = vocabLabel(cands[i], type);
      if (!label || seen[label]) continue;
      seen[label] = true;
      options.push(cands[i]);
    }
    if (options.length < 4) return null;
    const shuffled = shuffle(options);
    return {
      kind: "vocab", type: type, item: v, options: shuffled, answer: v,
      prompt: type === "context" ? blankContext(v) : type === "definition" ? definitionPrompt(v) : null,
      correctIndex: shuffled.indexOf(v)
    };
  }

  function makeVocabQuestion(v, pool) {
    const types = canQuizVocab(v) ? ["reading", "context", "kanji", "definition"] : ["context", "definition"];
    const first = pickVocabType(v);
    if (first) {
      const q = vocabQuestion(v, first, pool);
      if (q) return q;
    }
    for (let i = 0; i < types.length; i++) {
      if (types[i] === first) continue;
      const q = vocabQuestion(v, types[i], pool);
      if (q) return q;
    }
    return null;
  }

  function buildQuiz(opts) {
    opts = opts || {};
    const type = opts.type || ui.quiz.type;
    const count = opts.count || ui.quiz.count;
    const weak = opts.weak == null ? ui.quiz.weak : opts.weak;
    const grammarLevel = opts.grammarLevel || ui.quiz.grammarLevel || "N1";
    let gPool = grammarPool(grammarLevel);
    let vPool = vocabPool();
    if (weak) { gPool = limitToWeak(gPool); vPool = limitToWeak(vPool); }

    const questions = [];
    if (opts.focus) {
      const item = byId(opts.focus);
      if (item) {
        const q = item.kind === "grammar" ?
          grammarQuestion(item, grammarPool(item.level || "N1")) :
          makeVocabQuestion(item, vPool);
        if (q) questions.push(q);
      }
    }

    const wantR = type === "reading" ? count : type === "mixed" ? Math.min(count, Math.max(1, Math.round(count * 0.2))) : 0;
    const rest = count - wantR;
    const wantG = type === "grammar" ? rest : type === "vocab" || type === "reading" ? 0 : Math.ceil(rest / 2);
    const wantV = type === "vocab" ? rest : type === "grammar" || type === "reading" ? 0 : rest - wantG;

    const gUsed = {};
    const vUsed = {};
    const gShuffled = shuffle(gPool);
    const vShuffled = shuffle(vPool);
    let vi = 0;

    while (questions.filter(function (q) { return q.kind === "grammar"; }).length < wantG) {
      let added = false;
      for (let i = 0; i < gShuffled.length; i++) {
        const g = gShuffled[i];
        if (gUsed[g.id]) continue;
        const q = grammarQuestion(g, gPool);
        gUsed[g.id] = true;
        if (q) { questions.push(q); added = true; }
        break;
      }
      if (!added && Object.keys(gUsed).length >= gShuffled.length) break;
      if (!added && gShuffled.every(function (g) { return gUsed[g.id]; })) break;
    }

    while (questions.filter(function (q) { return q.kind === "vocab"; }).length < wantV) {
      if (vi >= vShuffled.length) break;
      const v = vShuffled[vi++];
      if (vUsed[v.id]) continue;
      vUsed[v.id] = true;
      const q = makeVocabQuestion(v, vPool);
      if (q) questions.push(q);
    }

    if (wantR > 0) {
      const rPool = shuffle(readingQuestionPool());
      for (let i = 0; i < rPool.length &&
        questions.filter(function (q) { return q.kind === "reading"; }).length < wantR; i++) {
        questions.push(rPool[i]);
      }
    }

    let list = questions;
    if (type === "mixed") list = shuffle(list);
    return list.slice(0, count);
  }

  function startQuiz(opts) {
    opts = opts || {};
    const questions = buildQuiz(opts);
    if (!questions.length) {
      toast(t("emptyGrammar"));
      return;
    }
    quiz = {
      questions: questions, index: 0, answered: false, selected: -1,
      correct: 0, wrong: [], phase: "play", type: opts.type || ui.quiz.type
    };
    showView("quiz");
    renderQuiz();
  }

  function renderQuiz() {
    const setup = $("#quizSetup");
    const play = $("#quizPlay");
    const done = $("#quizDone");
    if (!quiz) {
      setup.hidden = false; play.hidden = true; done.hidden = true;
      $$("#quizTypes .type-card").forEach(function (b) {
        const on = b.dataset.type === ui.quiz.type;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-checked", on ? "true" : "false");
      });
      $$("#quizCount button").forEach(function (b) {
        b.classList.toggle("is-active", Number(b.dataset.count) === ui.quiz.count);
      });
      const showLevel = ui.quiz.type === "grammar" || ui.quiz.type === "mixed";
      $("#quizLevelRow").hidden = !showLevel;
      $$("#quizLevel button").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.level === ui.quiz.grammarLevel);
      });
      $("#quizWeakOnly").checked = !!ui.quiz.weak;
      return;
    }
    setup.hidden = true;
    if (quiz.phase === "play") {
      play.hidden = false; done.hidden = true;
      renderQuizPlay();
    } else {
      play.hidden = true; done.hidden = false;
      renderQuizDone();
    }
  }

  function renderQuizPlay() {
    const q = quiz.questions[quiz.index];
    if (!q) return;
    $("#quizCounter").textContent = t("quizOf", { n: quiz.index + 1, total: quiz.questions.length });
    $("#quizBarFill").style.width = ((quiz.index + 1) / quiz.questions.length * 100) + "%";
    $("#quizKind").textContent = q.kind === "reading" ? t("quizReading") :
      q.kind === "grammar" ? t("quizGrammar") : t("quizVocab");

    const prompt = $("#quizPrompt");
    const passage = $("#quizPassage");
    if (q.kind === "reading") {
      passage.hidden = false;
      const title = q.title ? (q.title[state.lang] || q.title.ja) : "";
      passage.innerHTML = (title ? '<p class="passage-title">' + esc(title) + "</p>" : "") +
        '<div class="passage-text">' + esc(q.passage).replace(/\n/g, "<br>") + "</div>";
      prompt.innerHTML = '<span style="font-size:.84em">' + esc(q.question) + "</span>";
      $("#quizSub").textContent = t("readingInstruction");
    } else if (q.kind === "grammar") {
      passage.hidden = true;
      passage.innerHTML = "";
      prompt.innerHTML = esc(q.blank).replace("＿＿＿", '<span class="blank">?</span>');
      $("#quizSub").textContent = t("blankQuestion");
    } else if (q.type === "reading") {
      passage.hidden = true;
      passage.innerHTML = "";
      prompt.innerHTML = '<span class="q-word">' + esc(maskedReadingWord(q.item)) + "</span>";
      $("#quizSub").textContent = t("readingQuestion");
    } else if (q.type === "kanji") {
      passage.hidden = true;
      passage.innerHTML = "";
      prompt.innerHTML = '<span class="q-word">' + esc(q.item.kana) + "</span>";
      $("#quizSub").textContent = t("kanjiQuestion");
    } else if (q.type === "context") {
      passage.hidden = true;
      passage.innerHTML = "";
      prompt.innerHTML = '<span style="font-size:.82em">' +
        esc(q.prompt || "").replace("＿＿＿", '<span class="blank">?</span>') + "</span>";
      $("#quizSub").textContent = t("contextQuestion");
    } else {
      passage.hidden = true;
      passage.innerHTML = "";
      prompt.innerHTML = '<span style="font-size:.8em">' + esc(q.prompt || definitionPrompt(q.item)) + "</span>";
      $("#quizSub").textContent = t("definitionQuestion");
    }

    const opts = $("#quizOptions");
    opts.innerHTML = q.options.map(function (opt, i) {
      const label = q.kind === "grammar" || q.kind === "reading" ? opt : vocabLabel(opt, q.type);
      return '<button class="option" data-i="' + i + '"><span class="opt-no">' + (i + 1) +
        '</span><span class="jp">' + esc(label) + "</span></button>";
    }).join("");

    $("#quizFeedback").hidden = true;
    $("#quizNext").hidden = true;

    if (quiz.answered && quiz.selected >= 0) {
      paintQuizAnswer(q, quiz.selected);
    } else {
      opts.querySelectorAll(".option").forEach(function (btn) {
        btn.disabled = false;
        btn.classList.remove("is-correct", "is-wrong", "is-dim");
      });
    }
  }

  function paintQuizAnswer(q, selected) {
    const ok = selected === q.correctIndex;
    $$("#quizOptions .option").forEach(function (btn, bi) {
      btn.disabled = true;
      btn.classList.remove("is-correct", "is-wrong", "is-dim");
      if (bi === q.correctIndex) btn.classList.add("is-correct");
      else if (bi === selected) btn.classList.add("is-wrong");
      else btn.classList.add("is-dim");
    });

    const fb = $("#quizFeedback");
    fb.hidden = false;
    const title = $("#fbTitle");
    title.textContent = t(ok ? "quizCorrect" : "quizWrong") + (ok ? " ✓" : " ✕");
    title.className = "fb-title " + (ok ? "ok" : "no");
    let explain;
    let answerText;
    if (q.kind === "grammar") {
      explain = "<span class='jp'>" + esc(q.item.pattern) + "</span> — " + esc(currentTranslation(q.item.meaning)) +
        "<br><span class='jp'>" + esc(q.example.ja) + "</span> — " + esc(exampleTranslation(q.example));
      answerText = q.answer;
    } else if (q.kind === "reading") {
      explain = "<span class='jp'>" + esc(q.options[q.answerIndex]) + "</span><br>" +
        esc(q.explain[state.lang] || q.explain.en);
      answerText = q.options[q.answerIndex];
    } else {
      const vocabHead = q.item.kana !== q.item.kanji ?
        esc(q.item.kanji) + "（" + esc(q.item.kana) + "）" : esc(q.item.kanji);
      const exTr = exampleTranslation(q.item.example);
      explain = "<span class='jp'>" + vocabHead + "</span> — " + esc(currentTranslation(q.item.meaning)) +
        "<br><span class='jp'>" + esc(q.item.example.ja) + "</span>" + (exTr ? " — " + esc(exTr) : "");
      answerText = vocabLabel(q.item, q.type);
    }
    $("#fbBody").innerHTML = explain +
      (ok ? "" : '<br><strong>' + esc(t("answerWas", { answer: answerText })) + "</strong>");
    $("#quizNext").hidden = false;
  }

  function answerQuiz(i) {
    if (!quiz || quiz.phase !== "play" || quiz.answered) return;
    const q = quiz.questions[quiz.index];
    if (i < 0 || i >= q.options.length) return;
    quiz.answered = true;
    quiz.selected = i;
    const ok = i === q.correctIndex;
    if (ok) quiz.correct++;

    if (q.kind === "reading") {
      state.quiz.asked++;
      if (ok) state.quiz.correct++;
      addActivity("quiz", 1);
      if (ok) addActivity("correct", 1);
      save();
    } else {
      // SRS + global stats
      const id = q.item.id;
      const s = state.srs[id] || { box: 0, due: 0, seen: 0, right: 0, wrong: 0 };
      s.seen = (s.seen || 0) + 1;
      if (ok) {
        s.right = (s.right || 0) + 1;
        s.box = Math.min(6, (s.box || 0) + 1);
        state.quiz.correct++;
      } else {
        s.wrong = (s.wrong || 0) + 1;
        s.box = 0;
      }
      s.due = Date.now() + BOX_DAYS[s.box] * DAY;
      state.srs[id] = s;
      state.quiz.asked++;
      addActivity("quiz", 1);
      if (ok) addActivity("correct", 1);
      save();
    }

    if (!ok) {
      let promptText;
      let answerText;
      if (q.kind === "grammar") {
        promptText = q.blank;
        answerText = q.answer;
      } else if (q.kind === "reading") {
        promptText = q.question;
        answerText = q.options[q.answerIndex];
      } else {
        promptText = q.type === "reading" ? maskedReadingWord(q.item) :
          q.type === "kanji" ? q.item.kana :
            (q.prompt || definitionPrompt(q.item));
        answerText = vocabLabel(q.item, q.type);
      }
      quiz.wrong.push({ kind: q.kind, prompt: promptText, answer: answerText });
    }

    paintQuizAnswer(q, i);
    updateQuizBar();
  }

  function updateQuizBar() {
    $("#quizBarFill").style.width = ((quiz.index + 1) / quiz.questions.length * 100) + "%";
  }

  function nextQuiz() {
    if (!quiz) return;
    if (quiz.index + 1 >= quiz.questions.length) {
      quiz.phase = "done";
      renderQuiz();
      return;
    }
    quiz.index++;
    quiz.answered = false;
    quiz.selected = -1;
    renderQuizPlay();
  }

  function renderQuizDone() {
    const pctv = pct(quiz.correct, quiz.questions.length);
    const ring = $("#scoreRing");
    ring.style.setProperty("--pct", pctv);
    $("#scoreValue").textContent = pctv + "%";
    $("#quizSummary").textContent = quiz.correct === quiz.questions.length ?
      t("quizPerfect") : t("quizSummary", { correct: quiz.correct, total: quiz.questions.length });
    $("#quizWrongList").innerHTML = quiz.wrong.length ? quiz.wrong.map(function (w) {
      return '<div class="wrong-item"><p class="w-q">' + esc(w.prompt) + '</p><p class="w-a">' +
        esc(t("answerWas", { answer: w.answer })) + "</p></div>";
    }).join("") : "";
    save();
  }

  /* ── review ────────────────────────────── */

  function startReview(fromNew) {
    let queue;
    if (fromNew) {
      queue = shuffle(newList()).slice(0, 10);
    } else {
      queue = dueList();
    }
    if (!queue.length) {
      toast(t("reviewEmptyPill"));
      return;
    }
    review = { queue: queue, index: 0, revealed: false, complete: false };
    renderReview();
  }

  function renderReview() {
    const due = dueList().length;
    const pill = $("#reviewPill");
    if (pill) {
      if (review && !review.complete) {
        pill.innerHTML = esc(t("reviewSession", { n: review.queue.length }));
      } else {
        pill.innerHTML = due ? t("reviewDue", { n: "<b>" + due + "</b>" }) : esc(t("reviewEmptyPill"));
      }
    }

    const empty = $("#reviewEmpty");
    const stage = $("#reviewStage");
    const completeEl = $("#reviewComplete");

    if (!review) {
      empty.hidden = false;
      stage.hidden = true;
      completeEl.hidden = true;
      $("#reviewNewBtn").textContent = t("reviewNewCards");
      return;
    }

    empty.hidden = true;
    completeEl.hidden = !review.complete;
    stage.hidden = !!review.complete;

    if (review.complete) {
      $("#reviewDoneText").textContent = t("reviewDoneD", { n: review.queue.length });
      return;
    }

    const entry = review.queue[review.index];
    if (!entry) { review.complete = true; renderReview(); return; }
    const item = entry.item;

    $("#reviewCounter").textContent = t("reviewCardOf", { n: review.index + 1, total: review.queue.length });
    $("#reviewBarFill").style.width = ((review.index + 1) / review.queue.length * 100) + "%";

    const front = $("#reviewFront");
    const back = $("#reviewBack");
    const kindEl = $("#reviewKind");
    kindEl.textContent = entry.kind === "grammar" ?
      t("navGrammar") + " · " + (item.level || "N1") :
      t("navVocab") + " · " + posLabel(item);

    if (entry.kind === "grammar") {
      const ex = item.examples[0];
      const idx = ex.ja.indexOf(item.core);
      const blanked = idx === -1 ? ex.ja : ex.ja.slice(0, idx) + "＿＿＿" + ex.ja.slice(idx + item.core.length);
      front.innerHTML = '<div class="review-pattern">' + esc(item.pattern) + "</div>" +
        '<p class="review-prompt-line">' + esc(item.formation[state.lang]) + "</p>" +
        '<p class="review-prompt-line jp" style="margin-top:12px">' + esc(blanked) + "</p>";
      back.innerHTML = '<div class="review-back-head">' + esc(item.pattern) + "</div>" +
        '<div class="meanings">' + meaningRows(item) + "</div>" +
        '<p class="review-prompt-line jp" style="margin-top:14px;display:flex;gap:8px;align-items:flex-start"><span>' +
        esc(ex.ja) + "</span>" + speakButton(ex.ja) + "</p>" +
        '<p class="review-prompt-line">' + esc(exampleTranslation(ex)) + "</p>" +
        (item.note ? '<p class="note"><span class="k">' + esc(t("note")) + "</span><span>" +
          esc(currentTranslation(item.note)) + "</span></p>" : "");
    } else {
      if (canQuizVocab(item)) {
        front.innerHTML = '<div class="review-word">' + esc(maskedReadingWord(item)) + "</div>" +
          '<p class="review-prompt-line">' + esc(t("readingQuestion")) + "</p>";
      } else {
        front.innerHTML = '<div class="review-def">' + esc(definitionPrompt(item)) + "</div>" +
          '<p class="review-prompt-line">' + esc(t("definitionQuestion")) + "</p>";
      }
      const backHead = item.kana !== item.kanji ?
        esc(item.kanji) + " <span>" + esc(item.kana) + "</span>" :
        esc(item.kanji) + " <span>" + esc(item.romaji) + "</span>";
      back.innerHTML = '<div class="review-back-head">' + backHead + "</div>" +
        '<div class="meanings">' + meaningRows(item) + "</div>" +
        '<p class="review-prompt-line jp" style="margin-top:14px;display:flex;gap:8px;align-items:flex-start"><span>' +
        esc(item.example.ja) + "</span>" + speakButton(item.example.ja) + "</p>" +
        '<p class="review-prompt-line">' + esc(exampleTranslation(item.example)) + "</p>";
    }

    back.hidden = !review.revealed;
    $("#reviewReveal").hidden = review.revealed;
    $("#reviewRatings").hidden = !review.revealed;

    // rebuild reveal/rating listeners are delegated; no need to re-bind
  }

  function rateReview(rating) {
    if (!review || review.complete) return;
    const entry = review.queue[review.index];
    if (!entry) return;
    const item = entry.item;
    const s = state.srs[item.id] || { box: 0, due: 0, seen: 0, right: 0, wrong: 0 };
    s.seen = (s.seen || 0) + 1;
    if (rating === "again") {
      s.box = 0;
      s.wrong = (s.wrong || 0) + 1;
    } else if (rating === "hard") {
      s.box = Math.max(1, (s.box || 1) - 1);
    } else {
      s.box = Math.min(6, (s.box || 0) + 1);
      s.right = (s.right || 0) + 1;
    }
    s.due = Date.now() + BOX_DAYS[s.box] * DAY;
    state.srs[item.id] = s;
    addActivity("review", 1);
    save();

    review.index++;
    review.revealed = false;
    if (review.index >= review.queue.length) review.complete = true;
    renderReview();
  }

  /* ── progress ──────────────────────────── */

  function barRow(label, value, total, color) {
    return '<div class="bar-row"><div class="bar-top"><span>' + esc(label) + "</span><span>" +
      value + " / " + total + "</span></div>" +
      '<div class="bar"><span class="' + (color || "") + '" style="width:' + pct(value, total) + '%"></span></div></div>';
  }

  function renderProgress() {
    renderDailyProgress();
    const gDone = GRAMMAR.filter(function (g) { return state.known[g.id]; }).length;
    const vKnown = VOCAB.filter(function (v) { return state.known[v.id]; }).length;
    const mastered = allItems().filter(function (x) { return isMastered(x.item.id); }).length;
    const acc = accuracy();

    $("#progressStats").innerHTML =
      statCard(t("progressGrammarDone"), gDone, "/ " + GRAMMAR.length, pct(gDone, GRAMMAR.length)) +
      statCard(t("progressVocabKnown"), vKnown, "/ " + VOCAB.length, pct(vKnown, VOCAB.length)) +
      statCard(t("progressMastered"), mastered, "/ " + (GRAMMAR.length + VOCAB.length), pct(mastered, GRAMMAR.length + VOCAB.length)) +
      statCard(t("progressQuizAvg"), acc, "%", null, t("progressStreakValue", { n: streak() }));

    const gMastered = GRAMMAR.filter(function (g) { return isMastered(g.id); }).length;
    const vMastered = VOCAB.filter(function (v) { return isMastered(v.id); }).length;
    $("#grammarBars").innerHTML =
      barRow(t("barDone"), gDone, GRAMMAR.length, "") +
      barRow(t("barMastered"), gMastered, GRAMMAR.length, "green");
    $("#vocabBars").innerHTML =
      barRow(t("barKnown"), vKnown, VOCAB.length, "") +
      barRow(t("barMastered"), vMastered, VOCAB.length, "green");

    // 14-day activity, scaled against the daily goal
    const goal = dailyGoalValue();
    const cols = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const act = activityOf(key);
      const total = dailyTotal(act);
      cols.push({ d: d, total: total, met: total >= goal, today: i === 0 });
    }
    const max = Math.max(goal, 1, Math.max.apply(null, cols.map(function (c) { return c.total; })));
    $("#activityChart").innerHTML = cols.map(function (c) {
      const h = c.total ? Math.max(8, Math.round(c.total / max * 100)) : 0;
      return '<div class="activity-col' + (c.today ? " is-today" : "") + (c.met ? " is-met" : "") + '">' +
        '<div class="activity-bar" title="' + c.total + " / " + goal + '" style="height:' + h + '%">' +
        (c.total ? "<span></span>" : "") + "</div>" +
        '<span class="activity-day">' + (c.d.getMonth() + 1) + "/" + c.d.getDate() + "</span></div>";
    }).join("");

    const due = dueList().length;
    const starred = Object.keys(state.starred).length;
    const today = todayActivity();
    const totalToday = dailyTotal(today);
    const tips = [];
    if (totalToday < goal) {
      tips.push('<li><span>' + esc(t("goalTip", { n: goal - totalToday })) +
        ' <button class="link" data-go="quiz">' + esc(t("navQuiz")) + "</button></span></li>");
    } else {
      tips.push('<li><span class="tip-done">' + esc(t("goalMetTip")) + "</span></li>");
    }
    if (due > 0) {
      tips.push('<li><span>' + esc(t("tipReview", { n: due })) +
        ' <button class="link" data-go="review">' + esc(t("reviewTitle")) + "</button></span></li>");
    }
    tips.push('<li><span>' + esc(t("tipQuiz")) +
      ' <button class="link" data-go="quiz">' + esc(t("navQuiz")) + "</button></span></li>");
    if (starred > 0) {
      tips.push('<li><span>' + esc(t("tipStar", { n: starred })) +
        ' <button class="link" data-go="grammar">' + esc(t("navGrammar")) + "</button></span></li>");
    }
    if (gDone === 0) tips.push('<li><span>' + esc(t("tipStart")) + "</span></li>");
    $("#progressTips").innerHTML = tips.join("");
  }

  /* ── controls / i18n ───────────────────── */

  const STATUS_KEYS = { all: "statusAll", new: "statusNew", done: "statusDone", star: "statusStar", weak: "statusWeak" };

  function fillSelects() {
    const make = function (sel, cur, kind) {
      sel.innerHTML = ["all", "new", "done", "star", "weak"].map(function (v) {
        return '<option value="' + v + '">' + esc(t(STATUS_KEYS[v])) + "</option>";
      }).join("");
      sel.value = cur;
      sel.onchange = function () {
        if (kind === "grammar") { ui.grammar.status = sel.value; ui.grammar.limit = 30; renderGrammar(); }
        else { ui.vocab.status = sel.value; ui.vocab.limit = 30; renderVocab(); }
      };
    };
    make($("#grammarStatus"), ui.grammar.status, "grammar");
    make($("#vocabStatus"), ui.vocab.status, "vocab");

    const makeSort = function (sel, cur, kind) {
      sel.innerHTML = '<option value="default">' + esc(t("sortDefault")) + "</option>" +
        '<option value="reading">' + esc(t("sortKana")) + "</option>";
      sel.value = cur;
      sel.onchange = function () {
        if (kind === "grammar") { ui.grammar.sort = sel.value; ui.grammar.limit = 30; renderGrammar(); }
        else { ui.vocab.sort = sel.value; ui.vocab.limit = 30; renderVocab(); }
      };
    };
    makeSort($("#grammarSort"), ui.grammar.sort, "grammar");
    makeSort($("#vocabSort"), ui.vocab.sort, "vocab");
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach(function (el) {
      const val = t(el.dataset.i18n);
      if (val.indexOf("<") !== -1) el.innerHTML = val;
      else el.textContent = val;
    });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    $$(".lang button").forEach(function (b) {
      const on = b.dataset.lang === state.lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $$("#quizTypes .type-card small").forEach(function (small) {
      const card = small.closest(".type-card");
      if (!card) return;
      const key = { mixed: "quizMixedD", grammar: "quizGrammarD", vocab: "quizVocabD", reading: "quizReadingD" }[card.dataset.type];
      if (key) small.textContent = t(key);
    });
    fillSelects();
    $("#themeBtn").setAttribute("aria-label", t("theme"));
    updateSyncUI();
  }

  function renderCurrentView() {
    const active = $(".view.is-active");
    const view = active ? active.dataset.view : "home";
    if (view === "home") renderHome();
    else if (view === "grammar") renderGrammar();
    else if (view === "vocab") renderVocab();
    else if (view === "quiz") renderQuiz();
    else if (view === "review") renderReview();
    else if (view === "progress") renderProgress();
  }

  function showView(name) {
    const valid = ["home", "grammar", "vocab", "quiz", "review", "progress"];
    if (valid.indexOf(name) === -1) name = "home";
    $$(".view").forEach(function (v) { v.classList.toggle("is-active", v.dataset.view === name); });
    $$(".tab").forEach(function (tb) {
      const on = tb.dataset.view === name;
      tb.classList.toggle("is-active", on);
      if (on) tb.setAttribute("aria-current", "page");
      else tb.removeAttribute("aria-current");
    });
    const fab = $("#fabQuiz");
    if (fab) fab.hidden = name === "quiz" || name === "review";
    if (name === "home") renderHome();
    else if (name === "grammar") renderGrammar();
    else if (name === "vocab") renderVocab();
    else if (name === "quiz") renderQuiz();
    else if (name === "review") renderReview();
    else if (name === "progress") renderProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
    try { history.replaceState(null, "", "#" + name); } catch (e) { /* file:// */ }
  }

  /* ── theme / language ──────────────────── */

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    const icon = $("#themeBtn span");
    if (icon) icon.textContent = state.theme === "dark" ? "☀" : "☾";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#121318" : "#FBF8FF");
  }

  function setLang(lang) {
    if (!I18N[lang]) return;
    state.lang = lang;
    save();
    applyI18n();
    renderCurrentView();
  }

  /* ── event wiring ──────────────────────── */

  function onDocumentClick(e) {
    const go = e.target.closest("[data-go]");
    if (go) {
      e.preventDefault();
      showView(go.dataset.go);
      return;
    }
    const focus = e.target.closest("[data-quiz-focus]");
    if (focus) {
      startQuiz({ type: byId(focus.dataset.quizFocus).kind, count: 1, focus: focus.dataset.quizFocus });
      return;
    }
    const start = e.target.closest("[data-start-quiz]");
    if (start) {
      const type = start.dataset.startQuiz;
      if (type === "grammar") {
        ui.quiz.grammarLevel = ui.grammar.level;
        state.quizGrammarLevel = ui.grammar.level;
        save();
      }
      startQuiz({ type: type, count: ui.quiz.count });
      return;
    }
    const speakEl = e.target.closest("[data-speak]");
    if (speakEl) {
      speak(speakEl.dataset.speak);
      return;
    }
    const langBtn = e.target.closest("[data-lang]");
    if (langBtn) { setLang(langBtn.dataset.lang); return; }
  }

  function handleCardAction(e) {
    const more = e.target.closest("[data-more]");
    if (more) {
      if (more.dataset.more === "grammar") { ui.grammar.limit += 30; renderGrammar(); }
      else { ui.vocab.limit += 30; renderVocab(); }
      return;
    }
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest("[data-id]");
    if (!card) return;
    const item = byId(card.dataset.id);
    if (!item) return;
    if (btn.dataset.act === "done") {
      toggleKnown(item);
      syncCardState(card, item);
    } else if (btn.dataset.act === "star") {
      toggleStar(item);
      syncCardState(card, item);
    } else if (btn.dataset.act === "quiz") {
      if (item.kind === "grammar") {
        ui.quiz.grammarLevel = item.level || "N1";
        state.quizGrammarLevel = ui.quiz.grammarLevel;
        save();
      }
      startQuiz({ type: item.kind, count: 1, focus: item.id });
    }
  }

  function wire() {
    // nav
    $("#nav").addEventListener("click", function (e) {
      const tab = e.target.closest(".tab");
      if (tab) showView(tab.dataset.view);
    });
    document.addEventListener("click", onDocumentClick);
    $("#themeBtn").addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
      save();
    });

    // M3 extended FAB
    $("#fabQuiz").addEventListener("click", function () {
      showView("quiz");
    });

    // M3 state-layer ripple
    document.addEventListener("pointerdown", function (e) {
      const el = e.target.closest(".btn, .tab, .chip, .option, .type-card, .rating, .icon-btn, .segmented button, .lang button, .fab, .speak");
      if (!el || el.disabled) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      el.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });

    // search + filters
    $("#grammarSearch").addEventListener("input", function (e) {
      ui.grammar.q = e.target.value;
      ui.grammar.limit = 30;
      renderGrammar();
    });
    $("#vocabSearch").addEventListener("input", function (e) {
      ui.vocab.q = e.target.value;
      ui.vocab.limit = 30;
      flashIndex = 0;
      renderVocab();
    });
    $("#grammarTags").addEventListener("click", function (e) {
      const chip = e.target.closest("[data-tag]");
      if (!chip) return;
      ui.grammar.tag = chip.dataset.tag;
      ui.grammar.limit = 30;
      renderGrammar();
    });
    $("#grammarLevel").addEventListener("click", function (e) {
      const b = e.target.closest("[data-level]");
      if (!b) return;
      ui.grammar.level = b.dataset.level;
      ui.quiz.grammarLevel = b.dataset.level;
      state.grammarLevel = b.dataset.level;
      state.quizGrammarLevel = b.dataset.level;
      ui.grammar.tag = "all";
      save();
      ui.grammar.limit = 30;
      renderGrammar();
    });
    $("#vocabTags").addEventListener("click", function (e) {
      const chip = e.target.closest("[data-tag]");
      if (!chip) return;
      ui.vocab.tag = chip.dataset.tag;
      ui.vocab.limit = 30;
      flashIndex = 0;
      renderVocab();
    });
    $("#grammarList").addEventListener("click", handleCardAction);
    $("#vocabList").addEventListener("click", handleCardAction);

    // vocab mode
    $("#vocabMode").addEventListener("click", function (e) {
      const b = e.target.closest("[data-mode]");
      if (!b) return;
      ui.vocab.mode = b.dataset.mode;
      flashIndex = 0;
      renderVocab();
    });

    // flash
    bindFlashButtons();

    // quiz setup
    $("#quizTypes").addEventListener("click", function (e) {
      const b = e.target.closest(".type-card");
      if (!b) return;
      ui.quiz.type = b.dataset.type;
      renderQuiz();
    });
    $("#quizCount").addEventListener("click", function (e) {
      const b = e.target.closest("[data-count]");
      if (!b) return;
      ui.quiz.count = Number(b.dataset.count);
      renderQuiz();
    });
    $("#quizLevel").addEventListener("click", function (e) {
      const b = e.target.closest("[data-level]");
      if (!b) return;
      ui.quiz.grammarLevel = b.dataset.level;
      state.quizGrammarLevel = b.dataset.level;
      save();
      renderQuiz();
    });
    $("#quizWeakOnly").addEventListener("change", function (e) { ui.quiz.weak = e.target.checked; });
    $("#quizStart").addEventListener("click", function () { startQuiz({ type: ui.quiz.type, count: ui.quiz.count, weak: ui.quiz.weak }); });
    $("#quizQuit").addEventListener("click", function () { quiz = null; renderQuiz(); });
    $("#quizNext").addEventListener("click", nextQuiz);
    $("#quizOptions").addEventListener("click", function (e) {
      const b = e.target.closest(".option");
      if (!b) return;
      answerQuiz(Number(b.dataset.i));
    });
    $("#quizAgain").addEventListener("click", function () {
      const type = quiz ? quiz.type : ui.quiz.type;
      const count = quiz ? quiz.questions.length : ui.quiz.count;
      startQuiz({ type: type, count: count, weak: ui.quiz.weak });
    });

    // review
    $("#reviewReveal").addEventListener("click", function () {
      if (!review) return;
      review.revealed = true;
      renderReview();
    });
    $("#reviewRatings").addEventListener("click", function (e) {
      const b = e.target.closest("[data-rate]");
      if (b) rateReview(b.dataset.rate);
    });
    $("#reviewNewBtn").addEventListener("click", function () { startReview(true); });
    $("#reviewMore").addEventListener("click", function () { startReview(true); });
    $("#dailyProgress").addEventListener("click", function (e) {
      const b = e.target.closest("[data-daily-goal]");
      if (!b) return;
      const n = Number(b.dataset.dailyGoal);
      if ([10, 20, 30, 50, 100].indexOf(n) === -1) return;
      state.dailyGoal = n;
      save();
      renderProgress();
      toast(t("goalChanged", { n: n }));
    });

    // reset — M3 dialog
    let resetReturnFocus = null;
    const resetScrim = $("#resetScrim");
    const closeReset = function () {
      resetScrim.hidden = true;
      document.body.style.overflow = "";
      if (resetReturnFocus && resetReturnFocus.focus) resetReturnFocus.focus();
    };
    $("#resetBtn").addEventListener("click", function () {
      resetReturnFocus = document.activeElement;
      resetScrim.hidden = false;
      document.body.style.overflow = "hidden";
      $("#resetCancel").focus();
    });
    $("#resetCancel").addEventListener("click", closeReset);
    $("#resetScrim").addEventListener("click", function (e) {
      if (e.target === resetScrim) closeReset();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !resetScrim.hidden) {
        closeReset();
        e.preventDefault();
      } else if (e.key === "Escape" && !userScrim.hidden) {
        closeUser();
        e.preventDefault();
      }
    });
    $("#resetConfirm").addEventListener("click", function () {
      state.known = {};
      state.starred = {};
      state.srs = {};
      state.quiz = { asked: 0, correct: 0 };
      state.activity = {};
      quiz = null;
      review = null;
      flashIndex = 0;
      save();
      closeReset();
      renderCurrentView();
      toast(t("toastReset"));
    });

    // single-user sync dialog
    let userReturnFocus = null;
    const userScrim = $("#userScrim");
    const closeUser = function () {
      userScrim.hidden = true;
      document.body.style.overflow = "";
      if (userReturnFocus && userReturnFocus.focus) userReturnFocus.focus();
    };
    $("#userChip").addEventListener("click", function () {
      userReturnFocus = document.activeElement;
      updateSyncUI();
      userScrim.hidden = false;
      document.body.style.overflow = "hidden";
      $("#userClose").focus();
    });
    $("#userClose").addEventListener("click", closeUser);
    $("#userScrim").addEventListener("click", function (e) {
      if (e.target === userScrim) closeUser();
    });
    $("#syncNowBtn").addEventListener("click", syncNow);
    $("#syncKeySave").addEventListener("click", function () {
      const input = $("#syncKeyInput");
      SYNC.token = input ? input.value.trim() : "";
      try {
        if (SYNC.token) localStorage.setItem(SYNC_TOKEN_KEY, SYNC.token);
        else localStorage.removeItem(SYNC_TOKEN_KEY);
      } catch (e) { /* ignore */ }
      syncPull();
    });

    // keyboard
    document.addEventListener("keydown", function (e) {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      const active = $(".view.is-active");
      const view = active ? active.dataset.view : "";
      if (view === "quiz" && quiz && quiz.phase === "play") {
        if (/^[1-4]$/.test(e.key) && !quiz.answered) {
          answerQuiz(Number(e.key) - 1);
          e.preventDefault();
        } else if (e.key === "Enter" && quiz.answered) {
          nextQuiz();
          e.preventDefault();
        }
      } else if (view === "review" && review && !review.complete) {
        if (e.key === " " || e.key === "Enter") {
          if (!review.revealed) { review.revealed = true; renderReview(); e.preventDefault(); }
        } else if (review.revealed && /^[1-3]$/.test(e.key)) {
          rateReview(["again", "hard", "good"][Number(e.key) - 1]);
          e.preventDefault();
        }
      }
    });

    window.addEventListener("hashchange", function () {
      showView(location.hash.replace("#", ""));
    });
  }

  /* ── init ──────────────────────────────── */

  function init() {
    applyTheme();
    applyI18n();
    wire();
    const initial = location.hash ? location.hash.replace("#", "") : "home";
    showView(initial);
    if (SYNC.enabled) syncPull();
    else setSyncStatus("local");
    window.addEventListener("online", function () {
      if (SYNC.enabled) syncPull();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
