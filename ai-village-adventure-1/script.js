'use strict';
/* =========================================================
   The AI Village Adventure – Giải cứu Làng AI
   script.js: the game engine (map, movement, dialogue,
   puzzles, quizzes, Seals and saving).
   All learning content lives in levels.js.
   ========================================================= */


/* ---------- 1. SETTINGS ---------- */
const TILE = 32;              // size of one map square, in pixels
const VIEW_W = 768;           // visible part of the map (24 x 15 tiles)
const VIEW_H = 480;
const PLAYER_SPEED = 140;     // pixels per second
const TALK_DISTANCE = 52;     // how close NIAN must be to talk or inspect
const FOLLOW_GAP = 18;        // how far behind NIAN Wang walks
const TEXT_SPEED = 45;        // dialogue letters per second
const PASS_SCORE = 4;         // knowledge check: correct answers needed (out of 5)
const SAVE_KEY = 'aiVillageAdventure.save.v1';
const SHOW_SOURCES = true;    // true = show small grey "Source: §4.7" tags; false = hide them from players
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ---------- 0. AUDIO SAFETY NET ----------
   The game must run even if audio.js is missing (not uploaded, renamed,
   or an older index.html) or if the browser's sound features fail.
   Every sound call goes through try/catch, so a sound problem can never
   stop the game. */
(function audioSafetyNet() {
  const quiet = { tick() {}, sfx() {}, speak() {}, stopSpeech() {}, feedback() {} };
  let real = null;
  try { real = (typeof Sound !== 'undefined') ? Sound : null; } catch (e) { real = null; }
  if (!real) {
    console.warn('audio.js was not loaded: the game runs without sound. Check that audio.js is next to index.html.');
    window.Sound = quiet;
    return;
  }
  for (const name of Object.keys(quiet)) {
    const fn = real[name];
    real[name] = typeof fn !== 'function' ? quiet[name] : function (...args) {
      try { return fn.apply(real, args); } catch (e) { console.warn('Sound problem (game continues):', e); }
    };
  }
})();


/* ---------- 2. THE VILLAGE MAP ----------
   Each letter is one 32x32 square. Blocked squares are in SOLID_TILES.
   .  grass     :  dirt path     W  lotus pond     T  tree
   R  roof      H  house wall    D  door           P  rice paddy
   G  gate      Y  great banyan  J  pavilion roof  S  market stall
   O  observatory
*/
const MAP = [
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T............YYYY..................T',
  'T.RRRR..PPPP.YYYY...JJJJ......S.S.ST',
  'T.HHHH..PPPP.YYYY...JJJJ...T.......T',
  'T.HDHH..PPPP..................S.S.ST',
  'T..:..............T................T',
  'T..:...............................T',
  'T.....::::::::::::::::::::::::.....T',
  'T.....:......................:.....T',
  'T.....:......T..WWWW.....T...::::..T',
  'T.....:.T......WWWWWW........:.RRRRT',
  'T.....:........WWWWWW........:.HHHHT',
  'T.....:..T.....WWWWWW...T..T.:.HDHHT',
  'TT....:.........WWWW.........:.....T',
  'T.....:......................:.....T',
  'T.....::::::::::::::::::::::::.....T',
  'TT........:......:...:.............T',
  'T........RRRR....:..RRRR..T........T',
  'T........HHHH....:..HHHH......OOOO.T',
  'T..T.....HDHH....:..HDHH......OOOO.T',
  'T................:..........T.OOOO.T',
  'T....T......T....:.......T.........T',
  'T................:.................T',
  'TTTTTTTTTTTTTTTTG:GTTTTTTTTTTTTTTTTT',
];
const ROWS = MAP.length;
const COLS = MAP[0].length;
const WORLD_W = COLS * TILE;
const WORLD_H = ROWS * TILE;
const SOLID_TILES = new Set(['T', 'W', 'H', 'R', 'D', 'P', 'G', 'Y', 'J', 'S', 'O']);


/* ---------- 3. GAME TEXT (easy to edit or translate) ---------- */
const START_OBJECTIVES = [
  { id: 'move', text: 'Move with WASD or the arrow keys' },
  { id: 'find', text: 'Find Wang, your robot companion' },
  { id: 'talk', text: 'Press E near Wang to talk' },
];
const STAGES = ['meet', 'explore', 'mini', 'quiz', 'done'];

const DIALOGUE_INTRO = [
  { speaker: 'Wang', text: 'Beep boop! Hello, NIAN! I am Wang, your robot companion.' },
  { speaker: 'Wang', text: 'Last night a glitch called BUG.exe spread through Làng AI. It scrambled labels and filled the village with misconceptions.' },
  { speaker: 'NIAN', text: 'Misconceptions? Like what?' },
  { speaker: 'Wang', text: 'Like “AI always means a human-like robot.” Not true! Many robots have no AI, and AI can exist entirely as software.' },
  { speaker: 'Wang', text: 'There are nine areas to restore. Each one teaches a topic and gives us a Knowledge Seal.' },
  { speaker: 'NIAN', text: 'Then let’s go! Follow me, Wang.' },
  { speaker: 'Wang', text: 'Following! First stop: Cô Lan at the Workshop, just up the path on the right. Look for the yellow “!”.' },
];


/* ---------- 4. PAGE ELEMENTS ---------- */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const newGameBtn = document.getElementById('new-game-btn');
const dialogueBox = document.getElementById('dialogue');
const portraitNian = document.getElementById('portrait-nian');
const portraitRight = document.getElementById('portrait-right');
const dialogueName = document.getElementById('dialogue-name');
const dialogueText = document.getElementById('dialogue-text');
const dialogueSR = document.getElementById('dialogue-sr');
const objectiveArea = document.getElementById('objective-area');
const objectiveText = document.getElementById('objective-text');
const objectiveList = document.getElementById('objective-list');
const progressBar = document.querySelector('.bar');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const sealList = document.getElementById('seals');
const sealCount = document.getElementById('seal-count');
const activityEl = document.getElementById('activity');
const activityKicker = document.getElementById('activity-kicker');
const activityTitle = document.getElementById('activity-title');
const activityBody = document.getElementById('activity-body');
const activityFeedback = document.getElementById('activity-feedback');
const activityFooter = document.getElementById('activity-footer');
const hintBtn = document.getElementById('hint-btn');
const closeBtn = document.getElementById('close-btn');
const hintBox = document.getElementById('hint-box');


/* ---------- 5. GAME STATE ----------
   The game is always in ONE mode: 'TITLE', 'EXPLORE', 'DIALOGUE', 'ACTIVITY',
   or (final stage, see finale.js) 'CUTSCENE', 'BOSS' or 'ENDING'. */
let gameState = 'TITLE';

const START_POS = { x: 17 * TILE + 16, y: 22 * TILE + 16 };   // just inside the village gate

const player = {
  x: START_POS.x,
  y: START_POS.y,
  dir: 'up',
  moving: false,
  walkTime: 0,
  distance: 0,
};

const wang = {
  x: 19 * TILE + 16,
  y: 21 * TILE + 16,
  dir: 'down',
  moving: false,
  following: false,
  hoverTime: 0,
};

let trail = [];  // NIAN's recent positions; Wang walks along them

// Everything that gets saved. stages[areaId] is one of STAGES.
const progress = {
  moved: false,
  foundWang: false,
  wangTalked: false,
  stages: {},
  finale: 'none',   // final stage: 'none' → 'portal' (hole is open) → 'won'
};

function stageOf(area) {
  return progress.stages[area.id] || 'meet';
}

function isUnlocked(area) {
  if (area.id === 1) return progress.wangTalked;
  return stageOf(AREAS[area.id - 2]) === 'done';
}

function sealsEarned() {
  return AREAS.filter(a => stageOf(a) === 'done').length;
}

function currentArea() {
  return AREAS.find(a => stageOf(a) !== 'done') || null;
}

function setStage(area, stage) {
  progress.stages[area.id] = stage;
  saveGame();
  refreshUI();
}

// People and things you can talk to or inspect, built from levels.js
const npcs = AREAS.map(area => ({
  kind: 'npc', area, name: area.npc.name, look: area.npc.look,
  x: area.npc.tx * TILE + 16, y: area.npc.ty * TILE + 16, dir: 'down',
}));
const things = AREAS.map(area => ({
  kind: 'object', area, icon: area.object.icon, name: area.object.name,
  x: area.object.tx * TILE + 16, y: area.object.ty * TILE + 16,
}));


/* ---------- 6. KEYBOARD INPUT ----------
   We use event.code (the physical key), so it also works with
   Vietnamese keyboard layouts. */
const keysDown = new Set();
const GAME_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'Space', 'Enter', 'NumpadEnter',
]);

function isDown(...codes) {
  return codes.some(code => keysDown.has(code));
}

