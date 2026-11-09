/* N1 grammar — part 1 (1–33) */
window.GRAMMAR = window.GRAMMAR || [];
window.GRAMMAR.push(
{
  id: "g1", pattern: "〜あげく(に)", core: "あげく", reading: "あげく", tag: "result",
  meaning: {
    ja: "長い間いろいろした結果、最後に望ましくない状態になる。",
    en: "after a long process, finally (with an undesirable result)",
    ko: "오랜 과정 끝에 결국 (좋지 않은 결과가) 되다"
  },
  formation: {
    ja: "動詞た形／名詞の ＋ あげく(に)",
    en: "V-ta / N no + ageku(ni)",
    ko: "동사 た형 / 명사 の + あげく(に)"
  },
  examples: [
    { ja: "さんざん悩んだあげく、会社を辞めることにした。", en: "After agonising over it for a long time, I decided to quit the company.", ko: "한참을 고민한 끝에 회사를 그만두기로 했다." },
    { ja: "口論のあげく、二人は離婚してしまった。", en: "After a heated argument, the two ended up divorcing.", ko: "말다툼을 벌인 끝에 두 사람은 결국 이혼했다." }
  ],
  note: {
    ja: "長い過程の末に、好ましくない結果が来る場合に使う。「末に」よりマイナス評価が強い。",
    en: "Used when a long process ends badly; more negative than 末に.",
    ko: "긴 과정 끝에 좋지 않은 결과가 올 때 씁니다. 末に보다 부정적 평가가 강합니다."
  },
  similar: ["〜末に", "〜結果"]
},
{
  id: "g2", pattern: "〜あまり(に)", core: "あまり", reading: "あまり", tag: "reason",
  meaning: {
    ja: "感情や程度がひどすぎて、その結果〜になる。",
    en: "so (much) that ~; out of excessive ~",
    ko: "너무 ~한 나머지"
  },
  formation: {
    ja: "動詞る形／名詞の／感情名詞 ＋ あまり(に)",
    en: "V-ru / N no / emotion noun + amari(ni)",
    ko: "동사 기본형 / 명사 の / 감정 명사 + あまり(に)"
  },
  examples: [
    { ja: "彼女は驚きのあまり、声も出なかった。", en: "She was so shocked that she could not even speak.", ko: "그녀는 너무 놀란 나머지 소리도 내지 못했다." },
    { ja: "心配するあまり、何度も電話してしまった。", en: "I was so worried that I called again and again.", ko: "걱정한 나머지 몇 번이나 전화를 걸고 말았다." }
  ],
  note: {
    ja: "「驚き・怒り・悲しみ・心配」など、感情を表す名詞と相性がいい。",
    en: "Often pairs with emotion nouns such as surprise, anger, sadness and worry.",
    ko: "놀람, 분노, 슬픔, 걱정처럼 감정을 나타내는 명사와 잘 어울립니다."
  },
  similar: ["〜あまりの〜に", "〜のあまり"]
},
{
  id: "g3", pattern: "〜いかんでは／〜いかんによっては", core: "いかんでは", reading: "いかんでは", tag: "condition",
  meaning: {
    ja: "〜の内容や結果によっては、ある事態が起こりうる。",
    en: "depending on how ~ turns out",
    ko: "~의 내용이나 결과에 따라서는"
  },
  formation: {
    ja: "名詞（の）＋ いかんでは／いかんによっては",
    en: "N(no) + ikande wa / ikan ni yotte wa",
    ko: "명사(の) + いかんでは / いかんによっては"
  },
  examples: [
    { ja: "今後の話し合いのいかんでは、契約を打ち切ることもある。", en: "Depending on how the talks go, we may terminate the contract.", ko: "앞으로의 협의 여하에 따라서는 계약을 중단할 수도 있다." },
    { ja: "成績のいかんによっては、進級できない場合もある。", en: "Depending on your grades, you may not be able to move up a year.", ko: "성적 여하에 따라서는 진급하지 못할 수도 있다." }
  ],
  note: {
    ja: "硬い改まった表現。ビジネス文書や公的な場面でよく使う。",
    en: "Formal and bookish; common in business documents and official contexts.",
    ko: "딱딱하고 격식 있는 표현으로, 비즈니스 문서나 공식 석상에서 자주 씁니다."
  },
  similar: ["〜次第では", "〜によっては"]
},
{
  id: "g4", pattern: "〜いかんにかかわらず", core: "いかんにかかわらず", reading: "いかんにかかわらず", tag: "condition",
  meaning: {
    ja: "〜がどうであっても、それに関係なく。",
    en: "regardless of what/how ~",
    ko: "~이 어떠하든 관계없이"
  },
  formation: {
    ja: "名詞 ＋ いかんにかかわらず",
    en: "N + ikan ni kakawarazu",
    ko: "명사 + いかんにかかわらず"
  },
  examples: [
    { ja: "理由のいかんにかかわらず、締め切り後の提出は認めない。", en: "Regardless of the reason, we do not accept submissions after the deadline.", ko: "이유 여하에 관계없이 마감 이후 제출은 인정하지 않는다." },
    { ja: "天候のいかんにかかわらず、イベントは開催します。", en: "The event will be held regardless of the weather.", ko: "날씨 여하에 관계없이 행사는 개최합니다." }
  ],
  note: {
    ja: "「いかん」は「どうであるか」という意味の硬い語。否定の内容とともに使うことが多い。",
    en: "いかん means how something is; often followed by a negative statement.",
    ko: "いかん은 '어떠함'이라는 뜻의 딱딱한 말로, 부정적인 내용과 함께 쓰이는 경우가 많습니다."
  },
  similar: ["〜にかかわらず", "〜を問わず"]
},
{
  id: "g5", pattern: "〜いかんせん", core: "いかんせん", reading: "いかんせん", tag: "reason",
  meaning: {
    ja: "残念ながら〜である。実現を妨げる原因を述べる。",
    en: "unfortunately it is because ~; regrettably ~",
    ko: "안타깝게도 ~인 것이 문제다"
  },
  formation: {
    ja: "いかんせん ＋ 文（原因）",
    en: "ikan sen + clause stating the cause",
    ko: "いかんせん + 원인을 나타내는 문장"
  },
  examples: [
    { ja: "いい企画だが、いかんせん予算が足りない。", en: "It is a good plan, but unfortunately there is not enough budget.", ko: "좋은 기획이지만 안타깝게도 예산이 부족하다." },
    { ja: "いかんせん、人手が足りなくて計画が進まない。", en: "The problem is that we are short-staffed, so the plan is not moving.", ko: "안타깝게도 인력이 부족해 계획이 진척되지 않는다." }
  ],
  note: {
    ja: "単独で副詞のように使い、後に続く文全体の理由を述べる。",
    en: "Stands alone like an adverb and introduces the reason for the whole clause.",
    ko: "단독으로 부사처럼 쓰며 뒤 문장 전체의 이유를 말합니다."
  },
  similar: ["〜残念ながら"]
},
{
  id: "g6", pattern: "〜かたがた", core: "かたがた", reading: "かたがた", tag: "purpose",
  meaning: {
    ja: "〜を兼ねて。二つの目的を同時に果たす。",
    en: "as a way of ~; serving two purposes at once",
    ko: "~을 겸하여"
  },
  formation: {
    ja: "名詞 ＋ かたがた",
    en: "N + katagata",
    ko: "명사 + かたがた"
  },
  examples: [
    { ja: "お礼かたがた、近況をご報告いたします。", en: "I am writing both to thank you and to give you an update.", ko: "감사 인사를 겸하여 근황을 보고드립니다." },
    { ja: "散歩かたがた、駅前の店まで行ってきた。", en: "I walked to the shop by the station, combining it with a stroll.", ko: "산책을 겸해서 역 앞 가게까지 다녀왔다." }
  ],
  note: {
    ja: "名詞だけにつく。手紙や挨拶など、改まった場面で使う。「〜がてら」より硬い。",
    en: "Attaches to nouns only. Formal, used in letters and greetings; stiffer than がてら.",
    ko: "명사에만 붙습니다. 편지나 인사 등 격식 있는 자리에서 쓰며 がてら보다 딱딱합니다."
  },
  similar: ["〜がてら", "〜を兼ねて"]
},
{
  id: "g7", pattern: "〜かたわら", core: "かたわら", reading: "かたわら", tag: "time",
  meaning: {
    ja: "主なことをする一方で、別のこともしている。",
    en: "while also doing ~ alongside one's main activity",
    ko: "~하는 한편 (본업 외에) ~도 하다"
  },
  formation: {
    ja: "動詞る形／名詞の ＋ かたわら",
    en: "V-ru / N no + katawara",
    ko: "동사 기본형 / 명사 の + かたわら"
  },
  examples: [
    { ja: "彼は会社勤めのかたわら、小説を書いている。", en: "He writes novels while working at a company.", ko: "그는 회사에 다니는 한편 소설을 쓰고 있다." },
    { ja: "母親は子育てのかたわら、自宅で教室を開いている。", en: "While raising her children, the mother runs a small school at home.", ko: "어머니는 육아를 하는 한편 집에서 교실을 열고 있다." }
  ],
  note: {
    ja: "長期にわたる二つの活動を並べる。名詞につくときは「の」が必要。",
    en: "Describes two long-term activities. Nouns take の before it.",
    ko: "장기적인 두 활동을 나란히 말합니다. 명사 뒤에는 の가 필요합니다."
  },
  similar: ["〜ながら", "〜一方で"]
},
{
  id: "g8", pattern: "〜がてら", core: "がてら", reading: "がてら", tag: "purpose",
  meaning: {
    ja: "〜をするついでに、別のこともする。",
    en: "while doing ~; on the way, as a side purpose",
    ko: "~하는 김에"
  },
  formation: {
    ja: "動詞ます形の語幹／名詞 ＋ がてら",
    en: "V-masu stem / N + gatera",
    ko: "동사 ます형 어간 / 명사 + がてら"
  },
  examples: [
    { ja: "買い物がてら、公園を散歩した。", en: "I took a walk in the park while out shopping.", ko: "장을 보는 김에 공원을 산책했다." },
    { ja: "散歩がてら、郵便局に寄ってきた。", en: "I stopped by the post office on my walk.", ko: "산책하는 김에 우체국에 들렀다." }
  ],
  note: {
    ja: "移動を伴う行為に使うことが多い。主な目的は前の動作。",
    en: "Often involves movement; the main purpose is the first action.",
    ko: "이동을 수반하는 행위에 주로 씁니다. 주된 목적은 앞의 동작입니다."
  },
  similar: ["〜かたがた", "〜ついでに"]
},
{
  id: "g9", pattern: "〜かと思うと／〜かと思ったら", core: "かと思うと", reading: "かとおもうと", tag: "time",
  meaning: {
    ja: "前のことが終わった直後に、次のことが起こる。",
    en: "no sooner than ~; just when one thinks ~",
    ko: "~하자마자 (예상 밖의 일이)"
  },
  formation: {
    ja: "動詞た形 ＋ かと思うと／かと思ったら",
    en: "V-ta + ka to omou to / ka to omottara",
    ko: "동사 た형 + かと思うと / かと思ったら"
  },
  examples: [
    { ja: "空が暗くなったかと思うと、急に雨が降り出した。", en: "No sooner had the sky darkened than it suddenly began to rain.", ko: "하늘이 어두워지더니 갑자기 비가 내리기 시작했다." },
    { ja: "泣いているかと思うと、もう笑っている。", en: "One moment she is crying, the next she is already laughing.", ko: "울고 있나 싶더니 벌써 웃고 있다." }
  ],
  note: {
    ja: "話し手の意外な気持ちを表す。二つの動作がほぼ同時に起きる。",
    en: "Expresses the speaker's surprise at how quickly things change.",
    ko: "화자의 의외라는 느낌을 나타냅니다. 두 동작이 거의 동시에 일어납니다."
  },
  similar: ["〜が早いか", "〜たとたん"]
},
{
  id: "g10", pattern: "〜が早いか", core: "が早いか", reading: "がはやいか", tag: "time",
  meaning: {
    ja: "〜すると、ほとんど同時に素早く次の動作をする。",
    en: "as soon as ~ (and immediately)",
    ko: "~하자마자 (재빨리)"
  },
  formation: {
    ja: "動詞る形／た形 ＋ が早いか",
    en: "V-ru / V-ta + ga hayai ka",
    ko: "동사 기본형 / た형 + が早いか"
  },
  examples: [
    { ja: "ベルが鳴るが早いか、子どもたちは教室を飛び出した。", en: "As soon as the bell rang, the children dashed out of the classroom.", ko: "종이 울리자마자 아이들은 교실 밖으로 뛰어나갔다." },
    { ja: "ドアが開くが早いか、犬が外へ飛び出した。", en: "The moment the door opened, the dog bolted outside.", ko: "문이 열리자마자 개가 밖으로 튀어나갔다." }
  ],
  note: {
    ja: "意志的な動作に使う。「〜かと思うと」より動作の速さを強調する。",
    en: "Used with deliberate actions; stresses speed more than かと思うと.",
    ko: "의지적인 동작에 씁니다. かと思うと보다 동작의 빠름을 강조합니다."
  },
  similar: ["〜かと思うと", "〜やいなや"]
},
{
  id: "g11", pattern: "〜かれ〜かれ", core: "かれ", reading: "かれ", tag: "time", quiz: false,
  meaning: {
    ja: "時間が経てば、遅いか早いかの違いはあっても必ず〜。",
    en: "sooner or later; more or less (paired adjective stems)",
    ko: "늦든 빠르든 / 많든 적든"
  },
  formation: {
    ja: "形容詞の語幹 ＋ かれ ＋ 同じ語 ＋ かれ（遅かれ早かれ など）",
    en: "adjective stem + kare + adjective stem + kare (e.g. osokare hayakare)",
    ko: "형용사 어간 + かれ + 형용사 어간 + かれ (예: 遅かれ早かれ)"
  },
  examples: [
    { ja: "遅かれ早かれ、彼は真実を知ることになるだろう。", en: "Sooner or later, he will learn the truth.", ko: "늦든 빠르든 그는 진실을 알게 될 것이다." },
    { ja: "多かれ少なかれ、誰にでも悩みはある。", en: "Everyone has worries, more or less.", ko: "많든 적든 누구에게나 고민은 있다." }
  ],
  note: {
    ja: "対になる形容詞を組み合わせた決まった言い方。「遅かれ早かれ」「多かれ少なかれ」が代表例。",
    en: "A set pattern pairing opposite adjectives; 遅かれ早かれ and 多かれ少なかれ are the most common.",
    ko: "반대되는 형용사를 짝지은 정해진 표현입니다. 遅かれ早かれ, 多かれ少なかれ가 대표적입니다."
  },
  similar: ["〜いずれ"]
},
{
  id: "g12", pattern: "〜きらいがある", core: "きらいがある", reading: "きらいがある", tag: "tendency",
  meaning: {
    ja: "好ましくない傾向がある。",
    en: "have a tendency to (something undesirable)",
    ko: "~한 경향이 있다 (바람직하지 않은)"
  },
  formation: {
    ja: "動詞る形／名詞の ＋ きらいがある",
    en: "V-ru / N no + kirai ga aru",
    ko: "동사 기본형 / 명사 の + きらいがある"
  },
  examples: [
    { ja: "彼は物事を悲観的に考えるきらいがある。", en: "He has a tendency to see things pessimistically.", ko: "그는 사물을 비관적으로 보는 경향이 있다." },
    { ja: "この計画は理想に走るきらいがある。", en: "This plan tends to chase ideals too far.", ko: "이 계획은 이상에 치우치는 경향이 있다." }
  ],
  note: {
    ja: "相手の欠点をやわらかく指摘するときに使う。",
    en: "A soft way to point out someone's shortcoming.",
    ko: "상대의 단점을 부드럽게 지적할 때 씁니다."
  },
  similar: ["〜傾向がある", "〜がちだ"]
},
{
  id: "g13", pattern: "〜ごとき／〜ごとく", core: "ごとき", reading: "ごとき", tag: "evaluation",
  meaning: {
    ja: "〜のような。硬い比喩表現で、軽んじる気持ちを含むこともある。",
    en: "like ~ / such as ~ (literary; sometimes dismissive)",
    ko: "~ 따위 / ~와 같은 (문어체, 경시하는 느낌도 있음)"
  },
  formation: {
    ja: "名詞 ＋ のごとき／ごとく ＋ 動詞（ごとし）",
    en: "N + no gotoki / gotoku (+ verb)",
    ko: "명사 + のごとき / ごとく (+ 동사)"
  },
  examples: [
    { ja: "私ごときが、そんな大切な仕事を任されるとは思わなかった。", en: "I never expected someone like me to be given such important work.", ko: "나 같은 사람이 그런 중요한 일을 맡게 될 줄은 몰랐다." },
    { ja: "彼は水を得た魚のごとく働いた。", en: "He worked like a fish that had found water.", ko: "그는 물을 만난 물고기처럼 일했다." }
  ],
  note: {
    ja: "「〜のように」の硬い形。自分をへりくだる場合にも使う。",
    en: "A literary version of のように; also used for self-deprecation.",
    ko: "のように의 딱딱한 형태로, 자신을 낮출 때도 씁니다."
  },
  similar: ["〜のように", "〜如し"]
},
{
  id: "g14", pattern: "〜こととて", core: "こととて", reading: "こととて", tag: "reason",
  meaning: {
    ja: "〜だから。弁解やお詫びの理由を述べる。",
    en: "because (of the fact that) ~; used in apologies or excuses",
    ko: "~이기 때문에 (변명·사과)"
  },
  formation: {
    ja: "名詞＋の／な形容詞＋な／動詞る形 ＋ こととて",
    en: "N no / na-adj na / V-ru + koto to te",
    ko: "명사 の / な형용사 な / 동사 기본형 + こととて"
  },
  examples: [
    { ja: "慣れぬこととて、失礼があったらお許しください。", en: "As I am inexperienced, please forgive any rudeness.", ko: "익숙하지 않은 탓에 실례가 있었다면 용서해 주십시오." },
    { ja: "急なこととて、十分な準備ができなかった。", en: "Because it was so sudden, we could not prepare properly.", ko: "갑작스러운 일이라 충분히 준비하지 못했다." }
  ],
  note: {
    ja: "改まった表現で、目上の人へのお詫びによく使う。",
    en: "Formal, often used when apologising to a superior.",
    ko: "격식 있는 표현으로 윗사람에게 사과할 때 자주 씁니다."
  },
  similar: ["〜ものですから", "〜ため"]
},
{
  id: "g15", pattern: "〜ことなしに", core: "ことなしに", reading: "ことなしに", tag: "negation",
  meaning: {
    ja: "〜をしないで。",
    en: "without doing ~",
    ko: "~하지 않고서는"
  },
  formation: {
    ja: "動詞る形 ＋ ことなしに",
    en: "V-ru + koto nashi ni",
    ko: "동사 기본형 + ことなしに"
  },
  examples: [
    { ja: "努力することなしに、成功はありえない。", en: "Success is impossible without effort.", ko: "노력하지 않고서는 성공은 있을 수 없다." },
    { ja: "誰にも知られることなしに、彼は町を去った。", en: "He left town without anyone knowing.", ko: "누구에게도 알려지지 않은 채 그는 마을을 떠났다." }
  ],
  note: {
    ja: "「〜ないで」の硬い言い方。後に否定や不可能の表現が来ることが多い。",
    en: "A formal version of ないで; often followed by a negative or impossible statement.",
    ko: "ないで의 딱딱한 표현으로, 뒤에 부정이나 불가능 표현이 오는 경우가 많습니다."
  },
  similar: ["〜ずに", "〜なしに"]
},
{
  id: "g16", pattern: "〜しまつだ", core: "しまつだ", reading: "しまつだ", tag: "result",
  meaning: {
    ja: "最後にはひどい結果になった。あきれた気持ちを込める。",
    en: "end up (in a sorry state)",
    ko: "결국 ~하는 꼴이 되다"
  },
  formation: {
    ja: "動詞る形／た形 ＋ しまつだ",
    en: "V-ru / V-ta + shimatsu da",
    ko: "동사 기본형 / た형 + しまつだ"
  },
  examples: [
    { ja: "節約していたのに、最後には借金を抱えるしまつだ。", en: "I was saving money, but in the end I ended up in debt.", ko: "절약하고 있었는데 결국 빚을 떠안는 꼴이 되었다." },
    { ja: "彼は毎日遅刻し、ついにはクビになるしまつだった。", en: "He was late every day and ended up getting fired.", ko: "그는 매일 지각하다가 결국 해고되는 지경에 이르렀다." }
  ],
  note: {
    ja: "悪い結果に至ったことを、あきれた気持ちで述べる。",
    en: "Describes a bad outcome with a tone of dismay.",
    ko: "좋지 않은 결과에 이르렀음을 어이없는 심정으로 말합니다."
  },
  similar: ["〜あげく", "〜結果になる"]
},
{
  id: "g17", pattern: "〜ずくめ", core: "ずくめ", reading: "ずくめ", tag: "evaluation",
  meaning: {
    ja: "〜ばかりでいっぱい。全体が〜で占められている。",
    en: "entirely ~; nothing but ~",
    ko: "온통 ~투성이"
  },
  formation: {
    ja: "名詞 ＋ ずくめ",
    en: "N + zukume",
    ko: "명사 + ずくめ"
  },
  examples: [
    { ja: "彼の部屋は白ずくめだった。", en: "His room was entirely white.", ko: "그의 방은 온통 하얀색이었다." },
    { ja: "今年はいいことずくめの一年だった。", en: "This year was full of nothing but good things.", ko: "올해는 좋은 일투성이인 한 해였다." }
  ],
  note: {
    ja: "いいことにも悪いことにも使えるが、良い例が多い。「黒ずくめ」「規則ずくめ」など。",
    en: "Works with good or bad things, though positive uses are common: 黒ずくめ, 規則ずくめ.",
    ko: "좋은 일에도 나쁜 일에도 쓸 수 있지만 좋은 예가 많습니다. 黒ずくめ, 規則ずくめ 등."
  },
  similar: ["〜だらけ", "〜ばかり"]
},
{
  id: "g18", pattern: "〜ずじまい", core: "ずじまい", reading: "ずじまい", tag: "result",
  meaning: {
    ja: "しようと思っていたが、結局しないまま終わった。",
    en: "ended up not doing ~ (though one meant to)",
    ko: "결국 ~하지 못하고 말았다"
  },
  formation: {
    ja: "動詞ない形の語幹（〜ず）＋ じまい",
    en: "V-nai stem (zu) + jimai",
    ko: "동사 ない형 어간(ず) + じまい"
  },
  examples: [
    { ja: "忙しくて、その本は読まずじまいだった。", en: "I was busy and never got around to reading the book.", ko: "바빠서 그 책은 끝내 읽지 못했다." },
    { ja: "結局、彼には本当のことを言わずじまいだ。", en: "In the end, I never told him the truth.", ko: "결국 그에게 진실을 말하지 못했다." }
  ],
  note: {
    ja: "残念だという気持ちが含まれる。意志的な行為に使う。",
    en: "Carries regret; used with intentional actions.",
    ko: "아쉬운 마음이 담깁니다. 의지적인 행위에 씁니다."
  },
  similar: ["〜ないまま", "〜そこなう"]
},
{
  id: "g19", pattern: "〜ずにはおかない", core: "ずにはおかない", reading: "ずにはおかない", tag: "emphasis",
  meaning: {
    ja: "必ず〜させる。自然に〜という状態を引き起こす。",
    en: "will inevitably cause ~; cannot fail to ~",
    ko: "반드시 ~하게 만들다"
  },
  formation: {
    ja: "動詞ない形の語幹（〜ず）＋ にはおかない",
    en: "V-nai stem (zu) + ni wa okanai",
    ko: "동사 ない형 어간(ず) + にはおかない"
  },
  examples: [
    { ja: "その映画は見る者を感動させずにはおかない。", en: "That film cannot fail to move anyone who sees it.", ko: "그 영화는 보는 사람을 감동시키지 않고는 못 배긴다." },
    { ja: "彼の発言は社会に議論を起こさずにはおかないだろう。", en: "His remark will inevitably spark debate in society.", ko: "그의 발언은 사회에 논쟁을 일으키지 않고는 못 배길 것이다." }
  ],
  note: {
    ja: "人を感動させる・考えさせるなど、強い働きかけを表す。",
    en: "Expresses a strong effect on people, such as moving or provoking them.",
    ko: "사람을 감동시키거나 생각하게 하는 등 강한 작용을 나타냅니다."
  },
  similar: ["〜ないではおかない", "〜ずにはいられない"]
},
{
  id: "g20", pattern: "〜ずにはすまない", core: "ずにはすまない", reading: "ずにはすまない", tag: "negation",
  meaning: {
    ja: "社会的・道徳的に、〜しなければならない状況だ。",
    en: "must ~; there is no way but to ~",
    ko: "~하지 않으면 안 된다 (상황상)"
  },
  formation: {
    ja: "動詞ない形の語幹（〜ず）＋ にはすまない",
    en: "V-nai stem (zu) + ni wa sumanai",
    ko: "동사 ない형 어간(ず) + にはすまない"
  },
  examples: [
    { ja: "自分のミスなのだから、謝らずにはすまない。", en: "Since it was my mistake, I have no choice but to apologise.", ko: "내 실수이니만큼 사과하지 않으면 안 된다." },
    { ja: "こんなに迷惑をかけたら、何かお礼をせずにはすまない。", en: "Having caused so much trouble, I must do something to thank them.", ko: "이렇게 폐를 끼쳤으니 뭔가 감사의 뜻을 표하지 않으면 안 된다." }
  ],
  note: {
    ja: "自分の意思ではなく、状況や立場から義務として迫られる感じ。",
    en: "Not a personal choice but an obligation forced by the situation.",
    ko: "자신의 의지가 아니라 상황이나 입장 때문에 의무로 강요되는 느낌입니다."
  },
  similar: ["〜ざるをえない", "〜ないわけにはいかない"]
},
{
  id: "g21", pattern: "〜たところで", core: "たところで", reading: "たところで", tag: "condition",
  meaning: {
    ja: "仮に〜しても、期待する結果にはならない。",
    en: "even if ~ (it will not help)",
    ko: "~해 봤자"
  },
  formation: {
    ja: "動詞た形 ＋ ところで",
    en: "V-ta + tokoro de",
    ko: "동사 た형 + ところで"
  },
  examples: [
    { ja: "今さら謝ったところで、許してもらえないだろう。", en: "Even if I apologise now, they probably will not forgive me.", ko: "이제 와서 사과해 봤자 용서받지 못할 것이다." },
    { ja: "急いだところで、間に合いはしない。", en: "Even if we hurry, we will not make it.", ko: "서둘러 봤자 시간에 맞지 않는다." }
  ],
  note: {
    ja: "後に否定や否定的な内容が続く。「〜ても」より無駄だという気持ちが強い。",
    en: "Followed by a negative or hopeless statement; more dismissive than ても.",
    ko: "뒤에 부정적 내용이 이어집니다. ても보다 허무하다는 느낌이 강합니다."
  },
  similar: ["〜ても", "〜ところが"]
},
{
  id: "g22", pattern: "〜たりとも", core: "たりとも", reading: "たりとも", tag: "limit",
  meaning: {
    ja: "〜さえも。最小の数量を強調して否定する。",
    en: "not even ~ (with a minimum quantity)",
    ko: "단 ~조차도 (부정)"
  },
  formation: {
    ja: "数量詞 ＋ たりとも ＋ 否定",
    en: "quantity word + taritomo + negative",
    ko: "수량사 + たりとも + 부정"
  },
  examples: [
    { ja: "一円たりとも無駄にはしない。", en: "I will not waste even a single yen.", ko: "단 1엔도 낭비하지 않겠다." },
    { ja: "一日たりとも練習を休まなかった。", en: "I never skipped practice, not even for a day.", ko: "단 하루도 연습을 쉬지 않았다." }
  ],
  note: {
    ja: "「一円」「一日」「一秒」など、最小単位の数量とともに使う。",
    en: "Used with minimum units such as one yen, one day or one second.",
    ko: "1엔, 하루, 1초처럼 최소 단위의 수량과 함께 씁니다."
  },
  similar: ["〜さえ", "〜すら"]
},
{
  id: "g23", pattern: "〜つ〜つ", core: "つ", reading: "つ", tag: "time", quiz: false,
  meaning: {
    ja: "二つの動作を交互に、または繰り返し行う。",
    en: "doing this and that, back and forth",
    ko: "~하기도 하고 ~하기도 하며 (반복)"
  },
  formation: {
    ja: "動詞ます形の語幹 ＋ つ ＋ 動詞ます形の語幹 ＋ つ",
    en: "V-masu stem + tsu + V-masu stem + tsu",
    ko: "동사 ます형 어간 + つ + 동사 ます형 어간 + つ"
  },
  examples: [
    { ja: "山を登りつ下りつ、一日中歩き回った。", en: "We walked all day, climbing up and down the mountain.", ko: "산을 오르락내리락하며 하루 종일 걸어 다녔다." },
    { ja: "行きつ戻りつしながら、彼は決断できずにいた。", en: "Pacing back and forth, he could not make up his mind.", ko: "왔다 갔다 하면서 그는 결단을 내리지 못하고 있었다." }
  ],
  note: {
    ja: "「〜たり〜たり」の硬い言い方。同じ動作の繰り返しを表す。",
    en: "A literary form of たり〜たり, showing repeated or alternating actions.",
    ko: "たり〜たり의 딱딱한 형태로, 같은 동작의 반복을 나타냅니다."
  },
  similar: ["〜たり〜たり", "〜つつ"]
},
{
  id: "g24", pattern: "〜つつも", core: "つつも", reading: "つつも", tag: "contrast",
  meaning: {
    ja: "〜ながらも。反対の気持ちを抱えながら行為をする。",
    en: "although ~; even while ~",
    ko: "~하면서도"
  },
  formation: {
    ja: "動詞ます形の語幹 ＋ つつも",
    en: "V-masu stem + tsutsumo",
    ko: "동사 ます형 어간 + つつも"
  },
  examples: [
    { ja: "悪いと知りつつも、つい嘘をついてしまった。", en: "Although I knew it was wrong, I ended up lying.", ko: "나쁜 줄 알면서도 나도 모르게 거짓말을 하고 말았다." },
    { ja: "体に悪いと分かりつつも、たばこがやめられない。", en: "Even though I know it is bad for me, I cannot stop smoking.", ko: "몸에 나쁜 줄 알면서도 담배를 끊지 못하겠다." }
  ],
  note: {
    ja: "「〜つつ」に「も」がつくと、逆接の意味がはっきりする。",
    en: "Adding も to つつ makes the contrast explicit.",
    ko: "つつ에 も가 붙으면 역접의 의미가 분명해집니다."
  },
  similar: ["〜ながらも", "〜つつ"]
},
{
  id: "g25", pattern: "〜であれ〜であれ", core: "であれ", reading: "であれ", tag: "condition", quiz: false,
  meaning: {
    ja: "〜でも〜でも、どちらの場合も同じだ。",
    en: "whether ~ or ~",
    ko: "~이든 ~이든"
  },
  formation: {
    ja: "名詞 ＋ であれ ＋ 名詞 ＋ であれ",
    en: "N + de are + N + de are",
    ko: "명사 + であれ + 명사 + であれ"
  },
  examples: [
    { ja: "正社員であれ、派遣社員であれ、仕事への姿勢は同じであるべきだ。", en: "Whether regular or temporary staff, the attitude to work should be the same.", ko: "정규직이든 파견직이든 일에 대한 태도는 같아야 한다." },
    { ja: "雨であれ雪であれ、試合は行われる。", en: "Whether it rains or snows, the match will be held.", ko: "비가 오든 눈이 오든 경기는 열린다." }
  ],
  note: {
    ja: "「〜でも〜でも」の硬い言い方。譲歩の気持ちを表す。",
    en: "A formal way to say whether A or B; expresses concession.",
    ko: "~이든 ~이든의 딱딱한 표현으로 양보의 뜻을 나타냅니다."
  },
  similar: ["〜であろうと〜であろうと", "〜にせよ〜にせよ"]
},
{
  id: "g26", pattern: "〜てからというもの", core: "てからというもの", reading: "てからというもの", tag: "time",
  meaning: {
    ja: "ある出来事の後、その状態がずっと続いている。",
    en: "ever since ~",
    ko: "~한 이후로 줄곧"
  },
  formation: {
    ja: "動詞て形 ＋ からというもの",
    en: "V-te + kara to iu mono",
    ko: "동사 て형 + からというもの"
  },
  examples: [
    { ja: "子どもが生まれてからというもの、生活が一変した。", en: "Ever since my child was born, my life has changed completely.", ko: "아이가 태어난 이후로 생활이 완전히 바뀌었다." },
    { ja: "あの事故があってからというもの、彼は車を運転しない。", en: "Since that accident, he has not driven a car.", ko: "그 사고가 있은 이후로 그는 차를 운전하지 않는다." }
  ],
  note: {
    ja: "変化が大きく、その後の状態が長く続くことを強調する。",
    en: "Stresses a major change and the long-lasting state that followed.",
    ko: "변화가 크고 그 후의 상태가 오래 지속됨을 강조합니다."
  },
  similar: ["〜以来", "〜て以来"]
},
{
  id: "g27", pattern: "〜てでも", core: "てでも", reading: "てでも", tag: "purpose",
  meaning: {
    ja: "無理な手段を使っても、目的を達成したい。",
    en: "even if I have to ~ (to achieve something)",
    ko: "무리해서라도 ~해서라도"
  },
  formation: {
    ja: "動詞て形 ＋ でも",
    en: "V-te + demo",
    ko: "동사 て형 + でも"
  },
  examples: [
    { ja: "借金してでも、その大学に行きたい。", en: "I want to go to that university even if I have to borrow money.", ko: "빚을 내서라도 그 대학에 가고 싶다." },
    { ja: "徹夜してでも、締め切りに間に合わせるつもりだ。", en: "I intend to meet the deadline even if I have to stay up all night.", ko: "밤을 새워서라도 마감에 맞출 생각이다." }
  ],
  note: {
    ja: "強い意志を表す。後に続く目的は話し手が強く望むこと。",
    en: "Shows strong determination; the goal is something the speaker really wants.",
    ko: "강한 의지를 나타냅니다. 뒤의 목적은 화자가 간절히 바라는 일입니다."
  },
  similar: ["〜までして", "〜ても"]
},
{
  id: "g28", pattern: "〜とはいえ", core: "とはいえ", reading: "とはいえ", tag: "contrast",
  meaning: {
    ja: "〜と言っても、やはり実際は〜だ。",
    en: "although ~; even so",
    ko: "~라고는 해도"
  },
  formation: {
    ja: "文 ＋ とはいえ",
    en: "clause + to wa ie",
    ko: "문장 + とはいえ"
  },
  examples: [
    { ja: "春とはいえ、朝はまだ寒い。", en: "Although it is spring, the mornings are still cold.", ko: "봄이라고는 해도 아침은 아직 춥다." },
    { ja: "便利とはいえ、使い方を間違えると危険だ。", en: "Even though it is convenient, it is dangerous if used wrongly.", ko: "편리하다고는 해도 사용법을 틀리면 위험하다." }
  ],
  note: {
    ja: "前の内容を一度認めてから、それでも成り立つ別の事実を述べる。",
    en: "Concedes the first point, then states a contrasting fact that still holds.",
    ko: "앞의 내용을 일단 인정한 뒤, 그래도 성립하는 다른 사실을 말합니다."
  },
  similar: ["〜ものの", "〜とは言うものの"]
},
{
  id: "g29", pattern: "〜ともあろうものが", core: "ともあろうものが", reading: "ともあろうものが", tag: "evaluation",
  meaning: {
    ja: "〜のような高い立場の人が、まさかそんなことをするとは。",
    en: "someone of the standing of ~ (should not do such a thing)",
    ko: "~일 사람이 (어찌 그런 일을)"
  },
  formation: {
    ja: "名詞 ＋ ともあろうものが",
    en: "N + to mo arou mono ga",
    ko: "명사 + ともあろうものが"
  },
  examples: [
    { ja: "大臣ともあろうものが、そんな失礼な発言をするとは。", en: "That a cabinet minister should make such a rude remark!", ko: "장관일 사람이 그런 무례한 발언을 하다니." },
    { ja: "大学生ともあろうものが、こんな簡単な計算もできないのか。", en: "A university student who cannot do such simple arithmetic?", ko: "대학생일 사람이 이런 간단한 계산도 못 하는 건가." }
  ],
  note: {
    ja: "非難やあきれた気持ちを強く表す。目上の立場の人や組織に使う。",
    en: "Strongly criticises or expresses dismay at someone of high standing.",
    ko: "비난이나 어이없는 마음을 강하게 나타냅니다. 높은 지위의 사람이나 조직에 씁니다."
  },
  similar: ["〜ともあろう人が", "〜にあるまじき"]
},
{
  id: "g30", pattern: "〜ともなく／〜ともなしに", core: "ともなく", reading: "ともなく", tag: "time",
  meaning: {
    ja: "特に目的や意識がなく、自然に〜する。",
    en: "without particularly intending to ~",
    ko: "특별히 의식하지 않고 (어느새) ~하다"
  },
  formation: {
    ja: "動詞る形 ＋ ともなく／ともなしに",
    en: "V-ru + to mo naku / to mo nashi ni",
    ko: "동사 기본형 + ともなく / ともなしに"
  },
  examples: [
    { ja: "見るともなくテレビを見ていた。", en: "I was watching TV without really watching it.", ko: "딱히 보지도 않으면서 텔레비전을 보고 있었다." },
    { ja: "誰に言うともなく、ひとりでつぶやいた。", en: "I muttered to myself, not really to anyone.", ko: "누구에게라기보다 혼잣말로 중얼거렸다." }
  ],
  note: {
    ja: "「どこからともなく」「誰にともなく」など、疑問詞とセットでもよく使う。",
    en: "Also common with question words: どこからともなく, 誰にともなく.",
    ko: "どこからともなく, 誰にともなく처럼 의문사와 함께 쓰기도 합니다."
  },
  similar: ["〜なんとなく", "〜いつのまにか"]
},
{
  id: "g31", pattern: "〜ないまでも", core: "ないまでも", reading: "ないまでも", tag: "limit",
  meaning: {
    ja: "高い程度は無理でも、せめて低い程度でいいから。",
    en: "even if not quite ~ (at least)",
    ko: "~까지는 아니더라도"
  },
  formation: {
    ja: "動詞ない形 ＋ までも",
    en: "V-nai + made mo",
    ko: "동사 ない형 + までも"
  },
  examples: [
    { ja: "毎日とは言わないまでも、週に一度は運動したい。", en: "I want to exercise at least once a week, if not every day.", ko: "매일까지는 아니더라도 일주일에 한 번은 운동하고 싶다." },
    { ja: "完璧ではないまでも、できるだけのことはした。", en: "It may not be perfect, but I did everything I could.", ko: "완벽하지는 않더라도 할 수 있는 만큼은 했다." }
  ],
  note: {
    ja: "前で高い理想を否定し、後で現実的な最低ラインを示す。",
    en: "Denies an ideal level first, then names a realistic minimum.",
    ko: "앞에서 높은 이상을 부정하고 뒤에서 현실적인 최소선을 제시합니다."
  },
  similar: ["〜とは言わないまでも", "〜せめて"]
},
{
  id: "g32", pattern: "〜ながらも", core: "ながらも", reading: "ながらも", tag: "contrast",
  meaning: {
    ja: "〜けれども。予想に反する事実を述べる。",
    en: "although ~; even while ~",
    ko: "~이면서도 / ~임에도"
  },
  formation: {
    ja: "動詞ます形の語幹／い形容詞／な形容詞／名詞 ＋ ながらも",
    en: "V-masu stem / i-adj / na-adj / N + nagara mo",
    ko: "동사 ます형 어간 / い형용사 / な형용사 / 명사 + ながらも"
  },
  examples: [
    { ja: "狭いながらも、ようやく自分の家を持てた。", en: "Though small, I finally have a home of my own.", ko: "좁지만 마침내 내 집을 갖게 되었다." },
    { ja: "彼はその話を聞きながらも、何も言わなかった。", en: "He heard the story but said nothing.", ko: "그는 그 이야기를 들으면서도 아무 말도 하지 않았다." }
  ],
  note: {
    ja: "名詞や形容詞にもつく。「〜のに」よりやわらかい。",
    en: "Attaches to nouns and adjectives too; softer than のに.",
    ko: "명사나 형용사에도 붙습니다. のに보다 부드러운 표현입니다."
  },
  similar: ["〜けれども", "〜にもかかわらず"]
},
{
  id: "g33", pattern: "〜なくして(は)", core: "なくして", reading: "なくして", tag: "condition",
  meaning: {
    ja: "もし〜がなかったら、〜は実現しない。",
    en: "without ~ (it is impossible)",
    ko: "~이 없이는"
  },
  formation: {
    ja: "名詞 ＋ なくして(は)",
    en: "N + nakushite (wa)",
    ko: "명사 + なくして(は)"
  },
  examples: [
    { ja: "努力なくして成功はない。", en: "There is no success without effort.", ko: "노력 없이는 성공도 없다." },
    { ja: "市民の協力なくしては、この計画は成り立たない。", en: "Without the cooperation of citizens, this plan cannot work.", ko: "시민의 협력 없이는 이 계획은 성립하지 않는다." }
  ],
  note: {
    ja: "後に否定や困難な内容が来ることが多い。「〜なしには」とほぼ同じ。",
    en: "Often followed by a negative; close in meaning to なしには.",
    ko: "뒤에 부정적 내용이 오는 경우가 많습니다. なしには와 거의 같습니다."
  },
  similar: ["〜なしには", "〜がなければ"]
}
);
