/* N1 grammar — part 2 (34–65) */
window.GRAMMAR = window.GRAMMAR || [];
window.GRAMMAR.push(
{
  id: "g34", pattern: "〜ならでは", core: "ならでは", reading: "ならでは", tag: "evaluation",
  meaning: {
    ja: "〜だけが持つ、独特の良さ。",
    en: "unique to ~; only possible for ~",
    ko: "~만이 가질 수 있는 독특함"
  },
  formation: {
    ja: "名詞 ＋ ならでは（の／だ）",
    en: "N + narade wa (no / da)",
    ko: "명사 + ならでは(の/だ)"
  },
  examples: [
    { ja: "京都ならではの風景を楽しんだ。", en: "We enjoyed scenery that only Kyoto can offer.", ko: "교토에서만 볼 수 있는 풍경을 즐겼다." },
    { ja: "彼ならではのアイデアだ。", en: "That is an idea only he could come up with.", ko: "그만이 낼 수 있는 아이디어다." }
  ],
  note: {
    ja: "良い評価に使うことが多い。「〜でしか味わえない」に言い換えられる。",
    en: "Usually positive; can be rephrased as something only ~ can offer.",
    ko: "좋은 평가에 주로 씁니다. '~에서만 느낄 수 있는'으로 바꿔 쓸 수 있습니다."
  },
  similar: ["〜独自の", "〜でしか"]
},
{
  id: "g35", pattern: "〜なり〜なり", core: "なり", reading: "なり", tag: "condition", quiz: false,
  meaning: {
    ja: "いくつかの中から、適当なものを一つ選ぶ。",
    en: "either ~ or ~; something like ~",
    ko: "~이든지 ~이든지"
  },
  formation: {
    ja: "動詞る形／名詞 ＋ なり ＋ 動詞る形／名詞 ＋ なり",
    en: "V-ru / N + nari + V-ru / N + nari",
    ko: "동사 기본형 / 명사 + なり + 동사 기본형 / 명사 + なり"
  },
  examples: [
    { ja: "電話なりメールなりで連絡してください。", en: "Please contact me by phone or email, whichever.", ko: "전화든 메일이든으로 연락해 주세요." },
    { ja: "コーヒーなり紅茶なり、好きなものをどうぞ。", en: "Have whatever you like, coffee or tea.", ko: "커피든 홍차든 좋아하는 것을 드세요." }
  ],
  note: {
    ja: "話し手が例をいくつか挙げ、相手に選択を任せる。",
    en: "The speaker offers examples and leaves the choice to the listener.",
    ko: "화자가 몇 가지 예를 들고 상대에게 선택을 맡깁니다."
  },
  similar: ["〜でも", "〜とか"]
},
{
  id: "g36", pattern: "〜なりに", core: "なりに", reading: "なりに", tag: "evaluation",
  meaning: {
    ja: "その人や状況にふさわしい程度で。",
    en: "in one's own way; to the extent appropriate for ~",
    ko: "~나름대로"
  },
  formation: {
    ja: "名詞 ＋ なりに",
    en: "N + nari ni",
    ko: "명사 + なりに"
  },
  examples: [
    { ja: "子どもなりに一生懸命考えている。", en: "The child is thinking hard in their own way.", ko: "아이 나름대로 열심히 생각하고 있다." },
    { ja: "私なりに努力したつもりだ。", en: "I believe I made an effort in my own way.", ko: "나 나름대로 노력했다고 생각한다." }
  ],
  note: {
    ja: "「その立場に応じた」という意味で、程度が高くなくても認める気持ちを表す。",
    en: "Acknowledges effort at a level suited to the person, even if modest.",
    ko: "그 입장에 걸맞은 정도라는 뜻으로, 수준이 높지 않아도 인정하는 마음을 나타냅니다."
  },
  similar: ["〜なりの", "〜相応に"]
},
{
  id: "g37", pattern: "〜に至っては", core: "に至っては", reading: "にいたっては", tag: "emphasis",
  meaning: {
    ja: "極端な例を取り上げて強調する。",
    en: "when it comes to ~ (an extreme example)",
    ko: "~에 이르러서는 (극단적인 예)"
  },
  formation: {
    ja: "名詞 ＋ に至っては",
    en: "N + ni itatte wa",
    ko: "명사 + に至っては"
  },
  examples: [
    { ja: "兄はまったく勉強しない。弟に至っては、学校にも行かない。", en: "My older brother does not study at all. As for my younger brother, he does not even go to school.", ko: "형은 전혀 공부하지 않는다. 동생에 이르러서는 학교에도 가지 않는다." },
    { ja: "この店の混雑ぶりはひどい。週末に至っては、入店まで一時間待ちだ。", en: "This shop is terribly crowded. On weekends, you wait an hour just to get in.", ko: "이 가게의 혼잡함은 심하다. 주말에 이르러서는 입장까지 한 시간을 기다려야 한다." }
  ],
  note: {
    ja: "前に普通の例、後に極端な例を置くと効果的。",
    en: "Works well with an ordinary example first and an extreme one after.",
    ko: "앞에 보통 예, 뒤에 극단적인 예를 두면 효과적입니다."
  },
  similar: ["〜ときたら", "〜はもちろん"]
},
{
  id: "g38", pattern: "〜にかこつけて", core: "にかこつけて", reading: "にかこつけて", tag: "reason",
  meaning: {
    ja: "〜を口実にして。批判的なニュアンスがある。",
    en: "using ~ as an excuse",
    ko: "~을 구실로 삼아"
  },
  formation: {
    ja: "名詞 ＋ にかこつけて",
    en: "N + ni kakotsukete",
    ko: "명사 + にかこつけて"
  },
  examples: [
    { ja: "病気にかこつけて、仕事を休んだ。", en: "He used illness as an excuse to take time off work.", ko: "병을 구실로 삼아 일을 쉬었다." },
    { ja: "出張にかこつけて、観光を楽しんだ。", en: "I enjoyed sightseeing under the pretext of a business trip.", ko: "출장을 구실로 관광을 즐겼다." }
  ],
  note: {
    ja: "本当の理由を隠して、別のことを口実にする場合に使う。",
    en: "Used when someone hides the real reason behind another pretext.",
    ko: "진짜 이유를 숨기고 다른 일을 구실로 삼을 때 씁니다."
  },
  similar: ["〜を口実に", "〜にかまけて"]
},
{
  id: "g39", pattern: "〜にたえない", core: "にたえない", reading: "にたえない", tag: "emotion",
  meaning: {
    ja: "感情が強くて抑えられない。／見る価値がない。",
    en: "cannot help feeling ~ / not worth ~ing",
    ko: "~을 금할 수 없다 / ~할 가치가 없다"
  },
  formation: {
    ja: "名詞 ＋ にたえない",
    en: "N + ni taenai",
    ko: "명사 + にたえない"
  },
  examples: [
    { ja: "被災者の話を聞くと、同情にたえない。", en: "Hearing the disaster victims' stories, I cannot help feeling deep sympathy.", ko: "피해자의 이야기를 들으면 연민을 금할 수 없다." },
    { ja: "最近の彼の態度は、見るにたえない。", en: "His recent attitude is unbearable to watch.", ko: "최근 그의 태도는 차마 볼 수 없을 정도다." }
  ],
  note: {
    ja: "「感謝にたえない」「感謝の念にたえない」は丁寧な感謝の表現。「見るにたえない」は別の用法。",
    en: "感謝にたえない is a formal expression of gratitude; 見るにたえない means too painful to watch.",
    ko: "感謝にたえない는 정중한 감사 표현이고, 見るにたえない는 차마 볼 수 없다는 뜻입니다."
  },
  similar: ["〜を禁じえない", "〜てたまらない"]
},
{
  id: "g40", pattern: "〜にひきかえ", core: "にひきかえ", reading: "にひきかえ", tag: "contrast",
  meaning: {
    ja: "〜と比べて、まったく正反対だ。",
    en: "in contrast to ~",
    ko: "~와는 반대로"
  },
  formation: {
    ja: "名詞／文 ＋ のにひきかえ",
    en: "N / clause + no ni hikikae",
    ko: "명사 / 문장 + のにひきかえ"
  },
  examples: [
    { ja: "兄が冷静なのにひきかえ、弟はすぐ怒る。", en: "In contrast to his calm older brother, the younger one loses his temper easily.", ko: "형이 냉정한 것과는 반대로 동생은 금방 화를 낸다." },
    { ja: "去年の売上が伸びたのにひきかえ、今年は苦戦している。", en: "Sales grew last year, but this year we are struggling.", ko: "작년에는 매출이 늘었던 것과 반대로 올해는 고전하고 있다." }
  ],
  note: {
    ja: "二つのものを対比させ、差が大きいことを強調する。",
    en: "Sets two things against each other to emphasise a large gap.",
    ko: "두 가지를 대비시켜 차이가 큼을 강조합니다."
  },
  similar: ["〜に対して", "〜反面"]
},
{
  id: "g41", pattern: "〜にもまして", core: "にもまして", reading: "にもまして", tag: "emphasis",
  meaning: {
    ja: "〜以上に。比較の基準を強調する。",
    en: "more than ever; even more than ~",
    ko: "~보다도 더"
  },
  formation: {
    ja: "名詞 ＋ にもまして",
    en: "N + ni mo mashite",
    ko: "명사 + にもまして"
  },
  examples: [
    { ja: "今年の夏は、例年にもまして暑い。", en: "This summer is even hotter than usual.", ko: "올여름은 예년보다도 더 덥다." },
    { ja: "出産を機に、彼女は以前にもまして仕事に打ち込むようになった。", en: "After giving birth, she threw herself into work more than before.", ko: "출산을 계기로 그녀는 이전보다도 더 일에 몰두하게 되었다." }
  ],
  note: {
    ja: "改まった文章でよく使う。「誰にもまして」のようにも使う。",
    en: "Common in formal writing; also 誰にもまして (more than anyone).",
    ko: "격식 있는 글에서 자주 씁니다. 誰にもまして처럼도 씁니다."
  },
  similar: ["〜以上に", "〜にも増して"]
},
{
  id: "g42", pattern: "〜ばこそ", core: "ばこそ", reading: "ばこそ", tag: "reason",
  meaning: {
    ja: "〜からこそ。強い理由を表す。",
    en: "precisely because ~",
    ko: "~이기에야말로"
  },
  formation: {
    ja: "動詞・形容詞のば形 ＋ こそ",
    en: "ba-form + koso",
    ko: "동사·형용사 ば형 + こそ"
  },
  examples: [
    { ja: "健康であればこそ、仕事も楽しめる。", en: "It is precisely because I am healthy that I can enjoy work.", ko: "건강하기에야말로 일도 즐길 수 있다." },
    { ja: "家族を愛していればこそ、厳しく叱るのだ。", en: "It is precisely because I love my family that I scold them strictly.", ko: "가족을 사랑하기에야말로 엄하게 꾸짖는 것이다." }
  ],
  note: {
    ja: "「〜からこそ」より硬く、理由を強調する。後の文は肯定が多い。",
    en: "More formal than からこそ and strongly stresses the reason; usually followed by an affirmative.",
    ko: "からこそ보다 딱딱하고 이유를 강조합니다. 뒤에는 긍정문이 오는 경우가 많습니다."
  },
  similar: ["〜からこそ", "〜ゆえに"]
},
{
  id: "g43", pattern: "〜ぶり", core: "ぶり", reading: "ぶり", tag: "evaluation",
  meaning: {
    ja: "〜の様子、程度、または間隔。",
    en: "the way of ~; after an interval of ~",
    ko: "~하는 모양 / ~만의 간격"
  },
  formation: {
    ja: "名詞／動詞ます形の語幹 ＋ ぶり",
    en: "N / V-masu stem + buri",
    ko: "명사 / 동사 ます형 어간 + ぶり"
  },
  examples: [
    { ja: "彼の話しぶりには、説得力がある。", en: "There is persuasiveness in the way he speaks.", ko: "그의 말투에는 설득력이 있다." },
    { ja: "十年ぶりに故郷に帰った。", en: "I returned to my hometown for the first time in ten years.", ko: "10년 만에 고향에 돌아갔다." }
  ],
  note: {
    ja: "「〜ぶりに」の形で「〜年ぶり」のように間隔を表す用法も重要。",
    en: "The form ぶりに (as in 十年ぶり) expresses an interval.",
    ko: "ぶりに 형태로 '10년 만에'처럼 간격을 나타내는 용법도 중요합니다."
  },
  similar: ["〜様子", "〜ふう"]
},
{
  id: "g44", pattern: "〜べく", core: "べく", reading: "べく", tag: "purpose",
  meaning: {
    ja: "〜するために。硬い目的表現。",
    en: "in order to ~ (formal)",
    ko: "~하기 위해서"
  },
  formation: {
    ja: "動詞る形 ＋ べく（する→すべく）",
    en: "V-ru + beku (suru → subeku)",
    ko: "동사 기본형 + べく (する→すべく)"
  },
  examples: [
    { ja: "真相を明らかにすべく、調査を開始した。", en: "We began an investigation in order to uncover the truth.", ko: "진상을 밝히기 위해 조사를 시작했다." },
    { ja: "新しい事業を始めるべく、準備を進めている。", en: "We are preparing in order to launch a new business.", ko: "새 사업을 시작하기 위해 준비를 진행하고 있다." }
  ],
  note: {
    ja: "書き言葉的。意志的な目的に使う。「〜べくして」は別の意味になる。",
    en: "Literary; used for intentional goals. べくして has a different meaning.",
    ko: "문어적 표현으로 의지적인 목적에 씁니다. べくして는 다른 의미입니다."
  },
  similar: ["〜ために", "〜んがために"]
},
{
  id: "g45", pattern: "〜べくして", core: "べくして", reading: "べくして", tag: "evaluation",
  meaning: {
    ja: "当然そうなるべきして、その結果になった。",
    en: "as was bound to happen",
    ko: "당연히 ~할 만하여 (그렇게 되었다)"
  },
  formation: {
    ja: "動詞る形 ＋ べくして ＋ 動詞た形",
    en: "V-ru + bekushite + V-ta",
    ko: "동사 기본형 + べくして + 동사 た형"
  },
  examples: [
    { ja: "彼の失敗は、起こるべくして起こったことだ。", en: "His failure was bound to happen.", ko: "그의 실패는 일어날 만해서 일어난 일이다." },
    { ja: "彼女が選ばれたのは、選ばれるべくして選ばれたのだ。", en: "She was chosen because she was meant to be chosen.", ko: "그녀가 선택된 것은 선택될 만해서 선택된 것이다." }
  ],
  note: {
    ja: "「〜べくして〜た」で、同じ動詞を繰り返すことが多い。",
    en: "Often repeats the same verb: 起こるべくして起こった.",
    ko: "같은 동사를 반복하는 형태가 많습니다: 起こるべくして起こった."
  },
  similar: ["〜当然の結果として", "〜て当然だ"]
},
{
  id: "g46", pattern: "〜まじき", core: "まじき", reading: "まじき", tag: "evaluation",
  meaning: {
    ja: "その立場の人がしてはいけない。",
    en: "unbecoming of ~; unforgivable for ~",
    ko: "~으로서 해서는 안 될"
  },
  formation: {
    ja: "動詞る形 ＋ まじき ＋ 名詞（あるまじき など）",
    en: "V-ru + majiki + noun (e.g. aru majiki)",
    ko: "동사 기본형 + まじき + 명사 (あるまじき 등)"
  },
  examples: [
    { ja: "教師にあるまじき発言だ。", en: "That is a remark unbecoming of a teacher.", ko: "교사로서 해서는 안 될 발언이다." },
    { ja: "公務員としてあるまじき行為が問題になった。", en: "Conduct unbecoming of a public servant became an issue.", ko: "공무원으로서 해서는 안 될 행위가 문제가 되었다." }
  ],
  note: {
    ja: "「〜にあるまじき」の形で、職業や立場とセットで使うことが多い。",
    en: "Mostly in the form にあるまじき with an occupation or role.",
    ko: "にあるまじき 형태로 직업이나 입장과 함께 쓰는 경우가 많습니다."
  },
  similar: ["〜べきではない", "〜にあるまじき"]
},
{
  id: "g47", pattern: "〜までして", core: "までして", reading: "までして", tag: "emphasis",
  meaning: {
    ja: "そこまで極端なことをして。批判や疑問の気持ちを含む。",
    en: "even going so far as to ~",
    ko: "~까지 해 가며"
  },
  formation: {
    ja: "動詞ます形の語幹／名詞 ＋ までして",
    en: "V-masu stem / N + made shite",
    ko: "동사 ます형 어간 / 명사 + までして"
  },
  examples: [
    { ja: "借金までして、車を買う必要があるのか。", en: "Is there any need to buy a car, even going into debt?", ko: "빚까지 내 가며 차를 살 필요가 있나." },
    { ja: "家族を犠牲にするまでして、出世したいとは思わない。", en: "I do not want to climb the ladder at the cost of my family.", ko: "가족을 희생해 가면서까지 출세하고 싶지는 않다." }
  ],
  note: {
    ja: "普通はしないような極端な手段に対する、批判的な気持ちを表す。",
    en: "Expresses criticism of an extreme means that would normally be avoided.",
    ko: "보통은 하지 않을 극단적인 수단에 대한 비판적 마음을 나타냅니다."
  },
  similar: ["〜てでも", "〜を犠牲にしてまで"]
},
{
  id: "g48", pattern: "〜もさることながら", core: "もさることながら", reading: "もさることながら", tag: "emphasis",
  meaning: {
    ja: "〜はもちろん、それ以上に。",
    en: "not only ~ but also (even more so)",
    ko: "~은 물론이고 그보다도"
  },
  formation: {
    ja: "名詞 ＋ もさることながら",
    en: "N + mo saru koto nagara",
    ko: "명사 + もさることながら"
  },
  examples: [
    { ja: "味もさることながら、この店は雰囲気がいい。", en: "The food is good, but the atmosphere of this restaurant is even better.", ko: "맛도 그렇지만 이 가게는 분위기가 좋다." },
    { ja: "彼は演技もさることながら、歌もすばらしい。", en: "He is a fine actor, and an even more wonderful singer.", ko: "그는 연기뿐 아니라 노래도 훌륭하다." }
  ],
  note: {
    ja: "前者を認めたうえで、後者をより強調する。",
    en: "Acknowledges the first point, then emphasises the second even more.",
    ko: "전자를 인정한 뒤 후자를 더 강조합니다."
  },
  similar: ["〜はもちろん", "〜にもまして"]
},
{
  id: "g49", pattern: "〜ものを", core: "ものを", reading: "ものを", tag: "emotion",
  meaning: {
    ja: "本当は〜のに。実現しなかったことへの不満や残念な気持ち。",
    en: "if only ~ (regret over what did not happen)",
    ko: "~인 것을 (아쉬움·불만)"
  },
  formation: {
    ja: "文 ＋ ものを",
    en: "clause + mono o",
    ko: "문장 + ものを"
  },
  examples: [
    { ja: "言ってくれれば手伝ったものを。", en: "If you had told me, I would have helped.", ko: "말해 줬다면 도와줬을 것을." },
    { ja: "少し注意していれば事故は防げたものを。", en: "If only they had been a little more careful, the accident could have been prevented.", ko: "조금만 주의했더라면 사고는 막을 수 있었을 것을." }
  ],
  note: {
    ja: "相手を責める気持ちや、強い後悔を表す。文末に置くことが多い。",
    en: "Shows reproach or regret; often placed at the end of a sentence.",
    ko: "상대를 탓하는 마음이나 강한 후회를 나타냅니다. 문장 끝에 오는 경우가 많습니다."
  },
  similar: ["〜のに", "〜ばよかった"]
},
{
  id: "g50", pattern: "〜んがために", core: "んがために", reading: "んがために", tag: "purpose",
  meaning: {
    ja: "〜するために。強い目的意識を表す。",
    en: "in order to ~ (strong purpose)",
    ko: "~하기 위해(서)"
  },
  formation: {
    ja: "動詞ない形の語幹 ＋ んがために",
    en: "V-nai stem + n ga tame ni",
    ko: "동사 ない형 어간 + んがために"
  },
  examples: [
    { ja: "真実を明らかにせんがために、彼は調査を続けた。", en: "He continued the investigation in order to reveal the truth.", ko: "진실을 밝히기 위해 그는 조사를 계속했다." },
    { ja: "家族を守らんがために、彼は必死に働いた。", en: "He worked desperately in order to protect his family.", ko: "가족을 지키기 위해 그는 필사적으로 일했다." }
  ],
  note: {
    ja: "「する」は「せんがために」になる。書き言葉で、強い決意を伴う。",
    en: "する becomes せんがために. Literary, with strong resolve.",
    ko: "する는 せんがために가 됩니다. 문어체로 강한 결의를 동반합니다."
  },
  similar: ["〜べく", "〜ために"]
},
{
  id: "g51", pattern: "〜んばかりに", core: "んばかりに", reading: "んばかりに", tag: "emphasis",
  meaning: {
    ja: "今にも〜しそうなほど。",
    en: "as if about to ~",
    ko: "금방이라도 ~할 듯이"
  },
  formation: {
    ja: "動詞ない形の語幹 ＋ んばかりに",
    en: "V-nai stem + n bakari ni",
    ko: "동사 ない형 어간 + んばかりに"
  },
  examples: [
    { ja: "彼は今にも飛びかからんばかりに、こちらをにらんだ。", en: "He glared at me as if he were about to leap at me.", ko: "그는 당장이라도 달려들 듯이 이쪽을 노려보았다." },
    { ja: "彼は泣かんばかりの顔で訴えた。", en: "He appealed with a face as if he were about to cry.", ko: "그는 울음이 터질 듯한 얼굴로 호소했다." },
    { ja: "今にも降らんばかりの空模様だ。", en: "The sky looks as if it is about to rain at any moment.", ko: "금방이라도 비가 쏟아질 듯한 하늘이다." }
  ],
  note: {
    ja: "実際にはまだ〜していないが、その直前のような状態を表す。",
    en: "Not actually happening yet, but looking just about to happen.",
    ko: "실제로는 아직 ~하지 않았지만 곧 일어날 듯한 상태를 나타냅니다."
  },
  similar: ["〜そうに", "〜んばかりだ"]
},
{
  id: "g52", pattern: "〜を皮切りに", core: "を皮切りに", reading: "をかわきりに", tag: "time",
  meaning: {
    ja: "〜を最初として、同じようなことが続く。",
    en: "starting with ~; beginning with ~",
    ko: "~을 시작으로"
  },
  formation: {
    ja: "名詞 ＋ を皮切りに",
    en: "N + o kawakiri ni",
    ko: "명사 + を皮切りに"
  },
  examples: [
    { ja: "東京公演を皮切りに、全国ツアーが始まる。", en: "Starting with the Tokyo performance, a nationwide tour begins.", ko: "도쿄 공연을 시작으로 전국 투어가 시작된다." },
    { ja: "この作品を皮切りに、シリーズが次々と発表された。", en: "Beginning with this work, the series was released one after another.", ko: "이 작품을 시작으로 시리즈가 잇따라 발표되었다." }
  ],
  note: {
    ja: "最初の出来事を起点に、同種の展開が続くことを表す。",
    en: "Marks the first event as the start of a series of similar events.",
    ko: "첫 사건을 기점으로 같은 종류의 전개가 이어짐을 나타냅니다."
  },
  similar: ["〜をはじめ", "〜を契機に"]
},
{
  id: "g53", pattern: "〜を禁じえない", core: "を禁じえない", reading: "をきんじえない", tag: "emotion",
  meaning: {
    ja: "感情を抑えることができない。",
    en: "cannot help but feel ~",
    ko: "~을 금할 수 없다"
  },
  formation: {
    ja: "名詞 ＋ を禁じえない",
    en: "N + o kinjienai",
    ko: "명사 + を禁じえない"
  },
  examples: [
    { ja: "事件のニュースに、怒りを禁じえない。", en: "I cannot help feeling anger at the news of the incident.", ko: "사건 뉴스에 분노를 금할 수 없다." },
    { ja: "彼の努力を見て、感動を禁じえなかった。", en: "Seeing his effort, I could not help being moved.", ko: "그의 노력을 보고 감동을 금할 수 없었다." }
  ],
  note: {
    ja: "「怒り」「感動」「同情」など、強い感情を表す名詞につく。",
    en: "Attaches to strong emotion nouns such as anger, being moved or sympathy.",
    ko: "분노, 감동, 연민 등 강한 감정을 나타내는 명사에 붙습니다."
  },
  similar: ["〜にたえない", "〜ずにはいられない"]
},
{
  id: "g54", pattern: "〜を契機に", core: "を契機に", reading: "をけいきに", tag: "reason",
  meaning: {
    ja: "〜がきっかけになって、変化が起こる。",
    en: "with ~ as the turning point",
    ko: "~을 계기로"
  },
  formation: {
    ja: "名詞 ＋ を契機に",
    en: "N + o keiki ni",
    ko: "명사 + を契機に"
  },
  examples: [
    { ja: "入院を契機に、たばこをやめた。", en: "I quit smoking after being hospitalised.", ko: "입원을 계기로 담배를 끊었다." },
    { ja: "この事件を契機に、法律が改正された。", en: "The law was revised as a result of this incident.", ko: "이 사건을 계기로 법률이 개정되었다." }
  ],
  note: {
    ja: "「を機に」より硬い。大きな変化のきっかけに使うことが多い。",
    en: "Formal version of を機に; often marks the trigger of a major change.",
    ko: "を機に보다 딱딱합니다. 큰 변화의 계기에 주로 씁니다."
  },
  similar: ["〜を機に", "〜がきっかけで"]
},
{
  id: "g55", pattern: "〜を踏まえて", core: "を踏まえて", reading: "をふまえて", tag: "reason",
  meaning: {
    ja: "〜を考慮して、次の行動をする。",
    en: "based on ~; taking ~ into account",
    ko: "~을 감안하여"
  },
  formation: {
    ja: "名詞 ＋ を踏まえて",
    en: "N + o fumaete",
    ko: "명사 + を踏まえて"
  },
  examples: [
    { ja: "調査結果を踏まえて、計画を修正する。", en: "We will revise the plan based on the survey results.", ko: "조사 결과를 감안하여 계획을 수정한다." },
    { ja: "前回の反省を踏まえて、今回の企画を立てた。", en: "We drew up this plan in light of last time's lessons.", ko: "지난번의 반성을 감안하여 이번 기획을 세웠다." }
  ],
  note: {
    ja: "意見・結果・事情などを判断の材料にするときに使う。",
    en: "Used when opinions, results or circumstances are the basis for a decision.",
    ko: "의견, 결과, 사정 등을 판단의 재료로 삼을 때 씁니다."
  },
  similar: ["〜を考慮して", "〜に基づいて"]
},
{
  id: "g56", pattern: "〜を余儀なくされる", core: "を余儀なくされる", reading: "をよぎなくされる", tag: "result",
  meaning: {
    ja: "自分の意思に反して、仕方なく〜する。",
    en: "be forced to ~",
    ko: "어쩔 수 없이 ~하게 되다"
  },
  formation: {
    ja: "名詞 ＋ を余儀なくされる",
    en: "N + o yoginaku sareru",
    ko: "명사 + を余儀なくされる"
  },
  examples: [
    { ja: "業績悪化で、工場の閉鎖を余儀なくされる。", en: "Worsening business results force the factory to close.", ko: "실적 악화로 공장 폐쇄를 피할 수 없게 된다." },
    { ja: "大雨で、住民は避難を余儀なくされた。", en: "The heavy rain forced residents to evacuate.", ko: "폭우로 주민들은 어쩔 수 없이 대피해야 했다." }
  ],
  note: {
    ja: "名詞につく。「〜ざるをえない」より、外部からの強制のニュアンスが強い。",
    en: "Attaches to nouns; stresses external compulsion more than ざるをえない.",
    ko: "명사에 붙습니다. ざるをえない보다 외부의 강제 느낌이 강합니다."
  },
  similar: ["〜ざるをえない", "〜させられる"]
},
{
  id: "g57", pattern: "〜をよそに", core: "をよそに", reading: "をよそに", tag: "contrast",
  meaning: {
    ja: "〜を無視して、関係なく。",
    en: "disregarding ~; indifferent to ~",
    ko: "~을 아랑곳하지 않고"
  },
  formation: {
    ja: "名詞 ＋ をよそに",
    en: "N + o yoso ni",
    ko: "명사 + をよそに"
  },
  examples: [
    { ja: "親の心配をよそに、彼は留学した。", en: "Ignoring his parents' worries, he went to study abroad.", ko: "부모의 걱정을 아랑곳하지 않고 그는 유학을 갔다." },
    { ja: "大雨をよそに、祭りは予定通り行われた。", en: "Despite the heavy rain, the festival went ahead as planned.", ko: "폭우에도 아랑곳없이 축제는 예정대로 열렸다." }
  ],
  note: {
    ja: "周りの状況や気持ちと関係なく行動する様子を、少し批判的に述べる。",
    en: "Slightly critical tone for acting regardless of others' feelings or circumstances.",
    ko: "주변 상황이나 마음과 무관하게 행동하는 모습을 다소 비판적으로 말합니다."
  },
  similar: ["〜を無視して", "〜にもかかわらず"]
},
{
  id: "g58", pattern: "〜をものともせず", core: "をものともせず", reading: "をものともせず", tag: "contrast",
  meaning: {
    ja: "困難に負けずに、勇敢に立ち向かう。",
    en: "in defiance of ~; undeterred by ~",
    ko: "~을 두려워하지 않고"
  },
  formation: {
    ja: "名詞 ＋ をものともせず",
    en: "N + o mono to mo sezu",
    ko: "명사 + をものともせず"
  },
  examples: [
    { ja: "彼は嵐をものともせず、海へ出た。", en: "Undeterred by the storm, he went out to sea.", ko: "그는 폭풍을 두려워하지 않고 바다로 나갔다." },
    { ja: "選手たちは雨をものともせず、全力で走り続けた。", en: "Unfazed by the rain, the athletes kept running at full speed.", ko: "선수들은 비를 아랑곳하지 않고 전력으로 계속 달렸다." }
  ],
  note: {
    ja: "困難を乗り越える強い姿勢をほめる気持ちで使うことが多い。",
    en: "Often admiring, describing strength in overcoming hardship.",
    ko: "어려움을 극복하는 강한 자세를 칭찬하는 마음으로 주로 씁니다."
  },
  similar: ["〜にもかかわらず", "〜を顧みず"]
},
{
  id: "g59", pattern: "〜が最後", core: "が最後", reading: "がさいご", tag: "condition",
  meaning: {
    ja: "一度〜したら、もう後戻りできない。",
    en: "once ~ happens, there is no turning back",
    ko: "일단 ~하면 끝이다"
  },
  formation: {
    ja: "動詞た形 ＋ が最後",
    en: "V-ta + ga saigo",
    ko: "동사 た형 + が最後"
  },
  examples: [
    { ja: "その本を読み始めたが最後、徹夜で読み終えた。", en: "Once I started reading the book, I stayed up all night to finish it.", ko: "그 책을 읽기 시작하자마자 밤을 새워 다 읽었다." },
    { ja: "彼は寝たが最後、なかなか起きてこない。", en: "Once he falls asleep, he will not get up easily.", ko: "그는 일단 잠들면 좀처럼 일어나지 않는다." }
  ],
  note: {
    ja: "話し手のあきれた気持ちや、強い結果の予想を表す。",
    en: "Shows the speaker's exasperation or a strong expectation of consequences.",
    ko: "화자의 어이없는 마음이나 강한 결과 예측을 나타냅니다."
  },
  similar: ["〜たら最後", "〜てからは"]
},
{
  id: "g60", pattern: "〜そばから", core: "そばから", reading: "そばから", tag: "time",
  meaning: {
    ja: "〜しても、次から次へと同じことが起きる。",
    en: "as soon as ~ (and it keeps happening)",
    ko: "~하는 족족"
  },
  formation: {
    ja: "動詞る形／た形 ＋ そばから",
    en: "V-ru / V-ta + soba kara",
    ko: "동사 기본형 / た형 + そばから"
  },
  examples: [
    { ja: "覚えたそばから忘れてしまう。", en: "I forget things as soon as I learn them.", ko: "외우는 족족 잊어버린다." },
    { ja: "部屋を片付けたそばから、子どもたちが散らかす。", en: "The children mess up the room as soon as I tidy it.", ko: "방을 정리하는 족족 아이들이 어지른다." }
  ],
  note: {
    ja: "同じことの繰り返しに対する、困った気持ちを表す。",
    en: "Expresses frustration at the same thing happening over and over.",
    ko: "같은 일이 반복되는 것에 대한 난처한 마음을 나타냅니다."
  },
  similar: ["〜とたん", "〜や否や"]
},
{
  id: "g61", pattern: "〜てやまない", core: "てやまない", reading: "てやまない", tag: "emotion",
  meaning: {
    ja: "ずっと〜し続けている。強い感情を表す。",
    en: "never stop ~ing (a strong feeling)",
    ko: "끊임없이 ~하고 있다"
  },
  formation: {
    ja: "動詞て形 ＋ やまない",
    en: "V-te + yamanai",
    ko: "동사 て형 + やまない"
  },
  examples: [
    { ja: "皆様のご健康を願ってやまない。", en: "I sincerely wish everyone good health.", ko: "여러분의 건강을 끊임없이 기원합니다." },
    { ja: "彼の成功を信じてやまない。", en: "I firmly believe in his success.", ko: "그의 성공을 굳게 믿고 있다." }
  ],
  note: {
    ja: "「願う」「信じる」「愛する」「尊敬する」など、感情動詞につく。",
    en: "Attaches to emotion verbs such as wish, believe, love and respect.",
    ko: "願う, 信じる, 愛する, 尊敬する처럼 감정 동사에 붙습니다."
  },
  similar: ["〜ずにはいられない", "〜てしかたがない"]
},
{
  id: "g62", pattern: "〜ばそれまでだ", core: "ばそれまでだ", reading: "ばそれまでだ", tag: "condition",
  meaning: {
    ja: "〜してしまったら、そこで終わりだ。",
    en: "if ~, then that is the end",
    ko: "~하면 그뿐이다"
  },
  formation: {
    ja: "動詞ば形 ＋ それまでだ",
    en: "ba-form + sore made da",
    ko: "동사 ば형 + それまでだ"
  },
  examples: [
    { ja: "一度やめてしまえばそれまでだ。", en: "Once you give up, that is the end of it.", ko: "한 번 포기해 버리면 그뿐이다." },
    { ja: "ここで諦めればそれまでだ。", en: "If we give up here, it is all over.", ko: "여기서 포기하면 그만이다." }
  ],
  note: {
    ja: "「〜したら終わりだ」と、結果の重大さを強調する。",
    en: "Stresses the finality of a result: once it happens, it is over.",
    ko: "~하면 끝이라는 식으로 결과의 중대함을 강조합니다."
  },
  similar: ["〜たら最後", "〜ば終わりだ"]
},
{
  id: "g63", pattern: "〜つつある", core: "つつある", reading: "つつある", tag: "time",
  meaning: {
    ja: "少しずつ〜する方向に変化している。",
    en: "be in the process of ~ing",
    ko: "점차 ~하고 있다"
  },
  formation: {
    ja: "動詞ます形の語幹 ＋ つつある",
    en: "V-masu stem + tsutsu aru",
    ko: "동사 ます형 어간 + つつある"
  },
  examples: [
    { ja: "町の人口は減りつつある。", en: "The town's population is gradually decreasing.", ko: "마을 인구는 줄어들고 있다." },
    { ja: "環境への意識は高まりつつある。", en: "Awareness of the environment is gradually rising.", ko: "환경에 대한 의식은 높아지고 있다." }
  ],
  note: {
    ja: "変化の途中であることを表す。進行中の「〜ている」より、変化の方向を強調する。",
    en: "Shows a change in progress, stressing direction more than ている.",
    ko: "변화가 진행 중임을 나타냅니다. ている보다 변화의 방향을 강조합니다."
  },
  similar: ["〜ている", "〜ようとしている"]
},
{
  id: "g64", pattern: "〜を限りに", core: "を限りに", reading: "をかぎりに", tag: "limit",
  meaning: {
    ja: "〜を最後として、それ以降はしない。",
    en: "as of ~; with ~ as the last",
    ko: "~을 마지막으로"
  },
  formation: {
    ja: "名詞 ＋ を限りに",
    en: "N + o kagiri ni",
    ko: "명사 + を限りに"
  },
  examples: [
    { ja: "今日を限りに、たばこをやめる。", en: "I will quit smoking as of today.", ko: "오늘을 마지막으로 담배를 끊는다." },
    { ja: "この公演を限りに、彼は引退する。", en: "He will retire after this performance.", ko: "이 공연을 마지막으로 그는 은퇴한다." }
  ],
  note: {
    ja: "時間や回数の区切りを表す。「これを限りに」はやや古い言い方。",
    en: "Marks a cut-off in time or number; これを限りに is a slightly older form.",
    ko: "시간이나 횟수의 구분점을 나타냅니다. これを限りに는 다소 오래된 표현입니다."
  },
  similar: ["〜を最後に", "〜まで"]
},
{
  id: "g65", pattern: "〜だに", core: "だに", reading: "だに", tag: "emphasis",
  meaning: {
    ja: "〜さえ。最低限の例を出して強調する。",
    en: "even ~ (emphasising a minimum)",
    ko: "~조차"
  },
  formation: {
    ja: "名詞／動詞る形 ＋ だに（＋ 否定・困難な内容）",
    en: "N / V-ru + dani (+ negative or extreme statement)",
    ko: "명사 / 동사 기본형 + だに (+ 부정·극단적 내용)"
  },
  examples: [
    { ja: "想像だにしなかった結果になった。", en: "The result was beyond anything I could have imagined.", ko: "상상조차 하지 못한 결과가 되었다." },
    { ja: "聞くだに恐ろしい話だ。", en: "It is a story that is frightening just to hear.", ko: "듣기만 해도 무서운 이야기다." }
  ],
  note: {
    ja: "「想像だにしない」「聞くだに恐ろしい」など、決まった組み合わせが多い。",
    en: "Often appears in set combinations such as 想像だにしない and 聞くだに恐ろしい.",
    ko: "想像だにしない, 聞くだに恐ろしい처럼 정해진 조합이 많습니다."
  },
  similar: ["〜さえ", "〜すら"]
}
);