window.addEventListener('keydown', event => {
  // keys pressed inside the audio settings belong to those controls (audio.js)
  if (event.target && event.target.closest && event.target.closest('#audio-panel, #audio-btn')) return;
  if (gameState === 'TITLE') return;          // let the Start button work normally
  if (gameState === 'ENDING' && event.code === 'Tab') { keepFocusInside(congratsEl, event); return; }
  if (gameState === 'BOSS' && event.code === 'Tab' && !bossPanel.classList.contains('hidden')) { keepFocusInside(bossPanel, event); return; }
  if (gameState === 'CUTSCENE' || gameState === 'ENDING') return;   // final stage (finale.js)
  if (gameState === 'BOSS') { handleBossKey(event); return; }

  // In a puzzle, normal keys work on the buttons. H = hint, Esc = close.
  if (gameState === 'ACTIVITY') {
    if (event.code === 'Tab') { keepFocusInside(activityEl, event); return; }
    if (event.code === 'Escape') {
      event.preventDefault();
      closeActivity();
    } else if (event.code === 'KeyH' && !event.repeat) {
      event.preventDefault();
      showHint();
    }
    return;
  }

  if (GAME_KEYS.has(event.code)) event.preventDefault();  // stop page scrolling

  const isNextKey = ['Space', 'Enter', 'NumpadEnter', 'KeyE'].includes(event.code);

  if (gameState === 'DIALOGUE') {
    if (isNextKey && !event.repeat) advanceDialogue();
    return;
  }

  if (gameState === 'EXPLORE') {
    if (event.code === 'KeyE' && !event.repeat) {
      tryInteract();
      return;
    }
    keysDown.add(event.code);
  }
});

