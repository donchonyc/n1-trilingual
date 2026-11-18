/* 文の組み立て (sentence ordering) — JLPT-style ★ questions.
   Each item splits one everyday sentence into four chunks. The ★ is always the
   third slot, so `order[2]` is the answer. Chunks never contain sentence-final
   punctuation: punctuation belongs to `before`/`after`, not to an option.
   `before` and `after` carry the surrounding context so the order can be solved
   from the sentence itself, not from imagination. */
window.ORDERING = [
  /* ── N3 ─────────────────────────────────── */
  {
    id: "ord-n3-01", level: "N3",
    before: "きのうの晩ご飯は、", after: "。",
    order: ["母が", "台所で", "作った", "野菜スープだった"],
    en: "Yesterday's dinner was the vegetable soup my mother made in the kitchen.",
    ko: "어제 저녁은 어머니가 부엌에서 만든 야채수프였다."
  },
  {
    id: "ord-n3-02", level: "N3",
    before: "友だちに聞いたら、あの店で", after: "そうだ。",
    order: ["毎朝", "焼いている", "パンは", "とてもおいしい"],
    en: "When I asked a friend, I heard that the bread that shop bakes every morning is very good.",
    ko: "친구에게 물어보니, 그 가게에서 매일 아침 굽는 빵은 아주 맛있다고 한다."
  },
  {
    id: "ord-n3-03", level: "N3",
    before: "駅の前で待ち合わせをしたが、", after: "。",
    order: ["ずっと", "待っていた", "人は", "友だちだった"],
    en: "We agreed to meet in front of the station; the person who had been waiting there was my friend.",
    ko: "역 앞에서 만나기로 했는데, 계속 기다리던 사람은 내 친구였다."
  },
  {
    id: "ord-n3-04", level: "N3",
    before: "手がふさがっているので、机の上に", after: "。",
    order: ["置いてある", "本を", "取って", "くれませんか"],
    en: "My hands are full, so could you hand me the book that is on the desk?",
    ko: "손이 안 비어서 그런데, 책상 위에 놓여 있는 책을 집어 주시겠어요?"
  },
  {
    id: "ord-n3-05", level: "N3",
    before: "母の日には、", after: "。",
    order: ["弟が", "買った", "花を", "花瓶に飾った"],
    en: "On Mother's Day I arranged the flowers my younger brother had bought in a vase.",
    ko: "어버이날에는 동생이 산 꽃을 꽃병에 꽂았다."
  },
  {
    id: "ord-n3-06", level: "N3",
    before: "うちでは毎朝、", after: "。",
    order: ["歯を", "みがいてから", "朝ご飯を", "食べます"],
    en: "At our house, every morning we brush our teeth and then eat breakfast.",
    ko: "우리 집에서는 매일 아침 이를 닦고 나서 아침밥을 먹습니다."
  },
  {
    id: "ord-n3-07", level: "N3",
    before: "外から帰ったら、風邪を", after: "。",
    order: ["ひかない", "ように", "手を", "洗っている"],
    en: "When I come home, I wash my hands so that I do not catch a cold.",
    ko: "밖에서 돌아오면 감기에 걸리지 않도록 손을 씻고 있다."
  },
  {
    id: "ord-n3-08", level: "N3",
    before: "聞いた話では、この", after: "そうだ。",
    order: ["近くに", "引っ越してきた", "家族が", "犬を飼っている"],
    en: "I heard that the family that moved in nearby keeps a dog.",
    ko: "들은 이야기로는, 이 근처로 이사 온 가족은 개를 키우고 있다고 한다."
  },

  /* ── N2 ─────────────────────────────────── */
  {
    id: "ord-n2-01", level: "N2",
    before: "部長の話では、田中さんは", after: "。",
    order: ["来月", "大阪へ", "転勤する", "らしい"],
    en: "According to the manager, Tanaka is apparently being transferred to Osaka next month.",
    ko: "부장님 말로는 다나카 씨가 다음 달 오사카로 전근 간다고 한다."
  },
  {
    id: "ord-n2-02", level: "N2",
    before: "よく行くこの店は、", after: "。",
    order: ["駅から", "近い", "わりに", "値段が安い"],
    en: "This shop I often go to is cheap considering how close it is to the station.",
    ko: "자주 가는 이 가게는 역에서 가까운 것에 비해 값이 싸다."
  },
  {
    id: "ord-n2-03", level: "N2",
    before: "彼が", after: "ので、みんな困った。",
    order: ["時間に", "遅れた", "せいで", "会議が始まらなかった"],
    en: "Because he was late, the meeting did not start, and everyone was stuck.",
    ko: "그가 시간에 늦은 탓에 회의가 시작되지 않아서 모두 곤란했다."
  },
  {
    id: "ord-n2-04", level: "N2",
    before: "雨が", after: "ので、観客は少なかった。",
    order: ["降っている", "にもかかわらず", "試合は", "行われた"],
    en: "Even though it was raining, the game was held, so there were few spectators.",
    ko: "비가 오고 있었음에도 불구하고 경기는 열려서 관객은 적었다."
  },
  {
    id: "ord-n2-05", level: "N2",
    before: "授業のあとで先生に", after: "そうだ。",
    order: ["聞いた", "ところ", "答えは", "間違っていた"],
    en: "When I asked the teacher after class, it turned out the answer was wrong.",
    ko: "수업 후에 선생님께 물어보니 답이 틀렸다고 한다."
  },
  {
    id: "ord-n2-06", level: "N2",
    before: "すぐに返事ができなかったので、家族と", after: "。",
    order: ["相談した", "うえで", "返事を", "することにした"],
    en: "Since I could not reply right away, I decided to answer after discussing it with my family.",
    ko: "바로 답을 할 수 없어서 가족과 상의한 뒤 답을 하기로 했다."
  },
  {
    id: "ord-n2-07", level: "N2",
    before: "実際に引き受けてみると、この", after: "。",
    order: ["仕事は", "思った", "より", "時間がかかる"],
    en: "Once I actually took on this job, it took more time than I thought.",
    ko: "실제로 맡아 보니 이 일은 생각보다 시간이 걸린다."
  },
  {
    id: "ord-n2-08", level: "N2",
    before: "新しい仕事を始めたが、彼女は", after: "。",
    order: ["仕事が", "忙しい", "中でも", "毎日日本語を勉強している"],
    en: "She started a new job, but even though she is busy with work, she studies Japanese every day.",
    ko: "새 일을 시작했지만, 그녀는 일이 바쁜 중에도 매일 일본어를 공부하고 있다."
  },

  /* ── N1 ─────────────────────────────────── */
  {
    id: "ord-n1-01", level: "N1",
    before: "新しい部署に移ってみて、こんなに", after: "。",
    order: ["忙しい", "とは", "思って", "いなかった"],
    en: "After moving to a new department, I never thought it would be this busy.",
    ko: "새 부서로 옮겨 보고서, 이렇게 바쁠 줄은 생각하지 못했다."
  },
  {
    id: "ord-n1-02", level: "N1",
    before: "気づいたときには、彼が", after: "。",
    order: ["何も", "言わない", "うちに", "会議が終わった"],
    en: "By the time I noticed, the meeting had ended while he said nothing.",
    ko: "정신을 차려 보니, 그가 아무 말도 하지 않는 사이에 회의가 끝나 있었다."
  },
  {
    id: "ord-n1-03", level: "N1",
    before: "テストで出たこの問題は一見", after: "。",
    order: ["簡単そうに", "見えるが", "実際は", "難しい"],
    en: "This problem on the test looks easy at first glance, but it is actually difficult.",
    ko: "시험에 나온 이 문제는 언뜻 쉬워 보이지만 실제로는 어렵다."
  },
  {
    id: "ord-n1-04", level: "N1",
    before: "最近の彼は", after: "そうだ。",
    order: ["仕事の", "忙しさの", "あまり", "家族と話していない"],
    en: "Apparently he has been so busy with work lately that he does not talk with his family.",
    ko: "요즘 그는 일이 너무 바빠서 가족과 이야기하지 않는다고 한다."
  },
  {
    id: "ord-n1-05", level: "N1",
    before: "上司が何度", after: "。",
    order: ["注意しても", "彼は", "同じ", "失敗を繰り返す"],
    en: "No matter how many times his boss warns him, he keeps making the same mistake.",
    ko: "상사가 몇 번을 주의해도 그는 같은 실수를 반복한다."
  },
  {
    id: "ord-n1-06", level: "N1",
    before: "この", after: "が、味は本格的だ。",
    order: ["レシピは", "初心者", "向けに", "書かれている"],
    en: "This recipe is written for beginners, but the taste is authentic.",
    ko: "이 레시피는 초보자용으로 쓰여 있지만 맛은 본격적이다."
  },
  {
    id: "ord-n1-07", level: "N1",
    before: "最初は誤解していたが、", after: "。",
    order: ["彼女の", "話を", "聞くまで", "事情が分からなかった"],
    en: "At first I misunderstood, but I did not understand the situation until I heard her story.",
    ko: "처음에는 오해했지만, 그녀의 이야기를 들을 때까지 사정을 몰랐다."
  },
  {
    id: "ord-n1-08", level: "N1",
    before: "仕事が遅く終わった日でも、どんなに", after: "。",
    order: ["疲れていても", "毎日", "日記だけは", "書くようにしている"],
    en: "Even on days when work ends late, no matter how tired I am, I make sure to write in my diary every day.",
    ko: "일이 늦게 끝난 날에도 아무리 피곤해도 매일 일기만은 쓰도록 하고 있다."
  }
];
