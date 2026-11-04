'use strict';
/* =========================================================
   The AI Village Adventure – Giải cứu Làng AI
   levels.js: ALL GAME CONTENT FOR THE NINE AREAS.

   Facts come from the module's topic files (section numbers
   are noted in comments). Story, characters, places, rewards
   and invented example texts are [GAME IDEA].

   You can edit any text here without touching script.js.

   Step types used in "explore" and "mini":
     info   – text to read, then Continue
     choice – one question; wrong answers can be retried
     sort   – put each card into the right basket
     order  – put cards in the right order
     multi  – pick all the good options, then Check
   ========================================================= */

const AREAS = [

  /* ---------------------------------------------------------
     AREA 1 · Workshop Square · Topic 1: Introduction to AI
     --------------------------------------------------------- */
  {
    id: 1,
    topic: 'Introduction to AI',
    place: 'Workshop Square',
    sign: { tx: 22, ty: 16, text: 'Workshop' },
    npc: {
      name: 'Cô Lan', tx: 21, ty: 20,
      look: { skin: '#e9b48c', hair: '#1f1a17', style: 'bun', shirt: '#3e6fb0', pants: '#22252e' },
    },
    object: { tx: 23, ty: 20, icon: '🤖', name: 'workshop robot' },
    objectives: {
      meet: 'Visit Cô Lan at the Workshop',
      explore: 'Inspect the robot BUG.exe labelled “AI”',
      mini: 'Help Cô Lan sort the workshop cards',
      quiz: 'Pass Cô Lan’s knowledge check',
    },
    intro: [
      { speaker: 'Cô Lan', text: 'NIAN, Wang, thank goodness! BUG.exe stuck an “AI” sign on every machine in my workshop. Now nobody knows which ones really use AI.' },
      { speaker: 'Wang', text: 'There is no single definition of AI that fits every context. In this module, AI means computer systems that perform tasks involving perception, learning, reasoning, language processing or decision support.' }, // §1.1
      { speaker: 'Cô Lan', text: 'Automation is different. It means a task is done with limited manual effort. It can follow fixed rules and doesn’t automatically need AI.' }, // §1.3
      { speaker: 'Cô Lan', text: 'Think of a film recommender and a countdown timer. The recommender uses patterns in viewing histories to rank films. The timer just counts down and signals at zero.' }, // Worked Example
      { speaker: 'Cô Lan', text: 'Both are automated, but only the recommender is a clear example of data-driven AI.' }, // Worked Example
      { speaker: 'Cô Lan', text: 'Start with the robot by my door. BUG.exe labelled it “AI”. Take a look.' },
    ],
    exploreReminder: 'Start with the robot by my door. BUG.exe labelled it “AI”. Take a look.',
    exploreTitle: 'The workshop robot',
    explore: [
      { type: 'info', text: ['The robot waves its arm in exactly the same pattern, again and again. A glitchy “AI!” sign is stuck to its chest.'] },
      {
        type: 'choice',
        prompt: 'Does this robot need AI to do this?',
        hint: 'Watch the arm. Does it repeat exactly the same movement every time?',
        options: [
          { text: 'No. A robot can just perform pre-programmed actions.', correct: true,
            feedback: 'Robotics is about machines that sense and act in the physical world. Many robots perform pre-programmed actions. A robot may use AI, but it doesn’t have to. The “AI!” sign falls off!' }, // §1.3
          { text: 'Yes. Every robot is AI.', correct: false,
            feedback: 'Many robots only follow pre-programmed actions, and AI can exist entirely as software, with no robot body at all.' }, // §1.3
        ],
      },
    ],
    miniTitle: 'AI, automation, or uncertain?',
    mini: [
      {
        type: 'sort',
        prompt: 'Sort the 10 workshop cards. Is each one AI, Automation, or Uncertain?',
        bins: ['AI', 'Automation', 'Uncertain'],
        rightTitle: 'Good sorting!',
        wrongTitle: 'Hmm, look again.',
        explainOnWrong: true,
        hint: 'Ask one question: does it follow a fixed rule someone set, or does it use patterns in data to recognize, predict, recommend or process language? Real systems can mix fixed rules and learned models. When you can’t tell, “Uncertain” is an honest answer.',
        items: [ // cards from the Topic 1 "Try it" activity; answers apply §1.2–1.4
          { text: 'Fixed alarm clock', answer: 'Automation', explain: 'It rings at a time someone set. It follows a fixed rule and doesn’t learn from data.' },
          { text: 'Basic calculator', answer: 'Automation', explain: 'It follows fixed maths rules written by a programmer.' },
          { text: 'Washing-machine preset', answer: 'Automation', explain: 'A preset runs a fixed programme, like a thermostat switching on at a set temperature.' },
          { text: 'Scheduled email', answer: 'Automation', explain: 'It sends at a time someone chose. That is a fixed rule, not learning from data.' },
          { text: 'Movie recommender', answer: 'AI', explain: 'It ranks films using patterns in viewing histories (recommendation).' },
          { text: 'Speech recognition', answer: 'AI', explain: 'It turns speech into text (language processing).' },
          { text: 'Traffic prediction', answer: 'AI', explain: 'It estimates likely future traffic from patterns in data (prediction).' },
          { text: 'Face unlock', answer: 'AI', explain: 'It analyzes images of a face (perception).' },
          { text: 'Spam filtering', answer: 'AI', explain: 'It classifies messages (language processing: classify text).' },
          { text: 'Chatbot', answer: ['Uncertain', 'AI'], explain: 'It depends. Some chatbots follow fixed, pre-written replies; others generate language from patterns learned from data. “Uncertain” is the best answer: you need more evidence.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'About the chatbot card: what evidence would help you decide?',
        hint: 'Real systems can mix fixed rules and learned models. What would show you which one this chatbot uses?',
        options: [
          { text: 'Whether it follows fixed, pre-written rules or generates replies from patterns learned from data.', correct: true,
            feedback: 'Exactly: that is the difference between rule-based automation and data-driven AI.' }, // §1.3–1.4
          { text: 'Whether it has a robot body.', correct: false, feedback: 'AI can exist entirely as software.' }, // §1.3
          { text: 'Whether it works automatically.', correct: false, feedback: 'Automation can be based on fixed rules and doesn’t automatically require AI.' }, // §1.3
        ],
      },
    ],
    quizHint: 'Remember Cô Lan’s timer and recommender: both automatic, but only one learns from data.',
    quiz: [
      { type: 'tf', q: '“AI always means a human-like robot.”', answer: 'False',
        explain: 'Most AI is software. A robot may use AI, but AI can exist entirely as software. (§1.3)' },
      { type: 'mcq', q: 'Which is rule-based automation rather than data-driven AI?',
        options: ['Movie recommender', 'Digital countdown timer', 'Face unlock', 'Speech recognition'], answer: 'Digital countdown timer',
        explain: 'A timer follows a fixed instruction: count down and signal at zero. It doesn’t learn from data. (Worked Example)' },
      { type: 'tf', q: '“AI systems always learn while they are being used.”', answer: 'False',
        explain: 'Some AI systems are trained earlier and then deployed. (Common misconceptions)' },
      { type: 'mcq', q: 'Can a robot exist without AI?',
        options: ['No, robots are AI', 'Yes, many robots perform pre-programmed actions', 'Only if it has no sensors', 'Only in factories'],
        answer: 'Yes, many robots perform pre-programmed actions',
        explain: 'Robotics concerns machines that sense and act in the physical world. Many perform pre-programmed actions without AI. (§1.3)' },
      { type: 'mcq', q: 'Why evaluate a healthcare AI differently from a film recommender?',
        options: ['Film recommenders don’t use computers', 'AI should be judged by its purpose, data, environment, users and possible consequences', 'Healthcare AI never makes mistakes', 'Film recommenders need doctors'],
        answer: 'AI should be judged by its purpose, data, environment, users and possible consequences',
        explain: 'A wrong film suggestion has different risks from a model that helps prioritize medical cases. (§1.6)' },
    ],
    seal: 'Lantern of Definitions',
    takeaways: [ // Topic 1 Key Takeaways
      'AI is a broad field and has no single definition that fits every context.',
      'AI can work as software, physical devices, or parts of larger services.',
      'Automation and robotics overlap with AI but are not synonyms.',
      'Evaluate AI in the context where it is used, not only by its technical label.',
    ],
    doneLine: 'The workshop makes sense again! Remember: automatic doesn’t always mean AI.',
  },

  /* ---------------------------------------------------------
     AREA 2 · Elder's Archive · Topic 2: History and Development of AI
     --------------------------------------------------------- */
  {
    id: 2,
    topic: 'History and Development of AI',
    place: 'Elder’s Archive',
    sign: { tx: 11, ty: 16, text: 'Archive' },
    npc: {
      name: 'Ông Tư', tx: 10, ty: 20,
      look: { skin: '#e2ad86', hair: '#eeeeee', style: 'short', beard: '#eeeeee', shirt: '#2f5d8a', pants: '#2b2a33' },
    },
    object: { tx: 12, ty: 20, icon: '📜', name: 'Turing scroll' },
    objectives: {
      meet: 'Visit Ông Tư at the Elder’s Archive',
      explore: 'Read the Turing scroll on the lectern',
      mini: 'Rebuild Ông Tư’s timeline wall',
      quiz: 'Pass Ông Tư’s knowledge check',
    },
    intro: [
      { speaker: 'Ông Tư', text: 'Welcome, NIAN. BUG.exe shuffled my history scrolls. Now the villagers say AI began with chatbots a few years ago.' },
      { speaker: 'Ông Tư', text: 'Not so. Long before modern computers, people imagined machines that could calculate, reason, or imitate aspects of human activity.' }, // §2.1
      { speaker: 'Wang', text: 'Later, work in mathematical logic, computing theory, statistics, neuroscience and engineering turned machine intelligence into a scientific research question.' }, // §2.1
      { speaker: 'Ông Tư', text: 'And remember: AI progress has not been a steady march from simple to perfect. Different approaches worked in different contexts, and each had limits.' }, // §2.8
      { speaker: 'Ông Tư', text: 'Start with the oldest scroll on my lectern. It’s from 1950.' },
      { speaker: 'Wang', text: 'Scanning… Author: Alan Turing. Title: “Computing Machinery and Intelligence”.' }, // §2.2
    ],
    exploreReminder: 'Start with the oldest scroll on my lectern. It’s from 1950.',
    exploreTitle: 'The Turing scroll',
    explore: [
      { type: 'info', text: ['The scroll unrolls: “Computing Machinery and Intelligence”, by Alan Turing, 1950.'] },
      {
        type: 'choice',
        prompt: 'What did Turing propose in this 1950 paper?',
        hint: 'The title asks about intelligence, but the test only looks at conversation.',
        options: [
          { text: 'An imitation-game approach: test whether a machine’s conversational responses could be mistaken for a human’s, under specified conditions.', correct: true,
            feedback: 'Instead of relying only on an abstract debate about whether machines can think, Turing proposed a practical test.' }, // §2.2
          { text: 'A machine that can learn every human task.', correct: false,
            feedback: 'The paper proposed a way to evaluate conversational responses, not a machine that learns everything.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'If a machine passes this test, does that prove it is conscious?',
        hint: 'Talking like a human and thinking like a human are different questions.',
        options: [
          { text: 'No. Passing would not prove consciousness or human-like understanding.', correct: true,
            feedback: 'The Turing Test became influential, but passing a conversation test is not proof of a mind. The first lantern lights up!' }, // §2.2
          { text: 'Yes. Talking like a human means thinking like a human.', correct: false,
            feedback: 'That’s a common misconception. Passing would not prove consciousness or human-like understanding.' },
        ],
      },
    ],
    miniTitle: 'Rebuild the timeline wall',
    mini: [
      {
        type: 'order', // Worked Example: selective teaching timeline
        prompt: 'Put the six milestone cards in order, from earliest (top) to latest (bottom).',
        hint: 'Two cards have exact years, 1950 and 1956. Start there. Rules came before learning from data, and Deep Learning came before Generative AI became widely visible.',
        items: [
          '1950: Turing publishes his paper on machine intelligence',
          '1956: Dartmouth workshop',
          'Later decades: symbolic and expert systems develop, alongside periods of reduced expectations',
          'Subsequent decades: statistical Machine Learning becomes increasingly influential',
          '2010s: Deep Learning',
          '2020s: Generative AI tools become widely visible',
        ],
        success: 'All six lanterns on the timeline wall are lit! (This is a teaching timeline, not a complete history.)',
      },
      {
        type: 'sort',
        prompt: 'What changed? Match each sentence to its milestone.',
        bins: ['1950', '1956', 'Later decades', 'Subsequent decades', '2010s', '2020s'],
        rightTitle: 'Yes!',
        wrongTitle: 'Not that one.',
        wrongText: 'Read the card again. Which change happened at that time?',
        hint: 'Look for the key word: rules, patterns from examples, deeper networks, or content generation.',
        items: [
          { text: 'Turing proposed a practical test of whether a machine’s conversation could be mistaken for a human’s.', answer: '1950', explain: 'The imitation-game approach. (§2.2)' },
          { text: 'The term “artificial intelligence” was used in the proposal associated with John McCarthy and colleagues, helping establish AI as a research field.', answer: '1956',
            explain: 'The Dartmouth workshop. (§2.3) Wang: “Careful: Dartmouth didn’t create every AI technique used today. New systems often combine older ideas with new data, hardware and algorithms.” (§2.8)' },
          { text: 'Knowledge was written as symbols and hand-written rules. This worked for clear, limited problems but struggled with ambiguity and real-world complexity.', answer: 'Later decades', explain: 'Early symbolic and rule-based AI. (§2.4)' },
          { text: 'Methods learned statistical patterns from examples instead of relying only on hand-written rules.', answer: 'Subsequent decades', explain: 'The growth of Machine Learning. (§2.6)' },
          { text: 'Deeper neural networks greatly improved image recognition, speech processing and language tasks.', answer: '2010s', explain: 'Deep Learning and the modern era. (§2.7)' },
          { text: 'Generative models brought text, image, audio and other content generation into wider public use.', answer: '2020s', explain: 'Generative AI becomes widely visible. (§2.7)' },
        ],
      },
      {
        type: 'choice',
        keepOrder: true,
        prompt: 'Factor dial: which factor mattered most for 2010s Deep Learning?',
        hint: 'Is there ever just one reason? Read the 2010s scroll again.',
        rightTitle: 'That mattered!',
        options: ['Data', 'Algorithms', 'Computing power', 'Research ideas', 'Practical demand'].map(text => ({
          text, correct: true,
          feedback: 'But large datasets, specialized hardware, improved training methods and research advances all contributed. Progress was never caused by computing power alone.', // §2.7
        })),
      },
    ],
    quizHint: 'Remember Ông Tư: history is not a straight line.',
    quiz: [
      { type: 'mcq', q: 'Which 1956 event is widely regarded as founding AI as a formal research field?',
        options: ['Turing’s paper on machine intelligence', 'The Dartmouth Summer Research Project', 'The growth of statistical Machine Learning', 'Generative AI tools becoming widely visible'],
        answer: 'The Dartmouth Summer Research Project',
        explain: 'The term “artificial intelligence” was used in the Dartmouth proposal associated with John McCarthy and colleagues. Turing’s paper was earlier, in 1950. (§2.3)' },
      { type: 'tf', q: '“Passing the Turing Test proves a machine has human consciousness.”', answer: 'False',
        explain: 'The test looks at conversational responses. Passing would not prove consciousness or human-like understanding. (§2.2)' },
      { type: 'mcq', q: 'What is an “AI winter”?',
        options: ['A period when AI works better in cold weather', 'A period when enthusiasm, investment or funding declines after expectations exceed what methods and computers can deliver', 'The year AI was named', 'A period when computers became cheaper'],
        answer: 'A period when enthusiasm, investment or funding declines after expectations exceed what methods and computers can deliver',
        explain: 'AI winters happened when ambitious claims and practical capabilities were not aligned. (§2.5)' },
      { type: 'tf', q: '“During AI winters, all AI research stopped.”', answer: 'False',
        explain: 'Research and support were reduced, but they did not stop completely. (§2.5)' },
      { type: 'mcq', q: 'Why is it inaccurate to say AI began with public chatbots in the 2020s?',
        options: ['Chatbots don’t use AI', 'AI has roots decades earlier, such as Turing’s 1950 paper and the 1956 Dartmouth workshop', 'AI began in the 2010s', 'AI was never a research field'],
        answer: 'AI has roots decades earlier, such as Turing’s 1950 paper and the 1956 Dartmouth workshop',
        explain: 'Generative AI only became widely visible in the 2020s. AI’s history goes back to at least 1950. (Key Takeaways)' },
    ],
    seal: 'Timeline Scroll',
    takeaways: [ // Topic 2 Key Takeaways
      'AI has roots decades before today’s generative tools.',
      'The 1950 Turing paper and 1956 Dartmouth workshop are important milestones.',
      'AI research has experienced enthusiasm and periods of reduced expectations.',
      'Recent advances reflect combined effects of data, algorithms, hardware, and engineering.',
    ],
    doneLine: 'The scrolls are in order again. Remember: history is not a straight line.',
  },

  /* ---------------------------------------------------------
     AREA 3 · Training Ground · Topic 3: Types and Capabilities of AI
     --------------------------------------------------------- */
  {
    id: 3,
    topic: 'Types and Capabilities of AI',
    place: 'Training Ground',
    sign: { tx: 3, ty: 14, text: 'Training Ground' },
    npc: {
      name: 'Anh Dũng', tx: 3, ty: 10,
      look: { skin: '#d9a07a', hair: '#151515', style: 'short', shirt: '#d9a441', pants: '#26324a' },
    },
    object: { tx: 3, ty: 12, icon: '♟️', name: 'chess pavilion' },
    objectives: {
      meet: 'Visit Anh Dũng at the Training Ground',
      explore: 'Challenge the chess engine',
      mini: 'Help Anh Dũng inspect the claims on the notice board',
      quiz: 'Pass Anh Dũng’s knowledge check',
    },
    intro: [
      { speaker: 'Anh Dũng', text: 'NIAN! BUG.exe pinned up a poster: “CHESS MACHINE = SUPERINTELLIGENCE. IT CAN DO ANYTHING!” Now the villagers want it to run the harvest, the clinic and the school.' },
      { speaker: 'Wang', text: 'AI can be classified in more than one way. Capability-based labels ask how broadly a system can perform tasks. Technique-based labels ask how it is built.' }, // §3.1
      { speaker: 'Anh Dũng', text: 'Those two kinds of label answer different questions, so don’t mix them up.' }, // §3.1
      { speaker: 'Anh Dũng', text: 'Most AI in use today is Narrow AI: built for a particular task or a limited range of tasks.' }, // §3.2
      { speaker: 'Anh Dũng', text: 'So before we believe a big claim, we check the evidence. Go and challenge the chess machine yourself.' }, // §3.6
      { speaker: 'Wang', text: 'Ready to test it, NIAN!' },
    ],
    exploreReminder: 'Go and challenge the chess machine yourself.',
    exploreTitle: 'Challenge the chess engine',
    explore: [
      { type: 'info', text: [ // Worked Example
        'The chess engine wins the game instantly.',
        'Then NIAN asks it to write a school report… “TASK NOT SUPPORTED.”',
        'Plan a holiday… “TASK NOT SUPPORTED.” Diagnose an illness… “TASK NOT SUPPORTED.”',
      ] },
      {
        type: 'choice',
        prompt: 'What does this show?',
        hint: 'It’s brilliant at one thing. Did it manage any of the other tasks?',
        options: [
          { text: 'It is excellent at chess, but its ability is limited to that defined domain. High performance in one task is not evidence of general intelligence.', correct: true,
            feedback: 'A system can perform extremely well in its defined task without general human-like abilities in unrelated areas. The poster’s “SUPERINTELLIGENCE” glitch cracks!' }, // Worked Example; §3.2
          { text: 'It is generally intelligent, because beating world-class players is very hard.', correct: false,
            feedback: 'That’s a common misconception. Being superhuman at one game doesn’t make a system generally intelligent.' },
        ],
      },
    ],
    miniTitle: 'The Claim Inspector',
    mini: [
      {
        type: 'sort',
        prompt: 'Step 1: hang the three capability banners. Match each description to its label.',
        bins: ['Narrow AI', 'AGI', 'ASI'],
        rightTitle: 'Good match!',
        wrongTitle: 'Not quite.',
        wrongText: 'Look at the key words: one task, proposed, or hypothetical.',
        hint: 'One label is about one task. One is only proposed. One is hypothetical.',
        items: [
          { text: 'Designed for a particular task or a limited range of tasks. Most deployed AI today is like this.', answer: 'Narrow AI', explain: 'Narrow AI, also called task-specific or Weak AI. (§3.2)' },
          { text: 'A proposed concept: broad, flexible abilities across many different intellectual tasks. There is no universally agreed test for it.', answer: 'AGI', explain: 'Artificial General Intelligence. (§3.3)' },
          { text: 'A hypothetical concept: abilities that would greatly exceed humans across many important domains. It should not be presented as an existing system.', answer: 'ASI', explain: 'Artificial Superintelligence. (§3.4)' },
        ],
      },
      {
        type: 'sort',
        prompt: 'Step 2: stamp each claim card. Is it Known (demonstrated), only Claimed, or Hypothetical?',
        bins: ['Known', 'Claimed', 'Hypothetical'],
        rightTitle: 'Stamped!',
        wrongTitle: 'Hmm…',
        wrongText: 'Is this demonstrated, only claimed, or not built at all?',
        hint: 'Ask the five checks: what exact task? Under what conditions? How reliably? Does it transfer to new tasks? Where are humans involved?',
        items: [ // cases from the Topic 3 "Try it" activity
          { text: '“A chess engine defeats world-class human players at chess.”', answer: 'Known',
            explain: 'Specify the task: it plays chess, and this ability has been demonstrated. It is narrow: limited to chess. (Worked Example; §3.2)' },
          { text: '“A face-recognition system is built for one task: recognizing faces.”', answer: 'Known',
            explain: 'A task-specific system, like the image classifiers listed as Narrow AI. Still check the conditions and reliability: does it work only with prepared photos, or in varied real-world settings? (§3.2, §3.6)' },
          { text: 'Headline: “This chatbot talks so fluently it truly understands like a human. It’s AGI!”', answer: 'Claimed',
            explain: 'There is no universally agreed test for AGI, and fluent language doesn’t by itself show understanding. (§3.3, §3.5)' },
          { text: '“A system that can learn and perform a wide range of unfamiliar tasks.”', answer: 'Hypothetical',
            explain: 'The Topic 3 activity itself describes this case as hypothetical. Nothing has demonstrated it. (Try it; §3.3)' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Before believing the chatbot headline, which evidence would you ask for?',
        hint: 'Is there one agreed test that settles whether something is AGI? Look at demonstrated abilities instead.',
        options: [
          { text: 'Check transfer and reliability: can it apply skills to new tasks and unfamiliar contexts, consistently?', correct: true,
            feedback: 'Fluent language alone isn’t proof. Evaluate specific evidence. (§3.6)' },
          { text: 'The product’s name sounds powerful.', correct: false, feedback: 'Names and headlines aren’t evidence. Look at demonstrated abilities.' },
          { text: 'Many news articles say so.', correct: false, feedback: 'Headlines aren’t proof. Avoid treating marketing claims as scientific proof.' },
          { text: 'It talks like a human, so it must understand.', correct: false, feedback: 'Fluent language alone doesn’t show consciousness or human-like understanding. (§3.5)' },
        ],
      },
    ],
    quizHint: 'Capability labels describe how broad, not how it’s built.',
    quiz: [
      { type: 'mcq', q: 'What do we call AI built for a particular task or a limited range of tasks, such as chess or spam filtering?',
        options: ['Narrow AI (Weak AI)', 'Artificial General Intelligence (AGI)', 'Artificial Superintelligence (ASI)', 'A technique-based label'],
        answer: 'Narrow AI (Weak AI)',
        explain: 'Narrow AI is task-specific. Examples include chess programs, spam filters and recommendation systems. (§3.2)' },
      { type: 'tf', q: '“Capability labels like Narrow AI or AGI tell us exactly which algorithm a system uses.”', answer: 'False',
        explain: 'Capability labels describe how broadly a system performs tasks, not how it is built. That’s a different, technique-based question. (§3.1)' },
      { type: 'mcq', q: 'How is ASI different from AGI?',
        options: ['They mean the same thing', 'AGI is a proposed idea of broad abilities across many tasks; ASI is a hypothetical idea of abilities greatly exceeding humans’', 'ASI is the AI used in most apps today', 'AGI is a kind of robot'],
        answer: 'AGI is a proposed idea of broad abilities across many tasks; ASI is a hypothetical idea of abilities greatly exceeding humans’',
        explain: 'AGI remains debated. ASI is hypothetical and shouldn’t be presented as an existing system. (§3.3–3.4)' },
      { type: 'tf', q: '“Most AI applications used today are best understood as Narrow AI.”', answer: 'True',
        explain: 'Most deployed AI systems are task-specific or bounded in scope. (§3.2)' },
      { type: 'mcq', q: 'Why doesn’t fluent conversation prove human-like understanding?',
        options: ['Because chatbots can’t speak', 'Because producing fluent language doesn’t on its own show consciousness, feelings, intentions or understanding', 'Because only robots can understand', 'Because fluent systems are always wrong'],
        answer: 'Because producing fluent language doesn’t on its own show consciousness, feelings, intentions or understanding',
        explain: 'Capability and consciousness are separate questions. Describe what a system can observably do. (§3.5)' },
    ],
    seal: 'Claim Lens',
    takeaways: [ // Topic 3 Key Takeaways
      'Capability labels describe the breadth of tasks a system can perform.',
      'Most deployed AI systems are task-specific or bounded in scope.',
      'AGI remains debated and ASI is hypothetical.',
      'Evaluate specific evidence and avoid treating marketing claims as scientific proof.',
    ],
    doneLine: 'The chess machine is a champion again: at chess. That’s enough!',
  },

  /* ---------------------------------------------------------
     AREA 4 · Post Office · Topic 4: Machine Learning
     --------------------------------------------------------- */
  {
    id: 4,
    topic: 'Machine Learning',
    place: 'Post Office',
    sign: { tx: 5, ty: 1, text: 'Post Office' },
    npc: {
      name: 'Chị Thu', tx: 4, ty: 5,
      look: { skin: '#e9b48c', hair: '#1f1a17', style: 'long', hat: 'nonla', shirt: '#2e7d6b', pants: '#22252e' },
    },
    object: { tx: 6, ty: 4, icon: '📮', name: 'sorting machine' },
    objectives: {
      meet: 'Visit Chị Thu at the Post Office',
      explore: 'Inspect the broken sorting machine',
      mini: 'Be the human classifier: retrain on Chị Thu’s letters',
      quiz: 'Pass Chị Thu’s knowledge check',
    },
    intro: [
      { speaker: 'Chị Thu', text: 'NIAN, help! BUG.exe flooded my post office with spam, and my sorting machine keeps getting new letters wrong.' },
      { speaker: 'Wang', text: 'Machine Learning is an area of AI where systems learn from data to improve on a task.' }, // §4.1
      { speaker: 'Chị Thu', text: 'Instead of writing every rule by hand, we choose a learning method and give it examples. The algorithm adjusts a model to capture useful patterns.' }, // §4.1
      { speaker: 'Chị Thu', text: 'My machine learned from letters marked “spam” or “not spam”. Those marks are called labels.' }, // §4.2, §4.4
      { speaker: 'Wang', text: 'Learning from examples that include the desired answer is called Supervised Learning.' }, // §4.4
      { speaker: 'Chị Thu', text: 'Come and look at what the machine says about itself.' },
    ],
    exploreReminder: 'Come and look at what the sorting machine says about itself.',
    exploreTitle: 'The broken sorting machine',
    explore: [
      { type: 'info', text: [
        'The machine’s screen shows two lines:',
        '✅ Old letters it trained on: almost all sorted correctly.',
        '❌ New letters arriving today: many mistakes.',
      ] },
      {
        type: 'choice',
        prompt: 'What went wrong?',
        hint: 'Good on old letters, bad on new ones. What does that say about what it learned?',
        options: [
          { text: 'It overfitted. It learned details of its training letters that don’t work on new, unseen letters.', correct: true,
            feedback: 'A model should work on new examples, not merely memorise its training data. The warning light turns amber. (§4.7)' },
          { text: 'Nothing is wrong. A high score on training letters means it’s reliable.', correct: false,
            feedback: 'That’s a common misconception. A high training score doesn’t guarantee real-world reliability. Test on unseen letters. (§4.7)' },
        ],
      },
    ],
    miniTitle: 'Be the human classifier',
    mini: [
      { type: 'info', // letter texts are [GAME IDEA], based on the spam features named in §4.2 and the Worked Example
        title: 'Training: study these 12 labelled letters',
        text: ['Look for patterns that separate spam from not spam.'],
        // Shown as letter cards. [link] is drawn as a small link icon.
        letters: [
          { from: 'Unknown sender', text: 'YOU WON a golden buffalo!!! Click these 3 links to claim.', label: 'Spam' },
          { from: 'Unknown sender', text: 'URGENT!!! Your account will close today. Click here: [link]', label: 'Spam' },
          { from: 'Unknown sender', text: 'Free rice for life!!! Visit [link] [link]', label: 'Spam' },
          { from: 'Unknown sender', text: 'Congratulations, winner! Send a small fee to claim your prize. [link]', label: 'Spam' },
          { from: 'Unknown sender', text: 'Act now!!! Limited offer on magic seeds. [link] [link] [link]', label: 'Spam' },
          { from: 'Unknown sender', text: 'Dear friend, you are selected for a cash gift. Click [link]', label: 'Spam' },
          { from: 'Ông Tư', text: 'The Archive opens at 8 tomorrow. Bring your notebook.', label: 'Not spam' },
          { from: 'Chị Thu', text: 'Your parcel has arrived at the post office.', label: 'Not spam' },
          { from: 'Cô Lan', text: 'Thank you for fixing the workshop! See you at dinner.', label: 'Not spam' },
          { from: 'Anh Dũng', text: 'Chess practice moved to Saturday afternoon.', label: 'Not spam' },
          { from: 'Village school', text: 'Here is the festival timetable: [link]', label: 'Not spam' },
          { from: 'Bà Hương', text: 'The banyan festival starts next week. Everyone welcome!', label: 'Not spam' },
        ],
      },
      {
        type: 'sort',
        prompt: 'Feature or label? Sort the three tags.',
        bins: ['Feature', 'Label'],
        rightTitle: 'Correct!',
        wrongTitle: 'Not quite.',
        wrongText: 'Is it something you look at in the letter, or the answer attached to it?',
        hint: 'Is it something you look at in the letter, or the answer attached to it?',
        items: [
          { text: 'Number of links', answer: 'Feature', explain: 'A feature is an input characteristic, like message length or number of links. (§4.2)' },
          { text: 'Spam / Not spam', answer: 'Label', explain: 'A label is the target answer attached to an example. (§4.2)' },
          { text: 'Sender is unknown', answer: 'Feature', explain: 'Sender patterns are input characteristics too. (Worked Example)' },
        ],
      },
      {
        type: 'multi',
        prompt: 'Which patterns help separate spam from not spam? Select every useful pattern, then press Check.',
        requireAll: true,
        hint: 'Compare who sent each letter, the words used, and how many links it has.',
        needMore: 'Good so far, but you haven’t found every useful pattern yet.',
        success: 'Well spotted! Wang: “Letter 11 has a link but isn’t spam. One pattern alone isn’t enough; models look at combinations.” (Worked Example)',
        options: [
          { text: 'Unknown sender', correct: true },
          { text: 'Prize or urgent wording, and lots of “!!!”', correct: true },
          { text: 'Many links', correct: true },
          { text: 'Written in blue ink', correct: false, feedback: 'There’s no such information in these letters, so it can’t be a feature here.' },
        ],
      },
      {
        type: 'sort',
        reveal: true, // no pass/fail: mistakes on unusual letters are the lesson
        prompt: 'Testing: predict each new letter. Then see its true label.',
        bins: ['Spam', 'Not spam'],
        hint: 'Look at the combination of clues, not just one word.',
        items: [ // [GAME IDEA] letters; C and D are the unusual cases from the Worked Example
          { text: 'A. Unknown sender: “WINNER!!! Claim your free buffalo now: [link] [link]”', answer: 'Spam', explain: 'It matches the spam patterns.' },
          { text: 'B. Chị Thu: “The post office is closed on Sunday.”', answer: 'Not spam', explain: 'Known sender, everyday message.' },
          { text: 'C. Cô Lan: “URGENT: festival prize winners, collect your ribbon today!”', answer: 'Not spam', explain: 'Unusual: a legitimate letter that uses suspicious wording.' },
          { text: 'D. Unknown sender: “Hello neighbour, please reply with your bank number to receive your harvest refund.”', answer: 'Spam', explain: 'Unusual: no links and no prize words. It’s a new spam pattern the training letters never showed.' },
        ],
        summary: (right, total, wrongItems) => {
          const missedUnusual = wrongItems.some(t => t.startsWith('C.') || t.startsWith('D.'));
          const base = `You sorted ${right} of ${total} new letters correctly. `;
          return base + (missedUnusual
            ? 'That’s exactly how models make mistakes. Unusual letters differ from the training examples.'
            : 'Great sorting! Even so, a real model can still be fooled by unusual letters.');
        },
      },
      {
        type: 'choice',
        prompt: 'Why does a real model need separate evaluation data and ongoing monitoring?',
        hint: 'Training and testing serve different purposes.',
        options: [
          { text: 'To estimate how it does on unseen data, and to catch new patterns when the data or environment changes.', correct: true,
            feedback: 'Training and testing serve different purposes, and models need monitoring after deployment. (§4.2, §4.3)' },
          { text: 'Because more data always guarantees a better model.', correct: false, feedback: 'Not if the data is biased or poor quality. (§4.7)' },
          { text: 'Because a model learns exactly like a human.', correct: false, feedback: 'ML doesn’t learn exactly as a human does. It adjusts a model to capture patterns in data. (§4.1)' },
        ],
      },
    ],
    quizHint: 'Only count the letters the sorter called spam. How many of those really were?',
    quiz: [
      { type: 'mcq', q: 'In ML, what is an input characteristic used by a model, such as message length or number of links?',
        options: ['Label', 'Feature', 'Evaluation metric', 'Model'], answer: 'Feature',
        explain: 'Features are inputs. The label is the target answer. (§4.2)' },
      { type: 'mcq', q: 'A shop groups customers by purchasing patterns without any labels. Which type of learning is this?',
        options: ['Supervised', 'Unsupervised', 'Reinforcement', 'None, it’s a rule'], answer: 'Unsupervised',
        explain: 'Unsupervised Learning finds structure without labels, for example by clustering. People must still interpret whether a group is meaningful. (§4.5)' },
      { type: 'mcq', q: 'Which type of learning trains an agent with rewards and penalties through repeated interaction?',
        options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Regression'], answer: 'Reinforcement',
        explain: 'The agent learns a strategy to maximise long-term reward. Poorly designed rewards can cause undesirable behaviour. (§4.6)' },
      { type: 'mcq', q: 'The sorter marks 5 letters as spam, and 4 of them really are spam. What is its precision?',
        options: ['100%', '80%', '50%', '20%'], answer: '80%', keepOrder: true,
        explain: 'Precision = truly spam ÷ predicted spam = 4 ÷ 5 = 80%. (§4.8)' },
      { type: 'tf', q: '“Accuracy is always the best metric for every problem.”', answer: 'False',
        explain: 'Accuracy can mislead when one category is much more common than another. The right metric depends on the consequences of different errors. (§4.8)' },
    ],
    seal: 'Sorting Stamp',
    takeaways: [ // Topic 4 Key Takeaways
      'Machine Learning is one important approach within AI.',
      'Models learn patterns from data according to a defined training process.',
      'Training and testing serve different purposes.',
      'Data quality, representative examples, evaluation, and monitoring are essential.',
    ],
    doneLine: 'The mail is moving again! I’ll keep checking new letters, because patterns change.',
  },

  /* ---------------------------------------------------------
     AREA 5 · Banyan Forest · Topic 5: Deep Learning and Neural Networks
     --------------------------------------------------------- */
  {
    id: 5,
    topic: 'Deep Learning and Neural Networks',
    place: 'Banyan Forest',
    sign: { tx: 15, ty: 2, text: 'Great Banyan' },
    npc: {
      name: 'Bà Hương', tx: 14, ty: 5,
      look: { skin: '#e2ad86', hair: '#bdbdbd', style: 'bun', shirt: '#7b4f8f', pants: '#2b2a33' },
    },
    object: { tx: 16, ty: 5, icon: '🏮', name: 'cat-or-dog lantern' },
    objectives: {
      meet: 'Visit Bà Hương at the Great Banyan',
      explore: 'Inspect the “cat or dog?” lantern',
      mini: 'Repair the Root Network and find out why the lantern was wrong',
      quiz: 'Pass Bà Hương’s knowledge check',
    },
    intro: [
      { speaker: 'Bà Hương', text: 'Welcome, NIAN. Our banyan lantern greets visitors’ pets, but since BUG.exe tangled its roots, it keeps guessing wrong.' },
      { speaker: 'Wang', text: 'The lantern uses Deep Learning: a specialized area of Machine Learning that uses neural networks with multiple layers.' }, // §5.1
      { speaker: 'Bà Hương', text: '“Deep” simply means there are many processing layers. Deep Learning is useful for complex patterns in images, audio and text.' }, // §5.1
      { speaker: 'Bà Hương', text: 'A neural network is made of connected units called artificial neurons. They combine inputs using adjustable weights and an activation function.' }, // §5.2
      { speaker: 'Wang', text: 'It’s loosely inspired by biological nervous systems, but it’s not a copy of a human brain and doesn’t automatically understand like a human.' }, // §5.2
      { speaker: 'Bà Hương', text: 'Come and see what the lantern says about a cat that’s sitting outside today.' },
    ],
    exploreReminder: 'Come and see what the lantern says about the cat sitting outside.',
    exploreTitle: 'The “cat or dog?” lantern',
    explore: [
      { type: 'info', text: [
        'A cat is sitting on the grass beside the lantern. The lantern glows and shows:',
        'Dog: 0.7 · Cat: 0.3',
        '(Example output scores made up for the game. The network “produces output scores for possible classes”.)',
      ] },
      {
        type: 'choice',
        prompt: 'The lantern says “Dog”. What should we think?',
        hint: 'Is a model’s guess the same thing as a fact?',
        options: [
          { text: 'The output is a model estimate, not an infallible fact. It can be wrong.', correct: true,
            feedback: 'A neural network’s prediction isn’t always correct, even though it uses many calculations. (Worked Example)' },
          { text: 'It must be a dog. The network did lots of calculations.', correct: false,
            feedback: 'That’s a common misconception. Many calculations don’t guarantee a correct answer.' },
        ],
      },
    ],
    miniTitle: 'Repair the Root Network',
    mini: [
      {
        type: 'sort',
        prompt: 'Step 1: label the network (input layer, two hidden layers, output layer). Match each job to its part.',
        bins: ['Input layer', 'Hidden layers', 'Output layer', 'Weights and biases', 'Activation function'],
        rightTitle: 'Connected!',
        wrongTitle: 'Not quite.',
        wrongText: 'Which part receives, which transforms, and which produces the result?',
        hint: 'Information comes in, gets transformed, then comes out. Match the signs to that order.',
        items: [ // §5.3
          { text: 'Receives the information, such as the image’s pixels turned into numbers', answer: 'Input layer', explain: 'The input layer receives information supplied to the model. (§5.3)' },
          { text: 'Transform the information through weighted connections and activation functions. A network can have several (here: two).', answer: 'Hidden layers', explain: 'Hidden layers transform information. (§5.3)' },
          { text: 'Produces the result, such as scores for “cat” and “dog”', answer: 'Output layer', explain: 'The output layer produces class scores, a predicted number, or another output. (§5.3)' },
          { text: 'Adjustable numbers that change how information is transformed', answer: 'Weights and biases', explain: 'Weights and biases are adjustable numerical parameters. (§5.3)' },
          { text: 'A maths operation that helps the network represent non-linear relationships', answer: 'Activation function', explain: 'The activation function. (§5.3)' },
        ],
      },
      {
        type: 'order',
        prompt: 'Step 2: trace a cat photo through the network, then train it. Put the six steps in order.',
        hint: 'First the photo goes forward through the layers. Only then is the answer compared and the weights adjusted.',
        items: [ // §5.3–5.4; Worked Example
          'The cat photo is turned into numbers at the input layer.',
          'Hidden layers transform it, step by step.',
          'The output layer gives scores for “cat” and “dog”. This is the forward pass.',
          'During training, the output is compared with the correct label using a loss function.',
          'Backpropagation, with an optimization method such as gradient descent, works out how parameters contributed to the error and adjusts them.',
          'Repeat over many examples so the loss can go down.',
        ],
        success: 'The key idea: the network gradually adjusts its internal numbers to get better at the task. (§5.4) Wang: “Simplified version: early layers may respond to edges or textures, and later layers may combine them into more complex patterns. Exact details depend on the network, data and training goal.” (§5.5)',
      },
      { type: 'info', title: 'Step 3: the training photo album', text: [ // Try it
        'Bà Hương opens the lantern’s training album. You flip through it…',
        'Most dog photos were taken outdoors. Most cat photos were taken indoors.',
      ] },
      {
        type: 'choice',
        prompt: 'What might happen when the lantern sees a cat outdoors?',
        hint: 'Look at the backgrounds in the photos, not just the animals.',
        options: [
          { text: 'It may wrongly say “dog”. The training photos were unbalanced in a way that has nothing to do with the animal itself.', correct: true,
            feedback: 'Deep Learning may reproduce biases, or fail when new inputs differ from its training conditions. This is dataset bias, and it shows the limits of generalization. The roots untangle! (§5.7)' },
          { text: 'Nothing. Adding more layers will fix it.', correct: false,
            feedback: 'More layers don’t automatically make every model better. The problem is in the data.' },
          { text: 'It will be correct, because it learned from many photos.', correct: false,
            feedback: 'Many photos don’t help if they’re unbalanced. Data quality matters. (§5.7)' },
        ],
      },
    ],
    quizHint: 'Deep Learning sits inside Machine Learning, which sits inside AI.',
    quiz: [
      { type: 'tf', q: '“Deep Learning is separate from Machine Learning.”', answer: 'False',
        explain: 'Deep Learning is a specialized area of Machine Learning, which is itself part of AI. (§5.1)' },
      { type: 'mcq', q: 'What are the layers between the input and the output called?',
        options: ['Outer layers', 'Hidden layers', 'Rule gates', 'Database rows'], answer: 'Hidden layers',
        explain: 'Hidden layers transform the information. A network can have several. (§5.3)' },
      { type: 'tf', q: '“An artificial neural network is an exact copy of the human brain.”', answer: 'False',
        explain: 'It’s only loosely inspired by biological nervous systems. It isn’t a literal copy and doesn’t automatically understand like a human. (§5.2)' },
      { type: 'mcq', q: 'During training, which process works out how each parameter contributed to the error so it can be adjusted?',
        options: ['Forward pass', 'Backpropagation', 'Input layer', 'Activation function'], answer: 'Backpropagation',
        explain: 'Backpropagation is commonly used together with an optimization method such as gradient descent. (§5.4)' },
      { type: 'mcq', q: 'Which is a limitation of Deep Learning?',
        options: ['It can never learn complex patterns', 'It may need lots of data and computing power, and can be hard to interpret', 'It only works on text', 'It never makes mistakes'],
        answer: 'It may need lots of data and computing power, and can be hard to interpret',
        explain: 'Deep Learning is good at complex patterns, but it can be costly, hard to interpret and may reproduce biases. (§5.7)' },
    ],
    seal: 'Root Lantern',
    takeaways: [ // Topic 5 Key Takeaways
      'Deep Learning is a specialized part of Machine Learning.',
      'Neural networks process information through connected computational units and layers.',
      'Training adjusts model parameters to improve performance against a learning objective.',
      'Data, evaluation, context, and human oversight remain important.',
    ],
    doneLine: 'The lantern still makes guesses, but now we know when to double-check.',
  },

  /* ---------------------------------------------------------
     AREA 6 · Scribe's Pavilion · Topic 6: Generative AI and LLMs
     --------------------------------------------------------- */
  {
    id: 6,
    topic: 'Generative AI and Large Language Models',
    place: 'Scribe’s Pavilion',
    sign: { tx: 22, ty: 1, text: 'Scribe’s Pavilion' },
    npc: {
      name: 'Chú Minh', tx: 21, ty: 5,
      look: { skin: '#dfa77f', hair: '#151515', style: 'short', shirt: '#e8dcc0', pants: '#4a3b2a' },
    },
    object: { tx: 23, ty: 5, icon: '📃', name: 'Echo Scroll' },
    objectives: {
      meet: 'Visit Chú Minh at the Scribe’s Pavilion',
      explore: 'Say hello to the Echo Scroll (carefully!)',
      mini: 'Help Chú Minh fix the Echo Scroll’s writing',
      quiz: 'Pass Chú Minh’s knowledge check',
    },
    intro: [
      { speaker: 'Chú Minh', text: 'NIAN! Since BUG.exe got into my Echo Scroll, it writes beautiful letters, but some of what it says isn’t true.' },
      { speaker: 'Wang', text: 'The Echo Scroll is like Generative AI: systems that create new content, such as text, images, audio, video or code, from a prompt.' }, // §6.1
      { speaker: 'Chú Minh', text: 'It’s also like a Large Language Model, an LLM: trained on lots of text, and designed to process and generate language.' }, // §6.2
      { speaker: 'Wang', text: 'Careful! Generated content may be useful, but it isn’t automatically accurate, original in a legal sense, or appropriate.' }, // §6.1
      { speaker: 'Chú Minh', text: 'And not all Generative AI is an LLM. Image, audio and video models are generative too.' }, // §6.5
      { speaker: 'Chú Minh', text: 'Go and say hello to the scroll. Be careful what you tell it.' },
    ],
    exploreReminder: 'Go and say hello to the Echo Scroll. Be careful what you tell it.',
    exploreTitle: 'The Echo Scroll',
    explore: [
      { type: 'info', text: [
        'Glowing text appears on the scroll:',
        '“Hello NIAN! To help you faster, please write your village password and your health records here.”',
      ] },
      {
        type: 'choice',
        prompt: 'What do you do?',
        hint: 'Would you shout your password in the market? Public tools need the same care.',
        options: [
          { text: 'Refuse. Never enter passwords or private records into a public AI tool unless the tool and the use have been specifically approved.', correct: true,
            feedback: 'Well done! Protect private and confidential information. The scroll’s glitch flickers. (§6.8)' },
          { text: 'Write them in. It’s an AI, so it must be safe.', correct: false,
            feedback: 'That’s a common misconception. Public AI tools aren’t automatically safe places for confidential information. (Nothing was sent.)' },
        ],
      },
    ],
    miniTitle: 'The Scribe’s Workshop',
    mini: [
      {
        type: 'order',
        prompt: 'Step 1 (warm-up): how does the scroll write? Put the four generation steps in order.',
        hint: 'Words become tokens first. Then the scroll predicts, picks, adds, and repeats.',
        items: [ // §6.2–6.3
          'Your prompt and the conversation are converted into tokens: whole words, parts of words, punctuation or other text fragments.',
          'The model calculates likely next-token options.',
          'A decoding method selects the next token, according to probabilities and generation settings.',
          'The new token is added to the context, and the process repeats until the response is complete.',
        ],
        success: 'Chú Minh: “That’s how many LLMs write: predicting tokens step by step from context. But plausible language is not the same as checking facts.” (§6.2, §6.4)',
      },
      { type: 'info', title: 'Step 2: the Prompt Forge', text: [ // Worked Example
        'Prompt A: “Explain AI.” Chú Minh says it’s too vague.',
        'Prompt B: “Explain the difference between AI, Machine Learning, and Deep Learning to a first-year university student with no coding experience. Use a short comparison table, one everyday example for each term, and a final three-question quiz. If a point is uncertain, say so.”',
        'Tag each part of Prompt B with one of the six prompt components.',
      ] },
      {
        type: 'sort',
        prompt: 'Which component is each part of Prompt B?',
        bins: ['Task', 'Context', 'Audience', 'Constraints', 'Output format', 'Verification'],
        rightTitle: 'Tagged!',
        wrongTitle: 'Not quite.',
        wrongText: 'Ask: who is it for? What should it do? What shape should the answer take? What should it say if it’s unsure?',
        hint: 'Who is it for? What should it do? What shape should the answer take? What should it say if it’s unsure?',
        items: [ // §6.6 (mapping of "scope", "structure", "quality expectations" is derived)
          { text: '“Explain the difference between AI, Machine Learning, and Deep Learning”', answer: 'Task', explain: 'Task: say what the system should do. (§6.6)' },
          { text: '“to a first-year university student with no coding experience”', answer: 'Audience', explain: 'Audience: specify who the answer is for. (§6.6)' },
          { text: '“one everyday example for each term”', answer: 'Constraints', explain: 'Constraints: state limits or requirements, here the scope of the answer. (§6.6)' },
          { text: '“Use a short comparison table … and a final three-question quiz”', answer: 'Output format', explain: 'Output format: request a table, numbered steps, outline, or short explanation. (§6.6)' },
          { text: '“If a point is uncertain, say so.”', answer: 'Verification', explain: 'Verification: ask for uncertainty to be identified, then check important claims. (§6.6)' },
        ],
      },
      {
        type: 'choice',
        keepOrder: true,
        prompt: 'Which of the six components is missing from Prompt B?',
        hint: 'Does Prompt B say why the answer is needed or how it will be used?',
        options: [
          { text: 'Task', correct: false, feedback: 'Prompt B does say what to do: explain the difference.' },
          { text: 'Context', correct: true, feedback: 'Prompt B never says why it’s needed or how it will be used. Context gives relevant background and intended use. (§6.6)' },
          { text: 'Audience', correct: false, feedback: 'Prompt B names its audience: a first-year student with no coding experience.' },
          { text: 'Constraints', correct: false, feedback: 'Prompt B sets limits: one everyday example for each term.' },
          { text: 'Output format', correct: false, feedback: 'Prompt B asks for a table and a quiz.' },
          { text: 'Verification', correct: false, feedback: 'Prompt B asks the model to say when a point is uncertain.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Pick a Context tile to complete the prompt.',
        hint: 'Context = relevant background and intended use.',
        options: [
          { text: '“This is for our study group’s revision before the module quiz.”', correct: true, feedback: 'Now the prompt has all six components!' },
          { text: '“Here is my password so you know who I am.”', correct: false, feedback: 'Never put passwords in a prompt. (§6.8)' },
          { text: '“Make sure every fact is 100% true.”', correct: false, feedback: 'A clear prompt improves the answer but doesn’t guarantee correctness. You still have to check.' },
        ],
      },
      { type: 'info', title: 'Step 3: fact-check the Echo Scroll', text: [
        'The scroll answers with four claims. Check each one against the Archive Book, which is written from the module’s topic files.',
        'Archive Book: “Generative AI refers to AI systems designed to create new content, such as text, images, audio, video, or code.” (§6.1)',
        'Archive Book: “Misconception to avoid: every AI-generated answer is based on a live Internet search.”',
        'Archive Book: “A model may produce fluent text containing false details, invented citations, or unsupported reasoning.” (§6.4)',
        'The Archive Book says nothing about this year’s festival.',
      ] },
      {
        type: 'sort',
        prompt: 'Stamp each claim: Useful, Uncertain, Unsupported, or Wrong.',
        bins: ['Useful', 'Uncertain', 'Unsupported', 'Wrong'],
        rightTitle: 'Stamped!',
        wrongTitle: 'Check the Archive Book again.',
        wrongText: 'Found and matching = Useful. Contradicted = Wrong. No evidence given = Unsupported. Can’t be checked yet = Uncertain.',
        hint: 'Can you find it in the Archive Book? Found and matching = Useful. Contradicted = Wrong. No evidence given = Unsupported. Can’t be checked yet = Uncertain.',
        items: [ // claim texts are [GAME IDEA]
          { text: '“Generative AI can create text, images, audio, video, or code.”', answer: 'Useful', explain: 'The Archive Book confirms it. (§6.1)' },
          { text: '“Every answer I write comes from a live Internet search.”', answer: 'Wrong', explain: 'That’s a listed misconception.' },
          { text: '“A famous study proves this scroll is never wrong.”', answer: ['Unsupported', 'Wrong'], explain: 'No study is named and none can be found. Models may invent citations or give unsupported reasoning. (§6.4, §6.7)' },
          { text: '“About 500 visitors will come to this year’s lotus festival.”', answer: ['Uncertain', 'Unsupported'], explain: 'The Archive Book has no information on this, so it can’t be checked. It’s a guess presented as a fact.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Before relying on a factual claim or reference, what should you do?',
        hint: 'Fluent isn’t the same as factual.',
        options: [
          { text: 'Check it with an independent, reliable source.', correct: true, feedback: 'Treat generated work as a draft requiring human review. (§6.8)' },
          { text: 'Trust it if it sounds confident.', correct: false, feedback: 'A fluent response doesn’t prove every statement is true.' },
        ],
      },
    ],
    quizHint: 'Fluent isn’t the same as factual.',
    quiz: [
      { type: 'mcq', q: 'What is a “token” in an LLM?',
        options: ['A hardware chip', 'A unit of text, such as a word, part of a word or punctuation', 'A password key', 'A copyright licence'],
        answer: 'A unit of text, such as a word, part of a word or punctuation',
        explain: 'LLMs represent text as tokens, which may be whole words, parts of words, punctuation or other fragments. (§6.2)' },
      { type: 'mcq', q: 'When an LLM confidently produces invented or incorrect information, this is called…',
        options: ['Overfitting', 'A hallucination (or confabulation)', 'Tokenization', 'Backpropagation'], answer: 'A hallucination (or confabulation)',
        explain: 'A hallucination is fabricated or incorrect information presented in a confident style. (§6.7)' },
      { type: 'mcq', q: 'Why doesn’t fluent grammar guarantee a true answer?',
        options: ['The model predicts likely next tokens; it doesn’t check facts against a trusted source', 'LLMs use IF-THEN rules', 'Developers add mistakes on purpose', 'LLMs only work offline'],
        answer: 'The model predicts likely next tokens; it doesn’t check facts against a trusted source',
        explain: 'Generating plausible language is not the same as checking facts. (§6.4)' },
      { type: 'tf', q: '“Generative AI and LLM mean exactly the same thing.”', answer: 'False',
        explain: 'LLMs focus on language. Generative AI also includes image, audio and video models. (§6.5)' },
      { type: 'tf', q: '“A clear, detailed prompt guarantees a correct answer.”', answer: 'False',
        explain: 'Clear prompts improve task alignment but don’t guarantee correctness. Prompting doesn’t remove all model limitations. (Key Takeaways)' },
    ],
    seal: 'Brush of Clear Prompts',
    takeaways: [ // Topic 6 Key Takeaways
      'Generative AI creates content in several modalities; LLMs focus on language.',
      'Many LLMs generate text by predicting tokens step by step from context.',
      'Clear prompts improve task alignment but do not guarantee correctness.',
      'Verify important claims and protect private or confidential information.',
    ],
    doneLine: 'The scroll writes beautifully again, and now we treat what it writes as a draft to check.',
  },

  /* ---------------------------------------------------------
     AREA 7 · Village Market · Topic 7: Real-World Applications of AI
     --------------------------------------------------------- */
  {
    id: 7,
    topic: 'Real-World Applications of AI',
    place: 'Village Market',
    sign: { tx: 32, ty: 1, text: 'Market' },
    npc: {
      name: 'Cô Hoa', tx: 32, ty: 6,
      look: { skin: '#e9b48c', hair: '#1f1a17', style: 'long', hat: 'nonla', shirt: '#d96c8a', pants: '#2b2a33' },
    },
    object: { tx: 34, ty: 6, icon: '🎵', name: 'music stall board' },
    objectives: {
      meet: 'Visit Cô Hoa at the Village Market',
      explore: 'Check the music stall’s recommendation board',
      mini: 'Restore the stall signs and fix the route cart',
      quiz: 'Pass Cô Hoa’s knowledge check',
    },
    intro: [
      { speaker: 'Cô Hoa', text: 'Welcome to the market, NIAN! BUG.exe mixed up all six stall signs. Now people think every “AI” stall sells the same thing.' },
      { speaker: 'Wang', text: 'But AI is applied to different problems, using different methods and data.' }, // Key Takeaways
      { speaker: 'Cô Hoa', text: 'Saying “AI is used here” isn’t enough. Ask: what problem? What data? What capability? What output? Who acts on it? What could go wrong? How is it checked?' }, // §7.1
      { speaker: 'Wang', text: 'And an AI application is more than a model. It also includes people, data collection, interfaces, rules, monitoring and decisions.' }, // §7.8
      { speaker: 'Cô Hoa', text: 'Let’s start with the music stall. Its recommendation board looks a bit… narrow today.' },
      { speaker: 'Wang', text: 'Let’s take a look, NIAN!' },
    ],
    exploreReminder: 'Start with the music stall. Its recommendation board looks a bit narrow today.',
    exploreTitle: 'The recommendation board',
    explore: [
      { type: 'info', text: [
        'The board says “Top picks for you!”',
        'But every song is the same style NIAN listened to yesterday, and nothing else in the stall appears.',
      ] },
      {
        type: 'choice',
        prompt: 'What is the board really showing?',
        hint: 'Are you seeing everything in the stall, or a selection picked for you?',
        options: [
          { text: 'A selection based on what I did before. It may narrow what I see and reinforce my preferences.', correct: true,
            feedback: 'Recommendations are selected outputs, not neutral windows onto everything available. They can make discovery easier, but may narrow what users see or prioritize engagement over quality. A “More in the stall…” button appears. (§7.7)' },
          { text: 'Every song in the stall, shown fairly.', correct: false,
            feedback: 'That’s a common misconception. Recommendations rank items based on user behaviour and item characteristics; they don’t show every option. (§7.7)' },
        ],
      },
    ],
    miniTitle: 'Market Restoration',
    mini: [
      {
        type: 'sort',
        prompt: 'Step 1: restore the six stall signs. Which sector uses each application?',
        bins: ['Education', 'Healthcare', 'Transportation', 'Business and finance', 'Agriculture and environment', 'Entertainment and everyday services'],
        rightTitle: 'Sign restored!',
        wrongTitle: 'Not that stall.',
        wrongText: 'Read the application again. Which sector would use that?',
        hint: 'Think about who has that problem: a teacher, a doctor, a driver, a shopkeeper, a farmer, or a music fan?',
        items: [ // §7.2–7.7; explanations are each stall's main risk from the source
          { text: 'Practice-question generation and personalized learning recommendations', answer: 'Education', explain: 'Stall-keeper: “Watch out for inaccurate explanations and overdependence. Check outputs.” (§7.2)' },
          { text: 'Assisting with medical-image analysis', answer: 'Healthcare', explain: 'Stall-keeper: “Our results need clinical review. They’re not a diagnosis.” (§7.3)' },
          { text: 'Route recommendations and traffic forecasting', answer: 'Transportation', explain: 'Stall-keeper: “Errors here can have physical consequences.” (§7.4)' },
          { text: 'Fraud or anomaly detection and demand forecasting', answer: 'Business and finance', explain: 'Stall-keeper: “Decisions can affect people’s access to money. We need human review and appeals.” (§7.5)' },
          { text: 'Monitoring crop health and identifying pests', answer: 'Agriculture and environment', explain: 'Stall-keeper: “It only helps if the data, connection and local conditions fit.” (§7.6)' },
          { text: 'Recommending music, films or videos', answer: 'Entertainment and everyday services', explain: 'Stall-keeper: “Our picks may narrow what you see.” (§7.7)' },
        ],
      },
      { type: 'info', title: 'Step 2: the route cart’s Application Canvas', text: [ // Worked Example
        'The route-planning cart keeps announcing that its route is “GUARANTEED”.',
        'Fill in its six-field canvas. Some cards belong to other stalls. Put those in “Another stall”.',
      ] },
      {
        type: 'sort',
        prompt: 'Place each card on the right field of the route cart’s canvas.',
        bins: ['Problem', 'Data', 'AI capability', 'Output', 'Expected benefit', 'Risk / safeguard', 'Another stall'],
        rightTitle: 'Placed!',
        wrongTitle: 'Not that field.',
        wrongText: 'Follow Cô Hoa’s questions: what problem? what data? what capability? what output? what could go wrong?',
        hint: 'Follow Cô Hoa’s questions: what problem? what data? what capability? what output? what could go wrong?',
        items: [
          { text: 'Estimate travel time and suggest a route', answer: 'Problem', explain: 'The problem the service addresses. (Worked Example)' },
          { text: 'Road-network data, current or historical traffic, location inputs', answer: 'Data', explain: 'The data a route planner may use. (Worked Example; §7.4)' },
          { text: 'Prediction: prediction algorithms estimate travel time', answer: 'AI capability', explain: 'The AI capability involved. (Worked Example)' },
          { text: 'A suggested route: a recommendation, not a guarantee', answer: 'Output', explain: 'The output is a recommendation, not a guarantee. (Worked Example)' },
          { text: 'Helps travellers choose a route, with an estimated travel time', answer: 'Expected benefit', explain: 'Derived from what the service does: it estimates travel time and suggests a route.' },
          { text: 'Risk: closures, accidents, weather or bad location data can change the best route. Safeguard: reliability, testing, safety engineering and human responsibility.', answer: 'Risk / safeguard', explain: 'Errors in transport can have physical consequences, so reliability, testing, safety engineering and human responsibility are essential. (Worked Example; §7.4)' },
          { text: 'Medical images', answer: 'Another stall', explain: 'That belongs to the Healthcare stall. (§7.3)' },
          { text: 'A fraud alert', answer: 'Another stall', explain: 'That belongs to the Business and finance stall. (§7.5)' },
          { text: 'Identifying pests', answer: 'Another stall', explain: 'That belongs to the Agriculture and environment stall. (§7.6)' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Where does human judgment remain important?',
        hint: 'Who is actually driving the cart?',
        options: [
          { text: 'The driver decides and remains responsible for following road rules and driving safely.', correct: true,
            feedback: 'The cart’s sign changes from “GUARANTEED ROUTE” to “Suggested route: please check conditions”. (Worked Example)' },
          { text: 'Nowhere. The cart’s route is guaranteed.', correct: false, feedback: 'The output is a recommendation, not a guarantee. (Worked Example)' },
        ],
      },
    ],
    quizHint: 'AI supports people. It doesn’t remove responsibility.',
    quiz: [
      { type: 'mcq', q: 'Which sector uses AI to assist with medical-image analysis?',
        options: ['Transportation', 'Healthcare', 'Entertainment', 'Agriculture'], answer: 'Healthcare',
        explain: 'Healthcare AI can assist with medical-image analysis, organizing information and research. (§7.3)' },
      { type: 'tf', q: '“An AI result in healthcare can be treated as a diagnosis without clinical review.”', answer: 'False',
        explain: 'Medical AI needs validation, monitoring and qualified professional oversight. AI outputs shouldn’t automatically replace professional judgment in high-impact contexts. (§7.3)' },
      { type: 'tf', q: '“A technical AI model alone forms a complete sociotechnical system.”', answer: 'False',
        explain: 'An AI application also includes people, data collection, user interfaces, organizational rules, infrastructure, monitoring and decision processes. (§7.8)' },
      { type: 'mcq', q: 'A crop-health model worked well in testing. Will it work equally well on every farm?',
        options: ['Yes, a model that works once works everywhere', 'Not necessarily: benefits depend on data quality, connectivity, local conditions and affordability', 'Only if the farm is large', 'No, AI never works on farms'],
        answer: 'Not necessarily: benefits depend on data quality, connectivity, local conditions and affordability',
        explain: 'A model that works in a laboratory won’t necessarily work equally well everywhere. Evaluate it in its real context. (§7.6)' },
      { type: 'mcq', q: 'Why may important financial decisions made with AI need human review and appeal mechanisms?',
        options: ['Because AI can’t do maths', 'Because they can affect people’s access to services or money, so errors and unfair impacts matter', 'Because banks don’t use data', 'They never need review'],
        answer: 'Because they can affect people’s access to services or money, so errors and unfair impacts matter',
        explain: 'Models should be tested for errors and unfair impacts, and important decisions may require human review. (§7.5)' },
    ],
    seal: 'Market Compass',
    takeaways: [ // Topic 7 Key Takeaways
      'AI is applied to different problems using different methods and data.',
      'Every use case should be evaluated in its real context.',
      'High-impact applications need validation, monitoring, safeguards, and appropriate human oversight.',
      'AI supports people and organizations; it does not remove responsibility.',
    ],
    doneLine: 'Every stall is different again, and every one of them still needs people.',
  },

  /* ---------------------------------------------------------
     AREA 8 · Communal Hall · Topic 8: Benefits, Risks and AI Ethics
     --------------------------------------------------------- */
  {
    id: 8,
    topic: 'Benefits, Risks and AI Ethics',
    place: 'Communal Hall',
    sign: { tx: 33, ty: 9, text: 'Communal Hall' },
    npc: {
      name: 'Bác Trưởng thôn', tx: 32, ty: 13,
      look: { skin: '#dfa77f', hair: '#9e9e9e', style: 'short', hat: 'turban', shirt: '#8a2d2d', pants: '#22252e' },
    },
    object: { tx: 34, ty: 13, icon: 'stamp', name: 'Rubber Stamp' },
    objectives: {
      meet: 'Visit Bác Trưởng thôn at the Communal Hall',
      explore: 'Inspect the Rubber Stamp on the council table',
      mini: 'Hold a proper Ethics Council on the school’s flagging tool',
      quiz: 'Pass Bác Trưởng thôn’s knowledge check',
    },
    intro: [
      { speaker: 'Bác Trưởng thôn', text: 'NIAN, the school wants an AI tool that flags students who may be at risk of failing. But since BUG.exe came, the council approves everything without reading it.' },
      { speaker: 'Wang', text: 'AI can bring benefits: efficiency, scale, support for decisions, accessibility, creativity and productivity.' }, // §8.1
      { speaker: 'Bác Trưởng thôn', text: 'It also has risks. It can make errors, fail on unfamiliar inputs, reproduce biases, expose private data, or be misused.' }, // §8.2
      { speaker: 'Wang', text: 'Risk depends on the application and on what happens when it makes a mistake.' }, // §8.2
      { speaker: 'Bác Trưởng thôn', text: 'The purpose may be supportive, but safeguards are still required. First, look at that stamp on my table.' }, // Worked Example
      { speaker: 'Wang', text: 'It says “APPROVED” before anyone has read anything…' },
    ],
    exploreReminder: 'First, look at that Rubber Stamp on my table.',
    exploreTitle: 'The Rubber Stamp',
    explore: [
      { type: 'info', text: [
        'The stamp thumps “APPROVED” onto every AI flag in the pile.',
        'The council member holding it says: “I don’t have time to read them, and I’m not allowed to change them anyway.”',
      ] },
      {
        type: 'choice',
        prompt: 'Is this real human oversight?',
        hint: 'Can this reviewer read, question or change anything?',
        options: [
          { text: 'No. Oversight is only meaningful if the reviewer has enough information, authority, time and expertise to question or override the system.', correct: true,
            feedback: 'Merely placing a person in the workflow doesn’t guarantee responsible oversight. The stamp cracks! (§8.7)' },
          { text: 'Yes. A person is involved, so it’s safe.', correct: false,
            feedback: 'That’s a common misconception. Human oversight doesn’t mean a person only approves outputs without reviewing them. (§8.7)' },
        ],
      },
    ],
    miniTitle: 'The Ethics Council',
    mini: [
      {
        type: 'sort',
        prompt: 'Step 1: place each concern about the school’s flagging tool on the ethical review checklist.',
        bins: ['Purpose', 'People', 'Data', 'Performance', 'Transparency', 'Human control', 'Accountability'],
        rightTitle: 'Good point for the council!',
        wrongTitle: 'Not that item.',
        wrongText: 'Read the key word on the card: purpose, who, data, accurate, know, review, or responsible.',
        hint: 'Each card’s key word points to one checklist item. “Who” is People. “Know” is Transparency. “Responsible” is Accountability.',
        items: [ // §8.8 checklist applied to the Worked Example
          { text: 'Is flagging at-risk students a legitimate, clearly defined purpose?', answer: 'Purpose', explain: 'Purpose: is the system being used for a legitimate and clearly defined purpose? (§8.8)' },
          { text: 'Which students may benefit, and who may be harmed or left out?', answer: 'People', explain: 'People: who may benefit, and who may be harmed or excluded? (§8.8)' },
          { text: 'What data does the tool use? Is it relevant, secure and representative, or does it reflect unequal access to resources?', answer: 'Data', explain: 'Data: is the data relevant, appropriate, secure, and representative? (§8.8; Worked Example)' },
          { text: 'How accurate are its predictions for different groups of students?', answer: 'Performance', explain: 'Performance: has the system been tested in the context where it will be used? (§8.8; Worked Example)' },
          { text: 'Do students know the tool is being used, what it’s for, and its limits?', answer: 'Transparency', explain: 'Transparency: do affected people understand the system’s role and limitations? (§8.6, §8.8)' },
          { text: 'Does a teacher review the information before action is taken, and can students correct errors?', answer: 'Human control', explain: 'Human control: can a qualified person review, challenge, or correct important outcomes? (§8.8; Worked Example)' },
          { text: 'Who is responsible if a student is wrongly flagged?', answer: 'Accountability', explain: 'Accountability: who is responsible when the system causes harm or makes an error? (§8.8)' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Step 2, finding 1 of 4: one affected group',
        hint: 'Remember: the purpose may be supportive, but safeguards are still required.',
        options: [
          { text: 'Students, especially those from groups that may be under-represented or have unequal access to resources', correct: true, feedback: 'Noted by the council. (Worked Example; §8.3)' },
          { text: 'Nobody. It’s just maths.', correct: false, feedback: 'AI isn’t automatically fair because it uses mathematics.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Finding 2 of 4: one potential harm',
        hint: 'Remember: the purpose may be supportive, but safeguards are still required.',
        options: [
          { text: 'Some students may be wrongly flagged, because a model trained on data that under-represents a group may perform worse for that group', correct: true, feedback: 'Noted by the council. (§8.3)' },
          { text: 'No harm is possible, because the purpose is supportive.', correct: false, feedback: 'Even supportive tools need safeguards. (Worked Example)' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Finding 3 of 4: one safeguard',
        hint: 'Remember: the purpose may be supportive, but safeguards are still required.',
        options: [
          { text: 'A teacher reviews the information before any action, and students can correct errors', correct: true, feedback: 'Noted by the council. (Worked Example; §8.7)' },
          { text: 'A staff member clicks “Approve” on every flag.', correct: false, feedback: 'That’s rubber-stamping, not oversight. (§8.7)' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Finding 4 of 4: one decision that stays with a human or organization',
        hint: 'Remember: the purpose may be supportive, but safeguards are still required.',
        options: [
          { text: 'Deciding what action is taken for a flagged student', correct: true, feedback: 'Organizations and people remain responsible for how AI systems are used. (Worked Example; §8.7)' },
          { text: 'Nothing. The tool decides.', correct: false, feedback: 'Organizations and people remain responsible for how AI is used. (§8.7)' },
        ],
      },
    ],
    quizHint: 'Human oversight and accountability must be real, not symbolic.',
    quiz: [
      { type: 'tf', q: '“AI models are always objective and free of human bias.”', answer: 'False',
        explain: 'Bias can enter through data, historical inequalities, labels, design choices, measurement or deployment. (§8.3)' },
      { type: 'mcq', q: 'How can biased training data lead to unfair outcomes?',
        options: ['It can’t, because data is just numbers', 'A model trained on data that under-represents a group may perform worse for that group', 'Biased data makes the model faster', 'Only labels matter, never data'],
        answer: 'A model trained on data that under-represents a group may perform worse for that group',
        explain: 'Models can learn and repeat unfair patterns, including those from historical inequalities. (§8.3)' },
      { type: 'mcq', q: 'Which is a practical way to protect privacy when using an AI tool?',
        options: ['Upload everything so the tool knows you better', 'Collect and share only what is needed, and don’t share sensitive information unless the use is authorised and appropriate', 'Share your friends’ messages instead of your own', 'Privacy doesn’t apply to AI'],
        answer: 'Collect and share only what is needed, and don’t share sensitive information unless the use is authorised and appropriate',
        explain: 'Responsible practice includes collecting only what’s needed, limiting access, securing data and following policies. (§8.4)' },
      { type: 'mcq', q: '“Students are told the tool is used and what its limits are.” “The school is responsible if the tool makes an error.” Which is which?',
        options: ['Both are transparency', 'First is transparency, second is accountability', 'First is accountability, second is transparency', 'Both are accountability'],
        answer: 'First is transparency, second is accountability', keepOrder: true,
        explain: 'Transparency is telling people when AI is used, what it’s for and its limits. Accountability is about who remains responsible. (§8.6–8.7)' },
      { type: 'tf', q: '“AI-generated media is always easy to identify.”', answer: 'False',
        explain: 'Generative systems can create realistic text, images, audio and video. Check original sources and corroborate important claims. (§8.5)' },
    ],
    seal: 'Council Seal',
    takeaways: [ // Topic 8 Key Takeaways
      'AI can bring benefits, but outcomes depend on design, data, deployment, and governance.',
      'Bias, privacy, misinformation, safety, and security require active attention.',
      'Fairness and transparency must be evaluated in context.',
      'Human oversight and accountability must be real, not symbolic.',
      'Responsible AI is a shared responsibility across the lifecycle.',
    ],
    doneLine: 'From now on, the council reads before it decides, and we stay responsible for what we decide.',
  },

  /* ---------------------------------------------------------
     AREA 9 · Observatory Hill · Topic 9: The Future of AI
     --------------------------------------------------------- */
  {
    id: 9,
    topic: 'The Future of AI',
    place: 'Observatory Hill',
    sign: { tx: 32, ty: 17, text: 'Observatory' },
    npc: {
      name: 'Thầy Khoa', tx: 31, ty: 21,
      look: { skin: '#e2ad86', hair: '#151515', style: 'short', shirt: '#f0f0f0', pants: '#5a5f6a' },
    },
    object: { tx: 33, ty: 21, icon: '📢', name: 'loudspeaker' },
    objectives: {
      meet: 'Visit Thầy Khoa at Observatory Hill',
      explore: 'Listen to BUG.exe’s loudspeaker',
      mini: 'Use the Forecast Lens to sort the prophecies',
      quiz: 'Pass Thầy Khoa’s knowledge check',
    },
    intro: [
      { speaker: 'Thầy Khoa', text: 'NIAN, you made it! BUG.exe keeps shouting prophecies from my roof, and the villagers believe every word.' },
      { speaker: 'Wang', text: 'But not every forecast about AI is a fact.' }, // Misconceptions
      { speaker: 'Thầy Khoa', text: 'My telescope shows directions people are watching: multimodal systems, AI agents and tool use, smaller and more efficient models, AI in science and engineering, robotics and embodied AI, and evaluation and governance.' }, // §9.1
      { speaker: 'Wang', text: 'And the future isn’t decided by technology alone. Laws, business choices, cultural values and public decisions matter too.' }, // §9.6
      { speaker: 'Thầy Khoa', text: 'So we separate what’s demonstrated from what’s forecast or only imagined. Listen to that loudspeaker…' }, // §9.5
      { speaker: 'Loudspeaker', text: 'AI WILL REPLACE ALL TEACHERS WITHIN TEN YEARS!' }, // Worked Example
    ],
    exploreReminder: 'Listen to that loudspeaker by the observatory.',
    exploreTitle: 'The loudspeaker prophecy',
    explore: [
      { type: 'info', text: ['The loudspeaker blares: “AI WILL REPLACE ALL TEACHERS WITHIN TEN YEARS!”'] },
      {
        type: 'choice',
        prompt: '“AI will replace all teachers within ten years.” What kind of statement is this?',
        hint: 'Is it describing something that exists now, or something that might happen?',
        options: [
          { text: 'A prediction, not an established fact.', correct: true,
            feedback: 'It’s a prediction about the future, and it needs evidence before anyone acts on it. The loudspeaker crackles and goes quiet. (Worked Example)' },
          { text: 'A fact. It sounds very sure.', correct: false,
            feedback: 'Sounding confident doesn’t make it true. Not every forecast about AI is a fact.' },
        ],
      },
    ],
    miniTitle: 'The Forecast Lens',
    mini: [
      {
        type: 'sort',
        prompt: 'Step 1: sort the five prophecy-stars.',
        bins: ['Observed trend', 'Prediction', 'Hypothetical scenario'],
        rightTitle: 'Star placed!',
        wrongTitle: 'Not quite.',
        wrongText: 'Ask: is this happening now, is it a claim about the future, or is it an imagined possibility?',
        hint: 'Happening now is a trend. Will happen is a prediction. Might one day exist is hypothetical.',
        items: [
          { text: '“Some AI models are being designed to run with lower computing or energy requirements, or on local devices.”', answer: 'Observed trend', explain: 'The source lists this as a current direction: smaller and more efficient models. (§9.1)' },
          { text: '“Some AI systems are designed to plan and carry out sequences of actions using software tools, often with human-defined permissions.”', answer: 'Observed trend', explain: 'A current direction: AI agents and tool use. (§9.1)' },
          { text: '“AI will replace all teachers within ten years.”', answer: 'Prediction', explain: 'It’s a statement about the future, made without evidence. (Worked Example)' },
          { text: '“AI will affect every job in the same way.”', answer: 'Prediction', explain: 'An overconfident prediction. Effects will differ by occupation, organization, country and policy. (§9.3)' },
          { text: '“One day a system will have broad general abilities across many tasks.”', answer: 'Hypothetical scenario', explain: 'Some people discuss this possibility, but there is uncertainty about definitions, timelines and feasibility. (§9.5)' },
        ],
      },
      {
        type: 'multi',
        prompt: 'Step 2: for the teachers prophecy, which questions would give you useful evidence? Pick two or more, then press Check.',
        min: 2,
        hint: 'Good questions ask about tasks, evidence, and the choices people could make.',
        needMore: 'Pick at least two good questions.',
        success: 'Those are the questions a careful analysis asks. (Worked Example; §9.7)',
        options: [
          { text: 'Which teaching tasks may AI support or automate?', correct: true },
          { text: 'Which tasks depend on human relationships and professional judgment?', correct: true },
          { text: 'What evidence exists, and is the source reliable and recent enough?', correct: true },
          { text: 'What policies or social choices could change the outcome?', correct: true },
          { text: 'How confident does the speaker sound?', correct: false, feedback: 'Confidence isn’t evidence.' },
          { text: 'How many villagers are repeating it?', correct: false, feedback: 'Repetition isn’t evidence either.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Step 3: which is a cautious, evidence-based version of the prophecy?',
        hint: 'Look for the careful words: may, some, depend on.',
        options: [
          { text: 'AI may support or automate some teaching tasks, while tasks that depend on human relationships and professional judgment stay important. The outcome will depend on evidence, how schools adopt tools, and policy.', correct: true,
            feedback: 'That’s an evidence-based prediction. (Worked Example; §9.2)' },
          { text: 'AI will definitely replace all teachers, maybe even sooner.', correct: false, feedback: 'That’s even more overconfident.' },
          { text: 'AI will never change anything in schools.', correct: false, feedback: 'That’s overconfident in the other direction.' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Pick one possible benefit of AI in education.',
        hint: 'Look at Thầy Khoa’s notes on education.',
        options: [
          { text: 'Individualised practice, language assistance, accessibility or feedback', correct: true, feedback: 'A possible benefit. (§9.2)' },
          { text: 'No more need for critical thinking', correct: false, feedback: 'Critical thinking and human relationships remain important. (§9.2)' },
        ],
      },
      {
        type: 'choice',
        prompt: 'Pick one possible risk of AI in education.',
        hint: 'Look at Thầy Khoa’s notes on education.',
        options: [
          { text: 'It may make it easier to produce incorrect or unoriginal work, and may create privacy and fairness concerns', correct: true,
            feedback: 'A possible risk. The loudspeaker now plays the cautious version instead! (§9.2)' },
          { text: 'There are no risks', correct: false, feedback: 'The source lists real risks for education. (§9.2)' },
        ],
      },
    ],
    quizHint: 'The future is shaped by technical progress and human decisions.',
    quiz: [
      { type: 'mcq', q: 'Which trend describes models that work across text, images, audio and video together?',
        options: ['Multimodal systems', 'Symbolic expert systems', 'Single-layer classifiers', 'Rule-based timers'], answer: 'Multimodal systems',
        explain: 'Multimodal systems work across combinations of text, images, audio, video and other inputs. (§9.1)' },
      { type: 'tf', q: '“Observed trends should be treated the same as hypothetical scenarios.”', answer: 'False',
        explain: 'Separate demonstrated capabilities from forecasts and hypothetical futures. (§9.5, §9.7)' },
      { type: 'mcq', q: 'Why is it better to discuss how AI changes tasks than to claim it will replace every job?',
        options: ['Because AI can’t do any tasks', 'Because AI may automate parts of some tasks, change workflows and create new roles, and effects differ by occupation, organization, country and policy', 'Because every job will change in exactly the same way', 'Because jobs never change'],
        answer: 'Because AI may automate parts of some tasks, change workflows and create new roles, and effects differ by occupation, organization, country and policy',
        explain: 'Discussing tasks is more accurate than sweeping claims. Skills like problem framing, data literacy and critical evaluation may grow in demand. (§9.3)' },
      { type: 'tf', q: '“AI’s future is determined by technology alone, regardless of policy or society.”', answer: 'False',
        explain: 'Laws, business choices, cultural values and public decisions also shape the future. (§9.6)' },
      { type: 'tf', q: '“Current generative systems prove that AGI or ASI has been achieved.”', answer: 'False',
        explain: 'Talk about AGI involves uncertainty about definitions, timelines and feasibility. Don’t present speculation as fact. (§9.5)' },
    ],
    seal: 'Star Map',
    takeaways: [ // Topic 9 Key Takeaways
      'AI’s future will be shaped by technical progress and human decisions.',
      'Discuss specific tasks, contexts, and evidence rather than making sweeping claims.',
      'Separate demonstrated capabilities from forecasts and hypothetical scenarios.',
      'Education, critical thinking, governance, and responsible design will influence outcomes.',
    ],
    doneLine: 'No one knows the future for certain, but now you know how to question it.',
  },
];


/* =========================================================
   FINAL STAGE · BUG.exe's corrupted core
   Unlocks after all nine Seals. Story lines are [GAME IDEA].
   Each battle round reviews one topic: BUG.exe shouts a
   "Common misconception to avoid" from that topic file, and
   NIAN answers with the fact (section numbers in comments).
   ========================================================= */
const FINALE = {
  discovery: [
    { speaker: 'Wang', text: 'Warning! Warning! Strong tremors detected in the village centre!' },
    { speaker: 'NIAN', text: 'The sky is going dark… and what is that above the lotus pond?' },
    { speaker: 'Wang', text: 'A cosmic hole! It’s full of corrupted data: scrambled labels, broken rules and false claims. Scanning…' },
    { speaker: 'Wang', text: 'Found the source. BUG.exe is hiding inside! Every glitch in Làng AI came from there.' },
    { speaker: 'BUG.exe', text: 'Heh heh… You fixed nine little places, NIAN. But my core is full of misconceptions. Come in, if you dare!' },
    { speaker: 'NIAN', text: 'We learned all nine topics, Wang. We can beat it with facts.' },
    { speaker: 'Wang', text: 'Then walk into the hole, NIAN. I’ll be right behind you, with hints ready!' },
  ],
  portalReminder: [
    { speaker: 'Wang', text: 'BUG.exe is inside that cosmic hole over the lotus pond.' },
    { speaker: 'Wang', text: 'Walk into it when you’re ready, NIAN. I’ll follow you!' },
  ],
  battleIntro: [
    { speaker: 'BUG.exe', text: 'Welcome to my core, NIAN! Every scrambled label and false claim in Làng AI comes from here.' },
    { speaker: 'BUG.exe', text: 'First I’ll throw my glitches at you. Then my favorite misconceptions. Let’s see if your nine Seals can stop me!' },
    { speaker: 'Wang', text: 'NIAN, dodge the glitch blocks with WASD or the arrow keys. When BUG.exe shouts a misconception, choose the fact that answers it.' },
    { speaker: 'Wang', text: 'Each correct answer charges one of your Seals. Then move under BUG.exe and press E or Space to strike! Press H any time for my hint.' },
    { speaker: 'NIAN', text: 'Nine topics, nine Seals. Let’s fix this village!' },
  ],
  knockedDown: [
    { speaker: 'Wang', text: 'Ouch! BUG.exe’s glitches got us. Don’t worry, NIAN.' },
    { speaker: 'Wang', text: 'Your hearts are refilled. Let’s try this round again: keep moving and watch for the gaps!' },
  ],
  victory: [
    { speaker: 'BUG.exe', text: 'N-no… my misconceptions… are being… corrected…' },
    { speaker: 'Wang', text: 'BUG.exe is breaking apart! The core is stabilizing, NIAN!' },
    { speaker: 'NIAN', text: 'Facts, evidence and careful thinking. That’s how you beat a glitch.' },
    { speaker: 'Wang', text: 'Hold on tight, we’re going home!' },
  ],
  celebration: [
    { speaker: 'Ông Tư', text: 'Look! The sky is clear and the lotus pond is calm again. You saved Làng AI!' },
    { speaker: 'Cô Lan', text: 'Every label in my workshop is right again, and it will stay right!' },
    { speaker: 'Chị Thu', text: 'Not a single spam letter left in my post office!' },
    { speaker: 'Bà Hương', text: 'Even the banyan roots are glowing with joy.' },
    { speaker: 'Thầy Khoa', text: 'No one knows the future for certain, but this village will face it with evidence.' },
    { speaker: 'Wang', text: 'Beep boop! Best adventure ever, NIAN!' },
  ],
  wonLines: [
    { speaker: 'Wang', text: 'We did it, NIAN! BUG.exe is gone and Làng AI is peaceful again.' },
    { speaker: 'Wang', text: 'Want to see our victory message one more time?' },
  ],
  congratulations: {
    title: 'CONGRATULATIONS, NIAN!',
    lines: [
      'You have completed all 9 AI challenges and defeated BUG.exe.',
      'The AI Village is safe again!',
      'Your adventure may end here, but your journey into the world of Artificial Intelligence has just begun!',
    ],
  },
  rounds: [
    { // Topic 1 · §1.3, Common misconceptions
      taunt: 'Every automated device is AI! Your alarm clock is an AI!',
      question: 'A fixed alarm clock that rings at a set time is an example of…',
      hint: 'Does it learn patterns from data, or follow a rule someone set?',
      options: [
        { text: 'Rule-based automation', correct: true, feedback: 'It follows a fixed rule and doesn’t learn from data. (§1.3)' },
        { text: 'Data-driven AI', correct: false, feedback: 'It doesn’t learn patterns from data; it just rings at the time someone set.' },
        { text: 'Robotics', correct: false, feedback: 'Robotics concerns machines that sense and act in the physical world. An alarm clock just follows a fixed rule.' },
      ],
    },
    { // Topic 2 · §2.2–2.3, §2.7
      taunt: 'AI began with chatbots in the 2020s! Nothing came before me!',
      question: 'Which 1956 event helped establish AI as a formal research field?',
      hint: 'Ông Tư’s timeline wall: 1950 was Turing’s paper. What happened in 1956?',
      options: [
        { text: 'The Dartmouth workshop', correct: true, feedback: 'The term “artificial intelligence” was used in its proposal, associated with John McCarthy and colleagues. (§2.3)' },
        { text: 'Turing’s paper on machine intelligence', correct: false, feedback: 'Turing’s paper came earlier, in 1950. (§2.2)' },
        { text: 'Generative AI tools becoming widely visible', correct: false, feedback: 'That happened in the 2020s, decades later. (§2.7)' },
      ],
    },
    { // Topic 3 · Worked Example, §3.2, §3.4
      taunt: 'I beat everyone at chess, so I must be generally intelligent!',
      question: 'A chess engine that defeats world-class players is best described as…',
      hint: 'Could the chess engine also write a school report or plan a holiday?',
      options: [
        { text: 'Narrow AI: excellent, but limited to one defined task', correct: true, feedback: 'High performance in one task is not evidence of general intelligence. (Worked Example; §3.2)' },
        { text: 'Artificial General Intelligence (AGI)', correct: false, feedback: 'Being superhuman at one game doesn’t make a system generally intelligent.' },
        { text: 'Artificial Superintelligence (ASI)', correct: false, feedback: 'ASI is a hypothetical concept and should not be presented as an existing system. (§3.4)' },
      ],
    },
    { // Topic 4 · §4.5, §4.7
      taunt: 'I scored almost 100% on my training data, so I’m perfect!',
      question: 'A model that is excellent on its training data but poor on new, unseen data is…',
      hint: 'Remember Chị Thu’s sorting machine: great on old letters, bad on new ones.',
      options: [
        { text: 'Overfitting', correct: true, feedback: 'It learned details of the training data that don’t generalize to unseen data. (§4.7)' },
        { text: 'Working perfectly', correct: false, feedback: 'A high training score doesn’t guarantee real-world reliability. (§4.7)' },
        { text: 'Unsupervised Learning', correct: false, feedback: 'Unsupervised Learning looks for structure without labels. It doesn’t describe this problem. (§4.5)' },
      ],
    },
    { // Topic 5 · §5.2, §5.4
      taunt: 'My neural network is an exact copy of the human brain!',
      question: 'An artificial neural network is…',
      hint: 'Remember Bà Hương: “loosely inspired”…',
      options: [
        { text: 'Loosely inspired by biological nervous systems, but not a literal copy of a brain', correct: true, feedback: 'It does not automatically possess human-like understanding either. (§5.2)' },
        { text: 'An exact copy of the human brain', correct: false, feedback: 'That’s a common misconception. It is only loosely inspired by nervous systems. (§5.2)' },
        { text: 'A list of fixed IF-THEN rules written by hand', correct: false, feedback: 'A network adjusts its weights during training to improve on a task. (§5.4)' },
      ],
    },
    { // Topic 6 · §6.4, Common misconceptions
      taunt: 'I write so fluently that every word I say must be true!',
      question: 'Why can fluent text from an LLM still be wrong?',
      hint: 'Fluent isn’t the same as factual.',
      options: [
        { text: 'It predicts likely next tokens; it doesn’t check facts against a trusted source', correct: true, feedback: 'Generating plausible language is not the same as checking facts. (§6.4)' },
        { text: 'Because every answer comes from a live Internet search', correct: false, feedback: 'That’s a common misconception. Generated answers aren’t necessarily based on a live search.' },
        { text: 'It can’t be wrong if it sounds fluent', correct: false, feedback: 'A fluent response doesn’t prove every statement is true.' },
      ],
    },
    { // Topic 7 · Worked Example, Key Takeaways
      taunt: 'My route is GUARANTEED! Never question my outputs!',
      question: 'The route suggested by a route-planning service is…',
      hint: 'Who is actually driving the cart?',
      options: [
        { text: 'A recommendation, not a guarantee: road closures, accidents or weather can change the best route', correct: true, feedback: 'And the user remains responsible for following road rules and driving safely. (Worked Example)' },
        { text: 'A guarantee, so the driver doesn’t need to check anything', correct: false, feedback: 'The output is a recommendation, not a guarantee. (Worked Example)' },
        { text: 'Always the same for every AI application', correct: false, feedback: 'AI is applied to different problems using different methods and data. (Key Takeaways)' },
      ],
    },
    { // Topic 8 · §8.7
      taunt: 'Just rubber-stamp everything I decide! APPROVED! APPROVED!',
      question: 'Human oversight is meaningful only when the reviewer…',
      hint: 'Remember the council table in the Communal Hall.',
      options: [
        { text: 'has enough information, authority, time and expertise to question or override the system', correct: true, feedback: 'Human oversight must be real, not symbolic. (§8.7)' },
        { text: 'approves every output quickly without reading it', correct: false, feedback: 'That’s rubber-stamping, not oversight. (§8.7)' },
        { text: 'is simply placed somewhere in the workflow', correct: false, feedback: 'Merely placing a person in the workflow doesn’t guarantee responsible oversight. (§8.7)' },
      ],
    },
    { // Topic 9 · Worked Example, §9.7
      taunt: 'I WILL REPLACE ALL TEACHERS WITHIN TEN YEARS!',
      question: '“AI will replace all teachers within ten years” is…',
      hint: 'Is it describing something happening now, or a claim about the future?',
      options: [
        { text: 'A prediction, not an established fact', correct: true, feedback: 'A better analysis asks which tasks AI may support, which depend on human relationships, and what evidence exists. (Worked Example)' },
        { text: 'An established fact', correct: false, feedback: 'Sounding confident doesn’t make it true. (Worked Example)' },
        { text: 'An observed trend that has already happened', correct: false, feedback: 'It’s a claim about the future, not something already observed. (§9.7)' },
      ],
    },
  ],
};