// Tab and Shift+Tab cycle through the buttons of an open panel instead of leaving it
function keepFocusInside(panel, event) {
  const items = [...panel.querySelectorAll('button:not([disabled])')].filter(b => b.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (!panel.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
  else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

window.addEventListener('keyup', event => keysDown.delete(event.code));
window.addEventListener('blur', () => keysDown.clear());  // stop walking if window loses focus


/* ---------- 7. MAP AND COLLISION ---------- */
function tileAt(col, row) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 'T'; // outside = blocked
  return MAP[row][col];
}

function isSolidAt(px, py) {
  return SOLID_TILES.has(tileAt(Math.floor(px / TILE), Math.floor(py / TILE)));
}

// NIAN's "feet box": a small rectangle around the feet.
function hitsWall(x, y) {
  const left = x - 9, right = x + 9, feetTop = y + 2, feetBottom = y + 13;
  return isSolidAt(left, feetTop) || isSolidAt(right, feetTop) ||
         isSolidAt(left, feetBottom) || isSolidAt(right, feetBottom);
}

function moveWithCollision(entity, moveX, moveY) {
  const newX = entity.x + moveX;
  const newY = entity.y + moveY;
  if (!hitsWall(newX, newY)) {
    entity.x = newX;
    entity.y = newY;
  }
}


/* ---------- 8. UPDATE (runs every frame) ---------- */
let saveTimer = 0;

function update(dt) {
  updateFinaleAmbient(dt);   // final-stage animations (finale.js)
  Sound.tick();              // background music follows the game (audio.js)
  updateGlitches(dt);
  wang.hoverTime += dt;
  wang.moving = false;

  if (gameState === 'EXPLORE') {
    updatePlayer(dt);
    checkPortalEntry();      // walking into the cosmic hole (finale.js)
    if (!wang.following) faceToward(wang, player);
    for (const npc of npcs) {
      if (Math.hypot(player.x - npc.x, player.y - npc.y) < TALK_DISTANCE * 2) faceToward(npc, player);
    }
    if (!progress.foundWang && distanceTo(wang) < TALK_DISTANCE) {
      progress.foundWang = true;
      refreshUI();
    }
    // save NIAN's position every few seconds
    saveTimer += dt;
    if (saveTimer > 5) { saveTimer = 0; saveGame(); }
  } else if (gameState === 'DIALOGUE') {
    updateTypewriter(dt);
  } else if (gameState === 'BOSS') {
    updateFinale(dt);
  }
  updateCamera();
}

function updatePlayer(dt) {
  let dx = 0, dy = 0;
  if (isDown('ArrowLeft', 'KeyA')) dx -= 1;
  if (isDown('ArrowRight', 'KeyD')) dx += 1;
  if (isDown('ArrowUp', 'KeyW')) dy -= 1;
  if (isDown('ArrowDown', 'KeyS')) dy += 1;

  player.moving = dx !== 0 || dy !== 0;
  if (!player.moving) return;

  // Same speed when walking diagonally
  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  if (dy < 0) player.dir = 'up';
  if (dy > 0) player.dir = 'down';
  if (dx < 0) player.dir = 'left';
  if (dx > 0) player.dir = 'right';

  const step = PLAYER_SPEED * dt;
  const oldX = player.x, oldY = player.y;

  // Move X and Y separately, so NIAN slides along walls
  moveWithCollision(player, dx * step, 0);
  moveWithCollision(player, 0, dy * step);

  const moved = Math.hypot(player.x - oldX, player.y - oldY);
  if (moved > 0) {
    player.walkTime += dt;
    player.distance += moved;
    if (!progress.moved && player.distance > 64) {
      progress.moved = true;
      refreshUI();
    }
    if (wang.following) updateWangFollow();
  }
}

function distanceTo(entity) {
  return Math.hypot(player.x - entity.x, player.y - entity.y);
}

function faceToward(entity, target) {
  const dx = target.x - entity.x, dy = target.y - entity.y;
  if (Math.abs(dx) > Math.abs(dy)) entity.dir = dx < 0 ? 'left' : 'right';
  else entity.dir = dy < 0 ? 'up' : 'down';
}


/* ---------- 9. CAMERA ----------
   The village is bigger than the screen, so the view follows NIAN. */
const camera = { x: 0, y: 0 };

function updateCamera() {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const focus = finaleCameraFocus() || player;   // a cutscene can point the camera elsewhere
  camera.x = Math.round(clamp(focus.x - VIEW_W / 2, 0, WORLD_W - VIEW_W));
  camera.y = Math.round(clamp(focus.y - VIEW_H / 2, 0, WORLD_H - VIEW_H));
}


/* ---------- 10. WANG (companion) ---------- */
// Wang walks along the path NIAN walked, a few steps behind.
function updateWangFollow() {
  trail.push({ x: player.x, y: player.y, dir: player.dir });
  while (trail.length > FOLLOW_GAP) {
    const spot = trail.shift();
    wang.x = spot.x;
    wang.y = spot.y;
    wang.dir = spot.dir;
    wang.moving = true;
  }
}

function startFollowing() {
  // Fill the trail with a smooth line from Wang to NIAN, so Wang doesn't jump.
  trail = [];
  for (let i = 0; i < FOLLOW_GAP; i++) {
    const t = i / FOLLOW_GAP;
    trail.push({
      x: wang.x + (player.x - wang.x) * t,
      y: wang.y + (player.y - wang.y) * t,
      dir: player.dir,
    });
  }
  wang.following = true;
}

function talkToWang() {
  if (!progress.wangTalked) {
    openDialogue(DIALOGUE_INTRO, () => {
      progress.wangTalked = true;
      progress.foundWang = true;
      startFollowing();
      saveGame();
      refreshUI();
    });
  } else if (sealsEarned() === AREAS.length) {
    talkToWangFinale();      // final stage (finale.js)
  } else {
    openDialogue([
      { speaker: 'Wang', text: `Our next goal: ${currentObjectiveText()}` },
      { speaker: 'Wang', text: 'Follow the yellow “!”. In a puzzle, press H if you’d like a hint from me.' },
    ]);
  }
}


/* ---------- 11. TALKING AND INSPECTING ---------- */
function interactables() {
  return [...npcs, ...things];
}

// The closest person or thing within reach (villagers and objects first, then Wang).
function nearestInteractable() {
  let best = null, bestDistance = TALK_DISTANCE;
  for (const entity of interactables()) {
    const d = distanceTo(entity);
    if (d < bestDistance) { best = entity; bestDistance = d; }
  }
  if (!best && distanceTo(wang) < TALK_DISTANCE) best = wang;
  return best;
}

function tryInteract() {
  const target = nearestInteractable();
  if (!target) return;
  if (target === wang) talkToWang();
  else if (target.kind === 'npc') talkToNpc(target.area);
  else if (target.kind === 'object') inspectObject(target.area);
}

function talkToNpc(area) {
  const name = area.npc.name;
  if (!isUnlocked(area)) {
    const need = area.id === 1
      ? 'Talk to Wang first, near the village gate.'
      : `My area is still glitched. Restore Area ${area.id - 1} first and earn Seal ${area.id - 1}.`;
    openDialogue([{ speaker: name, text: `Hello, NIAN! ${need}` }]);
    return;
  }
  const stage = stageOf(area);
  if (stage === 'meet') {
    openDialogue(area.intro, () => setStage(area, 'explore'));
  } else if (stage === 'explore') {
    openDialogue([{ speaker: name, text: area.exploreReminder }]);
  } else if (stage === 'mini') {
    openDialogue([{ speaker: name, text: 'Let’s begin! Take your time. Wang can give you a hint: just press H.' }], () => startMini(area));
  } else if (stage === 'quiz') {
    openDialogue([{ speaker: name, text: `Ready for the knowledge check? You need ${PASS_SCORE} of 5 correct.` }], () => startQuiz(area));
  } else {
    openDialogue([{ speaker: name, text: area.doneLine }]);
  }
}

function inspectObject(area) {
  if (!isUnlocked(area)) {
    openDialogue([{ speaker: 'Wang', text: area.id === 1
      ? 'Let’s talk first, NIAN. I’m near the village gate!'
      : `This area is still glitched. We need Seal ${area.id - 1} first.` }]);
    return;
  }
  const stage = stageOf(area);
  if (stage === 'meet') {
    openDialogue([{ speaker: 'Wang', text: `Let’s talk to ${area.npc.name} first.` }]);
  } else if (stage === 'explore') {
    openActivity(`Area ${area.id} · ${area.place}`, area.exploreTitle, area.explore, () => {
      setStage(area, 'mini');
      openDialogue([{ speaker: 'Wang', text: `Great work! Let’s go back to ${area.npc.name}.` }]);
    });
  } else {
    openDialogue([{ speaker: 'Wang', text: `We’ve already checked the ${area.object.name}. It’s fine now.` }]);
  }
}

function startMini(area) {
  const steps = [
    ...area.mini,
    { type: 'mark', run: () => setStage(area, 'quiz') },
    { type: 'quiz', area },
    { type: 'reward', area },
  ];
  openActivity(`Area ${area.id} · ${area.place}`, area.miniTitle, steps, () => afterReward(area));
}

function startQuiz(area) {
  openActivity(`Area ${area.id} · ${area.place}`, 'Knowledge check',
    [{ type: 'quiz', area }, { type: 'reward', area }], () => afterReward(area));
}

function afterReward(area) {
  const lines = [{ speaker: area.npc.name, text: area.doneLine }];
  const next = AREAS[area.id];  // the next area (or undefined after Area 9)
  lines.push({
    speaker: 'Wang',
    text: next
      ? `Seal ${area.id} is ours! Next: ${next.npc.name} at the ${next.place}.`
      : 'That’s all nine Seals! Look at the lotus pond, NIAN…',
  });
  openDialogue(lines, next ? null : startDiscovery);   // after Seal 9 the final stage begins
}


/* ---------- 12. DIALOGUE ---------- */
const dialogue = { lines: [], index: 0, visibleChars: 0, onEnd: null };

function openDialogue(lines, onEnd) {
  gameState = 'DIALOGUE';
  keysDown.clear();
  player.moving = false;
  dialogue.lines = lines;
  dialogue.index = 0;
  dialogue.onEnd = onEnd || null;
  // If NIAN stands in the lower half of the screen, show the box at the top so NIAN stays visible
  dialogueBox.classList.toggle('dialogue-top', !inBattle() && player.y - camera.y > VIEW_H / 2);
  dialogueBox.classList.remove('hidden');
  showLine();
}

function showLine() {
  const line = dialogue.lines[dialogue.index];
  dialogue.visibleChars = REDUCED_MOTION ? line.text.length : 0;
  dialogueName.textContent = line.speaker;

  // NIAN on the left, whoever NIAN is talking to on the right
  const nianSpeaks = line.speaker === 'NIAN';
  if (!nianSpeaks) setRightPortrait(line.speaker);
  portraitNian.classList.toggle('active', nianSpeaks);
  portraitNian.classList.toggle('inactive', !nianSpeaks);
  portraitRight.classList.toggle('active', !nianSpeaks);
  portraitRight.classList.toggle('inactive', nianSpeaks);

  dialogueSR.textContent = line.speaker + ': ' + line.text;
  renderDialogueText();
  Sound.speak(line.speaker, line.text);   // character voice (audio.js)
}

function renderDialogueText() {
  const line = dialogue.lines[dialogue.index];
  dialogueText.textContent = line.text.slice(0, Math.floor(dialogue.visibleChars));
}

function updateTypewriter(dt) {
  const line = dialogue.lines[dialogue.index];
  if (dialogue.visibleChars < line.text.length) {
    dialogue.visibleChars = Math.min(line.text.length, dialogue.visibleChars + dt * TEXT_SPEED);
    renderDialogueText();
  }
}

function advanceDialogue() {
  const line = dialogue.lines[dialogue.index];

  // First press: show the whole line at once
  if (dialogue.visibleChars < line.text.length) {
    dialogue.visibleChars = line.text.length;
    renderDialogueText();
    return;
  }

  // Next press: go to the next line, or close
  dialogue.index++;
  if (dialogue.index >= dialogue.lines.length) closeDialogue();
  else showLine();
}

function closeDialogue() {
  Sound.stopSpeech();
  dialogueBox.classList.add('hidden');
  dialogueSR.textContent = '';
  gameState = finaleResumeState();   // 'BOSS' inside the battle, otherwise 'EXPLORE'
  const callback = dialogue.onEnd;
  dialogue.onEnd = null;
  if (callback) callback();
}

dialogueBox.addEventListener('click', () => {
  if (gameState === 'DIALOGUE') advanceDialogue();
});


/* ---------- 13. PUZZLE PANEL (explorations, mini-games, quizzes) ----------
   A list of "steps" from levels.js is shown one at a time.
   When the last step is finished, onComplete() runs. */
const activity = { steps: [], index: 0, onComplete: null, hint: '' };

function openActivity(kicker, title, steps, onComplete) {
  gameState = 'ACTIVITY';
  keysDown.clear();
  player.moving = false;
  activity.steps = steps;
  activity.index = 0;
  activity.onComplete = onComplete || null;
  activityKicker.textContent = kicker;
  activityTitle.textContent = title;
  activityEl.classList.remove('hidden');
  renderStep();
}

// Esc or the Close button: leave the puzzle. Progress inside it is not kept,
// so talking to the villager again restarts this puzzle from its first step.
function closeActivity() {
  activityEl.classList.add('hidden');
  activityBody.replaceChildren();
  activityFooter.replaceChildren();
  activity.onComplete = null;
  gameState = 'EXPLORE';
  canvas.focus();
  refreshUI();
}

function finishActivity() {
  const callback = activity.onComplete;
  closeActivity();
  if (callback) callback();
}

function nextStep() {
  activity.index++;
  if (activity.index >= activity.steps.length) finishActivity();
  else renderStep();
}

function renderStep() {
  const step = activity.steps[activity.index];
  if (step.type === 'mark') {   // invisible step: save progress, then continue
    step.run();
    nextStep();
    return;
  }
  clearPanel();
  activity.hint = step.hint || '';
  hintBtn.disabled = !activity.hint;
  if (step.type === 'info') renderInfo(step);
  else if (step.type === 'choice') renderChoice(step);
  else if (step.type === 'sort') renderSort(step);
  else if (step.type === 'order') renderOrder(step);
  else if (step.type === 'multi') renderMulti(step);
  else if (step.type === 'quiz') renderQuiz(step);
  else if (step.type === 'reward') renderReward(step);
  focusFirst();
  activityEl.querySelector('.activity-card').scrollTop = 0;   // every new page starts at the top
}

/* -- small helpers for building the panel -- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function makeButton(text, className, onClick) {
  const button = el('button', className, text);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function clearPanel() {
  activityBody.replaceChildren();
  activityFooter.replaceChildren();
  activityFeedback.className = 'feedback hidden';
  activityFeedback.replaceChildren();
  hintBox.classList.add('hidden');
  activityEl.querySelector('.activity-card').scrollTop = 0;
}

function addPrompt(text) { activityBody.append(el('p', 'prompt', text)); }
function addSmall(text) { activityBody.append(el('p', 'small', text)); }

// Adds text to a page element, turning two markers from levels.js into
// friendly visuals: "[link]" becomes a small link icon, and source notes
// such as "(§4.7)" or "(Worked Example)" become small grey "Source" tags.
const RICH_PATTERN = /(\[link\]|\s*\((?:[^()]*§[^()]*|Worked Example|Key Takeaways|Common misconceptions|Try it[^()]*)\))/g;

function appendRich(node, text) {
  for (const part of String(text).split(RICH_PATTERN)) {
    if (!part) continue;
    if (part === '[link]') {
      node.append(el('span', 'link-chip', '🔗 link'));
    } else if (/^\s*\(/.test(part) && RICH_PATTERN.test(part)) {
      if (SHOW_SOURCES) node.append(' ', el('span', 'source-tag', 'Source: ' + part.trim().slice(1, -1)));
    } else {
      node.append(document.createTextNode(part));
    }
    RICH_PATTERN.lastIndex = 0;
  }
  return node;
}

function addNote(text) {
  const note = el('p', 'wang-note');
  note.append(el('span', 'note-icon', '🤖'), ' ');
  appendRich(note, text);
  activityBody.append(note);
}

function setFeedback(kind, title, text) {
  Sound.feedback(kind);   // right / wrong sound (audio.js)
  activityFeedback.className = 'feedback ' + kind;
  const mark = kind === 'good' ? '✓ ' : kind === 'bad' ? '✗ ' : 'ℹ ';
  activityFeedback.replaceChildren(el('strong', '', mark + title), ' ');
  appendRich(activityFeedback, text || '');
}

function addContinue(label, onClick) {
  activityFooter.replaceChildren();
  const button = makeButton(label || 'Continue ▶', 'btn-primary', onClick || nextStep);
  activityFooter.append(button);
  button.focus();
}

function focusFirst() {
  const target = activityBody.querySelector('button:not([disabled])') || activityFooter.querySelector('button');
  if (target) target.focus();
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showHint() {
  if (!activity.hint) return;
  hintBox.replaceChildren(el('strong', '', '🤖 Wang’s hint: '), document.createTextNode(activity.hint));
  hintBox.classList.toggle('hidden');
  if (!hintBox.classList.contains('hidden')) Sound.speak('Wang', activity.hint);   // Wang reads the hint
}
hintBtn.addEventListener('click', showHint);
closeBtn.addEventListener('click', closeActivity);

/* -- step type: info (text to read) -- */
function renderInfo(step) {
  if (step.title) activityBody.append(el('h3', 'step-title', step.title));
  for (const paragraph of step.text) activityBody.append(appendRich(el('p', 'info-text'), paragraph));
  if (step.list) {
    const list = el('ul', 'info-list');
    for (const item of step.list) list.append(appendRich(el('li'), item));
    activityBody.append(list);
  }
  if (step.letters) {            // letter cards (Area 4)
    const grid = el('div', 'letter-grid');
    step.letters.forEach((letter, i) => {
      const card = el('div', 'letter');
      const head = el('div', 'letter-head');
      head.append(el('span', 'letter-from', `${i + 1} · ${letter.from}`),
        el('span', letter.label === 'Spam' ? 'letter-tag spam' : 'letter-tag ok', letter.label));
      card.append(head, appendRich(el('p', 'letter-text'), letter.text));
      grid.append(card);
    });
    activityBody.append(grid);
  }
  addContinue();
}

/* -- step type: choice (one question, retry until right) -- */
function renderChoice(step) {
  addPrompt(step.prompt);
  const wrap = el('div', 'options');
  const options = step.keepOrder ? step.options : shuffle(step.options);
  const buttons = [];
  for (const option of options) {
    const button = makeButton(option.text, 'option', () => {
      if (option.correct) {
        buttons.forEach(b => { b.disabled = true; });
        button.classList.add('right');
        setFeedback('good', step.rightTitle || 'That’s right!', option.feedback);
        addContinue();
      } else {
        button.classList.add('wrong');
        button.disabled = true;
        setFeedback('bad', step.wrongTitle || 'Not quite.', option.feedback + ' Try again.');
      }
    });
    buttons.push(button);
    wrap.append(button);
  }
  activityBody.append(wrap);
}

/* -- step type: sort (put each card into a basket) -- */
function renderSort(step) {
  addPrompt(step.prompt);
  addSmall('Select a card, then select a basket.');
  const pile = el('div', 'sort-pile');
  pile.setAttribute('role', 'group');
  pile.setAttribute('aria-label', 'Cards to sort');
  const bins = el('div', 'sort-bins');
  const total = step.items.length;
  const state = { selected: null, placed: 0, right: 0, wrong: [] };
  const cards = [];

  for (const item of shuffle(step.items)) {
    const card = makeButton(item.text, 'card-btn', () => {
      cards.forEach(c => c.setAttribute('aria-pressed', 'false'));
      card.setAttribute('aria-pressed', 'true');
      state.selected = { item, card };
    });
    card.replaceChildren();
    appendRich(card, item.text);   // show [link] as a link icon
    card.setAttribute('aria-pressed', 'false');
    cards.push(card);
    pile.append(card);
  }

  for (const binName of step.bins) {
    const box = el('div', 'bin');
    const list = el('ul', 'bin-list');
    const binButton = makeButton(binName, 'bin-btn', () => {
      const selected = state.selected;
      if (!selected) {
        setFeedback('info', 'Choose a card first.', 'Select a card from the pile, then select a basket.');
        return;
      }
      const accepted = [].concat(selected.item.answer);
      const ok = accepted.includes(binName);

      if (!ok && !step.reveal) {
        setFeedback('bad', step.wrongTitle || 'Hmm, look again.',
          step.explainOnWrong ? selected.item.explain : (step.wrongText || 'That card belongs in a different basket.'));
        return;
      }

      // Place the card in the basket
      list.append(appendRich(el('li', ok ? 'placed ok' : 'placed miss', ok ? '✓ ' : '✗ '), selected.item.text));
      selected.card.remove();
      cards.splice(cards.indexOf(selected.card), 1);
      state.selected = null;
      state.placed++;
      if (ok) state.right++;
      else state.wrong.push(selected.item.text);

      if (step.reveal) {
        setFeedback(ok ? 'good' : 'bad', ok ? 'Correct!' : 'Not this time.', `True label: ${accepted[0]}. ${selected.item.explain}`);
      } else {
        setFeedback('good', step.rightTitle || 'Correct!', selected.item.explain);
      }

      if (state.placed === total) {
        pile.remove();
        if (step.summary) addNote(step.summary(state.right, total, state.wrong));
        addContinue();
      } else if (cards[0]) {
        cards[0].focus();
      }
    });
    box.append(binButton, list);
    bins.append(box);
  }
  activityBody.append(pile, bins);
}

/* -- step type: order (put cards in sequence) -- */
function renderOrder(step) {
  addPrompt(step.prompt);
  addSmall('Use ▲ and ▼ to move the cards, then press “Check order”.');
  const n = step.items.length;
  let order = shuffle([...Array(n).keys()]);
  while (order.every((value, index) => value === index)) order = shuffle(order);  // never start solved
  const list = el('ol', 'order-list');
  let marks = null;   // after "Check order": which positions are right

  function move(position, delta, itemIndex, which) {
    const target = position + delta;
    [order[position], order[target]] = [order[target], order[position]];
    marks = null;
    draw(itemIndex, which);
  }

  function draw(focusItem, focusWhich) {
    list.replaceChildren();
    order.forEach((itemIndex, position) => {
      const li = el('li', 'order-item');
      if (marks) li.classList.add(marks[position] ? 'ok' : 'miss');
      const text = el('span', 'order-text', (marks && marks[position] ? '✓ ' : '') + step.items[itemIndex]);
      const up = makeButton('▲', 'move-btn', () => move(position, -1, itemIndex, 'up'));
      const down = makeButton('▼', 'move-btn', () => move(position, 1, itemIndex, 'down'));
      up.setAttribute('aria-label', 'Move up: ' + step.items[itemIndex]);
      down.setAttribute('aria-label', 'Move down: ' + step.items[itemIndex]);
      up.disabled = position === 0;
      down.disabled = position === n - 1;
      li.append(el('span', 'order-num', String(position + 1)), text, up, down);
      list.append(li);
      if (itemIndex === focusItem) {
        const keep = focusWhich === 'up' ? (up.disabled ? down : up) : (down.disabled ? up : down);
        setTimeout(() => keep.focus(), 0);
      }
    });
  }

  draw();
  activityBody.append(list);
  const check = makeButton('Check order', 'btn-primary', () => {
    marks = order.map((value, index) => value === index);
    const rightCount = marks.filter(Boolean).length;
    draw();
    if (rightCount === n) {
      list.querySelectorAll('button').forEach(b => { b.disabled = true; });
      setFeedback('good', 'Correct order!', step.success || '');
      addContinue();
    } else {
      setFeedback('bad', 'Not quite yet.', `${rightCount} of ${n} cards are in the right place (marked ✓). Keep going!`);
    }
  });
  activityFooter.append(check);
}

/* -- step type: multi (pick all the good options) -- */
function renderMulti(step) {
  addPrompt(step.prompt);
  const wrap = el('div', 'options');
  const chosen = new Set();
  const buttons = [];
  for (const option of shuffle(step.options)) {
    const button = makeButton('☐ ' + option.text, 'option toggle', () => {
      if (chosen.has(option)) chosen.delete(option); else chosen.add(option);
      const on = chosen.has(option);
      button.setAttribute('aria-pressed', String(on));
      button.textContent = (on ? '☑ ' : '☐ ') + option.text;
    });
    button.setAttribute('aria-pressed', 'false');
    buttons.push(button);
    wrap.append(button);
  }
  activityBody.append(wrap);
  const totalCorrect = step.options.filter(o => o.correct).length;
  const check = makeButton('Check', 'btn-primary', () => {
    const wrongPicks = [...chosen].filter(o => !o.correct);
    if (wrongPicks.length) {
      setFeedback('bad', 'Not quite.', (wrongPicks[0].feedback || 'One of your choices doesn’t help.') + ' Unselect it and try again.');
      return;
    }
    const need = step.requireAll ? totalCorrect : (step.min || 1);
    if (chosen.size >= need) {
      buttons.forEach(b => { b.disabled = true; });
      setFeedback('good', 'Well done!', step.success || '');
      addContinue();
    } else {
      setFeedback('info', 'Almost.', step.needMore || 'Pick some more.');
    }
  });
  activityFooter.append(check);
}

/* -- step type: quiz (5 questions, pass with 4) -- */
function renderQuiz(step) {
  const area = step.area;
  activityTitle.textContent = 'Knowledge check';
  const questions = shuffle(area.quiz);
  let index = 0;
  let score = 0;

  function show() {
    clearPanel();
    activity.hint = area.quizHint;
    hintBtn.disabled = false;
    const q = questions[index];
    addSmall(`Question ${index + 1} of ${questions.length} · You need ${PASS_SCORE} correct to pass`);
    addPrompt(q.type === 'tf' ? `True or false? ${q.q}` : q.q);
    const choices = q.type === 'tf' ? ['True', 'False'] : (q.keepOrder ? q.options : shuffle(q.options));
    const wrap = el('div', 'options');
    const buttons = [];
    for (const text of choices) {
      const button = makeButton(text, 'option', () => {
        buttons.forEach(b => { b.disabled = true; });
        if (text === q.answer) {
          score++;
          button.classList.add('right');
          setFeedback('good', 'That’s right!', q.explain);
        } else {
          button.classList.add('wrong');
          const rightButton = buttons.find(b => b.textContent === q.answer);
          if (rightButton) rightButton.classList.add('right');
          setFeedback('bad', 'Not quite.', `Correct answer: ${q.answer}. ${q.explain}`);
        }
        const last = index === questions.length - 1;
        addContinue(last ? 'See my score ▶' : 'Next question ▶', () => {
          index++;
          if (index < questions.length) show(); else results();
        });
      });
      buttons.push(button);
      wrap.append(button);
    }
    activityBody.append(wrap);
    focusFirst();
  }

  function results() {
    clearPanel();
    activity.hint = '';
    hintBtn.disabled = true;
    activityBody.append(el('h3', 'step-title', `You scored ${score} / ${questions.length}`));
    if (score >= PASS_SCORE) {
      setStage(area, 'done');
      addPrompt('You passed the knowledge check!');
      addContinue('Collect your Seal ▶');
    } else {
      addPrompt(`You need ${PASS_SCORE} correct to pass.`);
      addNote('Don’t worry! Read the explanations again and have another go. The questions will come in a new order.');
      addContinue('Try again ↻', () => renderQuiz(step));
    }
  }

  show();
}

/* -- step type: reward (Seal + key takeaways) -- */
function renderReward(step) {
  const area = step.area;
  Sound.sfx('collect');   // Seal collected (audio.js)
  activityTitle.textContent = 'Area restored!';
  hintBtn.disabled = true;
  const badge = el('div', 'seal-badge', String(area.id));
  badge.setAttribute('aria-hidden', 'true');
  activityBody.append(badge);
  activityBody.append(el('h3', 'step-title center', `Seal ${area.id} earned: ${area.seal}`));
  activityBody.append(el('p', 'center', `${area.place} is restored! Knowledge Seals: ${sealsEarned()} / ${AREAS.length}`));
  activityBody.append(el('h4', 'takeaway-title', `Key takeaways · ${area.topic}`));
  const list = el('ul', 'info-list');
  for (const line of area.takeaways) list.append(el('li', '', line));
  activityBody.append(list);
  addContinue('Back to the village ▶');
}


/* ---------- 14. OBJECTIVES, PROGRESS AND SEALS ---------- */
function currentObjectiveText() {
  if (!progress.wangTalked) {
    if (!progress.moved) return START_OBJECTIVES[0].text;
    if (!progress.foundWang) return START_OBJECTIVES[1].text;
    return START_OBJECTIVES[2].text;
  }
  const area = currentArea();
  if (!area) return finaleObjectiveText();
  return area.objectives[stageOf(area)];
}

function refreshUI() {
  renderObjectives();
  renderSeals();
}

function renderObjectives() {
  objectiveList.replaceChildren();
  const addItem = (text, done) => {
    const item = document.createElement('li');
    if (done) item.classList.add('done');
    item.append(el('span', 'mark', done ? '✓' : '○'), el('span', '', text));
    objectiveList.append(item);
  };

  const area = progress.wangTalked ? currentArea() : null;
  if (!progress.wangTalked) {
    objectiveArea.textContent = 'Getting started';
    addItem(START_OBJECTIVES[0].text, progress.moved);
    addItem(START_OBJECTIVES[1].text, progress.foundWang);
    addItem(START_OBJECTIVES[2].text, false);
  } else if (area) {
    objectiveArea.textContent = `Area ${area.id} · ${area.place} · ${area.topic}`;
    const reached = STAGES.indexOf(stageOf(area));
    ['meet', 'explore', 'mini', 'quiz'].forEach((key, i) => addItem(area.objectives[key], reached > i));
  } else {
    renderFinaleObjectives(addItem);   // final stage (finale.js)
  }
  objectiveText.textContent = currentObjectiveText();

  // Village progress: meeting Wang + 4 steps in each of the 9 areas + defeating BUG.exe
  const total = 1 + AREAS.length * 4 + 1;
  let doneSteps = progress.wangTalked ? 1 : 0;
  for (const a of AREAS) doneSteps += STAGES.indexOf(stageOf(a));
  if (progress.finale === 'won') doneSteps++;
  const percent = Math.round((doneSteps / total) * 100);
  progressFill.style.width = percent + '%';
  progressBar.setAttribute('aria-valuenow', String(percent));
  progressLabel.textContent = `Village restored: ${percent}%`;
}

function renderSeals() {
  sealList.replaceChildren();
  for (const area of AREAS) {
    const earned = stageOf(area) === 'done';
    const seal = document.createElement('li');
    seal.className = earned ? 'seal earned' : 'seal';
    seal.textContent = String(area.id);
    const label = earned ? `Seal ${area.id}: ${area.seal}, earned` : `Seal ${area.id}: ${area.topic}, not yet earned`;
    seal.title = label;
    seal.setAttribute('aria-label', label);
    sealList.append(seal);
  }
  sealCount.textContent = `${sealsEarned()} / ${AREAS.length}`;
}


/* ---------- 15. SAVING PROGRESS ----------
   Progress is saved in this browser (localStorage) automatically.
   If saving is blocked (e.g. private mode), the game still works. */
function saveGame() {
  const pos = finaleSavePosition() || player;   // inside the battle, save the village spot
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      v: 1,
      wangTalked: progress.wangTalked,
      stages: progress.stages,
      finale: progress.finale,
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    }));
  } catch (error) {
    // Saving isn't available; nothing else to do.
  }
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && data.v === 1 ? data : null;
  } catch (error) {
    return null;
  }
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (error) { /* ignore */ }
}

