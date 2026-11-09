/* N1 reading comprehension — original passages in JLPT-style formats.
   Formats: short passage (内容理解), information retrieval (情報検索),
   integrated understanding (統合理解), text grammar (文章の文法). */
window.READING = [
  {
    id: "r1",
    type: "short",
    title: { ja: "在宅勤務の雑談", en: "Small talk when working from home", ko: "재택근무와 잡담" },
    passage: "在宅勤務が広がった当初、多くの企業は通勤時間の削減や業務の効率化を期待した。確かに、集中して作業できる時間は増えた。しかし、しばらくして、上司や同僚との何気ない雑談が、仕事の相談や新しいアイデアのきっかけになっていたことに気づく人が出てきた。画面越しの会議では、議題に沿った話はできるが、雑談は生まれにくい。ある会社では、週に一度、仕事の話をしない短い集まりをオンラインで開くようになった。すると、部署を超えた相談が増え、若手社員が質問しやすくなったという。効率だけを追い求めると、職場のつながりが失われる危険があるのかもしれない。",
    questions: [
      {
        id: "r1q1",
        question: "在宅勤務について、筆者が最も言いたいことは何か。",
        options: [
          "在宅勤務は通勤時間を減らすが、集中力が下がる。",
          "在宅勤務では、一見無駄に見える雑談のような時間が失われやすい。",
          "オンライン会議を増やせば、社員同士の相談は自然に増える。",
          "在宅勤務は若手社員の質問を難しくする一方で、効率は必ず上がる。"
        ],
        answer: 1,
        explain: {
          ja: "正解は2。在宅勤務で効率は上がったが、雑談が失われ、それが相談やアイデアのきっかけになっていたと述べている。1の「集中力が下がる」、3の「会議を増やせば相談が増える」は本文にない。4は「質問が難しくなる」が本文と逆で、「効率が必ず上がる」も本文の主張ではない。",
          en: "The answer is 2. The passage says efficiency rose, but casual conversation — which had been a trigger for advice and ideas — was lost. Option 1 (focus declines) and option 3 (more meetings automatically increase consultation) are not stated. Option 4 reverses the point about questions becoming harder and overstates the efficiency claim.",
          ko: "정답은 2. 재택근무로 효율은 높아졌지만, 상담이나 아이디어의 계기가 되던 잡담이 사라졌다고 말한다. 1의 ‘집중력 저하’, 3의 ‘회의를 늘리면 상담이 늘어난다’는 본문에 없다. 4는 ‘질문이 어려워진다’는 부분이 본문과 반대이고, ‘효율이 반드시 오른다’도 글의 주장이 아니다."
        }
      },
      {
        id: "r1q2",
        question: "「ある会社」が週に一度行っていることの目的は何か。",
        options: [
          "業務の進捗を細かく確認する。",
          "部署間の競争を促す。",
          "仕事以外の会話を通じて、社員のつながりを保つ。",
          "オンライン会議の技術を向上させる。"
        ],
        answer: 2,
        explain: {
          ja: "正解は3。仕事の話をしない短い集まりを開くことで、部署を超えた相談や若手の質問が増えたとある。進捗確認や競争の促進、技術向上は目的として述べられていない。",
          en: "The answer is 3. The company holds a short online gathering with no work talk, and cross-department consultation and questions from younger staff increased. Progress checks, competition and technical improvement are not mentioned as purposes.",
          ko: "정답은 3. 업무 이야기를 하지 않는 짧은 모임을 열자 부서를 넘은 상담과 젊은 사원의 질문이 늘었다고 한다. 진척 확인, 경쟁 촉진, 기술 향상은 목적으로 언급되지 않는다."
        }
      }
    ]
  },
  {
    id: "r2",
    type: "short",
    title: { ja: "図書館の電子化", en: "Digital books at the library", ko: "도서관의 전자화" },
    passage: "市立図書館は今年度から、蔵書の一部を電子書籍でも提供することを決めた。利用者は来館しなくても本を読めるようになり、高齢者や子育て中の人にも便利だと期待されている。一方で、電子書籍の貸出数には上限があり、人気の本は順番待ちが長くなる。また、紙の本をめくる感覚や、書店で本を選ぶ楽しさを失いたくないという声も根強い。図書館側は、電子と紙のどちらかを選ぶのではなく、両方の良さを生かすサービスを目指すとしている。",
    questions: [
      {
        id: "r2q1",
        question: "電子書籍の提供について、期待されていることは何か。",
        options: [
          "人気の本がすぐに読めること。",
          "来館しなくても本を読めること。",
          "紙の本が完全に不要になること。",
          "書店の売上が増えること。"
        ],
        answer: 1,
        explain: {
          ja: "正解は2。来館しなくても読めるようになり、高齢者や子育て中の人に便利だと期待されている。人気の本は順番待ちが長くなるので1は誤り。紙の本が不要になる、書店の売上が増えるとは述べていない。",
          en: "The answer is 2. People can read without visiting the library, which is expected to help older readers and parents. Popular titles still have long waiting lists, so 1 is wrong. The passage does not say paper books become unnecessary or that bookshops will sell more.",
          ko: "정답은 2. 도서관에 오지 않아도 책을 읽을 수 있어 고령자와 육아 중인 사람에게 편리할 것으로 기대된다. 인기 책은 대기 순서가 길어지므로 1은 틀리다. 종이책이 필요 없어지거나 서점 매출이 늘어난다는 내용은 없다."
        }
      },
      {
        id: "r2q2",
        question: "図書館側の考え方に最も近いものはどれか。",
        options: [
          "電子書籍だけに切り替える。",
          "紙の本をすべて保存する。",
          "電子と紙の両方の良さを生かす。",
          "書店と競争する。"
        ],
        answer: 2,
        explain: {
          ja: "正解は3。「電子と紙のどちらかを選ぶのではなく、両方の良さを生かすサービスを目指す」とある。電子だけ、紙だけ、書店との競争という方針は述べられていない。",
          en: "The answer is 3. The library says it aims to combine the strengths of both digital and paper rather than choosing one. A digital-only, paper-only, or bookshop-competition policy is not stated.",
          ko: "정답은 3. ‘전자와 종이 중 하나를 고르는 것이 아니라 양쪽의 장점을 살리는 서비스’를 목표로 한다고 했다. 전자만, 종이만, 서점과의 경쟁이라는 방침은 언급되지 않는다."
        }
      }
    ]
  },
  {
    id: "r3",
    type: "info",
    title: { ja: "市民講座の案内", en: "Community lecture notice", ko: "시민 강좌 안내" },
    passage: "市民講座「はじめての落語」受講者募集\n日時：11月7日・14日・21日（いずれも土曜）14:00～16:00\n会場：中央公民館 2階ホール\n対象：市内在住・在勤の方（高校生以上）\n定員：30名（応募者多数の場合は抽選）\n受講料：3,000円（全3回分、初回に納入）\n申込：10月1日～20日、市ホームページまたは電話\n注意：1回のみの受講はできません。締切後のキャンセルは受講料を返却しません。\n問合せ：中央公民館 03-1234-5678",
    questions: [
      {
        id: "r3q1",
        question: "この講座について正しいものはどれか。",
        options: [
          "1回だけ受講することもできる。",
          "市外に住んでいても受講できる。",
          "3回すべて受講する必要がある。",
          "受講料は毎回支払う。"
        ],
        answer: 2,
        explain: {
          ja: "正解は3。「1回のみの受講はできません」とあり、全3回の講座である。対象は市内在住・在勤者なので2は誤り。受講料は全3回分を初回に納入するので4も誤り。",
          en: "The answer is 3. The notice says one-session attendance is not allowed, so participants take all three sessions. It is for city residents or workers, so 2 is wrong. The fee covers all three sessions and is paid at the first session, so 4 is wrong.",
          ko: "정답은 3. ‘1회만 수강할 수 없습니다’라고 되어 있어 3회 모두 수강해야 한다. 대상은 시내 거주·재직자이므로 2는 틀리다. 수강료는 3회분을 첫 회에 내므로 4도 틀리다."
        }
      },
      {
        id: "r3q2",
        question: "申込みについて正しいものはどれか。",
        options: [
          "10月20日以降も電話で申し込める。",
          "定員を超えた場合は抽選になる。",
          "高校生は受講できない。",
          "締切後にキャンセルすれば受講料が戻る。"
        ],
        answer: 1,
        explain: {
          ja: "正解は2。「応募者多数の場合は抽選」とある。申込は10月1日～20日なので1は誤り。対象は高校生以上なので3は誤り。締切後のキャンセルは返却されないので4も誤り。",
          en: "The answer is 2. The notice says a lottery will be held if there are too many applicants. Applications close on October 20, so 1 is wrong. High-school students and older are eligible, so 3 is wrong. Fees are not refunded after the deadline, so 4 is wrong.",
          ko: "정답은 2. ‘신청자가 많으면 추첨’이라고 되어 있다. 신청은 10월 1일~20일이므로 1은 틀리다. 고등학생 이상이 대상이므로 3은 틀리다. 마감 후 취소는 환불되지 않으므로 4도 틀리다."
        }
      }
    ]
  },
  {
    id: "r4",
    type: "integrated",
    title: { ja: "AIと教育", en: "AI and education", ko: "AI와 교육" },
    passage: "A\nAIを教育に使うことには賛成だ。一人ひとりの理解度に合わせた問題を出せるため、教師が全員に同じ授業をするより効率的だ。教師は採点の負担から解放され、生徒と向き合う時間を増やせる。\n\nB\nAIの利用には慎重であるべきだ。AIは生徒の表情や悩みを読み取ることはできない。また、AIの提案に頼りすぎると、自分で考える力が育たない恐れがある。導入するなら、教師が最後に判断する仕組みが必要だ。",
    questions: [
      {
        id: "r4q1",
        question: "AとBの共通点は何か。",
        options: [
          "AIは教師より優れている。",
          "AIの利用には何らかの課題がある。",
          "AIは教育に使うべきではない。",
          "AIは生徒の悩みを理解できる。"
        ],
        answer: 1,
        explain: {
          ja: "正解は2。Aは効率化を評価しつつ、Bは表情や考える力への影響を心配しており、どちらもAI利用に課題があると考えている。1はAもBも述べておらず、3はBの主張に近いが「導入するなら」と条件付きで、4はBが否定している。",
          en: "The answer is 2. A values efficiency while B worries about reading emotions and losing thinking skills; both see some issue with using AI. 1 is not claimed by either, 3 is too strong for B (B allows use with conditions), and 4 is denied by B.",
          ko: "정답은 2. A는 효율성을 평가하고 B는 표정과 사고력에 대한 우려를 말한다. 둘 다 AI 활용에 과제가 있다고 본다. 1은 양쪽 모두 주장하지 않고, 3은 B의 ‘도입한다면’이라는 조건을 무시한 표현이며, 4는 B가 부정한다."
        }
      },
      {
        id: "r4q2",
        question: "Bの考えに合うものはどれか。",
        options: [
          "AIにすべての判断を任せるべきだ。",
          "AIは教育に導入すべきではない。",
          "AIを導入するなら、教師の判断を残すべきだ。",
          "AIは採点だけに使うべきだ。"
        ],
        answer: 2,
        explain: {
          ja: "正解は3。Bは「導入するなら、教師が最後に判断する仕組みが必要だ」と述べている。すべて任せる、まったく導入しない、採点だけに使うとは述べていない。",
          en: "The answer is 3. B says that if AI is introduced, a system in which teachers make the final judgment is necessary. B does not say to leave everything to AI, never introduce it, or use it only for grading.",
          ko: "정답은 3. B는 ‘도입한다면 교사가 최종 판단하는 구조가 필요하다’고 한다. 모든 판단을 맡기거나, 전혀 도입하지 않거나, 채점에만 쓰라고 하지는 않았다."
        }
      }
    ]
  },
  {
    id: "r5",
    type: "textgrammar",
    title: { ja: "失敗から学ぶ", en: "Learning from failure", ko: "실패에서 배우기" },
    passage: "新しいことに挑戦すれば、失敗することは避けられない。大切なのは、失敗を恐れて何もしないことではなく、失敗から何を学ぶかである。（1）、失敗の原因を冷静に分析することが必要だ。しかし、原因ばかり考えて自分を責め続けても、次の一歩は踏み出せない。（2）、失敗を「一度の結果」と捉え、次に生かす姿勢が大切だ。周囲の助けを借りることも忘れてはならない。（3）、一人で抱え込まずに相談することで、思いがけない解決策が見つかることもある。",
    questions: [
      {
        id: "r5q1",
        question: "（1）に入る最もよいものはどれか。",
        options: ["そのため", "一方", "つまり", "ところが"],
        answer: 0,
        explain: {
          ja: "正解は1。「失敗から何を学ぶかが大切だ」という前の内容を受けて、原因を分析する必要性を導いている。一方は対比、つまりは言い換え、ところがは予想外の展開を表すので合わない。",
          en: "The answer is 1. Following the idea that what matters is what we learn from failure, the sentence draws the need to analyse the cause. 一方 marks contrast, つまり rephrases, and ところが marks an unexpected turn.",
          ko: "정답은 1. ‘실패에서 무엇을 배우는지가 중요하다’는 앞 내용을 받아 원인 분석의 필요성을 이끈다. 一方은 대조, つまり는 바꿔 말하기, ところが는 예상 밖의 전개를 나타내므로 맞지 않는다."
        }
      },
      {
        id: "r5q2",
        question: "（2）に入る最もよいものはどれか。",
        options: ["その結果", "だからこそ", "それでも", "たとえば"],
        answer: 1,
        explain: {
          ja: "正解は2。「自分を責め続けても次の一歩は踏み出せない」という内容を受け、それだからこそ失敗を一度の結果として捉える姿勢が大切だと述べている。その結果は因果、それでもは逆接、たとえばは例示で、流れに合わない。",
          en: "The answer is 2. Because continuing to blame yourself prevents the next step, precisely for that reason it matters to treat failure as a single result. その結果 marks a result, それでも concession, and たとえば example, none of which fit.",
          ko: "정답은 2. 자신을 계속 탓하면 다음 걸음을 내딛지 못한다는 내용을 받아, 바로 그렇기 때문에 실패를 ‘하나의 결과’로 보고 다음에 살리는 자세가 중요하다고 한다. その結果는 결과, それでも는 역접, たとえば는 예시라 흐름에 맞지 않는다."
        }
      },
      {
        id: "r5q3",
        question: "（3）に入る最もよいものはどれか。",
        options: ["実際に", "要するに", "そのうえ", "むしろ"],
        answer: 0,
        explain: {
          ja: "正解は1。前の「周囲の助けを借りることも忘れてはならない」を受け、具体的な行動として「実際に、一人で抱え込まずに相談する」と述べている。要するにはまとめ、そのうえは追加、むしろは対比で、ここでは具体例を示す流れが自然だ。",
          en: "The answer is 1. After saying we must not forget to ask for help, the passage gives a concrete action: actually consult others instead of holding everything alone. 要するに summarises, そのうえ adds, and むしろ contrasts; a concrete example fits best here.",
          ko: "정답은 1. ‘주변의 도움을 구하는 것을 잊어서는 안 된다’는 앞 내용을 받아, 구체적인 행동으로 ‘실제로 혼자 안고 있지 말고 상담한다’고 한다. 要するに는 요약, そのうえ는 추가, むしろ는 대조라 여기서는 구체적 예시가 자연스럽다."
        }
      }
    ]
  }
];