function applySave(data) {
  progress.wangTalked = !!data.wangTalked;
  progress.moved = progress.wangTalked;
  progress.foundWang = progress.wangTalked;
  progress.stages = {};
  for (const area of AREAS) {
    const stage = data.stages && data.stages[area.id];
    if (STAGES.includes(stage)) progress.stages[area.id] = stage;
  }
  progress.finale = ['portal', 'won'].includes(data.finale) ? data.finale : 'none';
  if (Number.isFinite(data.x) && Number.isFinite(data.y) && !hitsWall(data.x, data.y)) {
    player.x = data.x;
    player.y = data.y;
  }
  if (progress.wangTalked) {
    wang.x = player.x;
    wang.y = player.y;
    startFollowing();
  }
}

window.addEventListener('pagehide', () => { if (gameState !== 'TITLE') saveGame(); });


/* ---------- 16. DRAWING THE VILLAGE (placeholder shapes) ---------- */

// A "random-looking" number that is always the same for the same square,
// so grass speckles don't flicker.
function hash(col, row) {
  let h = (col * 73856093) ^ (row * 19349663);
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) >>> 0;
}

function drawGrass(g, x, y, h) {
  g.fillStyle = '#7fb069';
  g.fillRect(x, y, TILE, TILE);
  g.fillStyle = '#6a9a57';
  for (let i = 0; i < 4; i++) {
    g.fillRect(x + ((h >>> (i * 5)) % 28), y + ((h >>> (i * 5 + 3)) % 28), 2, 2);
  }
}

function drawTile(g, ch, col, row) {
  const x = col * TILE, y = row * TILE, h = hash(col, row);

  switch (ch) {
    case ':': // dirt path
      g.fillStyle = '#e4cf9a';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#d2ba82';
      g.fillRect(x + (h % 26), y + ((h >>> 5) % 26), 3, 2);
      g.fillRect(x + ((h >>> 9) % 26), y + ((h >>> 13) % 26), 2, 2);
      break;

    case 'W': // lotus pond
      g.fillStyle = '#5aa6a0';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#7cc0b8';
      g.fillRect(x + 4, y + 8 + (h % 6), 10, 2);
      g.fillRect(x + 16, y + 20 + (h % 5), 8, 2);
      if (h % 3 === 0) {
        g.fillStyle = '#3f8f5a';
        g.beginPath();
        g.arc(x + 16, y + 16, 7, 0, Math.PI * 2);
        g.fill();
        if (h % 2 === 0) {
          g.fillStyle = '#f29bb5';
          g.fillRect(x + 14, y + 12, 5, 5);
        }
      }
      break;

    case 'T': // tree
      drawGrass(g, x, y, h);
      g.fillStyle = '#6b4a2b';
      g.fillRect(x + 13, y + 18, 6, 12);
      g.fillStyle = '#3f7d3a';
      g.beginPath();
      g.arc(x + 16, y + 14, 13, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#4f9447';
      g.fillRect(x + 9, y + 7, 6, 5);
      break;

    case 'Y': // great banyan: thick canopy with hanging aerial roots
      drawGrass(g, x, y, h);
      g.fillStyle = '#2f6b33';
      g.fillRect(x, y, TILE, TILE - 6);
      g.fillStyle = '#3d8240';
      g.beginPath();
      g.arc(x + 10 + (h % 8), y + 10, 9, 0, Math.PI * 2);
      g.arc(x + 22 - (h % 6), y + 16, 8, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#6b4a2b';
      g.fillRect(x + 6 + (h % 5), y + 18, 2, 14);
      g.fillRect(x + 18 + (h % 7), y + 20, 2, 12);
      break;

    case 'J': // scribe's pavilion roof (gold-trimmed)
      g.fillStyle = '#9c3b2c';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#7f2e22';
      for (let i = 5; i < TILE; i += 8) g.fillRect(x, y + i, TILE, 2);
      g.fillStyle = '#e0b64b';
      g.fillRect(x, y + TILE - 4, TILE, 4);
      break;

    case 'S': // market stall: striped awning over a counter
      drawGrass(g, x, y, h);
      for (let i = 0; i < 4; i++) {
        g.fillStyle = i % 2 === 0 ? '#d35b4a' : '#f4ead5';
        g.fillRect(x + 2 + i * 7, y + 2, 7, 12);
      }
      g.fillStyle = '#8a5a34';
      g.fillRect(x + 2, y + 14, 28, 14);
      g.fillStyle = '#6b4426';
      g.fillRect(x + 2, y + 26, 28, 3);
      break;

    case 'O': // observatory: stone with a dome on the top row
      g.fillStyle = '#b9b4a7';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#a19c8f';
      g.fillRect(x, y + (h % 2 ? 10 : 20), TILE, 2);
      g.fillRect(x + (h % 16) + 4, y, 2, TILE);
      if (row > 0 && MAP[row - 1][col] !== 'O') {
        g.fillStyle = '#7fb069';
        g.fillRect(x, y, TILE, 10);
        g.fillStyle = '#d6dbe0';
        g.beginPath();
        g.arc(x + 16, y + 14, 14, Math.PI, 0);
        g.fill();
      }
      break;

    case 'R': // terracotta roof
      g.fillStyle = '#b5523b';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#964030';
      for (let i = 4; i < TILE; i += 7) g.fillRect(x, y + i, TILE, 2);
      break;

    case 'H': // house wall
    case 'D': // house door
      g.fillStyle = '#efe3c8';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#d6c7a6';
      g.fillRect(x, y + TILE - 3, TILE, 3);
      if (ch === 'D') {
        g.fillStyle = '#7a4e2d';
        g.fillRect(x + 9, y + 8, 14, 24);
        g.fillStyle = '#f2c94c';
        g.fillRect(x + 19, y + 20, 2, 2);
      } else if (h % 2 === 0) {
        g.fillStyle = '#5b4632';
        g.fillRect(x + 8, y + 9, 16, 12);
        g.fillStyle = '#8fb3c4';
        g.fillRect(x + 10, y + 11, 12, 8);
      }
      break;

    case 'P': // rice paddy
      g.fillStyle = '#a9cf7a';
      g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#86b25a';
      for (let i = 3; i < TILE; i += 6) g.fillRect(x + 2, y + i, TILE - 4, 2);
      g.fillStyle = '#c8e6dc';
      g.fillRect(x + (h % 24), y + ((h >>> 4) % 24), 4, 1);
      break;

    case 'G': // village gate pillar
      drawGrass(g, x, y, h);
      g.fillStyle = '#b9b4a7';
      g.fillRect(x + 6, y + 2, 20, 30);
      g.fillStyle = '#8f8a7e';
      g.fillRect(x + 3, y, 26, 6);
      g.fillStyle = '#a4a091';
      g.fillRect(x + 10, y + 12, 12, 2);
      break;

    default: // '.' grass
      drawGrass(g, x, y, h);
  }
}

// Draw the whole map once into a hidden canvas; then copy the visible part each frame (fast).
const background = document.createElement('canvas');
background.width = WORLD_W;
background.height = WORLD_H;
(function buildBackground() {
  const g = background.getContext('2d');
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawTile(g, MAP[row][col], col, row);
    }
  }
})();


/* ---------- 17. BUG.exe GLITCH EFFECT ----------
   Small magenta/cyan blocks around every area that isn't restored yet.
   They change slowly (under 3 times a second, so nothing flashes fast)
   and stay still if the computer is set to reduce motion. */
let glitches = [];
let glitchTimer = 0;

function updateGlitches(dt) {
  glitchTimer -= dt;
  if (glitchTimer > 0) return;
  glitchTimer = REDUCED_MOTION ? 3 : 0.6;
  glitches = [];
  for (const area of AREAS) {
    if (stageOf(area) === 'done') continue;
    const cx = area.npc.tx * TILE + 16, cy = area.npc.ty * TILE;
    for (let i = 0; i < 3; i++) {
      glitches.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: cy + (Math.random() - 0.5) * 90,
        w: 4 + Math.random() * 10,
        h: 3 + Math.random() * 5,
        color: Math.random() < 0.5 ? '#ff3fd2' : '#3ff3ff',
      });
    }
  }
  glitches.push(...finaleExtraGlitches());   // the storm around the cosmic hole (finale.js)
}

function drawGlitches() {
  ctx.globalAlpha = 0.55;
  for (const glitch of glitches) {
    ctx.fillStyle = glitch.color;
    ctx.fillRect(Math.round(glitch.x), Math.round(glitch.y), glitch.w, glitch.h);
  }
  ctx.globalAlpha = 1;
}


/* ---------- 18. DRAWING CHARACTERS AND THINGS (placeholder shapes) ---------- */
function drawShadow(x, y) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x, y + 13, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

// NIAN's look (from the team's character art): bald head with grey stubble,
// round glasses, brown frog-button shirt, checked scarf (khăn rằn),
// rolled dark-brown trousers and sandals.
const NIAN_COLORS = {
  skin: '#e9b48c',
  stubble: '#c4b3a3',
  shirt: '#6e4430',
  shirtDark: '#4a2b1d',
  pants: '#35241d',
  sandal: '#2a1a12',
  scarfDark: '#2f3142',
  scarfLight: '#f1ebdf',
  frame: '#7c8088',
  lens: '#e4ecef',
  eye: '#2a1d16',
  mouth: '#b5704f',
};

function drawNian() {
  const c = NIAN_COLORS;
  const swing = player.moving ? Math.sin(player.walkTime * 14) : 0;
  const px = Math.round(player.x);
  const py = Math.round(player.y - Math.abs(swing) * 1.5);
  const dir = player.dir;

  drawShadow(player.x, player.y);

  // legs: rolled trousers, bare ankles, sandals (shorter leg = stepping)
  const leftLen = swing > 0 ? 7 : 9;
  const rightLen = swing < 0 ? 7 : 9;
  ctx.fillStyle = c.pants;
  ctx.fillRect(px - 6, py + 3, 5, leftLen - 2);
  ctx.fillRect(px + 1, py + 3, 5, rightLen - 2);
  ctx.fillStyle = c.skin;
  ctx.fillRect(px - 5, py + 1 + leftLen, 3, 2);
  ctx.fillRect(px + 2, py + 1 + rightLen, 3, 2);
  ctx.fillStyle = c.sandal;
  ctx.fillRect(px - 6, py + 3 + leftLen, 5, 2);
  ctx.fillRect(px + 1, py + 3 + rightLen, 5, 2);

  // brown shirt, rolled sleeves and forearms
  ctx.fillStyle = c.shirt;
  ctx.fillRect(px - 8, py - 9, 16, 13);
  ctx.fillStyle = c.shirtDark;
  ctx.fillRect(px - 10, py - 8, 2, 4);
  ctx.fillRect(px + 8, py - 8, 2, 4);
  ctx.fillStyle = c.skin;
  ctx.fillRect(px - 10, py - 4, 2, 6);
  ctx.fillRect(px + 8, py - 4, 2, 6);

  // frog buttons down the front (not visible from behind)
  if (dir !== 'up') {
    ctx.fillStyle = c.shirtDark;
    ctx.fillRect(px, py - 8, 1, 11);
    ctx.fillRect(px - 1, py - 6, 3, 1);
    ctx.fillRect(px - 1, py - 3, 3, 1);
    ctx.fillRect(px - 1, py, 3, 1);
  }

  // checked scarf over one shoulder
  const scarfX = (dir === 'up' || dir === 'right') ? px + 2 : px - 6;
  for (let sy = 0; sy < 12; sy += 2) {
    for (let sx = 0; sx < 4; sx += 2) {
      ctx.fillStyle = ((sx + sy) / 2) % 2 === 0 ? c.scarfDark : c.scarfLight;
      ctx.fillRect(scarfX + sx, py - 10 + sy, 2, 2);
    }
  }

  // bald head with ears and grey stubble
  ctx.fillStyle = c.skin;
  ctx.fillRect(px - 7, py - 22, 14, 13);
  ctx.fillRect(px - 6, py - 23, 12, 1);
  if (dir === 'down' || dir === 'up') {
    ctx.fillRect(px - 8, py - 17, 1, 3);
    ctx.fillRect(px + 7, py - 17, 1, 3);
  }
  ctx.fillStyle = c.stubble;
  if (dir === 'up') {
    ctx.fillRect(px - 7, py - 23, 14, 8);
  } else {
    ctx.fillRect(px - 6, py - 23, 12, 2);
    ctx.fillRect(px - 7, py - 21, 2, 3);
    ctx.fillRect(px + 5, py - 21, 2, 3);
  }

  // round glasses and face (the glasses show which way NIAN faces)
  if (dir === 'down') {
    ctx.fillStyle = c.frame;
    ctx.fillRect(px - 6, py - 17, 5, 4);
    ctx.fillRect(px + 1, py - 17, 5, 4);
    ctx.fillRect(px - 1, py - 16, 2, 1);
    ctx.fillStyle = c.lens;
    ctx.fillRect(px - 5, py - 16, 3, 2);
    ctx.fillRect(px + 2, py - 16, 3, 2);
    ctx.fillStyle = c.eye;
    ctx.fillRect(px - 4, py - 16, 1, 2);
    ctx.fillRect(px + 3, py - 16, 1, 2);
    ctx.fillStyle = c.mouth;
    ctx.fillRect(px - 2, py - 11, 4, 1);
  } else if (dir === 'left') {
    ctx.fillStyle = c.frame;
    ctx.fillRect(px - 7, py - 17, 5, 4);
    ctx.fillRect(px - 2, py - 16, 5, 1);
    ctx.fillStyle = c.lens;
    ctx.fillRect(px - 6, py - 16, 3, 2);
    ctx.fillStyle = c.eye;
    ctx.fillRect(px - 6, py - 16, 1, 2);
    ctx.fillStyle = c.mouth;
    ctx.fillRect(px - 6, py - 11, 3, 1);
  } else if (dir === 'right') {
    ctx.fillStyle = c.frame;
    ctx.fillRect(px + 2, py - 17, 5, 4);
    ctx.fillRect(px - 3, py - 16, 5, 1);
    ctx.fillStyle = c.lens;
    ctx.fillRect(px + 3, py - 16, 3, 2);
    ctx.fillStyle = c.eye;
    ctx.fillRect(px + 5, py - 16, 1, 2);
    ctx.fillStyle = c.mouth;
    ctx.fillRect(px + 3, py - 11, 3, 1);
  } else {
    // from behind: only the glasses' arms show at the sides
    ctx.fillStyle = c.frame;
    ctx.fillRect(px - 8, py - 16, 1, 1);
    ctx.fillRect(px + 7, py - 16, 1, 1);
  }
}

function drawWang() {
  const hover = Math.sin(wang.hoverTime * 3) * 1.5;
  const px = Math.round(wang.x);
  const py = Math.round(wang.y - 2 + hover);

  drawShadow(wang.x, wang.y);

  // wheels
  ctx.fillStyle = '#2f3d44';
  ctx.fillRect(px - 8, py + 5, 16, 5);

  // body
  ctx.fillStyle = '#4fa3a5';
  ctx.fillRect(px - 9, py - 9, 18, 14);
  ctx.fillStyle = '#3b8183';
  ctx.fillRect(px - 5, py - 5, 10, 6);
  ctx.fillStyle = '#ffd35c';
  ctx.fillRect(px - 1, py - 3, 2, 2);

  // head with visor
  ctx.fillStyle = '#dfe8e8';
  ctx.fillRect(px - 9, py - 22, 18, 12);
  ctx.fillStyle = '#22323a';
  ctx.fillRect(px - 7, py - 19, 14, 6);

  // glowing eyes
  ctx.fillStyle = '#6ff7ff';
  if (wang.dir === 'down') {
    ctx.fillRect(px - 5, py - 18, 3, 3);
    ctx.fillRect(px + 2, py - 18, 3, 3);
  } else if (wang.dir === 'left') {
    ctx.fillRect(px - 6, py - 18, 3, 3);
    ctx.fillRect(px - 1, py - 18, 3, 3);
  } else if (wang.dir === 'right') {
    ctx.fillRect(px - 2, py - 18, 3, 3);
    ctx.fillRect(px + 3, py - 18, 3, 3);
  }

  // antenna
  ctx.fillStyle = '#9aa9ad';
  ctx.fillRect(px - 1, py - 27, 2, 5);
  ctx.fillStyle = '#ff5d5d';
  ctx.fillRect(px - 2, py - 30, 4, 3);
}

// A villager, drawn from the "look" in levels.js
function drawPerson(person) {
  const look = person.look;
  const px = Math.round(person.x);
  const py = Math.round(person.y);
  const dir = person.dir;

  drawShadow(person.x, person.y);

  // legs and shoes
  ctx.fillStyle = look.pants;
  ctx.fillRect(px - 6, py + 3, 5, 9);
  ctx.fillRect(px + 1, py + 3, 5, 9);
  ctx.fillStyle = '#2a1a12';
  ctx.fillRect(px - 6, py + 12, 5, 2);
  ctx.fillRect(px + 1, py + 12, 5, 2);

  // shirt and arms
  ctx.fillStyle = look.shirt;
  ctx.fillRect(px - 8, py - 9, 16, 13);
  ctx.fillStyle = look.skin;
  ctx.fillRect(px - 10, py - 7, 2, 8);
  ctx.fillRect(px + 8, py - 7, 2, 8);

  // head
  ctx.fillStyle = look.skin;
  ctx.fillRect(px - 7, py - 22, 14, 13);

  // hair
  ctx.fillStyle = look.hair;
  ctx.fillRect(px - 7, py - 23, 14, 4);
  if (dir === 'up') ctx.fillRect(px - 7, py - 23, 14, 11);
  if (look.style === 'long') {
    ctx.fillRect(px - 8, py - 21, 2, 11);
    ctx.fillRect(px + 6, py - 21, 2, 11);
  } else {
    ctx.fillRect(px - 7, py - 20, 2, 3);
    ctx.fillRect(px + 5, py - 20, 2, 3);
  }
  if (look.style === 'bun') ctx.fillRect(px - 3, py - 27, 6, 4);

  // face (not visible from behind)
  if (dir !== 'up') {
    if (look.beard) {
      ctx.fillStyle = look.beard;
      ctx.fillRect(px - 5, py - 13, 10, 5);
    }
    ctx.fillStyle = '#1d1d1d';
    if (dir === 'down') {
      ctx.fillRect(px - 4, py - 16, 2, 2);
      ctx.fillRect(px + 2, py - 16, 2, 2);
    } else if (dir === 'left') {
      ctx.fillRect(px - 5, py - 16, 2, 2);
    } else {
      ctx.fillRect(px + 3, py - 16, 2, 2);
    }
  }

  // hats
  if (look.hat === 'nonla') {          // conical hat (nón lá)
    ctx.fillStyle = '#e8d5a0';
    ctx.beginPath();
    ctx.moveTo(px, py - 35);
    ctx.lineTo(px - 14, py - 21);
    ctx.lineTo(px + 14, py - 21);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c9b27a';
    ctx.fillRect(px - 14, py - 22, 28, 2);
  } else if (look.hat === 'turban') {  // khăn đóng
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(px - 8, py - 26, 16, 6);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(px - 8, py - 23, 16, 1);
  }
}

// Things to inspect: an emoji on a small wooden stand (or a drawn stamp)
function drawThing(thing) {
  const px = Math.round(thing.x), py = Math.round(thing.y);
  drawShadow(thing.x, thing.y);
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(px - 10, py + 2, 20, 10);
  ctx.fillStyle = '#6b4426';
  ctx.fillRect(px - 10, py + 10, 20, 2);
  if (thing.icon === 'stamp') {         // the Rubber Stamp
    ctx.fillStyle = '#5b3a22';
    ctx.fillRect(px - 2, py - 18, 4, 10);
    ctx.beginPath();
    ctx.arc(px, py - 19, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(px - 8, py - 8, 16, 8);
    return;
  }
  ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(thing.icon, px, py - 8);
}

function drawNameTag(x, y, text) {
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = ctx.measureText(text).width + 10;
  ctx.fillStyle = 'rgba(20, 30, 25, 0.75)';
  ctx.fillRect(Math.round(x - width / 2), Math.round(y - 8), Math.round(width), 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, Math.round(x), Math.round(y));
}

// Wooden sign with the area's name; shows "locked" until the area opens
function drawSign(area) {
  const x = area.sign.tx * TILE + 16, y = area.sign.ty * TILE + 16;
  const locked = !isUnlocked(area);
  const done = stageOf(area) === 'done';
  const text = `${area.id} · ${area.sign.text}${locked ? ' (locked)' : done ? ' ✓' : ''}`;
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = Math.round(ctx.measureText(text).width + 12);
  ctx.fillStyle = locked ? '#5f5c56' : '#8a5a34';
  ctx.fillRect(Math.round(x - width / 2), Math.round(y - 9), width, 18);
  ctx.fillStyle = locked ? '#45433f' : '#5b3a22';
  ctx.fillRect(Math.round(x - width / 2), Math.round(y + 7), width, 2);
  ctx.fillStyle = locked ? '#ffffff' : '#fff6dc';
  ctx.fillText(text, Math.round(x), Math.round(y));
}

function drawTalkPrompt(entity, label) {
  const bounce = REDUCED_MOTION ? 0 : Math.round(Math.sin(wang.hoverTime * 5) * 2);
  const x = Math.round(entity.x), y = Math.round(entity.y - 62 + bounce);
  ctx.font = 'bold 13px system-ui, sans-serif';
  const width = Math.round(ctx.measureText(label).width + 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - width / 2, y - 11, width, 22);
  ctx.fillStyle = '#2b2a26';
  ctx.fillRect(x - 4, y + 11, 8, 4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + 1);
}

// Who or what NIAN should go to next (marked with a yellow "!")
function currentTarget() {
  if (!progress.wangTalked) return wang;
  const area = currentArea();
  if (!area) return finaleTarget();
  return stageOf(area) === 'explore' ? things[area.id - 1] : npcs[area.id - 1];
}

function drawTargetMarker(target) {
  const bounce = REDUCED_MOTION ? 0 : Math.round(Math.sin(wang.hoverTime * 4) * 3);
  const x = Math.round(target.x), y = Math.round(target.y - 48 + bounce);
  ctx.fillStyle = '#2b2a26';
  ctx.fillRect(x - 6, y - 12, 12, 22);
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(x - 4, y - 10, 8, 12);
  ctx.fillRect(x - 4, y + 4, 8, 4);
}

// If the target is off screen, a yellow arrow at the screen edge points to it.
function drawEdgeArrow(target) {
  const sx = target.x - camera.x, sy = target.y - camera.y;
  if (sx > 0 && sx < VIEW_W && sy > 0 && sy < VIEW_H) return;
  const cx = VIEW_W / 2, cy = VIEW_H / 2;
  const angle = Math.atan2(sy - cy, sx - cx);
  const ax = Math.max(22, Math.min(VIEW_W - 22, cx + Math.cos(angle) * VIEW_W));
  const ay = Math.max(22, Math.min(VIEW_H - 22, cy + Math.sin(angle) * VIEW_H));
  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(angle);
  ctx.fillStyle = '#2b2a26';
  ctx.beginPath();
  ctx.moveTo(16, 0); ctx.lineTo(-10, -12); ctx.lineTo(-10, 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.moveTo(11, 0); ctx.lineTo(-7, -8); ctx.lineTo(-7, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawScene() {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  if (inBattle()) { drawBattle(); return; }   // inside BUG.exe's core (finale.js)

  const shake = finaleShake();
  ctx.drawImage(background, camera.x, camera.y, VIEW_W, VIEW_H, shake.x, shake.y, VIEW_W, VIEW_H);

  ctx.save();
  ctx.translate(-camera.x + shake.x, -camera.y + shake.y);
  drawGlitches();
  drawFinaleWorld();   // the cosmic hole over the lotus pond
  for (const area of AREAS) drawSign(area);

  // Draw everyone sorted by height on screen, so lower ones appear in front
  const drawables = [
    { y: player.y, draw: () => drawActor('nian', drawNian) },   // drawActor = jump animation
    { y: wang.y, draw: () => drawActor('wang', drawWang) },
    ...npcs.map((npc, i) => ({ y: npc.y, draw: () => {
      const hop = villagerHop(npc, i);   // villagers hop with joy at the ending
      npc.y -= hop; drawPerson(npc); npc.y += hop;
    } })),
    ...things.map(thing => ({ y: thing.y, draw: () => drawThing(thing) })),
  ];
  drawables.sort((a, b) => a.y - b.y).forEach(d => d.draw());

  // Name tags
  for (const npc of npcs) drawNameTag(npc.x, npc.y - (npc.look.hat === 'nonla' ? 44 : 34), npc.name);
  if (!finale.actors.nian) drawNameTag(player.x, player.y - 32, 'NIAN');
  if (!finale.actors.wang && distanceTo(wang) >= TALK_DISTANCE) drawNameTag(wang.x, wang.y - 40, 'Wang');
  drawFinaleParticles();   // sparkles and fireworks

  // "[E]" prompt over whatever NIAN can interact with, otherwise the "!" marker
  const target = currentTarget();
  if (gameState === 'EXPLORE') {
    const near = nearestInteractable();
    if (near) {
      drawTalkPrompt(near, near === wang || near.kind === 'npc' ? '[E] Talk' : '[E] Inspect');
    }
    if (target && target !== near) drawTargetMarker(target);
  }
  ctx.restore();

  drawFinaleOverlay();   // dark corrupted sky and fades
  if (gameState === 'EXPLORE' && target) drawEdgeArrow(target);
}


/* ---------- 19. DIALOGUE PORTRAITS ----------
   NIAN's face is the team's character art, stored here as text
   (a "data URL"), so it always shows - no separate image file needed. */
const NIAN_PORTRAIT_SRC = 'data:image/png;base64,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';
const portraitCache = {};

function makePortraitCanvas() {
  const face = document.createElement('canvas');
  face.width = 32;
  face.height = 32;
  return face;
}

function makeWangPortrait() {
  const face = makePortraitCanvas();
  const g = face.getContext('2d');
  g.fillStyle = '#cfe9e9'; g.fillRect(0, 0, 32, 32);   // background
  g.fillStyle = '#9aa9ad'; g.fillRect(15, 1, 2, 4);    // antenna
  g.fillStyle = '#ff5d5d'; g.fillRect(14, 0, 4, 2);    // antenna light
  g.fillStyle = '#dfe8e8'; g.fillRect(5, 5, 22, 15);   // head
  g.fillStyle = '#22323a'; g.fillRect(8, 9, 16, 7);    // visor
  g.fillStyle = '#6ff7ff';
  g.fillRect(10, 11, 4, 3);                            // left eye
  g.fillRect(18, 11, 4, 3);                            // right eye
  g.fillStyle = '#4fa3a5'; g.fillRect(7, 21, 18, 11);  // body
  g.fillStyle = '#3b8183'; g.fillRect(11, 24, 10, 6);  // chest panel
  g.fillStyle = '#ffd35c'; g.fillRect(15, 26, 2, 2);   // light
  return face;
}

// A close-up of a villager, using the same "look" as their map sprite
function makePersonPortrait(look) {
  const face = makePortraitCanvas();
  const g = face.getContext('2d');
  g.fillStyle = '#f3e7cf'; g.fillRect(0, 0, 32, 32);
  g.fillStyle = look.shirt; g.fillRect(4, 25, 24, 7);        // shoulders
  g.fillStyle = look.skin; g.fillRect(13, 22, 6, 4);         // neck
  g.fillRect(8, 7, 16, 16);                                  // head
  g.fillStyle = look.hair;
  g.fillRect(8, 5, 16, 4);
  if (look.style === 'long') { g.fillRect(6, 7, 3, 16); g.fillRect(23, 7, 3, 16); }
  else { g.fillRect(8, 8, 2, 4); g.fillRect(22, 8, 2, 4); }
  if (look.style === 'bun') g.fillRect(12, 1, 8, 5);
  if (look.beard) { g.fillStyle = look.beard; g.fillRect(10, 18, 12, 6); }
  g.fillStyle = '#1d1d1d';
  g.fillRect(11, 13, 3, 3);
  g.fillRect(18, 13, 3, 3);
  g.fillStyle = '#b5704f'; g.fillRect(14, 19, 4, 1);         // mouth
  if (look.hat === 'nonla') {
    g.fillStyle = '#e8d5a0';
    g.beginPath(); g.moveTo(16, 0); g.lineTo(2, 9); g.lineTo(30, 9); g.closePath(); g.fill();
  } else if (look.hat === 'turban') {
    g.fillStyle = '#1b1b1b'; g.fillRect(7, 3, 18, 6);
  }
  return face;
}

function makeIconPortrait(icon) {
  const face = document.createElement('canvas');
  face.width = 64;
  face.height = 64;
  const g = face.getContext('2d');
  g.fillStyle = '#f3e7cf'; g.fillRect(0, 0, 64, 64);
  g.font = '40px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(icon, 32, 35);
  return face;
}

function setRightPortrait(speaker) {
  if (!portraitCache[speaker]) {
    const npc = npcs.find(n => n.name === speaker);
    if (speaker === 'Wang') portraitCache[speaker] = makeWangPortrait();
    else if (npc) portraitCache[speaker] = makePersonPortrait(npc.look);
    else if (speaker === 'Loudspeaker') portraitCache[speaker] = makeIconPortrait('📢');
    else if (speaker === 'BUG.exe') portraitCache[speaker] = makeBugPortrait();   // finale.js
    else portraitCache[speaker] = makeIconPortrait('💬');
  }
  portraitRight.replaceChildren(portraitCache[speaker]);
}

function setupPortraits() {
  const nianImg = document.createElement('img');
  nianImg.src = NIAN_PORTRAIT_SRC;
  nianImg.alt = '';
  portraitNian.replaceChildren(nianImg);
  setRightPortrait('Wang');
}


/* ---------- 20. START + GAME LOOP ---------- */
const savedGame = loadSave();
if (savedGame) {
  startBtn.textContent = 'Continue';
  newGameBtn.classList.remove('hidden');
}

function startGame() {
  if (savedGame && startBtn.textContent === 'Continue') applySave(savedGame);
  startScreen.classList.add('hidden');
  gameState = 'EXPLORE';
  updateCamera();
  refreshUI();
  canvas.focus();
  finaleOnStart();   // after nine Seals: the cosmic hole (finale.js)
}
startBtn.addEventListener('click', startGame);

// "New game" asks for a second click before erasing saved progress
newGameBtn.addEventListener('click', () => {
  if (newGameBtn.dataset.confirm !== 'yes') {
    newGameBtn.dataset.confirm = 'yes';
    newGameBtn.textContent = 'Click again to erase progress';
    return;
  }
  clearSave();
  startBtn.textContent = 'Start';
  startGame();
});

let lastTime = performance.now();
function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05); // seconds since last frame (capped)
  lastTime = now;
  update(dt);
  drawScene();
  requestAnimationFrame(gameLoop);
}

setupPortraits();
updateCamera();
refreshUI();
startBtn.focus();
requestAnimationFrame(gameLoop);
