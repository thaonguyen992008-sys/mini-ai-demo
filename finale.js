'use strict';
/* =========================================================
   The AI Village Adventure – Giải cứu Làng AI
   finale.js: THE FINAL STAGE (unlocks after all nine Seals)

     1. Discovery  – the village shakes, the sky darkens and a
                     cosmic hole opens over the lotus pond
     2. Portal     – NIAN walks into the hole and jumps in; Wang follows
     3. Battle     – BUG.exe's corrupted core: dodge glitches, answer
                     a misconception from each topic, then strike
     4. Victory    – BUG.exe breaks apart, the hole closes, the village heals
     5. Ending     – villagers celebrate; congratulations screen

   This file is loaded BEFORE script.js. It only defines things;
   it uses the engine (player, wang, ctx, openDialogue, …) inside
   functions, which run later when the game is already going.
   All words (dialogue and questions) live in levels.js → FINALE.
   ========================================================= */


/* ---------- A. SETTINGS ---------- */
const PORTAL = { kind: 'portal', name: 'cosmic hole', x: 576, y: 368 };  // centre of the lotus pond
const PORTAL_RADIUS = 100;
const PORTAL_ENTER_DISTANCE = 114;     // NIAN jumps in when this close to the centre
const BATTLE_HEARTS = 5;
const ARENA = { left: 44, right: 724, top: 262, bottom: 448 };  // where NIAN can move in the battle
const NIAN_BATTLE_SPEED = 190;

// Pictures from finale-assets.js
const bugImage = new Image();
bugImage.src = BUG_EXE_SRC;
const coreSkyImage = new Image();
coreSkyImage.src = CORE_SKY_SRC;

// Page elements: the battle question card and the congratulations screen
const bossPanel = document.getElementById('boss-panel');
const bossKicker = document.getElementById('boss-kicker');
const bossTaunt = document.getElementById('boss-taunt');
const bossPrompt = document.getElementById('boss-prompt');
const bossOptions = document.getElementById('boss-options');
const bossFeedback = document.getElementById('boss-feedback');
const bossFooter = document.getElementById('boss-footer');
const bossHintBox = document.getElementById('boss-hint');
const bossHintBtn = document.getElementById('boss-hint-btn');
const congratsEl = document.getElementById('congrats');
const congratsTitle = document.getElementById('congrats-title');
const congratsBody = document.getElementById('congrats-body');
const congratsKeep = document.getElementById('congrats-keep');
const congratsAgain = document.getElementById('congrats-again');


/* ---------- B. FINALE STATE ---------- */
const finale = {
  scene: 'village',     // 'village' or 'battle'
  cutscene: null,       // the animation that is playing, if any
  time: 0,              // seconds since the game started (for animations)
  darkness: 0,          // 0 = normal sky, 1 = dark corrupted sky
  portalR: 0,           // current size of the cosmic hole
  quake: 0,             // screen-shake strength
  fade: 0,              // full-screen fade (0..1)
  fadeColor: '#12081f',
  focus: null,          // what the camera looks at during a cutscene
  actors: {},           // jump animation: scale/position overrides for NIAN and Wang
  particles: [],        // sparkles, fireworks
  celebrating: false,
  villagePos: null,     // where NIAN stood in the village before entering the hole
  npcHome: null,        // villagers' normal spots (restored after the party)
};

const battle = {
  round: 0, phase: 'none', t: 0, hearts: BATTLE_HEARTS, hp: 9,
  inv: 0, bolts: [], beams: [], sparks: [], spawn: 0, cooldown: 0,
  bugX: 384, bugY: 128, hurt: 0, banner: null, tip: null, answered: false,
};

const allSealsDone = () => sealsEarned() === AREAS.length;
const finaleCorrupted = () => allSealsDone() && progress.finale !== 'won';
const inBattle = () => finale.scene === 'battle';


/* ---------- C. HOOKS CALLED FROM script.js ---------- */

// Called every frame from update()
function updateFinaleAmbient(dt) {
  finale.time += dt;
  if (finale.cutscene) runCutscene(dt);
  else if (inBattle()) {
    finale.fade = Math.max(0, finale.fade - dt * 1.5);   // fade in from black
    finale.quake = Math.max(0, finale.quake - dt * 2);
  } else {
    // sky slowly matches the story state (the hole is open from the discovery onwards)
    const open = progress.finale === 'portal' || finale.focus === PORTAL;
    finale.darkness += ((open ? 1 : 0) - finale.darkness) * Math.min(1, dt * 1.5);
    finale.portalR += ((open ? PORTAL_RADIUS : 0) - finale.portalR) * Math.min(1, dt * 2);
    finale.quake = open ? 0.25 + 0.25 * Math.max(0, Math.sin(finale.time * 0.9)) : 0;
  }
  updateParticles(dt);
  if (finale.celebrating && !REDUCED_MOTION && Math.random() < dt * 2.2) spawnFirework();
}

// Called every frame when gameState is 'BOSS' or 'CUTSCENE'
function updateFinale(dt) {
  if (gameState === 'BOSS') updateBattle(dt);
}

// Called from update() while exploring: walking into the hole starts the jump
function checkPortalEntry() {
  // nine Seals but the discovery never played (e.g. the reward screen was closed with Esc)
  if (allSealsDone() && progress.finale === 'none' && !finale.cutscene) { startDiscovery(); return; }
  if (progress.finale !== 'portal' || finale.cutscene) return;
  if (Math.hypot(player.x - PORTAL.x, player.y - PORTAL.y) < PORTAL_ENTER_DISTANCE) startJump();
}

// Camera target during cutscenes (or null = follow NIAN)
function finaleCameraFocus() {
  return finale.focus;
}

// Screen-shake offset in pixels
function finaleShake() {
  if (REDUCED_MOTION || finale.quake <= 0) return { x: 0, y: 0 };
  const s = finale.quake * 4;
  return { x: Math.round((Math.random() - 0.5) * s), y: Math.round((Math.random() - 0.5) * s) };
}

// The yellow "!" after nine Seals points at the hole
const PORTAL_MARKER = { x: PORTAL.x, y: PORTAL.y - PORTAL_RADIUS + 20 };   // "!" sits on the top edge of the hole
function finaleTarget() {
  return progress.finale === 'portal' ? PORTAL_MARKER : null;
}

// Extra glitch blocks while BUG.exe corrupts the village
function finaleExtraGlitches() {
  if (finale.darkness < 0.05 || inBattle()) return [];
  const list = [];
  const count = Math.round(24 * finale.darkness);
  for (let i = 0; i < count; i++) {
    const near = i % 2 === 0;
    list.push({
      x: near ? PORTAL.x + (Math.random() - 0.5) * 360 : camera.x + Math.random() * VIEW_W,
      y: near ? PORTAL.y + (Math.random() - 0.5) * 260 : camera.y + Math.random() * VIEW_H,
      w: 4 + Math.random() * 14,
      h: 3 + Math.random() * 6,
      color: Math.random() < 0.5 ? '#ff3fd2' : '#3ff3ff',
    });
  }
  return list;
}

// Talking to Wang after the nine Seals
function talkToWangFinale() {
  if (progress.finale === 'won') openDialogue(FINALE.wonLines, showCongrats);
  else if (progress.finale === 'portal') openDialogue(FINALE.portalReminder);
  else startDiscovery();
}

// Called when the game starts or continues
function finaleOnStart() {
  if (!allSealsDone()) return;
  if (progress.finale === 'portal') {
    finale.darkness = 1;
    finale.portalR = PORTAL_RADIUS;
  } else if (progress.finale !== 'won') {
    startDiscovery();
  }
}

// Where to save NIAN: during the battle, keep the village position
function finaleSavePosition() {
  return inBattle() && finale.villagePos ? finale.villagePos : null;
}

// After a dialogue closes, go back to the battle or the village
function finaleResumeState() {
  return inBattle() ? 'BOSS' : 'EXPLORE';
}

function finaleObjectiveText() {
  if (progress.finale === 'won') return 'The AI Village is safe again! Talk to Wang to see the ending again.';
  if (inBattle()) return 'Defeat BUG.exe inside the corrupted core';
  if (progress.finale === 'portal') return 'Walk into the cosmic hole at the lotus pond';
  return 'Something is happening at the lotus pond…';
}

function renderFinaleObjectives(addItem) {
  objectiveArea.textContent = progress.finale === 'won' ? 'Village restored' : 'Final stage · BUG.exe’s core';
  addItem('Restore all nine areas', true);
  addItem('Enter the cosmic hole at the lotus pond', inBattle() || progress.finale === 'won');
  addItem('Defeat BUG.exe', progress.finale === 'won');
}

// Draws NIAN or Wang with the jump animation (shrink + spin into the hole)
function drawActor(name, drawFn) {
  const a = finale.actors[name];
  if (!a) { drawFn(); return; }
  if (a.hidden) return;
  const who = name === 'nian' ? player : wang;
  ctx.save();
  ctx.translate(who.x, who.y);
  ctx.rotate(a.rot || 0);
  ctx.scale(a.scale, a.scale);
  ctx.translate(-who.x, -who.y);
  drawFn();
  ctx.restore();
}

// World-space effects (drawn on the map, under the characters)
function drawFinaleWorld() {
  if (finale.portalR > 2) drawPortal(PORTAL.x, PORTAL.y, finale.portalR);
}

// Screen-space effects (dark sky, sparkles, fade)
function drawFinaleOverlay() {
  if (finale.darkness > 0.01) {
    ctx.fillStyle = `rgba(28, 10, 52, ${0.48 * finale.darkness})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    const g = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.35, VIEW_W / 2, VIEW_H / 2, VIEW_W * 0.7);
    g.addColorStop(0, 'rgba(60, 0, 90, 0)');
    g.addColorStop(1, `rgba(60, 0, 90, ${0.55 * finale.darkness})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  drawFade();
}

function drawFade() {
  if (finale.fade <= 0.01) return;
  ctx.globalAlpha = Math.min(1, finale.fade);
  ctx.fillStyle = finale.fadeColor;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.globalAlpha = 1;
}

// Particles are kept in world space for the village, screen space for the battle
function drawFinaleParticles() {
  for (const p of finale.particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;
}


/* ---------- D. THE COSMIC HOLE ---------- */
function drawPortal(cx, cy, r) {
  const t = finale.time;
  // outer glow rings
  for (let k = 3; k >= 1; k--) {
    ctx.strokeStyle = `rgba(170, 60, 255, ${0.12 * k})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4 + k * 7, 0, Math.PI * 2);
    ctx.stroke();
  }
  // inside: the cosmic sky, slowly drifting
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#0b0820';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  if (coreSkyImage.complete && coreSkyImage.naturalWidth) {
    const span = coreSkyImage.naturalHeight - coreSkyImage.naturalWidth;
    const sy = (Math.sin(t * 0.12) * 0.5 + 0.5) * span;
    ctx.drawImage(coreSkyImage, 0, sy, coreSkyImage.naturalWidth, coreSkyImage.naturalWidth, cx - r, cy - r, r * 2, r * 2);
  }
  // swirling arms
  ctx.lineWidth = 3;
  for (let arm = 0; arm < 3; arm++) {
    ctx.strokeStyle = arm % 2 ? 'rgba(63, 243, 255, 0.55)' : 'rgba(255, 63, 210, 0.55)';
    ctx.beginPath();
    for (let s = 0; s <= 30; s++) {
      const u = s / 30;
      const ang = (REDUCED_MOTION ? 0 : t * 0.8) + arm * (Math.PI * 2 / 3) + u * 4;
      const rr = r * (1 - u * 0.9);
      const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // BUG.exe's eyes deep inside
  if (progress.finale !== 'won' && Math.sin(t * 1.3) > -0.3) {
    ctx.fillStyle = '#ff3b3b';
    ctx.fillRect(Math.round(cx - 12), Math.round(cy - 4), 8, 5);
    ctx.fillRect(Math.round(cx + 4), Math.round(cy - 4), 8, 5);
  }
  ctx.restore();
  // pixel rim of glitch blocks
  for (let i = 0; i < 16; i++) {
    const ang = i / 16 * Math.PI * 2 + (REDUCED_MOTION ? 0 : t * 0.5);
    ctx.fillStyle = i % 2 ? '#ff3fd2' : '#3ff3ff';
    ctx.fillRect(Math.round(cx + Math.cos(ang) * r - 4), Math.round(cy + Math.sin(ang) * r - 4), 8, 8);
  }
  ctx.strokeStyle = '#9b4dff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}


/* ---------- E. CUTSCENES ---------- */
const ease = u => (u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u));

function startCutscene(name, duration, data) {
  finale.cutscene = { name, t: 0, duration, ...(data || {}) };
  gameState = 'CUTSCENE';
  keysDown.clear();
  player.moving = false;
}

function runCutscene(dt) {
  const c = finale.cutscene;
  c.t += dt;
  const u = c.t / c.duration;

  if (c.name === 'discovery') {          // the village shakes and the hole opens
    finale.focus = PORTAL;
    finale.quake = 1.2 * (1 - u * 0.5);
    finale.darkness = ease(u / 0.8);
    finale.portalR = PORTAL_RADIUS * ease((u - 0.3) / 0.6);
    if (Math.random() < dt * 30) spawnSpark(PORTAL.x + (Math.random() - 0.5) * 200, PORTAL.y + (Math.random() - 0.5) * 160);
  } else if (c.name === 'jump') {        // NIAN jumps in, then Wang
    finale.focus = PORTAL;
    finale.quake = 0.6;
    animateJump('nian', player, c.nianFrom, c.t, 0.0, 1.0);
    animateJump('wang', wang, c.wangFrom, c.t, 0.7, 1.7);
    finale.fadeColor = '#12081f';
    finale.fade = ease((c.t - 1.7) / 0.8);
  } else if (c.name === 'heal') {        // back home: the hole closes, the sky clears
    finale.quake = 0;
    finale.fade = 1 - ease(u / 0.35);
    finale.portalR = PORTAL_RADIUS * (1 - ease((u - 0.15) / 0.6));
    finale.darkness = 1 - ease((u - 0.2) / 0.7);
    if (Math.random() < dt * 40) spawnSpark(PORTAL.x + (Math.random() - 0.5) * 300, PORTAL.y + (Math.random() - 0.5) * 200, '#fff3a8');
  } else if (c.name === 'battle-out') {  // white flash out of the core
    finale.fadeColor = '#ffffff';
    finale.fade = ease(u);
  }

  if (c.t >= c.duration) {
    finale.cutscene = null;
    if (c.onDone) c.onDone();
  }
}

function animateJump(name, who, from, t, start, end) {
  const u = (t - start) / (end - start);
  if (u <= 0) { finale.actors[name] = { scale: 1, rot: 0 }; return; }
  if (u >= 1) { finale.actors[name] = { hidden: true }; return; }
  const e = ease(u);
  who.x = from.x + (PORTAL.x - from.x) * e;
  who.y = from.y + (PORTAL.y - from.y) * e - Math.sin(Math.PI * u) * 70;  // jump arc
  finale.actors[name] = { scale: 1 - 0.85 * e, rot: e * Math.PI * 3 };
  if (Math.random() < 0.3) spawnSpark(who.x, who.y, name === 'nian' ? '#f2c94c' : '#6ff7ff');
}

// 1. THE DISCOVERY
function startDiscovery() {
  if (progress.finale !== 'none' && progress.finale !== undefined) return;
  Sound.sfx('quake');
  Sound.sfx('portal');
  startCutscene('discovery', 3.2, {
    onDone: () => {
      openDialogue(FINALE.discovery, () => {
        finale.focus = null;
        progress.finale = 'portal';
        saveGame();
        refreshUI();
      });
    },
  });
}

// 2. ENTERING THE PORTAL
function startJump() {
  finale.villagePos = { x: PORTAL.x, y: PORTAL.y + 128 };   // safe spot on the path south of the pond
  Sound.sfx('jump');
  startCutscene('jump', 2.6, {
    nianFrom: { x: player.x, y: player.y },
    wangFrom: { x: wang.x, y: wang.y },
    onDone: startBattle,
  });
}


/* ---------- F. THE BATTLE ---------- */
function startBattle() {
  finale.scene = 'battle';
  finale.actors = {};
  finale.focus = null;
  finale.quake = 0;
  finale.particles = [];
  finale.fadeColor = '#12081f';
  finale.fade = 1;
  Object.assign(battle, {
    round: 0, phase: 'intro', t: 0, hearts: BATTLE_HEARTS, hp: FINALE.rounds.length,
    inv: 0, bolts: [], beams: [], sparks: [], spawn: 0, cooldown: 0,
    bugX: 384, bugY: 128, hurt: 0, banner: null, tip: null,
  });
  player.x = 384; player.y = 410; player.dir = 'up';
  wang.x = 340; wang.y = 420;
  gameState = 'BOSS';
  refreshUI();
  openDialogue(FINALE.battleIntro, () => startRound(0));
}

function startRound(index) {
  battle.round = index;
  battle.phase = 'attack';
  battle.t = 0;
  battle.spawn = 0.8;
  battle.bolts = [];
  battle.beams = [];
  battle.answered = false;
  setBanner(`Topic ${index + 1} of 9 · ${AREAS[index].topic}`, 'Dodge BUG.exe’s glitches!');
  gameState = 'BOSS';
}

const attackTime = round => Math.min(9, 7 + round * 0.25);

function setBanner(title, sub) {
  battle.banner = { title, sub, t: 0 };
}

function setTip(text, seconds) {
  battle.tip = { text, t: seconds || 4 };
}

function updateBattle(dt) {
  battle.t += dt;
  battle.inv = Math.max(0, battle.inv - dt);
  battle.cooldown = Math.max(0, battle.cooldown - dt);
  battle.hurt = Math.max(0, battle.hurt - dt);
  if (battle.banner) battle.banner.t += dt;
  if (battle.tip) { battle.tip.t -= dt; if (battle.tip.t <= 0) battle.tip = null; }

  // BUG.exe floats; in the strike phase it sways widely
  const sway = battle.phase === 'strike' ? 200 : 70;
  const speed = battle.phase === 'strike' ? 0.9 + battle.round * 0.06 : 0.6;
  battle.bugX = 384 + Math.sin(finale.time * speed) * sway;

  if (battle.phase === 'attack' || battle.phase === 'strike') moveNianInBattle(dt);
  wang.x += (player.x - 46 - wang.x) * Math.min(1, dt * 4);
  wang.y += (player.y + 10 - wang.y) * Math.min(1, dt * 4);
  wang.dir = 'up';

  if (battle.phase === 'attack') {
    updateAttack(dt);
  } else if (battle.phase === 'strike') {
    updateBeams(dt);
  } else if (battle.phase === 'hit' && battle.t > 1.5) {
    if (battle.round + 1 < FINALE.rounds.length) startRound(battle.round + 1);
    else startVictory();
  } else if (battle.phase === 'victory') {
    updateVictory(dt);
  }
  updateBolts(dt);
}

function moveNianInBattle(dt) {
  let dx = 0, dy = 0;
  if (isDown('ArrowLeft', 'KeyA')) dx -= 1;
  if (isDown('ArrowRight', 'KeyD')) dx += 1;
  if (isDown('ArrowUp', 'KeyW')) dy -= 1;
  if (isDown('ArrowDown', 'KeyS')) dy += 1;
  player.moving = dx !== 0 || dy !== 0;
  if (!player.moving) return;
  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
  if (dx < 0) player.dir = 'left';
  if (dx > 0) player.dir = 'right';
  if (!dx) player.dir = 'up';
  player.x = Math.max(ARENA.left, Math.min(ARENA.right, player.x + dx * NIAN_BATTLE_SPEED * dt));
  player.y = Math.max(ARENA.top, Math.min(ARENA.bottom, player.y + dy * NIAN_BATTLE_SPEED * dt));
  player.walkTime += dt;
}

/* -- attacks: three patterns, a little faster each round -- */
function updateAttack(dt) {
  const r = battle.round;
  if (battle.t < attackTime(r)) {
    battle.spawn -= dt;
    if (battle.spawn <= 0) {
      const pattern = r % 3;
      if (pattern === 0) {            // glitch rain
        battle.spawn = Math.max(0.32, 0.55 - r * 0.025);
        spawnBolt(ARENA.left + Math.random() * (ARENA.right - ARENA.left), 210, 0, 150 + r * 12, 18);
        if (r >= 3) spawnBolt(ARENA.left + Math.random() * (ARENA.right - ARENA.left), 200, 0, 150 + r * 12, 14);
      } else if (pattern === 1) {     // aimed bursts from BUG.exe's hands
        battle.spawn = Math.max(0.7, 1.1 - r * 0.04);
        const sx = battle.bugX, sy = battle.bugY + 70;
        const ang = Math.atan2(player.y - sy, player.x - sx);
        const v = 150 + r * 10;
        for (const off of [-0.32, 0, 0.32]) spawnBolt(sx, sy, Math.cos(ang + off) * v, Math.sin(ang + off) * v, 14);
      } else {                        // falling wall with one gap
        battle.spawn = Math.max(1.3, 1.9 - r * 0.06);
        const gap = 120, gapX = ARENA.left + 40 + Math.random() * (ARENA.right - ARENA.left - gap - 80);
        for (let x = ARENA.left - 10; x < ARENA.right + 20; x += 26) {
          if (x > gapX && x < gapX + gap) continue;
          spawnBolt(x, 205, 0, 110 + r * 8, 22);
        }
      }
    }
  } else if (battle.bolts.length === 0) {
    openQuestion();
  }
  if (battle.hearts <= 2 && !battle.tip && battle.t > 1) setTip('Keep moving! Look for the gaps.', 3);
}

function spawnBolt(x, y, vx, vy, size) {
  Sound.sfx('attack');   // (audio.js limits how often this plays)
  battle.bolts.push({ x, y, vx, vy, size, color: Math.random() < 0.5 ? '#ff3fd2' : '#3ff3ff' });
}

function updateBolts(dt) {
  for (const b of battle.bolts) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (battle.phase === 'attack' && battle.inv <= 0) {
      const nx = player.x, ny = player.y - 6;   // NIAN's body
      if (Math.abs(b.x - nx) < b.size / 2 + 9 && Math.abs(b.y - ny) < b.size / 2 + 13) {
        b.dead = true;
        hurtNian();
      }
    }
  }
  battle.bolts = battle.bolts.filter(b => !b.dead && b.y < 500 && b.y > 150 && b.x > -40 && b.x < VIEW_W + 40);
}

function hurtNian() {
  Sound.sfx('hurt');
  battle.hearts--;
  battle.inv = 1.2;
  finale.quake = 1;
  for (let i = 0; i < 10; i++) spawnSpark(player.x, player.y - 10, '#ff3fd2');
  if (battle.hearts <= 0) {
    battle.phase = 'down';
    battle.bolts = [];
    openDialogue(FINALE.knockedDown, () => {
      battle.hearts = BATTLE_HEARTS;
      startRound(battle.round);
    });
  }
}

/* -- the question: answer BUG.exe's misconception with a fact -- */
function openQuestion() {
  battle.phase = 'question';
  keysDown.clear();
  player.moving = false;
  const round = FINALE.rounds[battle.round];
  bossKicker.textContent = `Topic ${battle.round + 1} · ${AREAS[battle.round].topic}`;
  bossTaunt.textContent = `BUG.exe: “${round.taunt}”`;
  bossPrompt.textContent = round.question;
  bossHintBox.classList.add('hidden');
  bossFeedback.className = 'feedback hidden';
  bossFooter.replaceChildren();
  bossOptions.replaceChildren();
  shuffle(round.options).forEach((option, i) => {
    const button = makeButton(`${i + 1} · ${option.text}`, 'option', () => answerQuestion(option, button));
    bossOptions.append(button);
  });
  bossPanel.classList.remove('hidden');
  const first = bossOptions.querySelector('button');
  if (first) first.focus();
}

function answerQuestion(option, button) {
  if (battle.phase !== 'question') return;
  if (option.correct) {
    battle.phase = 'charged';
    bossOptions.querySelectorAll('button').forEach(b => { b.disabled = true; });
    button.classList.add('right');
    showBossFeedback('good', 'That’s the fact!', option.feedback);
    const seal = AREAS[battle.round];
    const go = makeButton(`Charge Seal ${seal.id} · ${seal.seal} ▶`, 'btn-primary', () => {
      Sound.sfx('collect');
      bossPanel.classList.add('hidden');
      battle.phase = 'strike';
      battle.t = 0;
      setBanner(`Seal ${seal.id} charged!`, 'Move under BUG.exe and press E or Space to strike!');
      canvas.focus();
    });
    bossFooter.replaceChildren(go);
    go.focus();
  } else {
    button.classList.add('wrong');
    button.disabled = true;
    battle.hearts = Math.max(1, battle.hearts - 1);   // BUG.exe strikes back, but never knocks NIAN out here
    finale.quake = 0.8;
    Sound.sfx('hurt');
    showBossFeedback('bad', 'BUG.exe laughs: “Wrong!”', option.feedback + ' Try again.');
  }
}

function showBossFeedback(kind, title, text) {
  Sound.feedback(kind);
  bossFeedback.className = 'feedback ' + kind;
  const mark = kind === 'good' ? '✓ ' : '✗ ';
  bossFeedback.replaceChildren(el('strong', '', mark + title), ' ');
  appendRich(bossFeedback, text);
}

function showBossHint() {
  if (battle.phase === 'question') {
    bossHintBox.replaceChildren(el('strong', '', '🤖 Wang’s hint: '), document.createTextNode(FINALE.rounds[battle.round].hint));
    bossHintBox.classList.toggle('hidden');
    if (!bossHintBox.classList.contains('hidden')) Sound.speak('Wang', FINALE.rounds[battle.round].hint);
  } else if (battle.phase === 'strike') {
    setTip('Stand right under BUG.exe, then press E or Space!', 4);
    Sound.speak('Wang', battle.tip.text);
  } else {
    setTip('Keep moving and look for the gaps between the glitch blocks!', 4);
    Sound.speak('Wang', battle.tip.text);
  }
}

/* -- the strike: fire the charged Seal at BUG.exe -- */
function fireBeam() {
  if (battle.phase !== 'strike' || battle.cooldown > 0) return;
  battle.cooldown = 0.45;
  Sound.sfx('strike');
  battle.beams.push({ x: player.x, y: player.y - 30, seal: battle.round + 1 });
}

function updateBeams(dt) {
  for (const beam of battle.beams) {
    beam.y -= 720 * dt;
    if (!beam.done && beam.y < battle.bugY + 60 && Math.abs(beam.x - battle.bugX) < 85) {
      beam.done = true;
      Sound.sfx('bossHit');
      battle.hp--;
      battle.hurt = 0.6;
      battle.phase = 'hit';
      battle.t = 0;
      finale.quake = 1;
      for (let i = 0; i < 26; i++) spawnSpark(battle.bugX + (Math.random() - 0.5) * 120, battle.bugY + (Math.random() - 0.5) * 120, i % 2 ? '#f2c94c' : '#ffffff');
      setBanner('Direct hit!', `${battle.hp} misconception${battle.hp === 1 ? '' : 's'} left`);
    } else if (!beam.done && beam.y < -20) {
      beam.done = true;
      setTip('Almost! Line up right under BUG.exe.', 2.5);
    }
  }
  battle.beams = battle.beams.filter(b => !b.done);
}

/* -- victory -- */
function startVictory() {
  Sound.sfx('victory');
  battle.phase = 'victory';
  battle.t = 0;
  battle.bolts = [];
  setBanner('BUG.exe is breaking apart!', '');
}

function updateVictory(dt) {
  finale.quake = battle.t < 2.4 ? 0.8 : 0;
  if (Math.random() < dt * 25) spawnSpark(battle.bugX + (Math.random() - 0.5) * 160, battle.bugY + (Math.random() - 0.5) * 160, Math.random() < 0.5 ? '#ff3fd2' : '#ffffff');
  if (battle.t > 2.6 && !battle.victoryTalked) {
    battle.victoryTalked = true;
    openDialogue(FINALE.victory, () => {
      startCutscene('battle-out', 1.2, { onDone: returnHome });
    });
  }
}

// 4. VICTORY: back to the village, which heals
function returnHome() {
  finale.scene = 'village';
  battle.phase = 'none';
  battle.victoryTalked = false;
  progress.finale = 'won';
  const home = finale.villagePos || { x: PORTAL.x, y: PORTAL.y + 128 };
  player.x = home.x; player.y = home.y; player.dir = 'up';
  wang.x = home.x - 36; wang.y = home.y;
  startFollowing();
  finale.actors = {};
  finale.fadeColor = '#ffffff';
  saveGame();
  refreshUI();
  gatherVillagers();
  startCutscene('heal', 3.4, {
    onDone: () => {
      finale.fade = 0;
      finale.celebrating = true;
      openDialogue(FINALE.celebration, showCongrats);
    },
  });
}

// 5. ENDING: villagers gather around NIAN at the lotus pond
function gatherVillagers() {
  finale.npcHome = npcs.map(n => ({ x: n.x, y: n.y }));
  // one spot per villager (same order as AREAS), spaced so name tags don't overlap
  const spots = [[11, 14], [12, 16], [13, 14], [15, 14], [19, 14], [21, 14], [23, 14], [15, 16], [20, 16]];
  npcs.forEach((npc, i) => {
    const [c, r] = spots[i % spots.length];
    npc.x = c * 32 + 16;
    npc.y = r * 32 + 16;
  });
}

function sendVillagersHome() {
  if (!finale.npcHome) return;
  npcs.forEach((npc, i) => { npc.x = finale.npcHome[i].x; npc.y = finale.npcHome[i].y; });
  finale.npcHome = null;
}

// Villagers hop with joy during the party
function villagerHop(npc, index) {
  if (!finale.celebrating || REDUCED_MOTION) return 0;
  return Math.abs(Math.sin(finale.time * 5 + index)) * 6;
}

function showCongrats() {
  Sound.sfx('victory');
  gameState = 'ENDING';
  finale.celebrating = true;
  congratsTitle.textContent = FINALE.congratulations.title;
  congratsBody.replaceChildren();
  for (const line of FINALE.congratulations.lines) congratsBody.append(el('p', '', line));
  congratsEl.classList.remove('hidden');
  congratsKeep.focus();
}

function closeCongrats() {
  congratsEl.classList.add('hidden');
  finale.celebrating = false;
  sendVillagersHome();
  gameState = 'EXPLORE';
  canvas.focus();
  refreshUI();
}


/* ---------- G. PARTICLES ---------- */
function spawnSpark(x, y, color) {
  if (finale.particles.length > 300) return;
  finale.particles.push({
    x, y, vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.5) * 160 - 40,
    life: 0.8, maxLife: 0.8, size: 3 + Math.floor(Math.random() * 3),
    color: color || (Math.random() < 0.5 ? '#ff3fd2' : '#3ff3ff'), gravity: 120,
  });
}

function spawnFirework() {
  const x = camera.x + 80 + Math.random() * (VIEW_W - 160);
  const y = camera.y + 40 + Math.random() * 160;
  const colors = ['#f2c94c', '#ff8fb1', '#6ff7ff', '#ffffff', '#b8f28c'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2;
    const v = 70 + Math.random() * 60;
    finale.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1.2, maxLife: 1.2, size: 3, color, gravity: 60 });
  }
}

function updateParticles(dt) {
  for (const p of finale.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    p.life -= dt;
  }
  finale.particles = finale.particles.filter(p => p.life > 0);
}


/* ---------- H. KEYBOARD IN THE BATTLE ---------- */
function handleBossKey(event) {
  // While the question card is open, the answer buttons take normal keys
  if (battle.phase === 'question' || battle.phase === 'charged') {
    const n = ['Digit1', 'Digit2', 'Digit3', 'Numpad1', 'Numpad2', 'Numpad3'].indexOf(event.code);
    if (n >= 0 && battle.phase === 'question') {
      event.preventDefault();
      const button = bossOptions.querySelectorAll('button')[n % 3];
      if (button && !button.disabled) button.click();
    } else if (event.code === 'KeyH' && !event.repeat) {
      event.preventDefault();
      showBossHint();
    }
    return;
  }
  if (GAME_KEYS.has(event.code) || event.code === 'KeyH') event.preventDefault();
  if (event.code === 'KeyH' && !event.repeat) { showBossHint(); return; }
  if ((event.code === 'KeyE' || event.code === 'Space' || event.code === 'Enter') && !event.repeat) {
    fireBeam();
    return;
  }
  keysDown.add(event.code);
}


/* ---------- I. DRAWING THE BATTLE ---------- */
// Pieces of the village floating in the corrupted core (copied from the village map picture)
const DEBRIS = [
  { col: 9, row: 17, x: 70, y: 70, s: 0.7 },    // Archive roof
  { col: 21, row: 18, x: 690, y: 90, s: 0.5 },  // Workshop wall
  { col: 16, row: 10, x: 150, y: 190, s: 0.6 }, // lotus pond
  { col: 9, row: 2, x: 620, y: 200, s: 0.8 },   // rice paddy
  { col: 13, row: 2, x: 250, y: 40, s: 0.4 },   // banyan
  { col: 30, row: 2, x: 520, y: 30, s: 0.55 },  // market stall
  { col: 20, row: 2, x: 40, y: 230, s: 0.65 },  // pavilion roof
  { col: 31, row: 18, x: 735, y: 240, s: 0.45 },// observatory
];

function drawBattle() {
  const t = finale.time;
  const shake = finaleShake();
  ctx.save();
  ctx.translate(shake.x, shake.y);

  // the cosmic sky of the core
  ctx.fillStyle = '#0b0820';
  ctx.fillRect(-10, -10, VIEW_W + 20, VIEW_H + 20);
  if (coreSkyImage.complete && coreSkyImage.naturalWidth) {
    const w = coreSkyImage.naturalWidth, h = coreSkyImage.naturalHeight;
    const viewH = w * VIEW_H / VIEW_W;
    const sy = (Math.sin(t * 0.04) * 0.5 + 0.5) * (h - viewH);
    ctx.drawImage(coreSkyImage, 0, sy, w, viewH, 0, 0, VIEW_W, VIEW_H);
  }

  // floating, glitching pieces of the village
  DEBRIS.forEach((d, i) => {
    const bob = REDUCED_MOTION ? 0 : Math.sin(t * 0.7 + i) * 8;
    const size = 64 * d.s + 24;
    ctx.save();
    ctx.translate(d.x, d.y + bob);
    if (!REDUCED_MOTION) ctx.rotate(Math.sin(t * 0.3 + i) * 0.25);
    ctx.globalAlpha = 0.85;
    ctx.drawImage(background, d.col * 32, d.row * 32, 32, 32, -size / 2, -size / 2, size, size);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = i % 2 ? '#ff3fd2' : '#3ff3ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  });

  // the corrupted lotus pond: the floor of the arena
  ctx.fillStyle = '#123c43';
  ctx.beginPath();
  ctx.ellipse(384, 452, 420, 120, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1d5b63';
  ctx.beginPath();
  ctx.ellipse(384, 456, 380, 96, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 9; i++) {           // lotus pads, one per Seal; broken ones glow
    const px = 90 + i * 74, py = 432 + (i % 2) * 22;
    const restored = i < FINALE.rounds.length - battle.hp;
    ctx.fillStyle = restored ? '#3f8f5a' : '#4a2a5a';
    ctx.beginPath();
    ctx.ellipse(px, py, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    if (restored) { ctx.fillStyle = '#f29bb5'; ctx.fillRect(px - 3, py - 6, 6, 5); }
  }
  ctx.strokeStyle = 'rgba(255, 63, 210, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(384, 456, 380, 96, 0, 0, Math.PI * 2);
  ctx.stroke();

  drawBugExe();

  // glitch bolts
  for (const b of battle.bolts) {
    const s = b.size;
    ctx.fillStyle = '#1a0f2e';
    ctx.fillRect(Math.round(b.x - s / 2 - 2), Math.round(b.y - s / 2 - 2), s + 4, s + 4);
    ctx.fillStyle = b.color;
    ctx.fillRect(Math.round(b.x - s / 2), Math.round(b.y - s / 2), s, s);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(Math.round(b.x - s / 2 + 2), Math.round(b.y - s / 2 + 2), 4, 4);
  }

  // Seal beams
  for (const beam of battle.beams) {
    ctx.fillStyle = 'rgba(242, 201, 76, 0.35)';
    ctx.fillRect(Math.round(beam.x - 14), Math.round(beam.y - 10), 28, 60);
    ctx.fillStyle = '#f2c94c';
    ctx.fillRect(Math.round(beam.x - 7), Math.round(beam.y), 14, 46);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(beam.x - 3), Math.round(beam.y + 4), 6, 34);
  }

  // Wang and NIAN (NIAN blinks after being hit)
  drawWang();
  const blink = battle.inv > 0 && Math.floor(battle.inv * 10) % 2 === 0;
  if (blink && !REDUCED_MOTION) {
    // skip a frame to blink
  } else {
    if (battle.inv > 0) ctx.globalAlpha = 0.6;
    drawNian();
    ctx.globalAlpha = 1;
  }
  if (battle.phase === 'strike') drawAimGuide();

  drawFinaleParticles();
  ctx.restore();

  drawBattleHud();
  drawFinaleSpeech();
  drawFade();
}

function drawBugExe() {
  const t = finale.time;
  const bob = REDUCED_MOTION ? 0 : Math.sin(t * 2) * 5;
  const w = 180, h = 186;
  const x = Math.round(battle.bugX - w / 2), y = Math.round(battle.bugY - h / 2 + bob);

  // dark aura
  ctx.fillStyle = 'rgba(155, 77, 255, 0.25)';
  ctx.beginPath();
  ctx.ellipse(battle.bugX, battle.bugY + bob + 10, 110, 100, 0, 0, Math.PI * 2);
  ctx.fill();

  if (battle.phase === 'victory') {           // breaking apart into pixels
    const u = Math.min(1, battle.t / 2.4);
    const n = 8;
    for (let gy = 0; gy < n; gy++) {
      for (let gx = 0; gx < n; gx++) {
        const sw = bugImage.naturalWidth / n, sh = bugImage.naturalHeight / n;
        const dx = (gx - n / 2 + 0.5) * u * 70, dy = (gy - n / 2 + 0.5) * u * 70 + u * u * 60;
        ctx.globalAlpha = 1 - u;
        if (bugImage.complete && bugImage.naturalWidth) {
          ctx.drawImage(bugImage, gx * sw, gy * sh, sw, sh, x + gx * w / n + dx, y + gy * h / n + dy, w / n, h / n);
        }
      }
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (bugImage.complete && bugImage.naturalWidth) {
    if (battle.hurt > 0) ctx.filter = 'brightness(2.2)';
    ctx.drawImage(bugImage, x, y, w, h);
    ctx.filter = 'none';
  } else {
    ctx.fillStyle = '#7b3fa0';
    ctx.fillRect(x + 30, y + 20, w - 60, h - 40);
  }
}

function drawAimGuide() {
  const under = Math.abs(player.x - battle.bugX) < 85;
  ctx.strokeStyle = under ? 'rgba(242, 201, 76, 0.9)' : 'rgba(255, 255, 255, 0.35)';
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y - 30);
  ctx.lineTo(player.x, battle.bugY + 80);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawHeart(x, y, full) {
  const shape = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
  shape.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== '#') continue;
      ctx.fillStyle = full ? '#ff4d6d' : '#4a3a4f';
      ctx.fillRect(x + c * 3, y + r * 3, 3, 3);
    }
  });
}

function drawBattleHud() {
  // BUG.exe's health: one segment per misconception (= per topic)
  const total = FINALE.rounds.length;
  const barX = 224, barY = 14, segW = 34, segH = 12;
  ctx.fillStyle = 'rgba(10, 6, 24, 0.75)';
  ctx.fillRect(barX - 70, barY - 6, segW * total + 84, segH + 14);
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff8fe0';
  ctx.fillText('BUG.exe', barX - 62, barY + segH / 2 + 1);
  for (let i = 0; i < total; i++) {
    const alive = i >= total - battle.hp;
    ctx.fillStyle = alive ? '#d63fd0' : '#3a2f45';
    ctx.fillRect(barX + i * segW, barY, segW - 4, segH);
    ctx.fillStyle = alive ? '#ffd6f6' : '#7a6f86';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), barX + i * segW + (segW - 4) / 2, barY + segH / 2 + 1);
  }

  // NIAN's hearts
  ctx.fillStyle = 'rgba(10, 6, 24, 0.7)';
  ctx.fillRect(10, VIEW_H - 34, 150, 26);
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('NIAN', 16, VIEW_H - 21);
  for (let i = 0; i < BATTLE_HEARTS; i++) drawHeart(56 + i * 20, VIEW_H - 30, i < battle.hearts);

  // what to do now
  const help = battle.phase === 'attack' ? 'Dodge: WASD / arrows · Hint: H'
    : battle.phase === 'strike' ? 'Move under BUG.exe · Strike: E or Space · Hint: H'
    : '';
  if (help) {
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'right';
    const w = ctx.measureText(help).width + 16;
    ctx.fillStyle = 'rgba(10, 6, 24, 0.7)';
    ctx.fillRect(VIEW_W - 10 - w, VIEW_H - 34, w, 26);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(help, VIEW_W - 18, VIEW_H - 21);
  }

  // attack timer bar (how long until the misconception appears)
  if (battle.phase === 'attack') {
    const u = Math.min(1, battle.t / attackTime(battle.round));
    ctx.fillStyle = 'rgba(10, 6, 24, 0.7)';
    ctx.fillRect(284, VIEW_H - 30, 200, 10);
    ctx.fillStyle = '#6ff7ff';
    ctx.fillRect(286, VIEW_H - 28, 196 * u, 6);
  }

  // big banner
  if (battle.banner && battle.banner.t < 2.6) {
    const a = battle.banner.t < 0.3 ? battle.banner.t / 0.3 : battle.banner.t > 2.1 ? (2.6 - battle.banner.t) / 0.5 : 1;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = 'rgba(10, 6, 24, 0.82)';
    ctx.fillRect(0, 214, VIEW_W, battle.banner.sub ? 62 : 44);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f2c94c';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(battle.banner.title, VIEW_W / 2, 236);
    if (battle.banner.sub) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(battle.banner.sub, VIEW_W / 2, 262);
    }
    ctx.globalAlpha = 1;
  }
}

// Speech bubbles: BUG.exe shouts its misconception, Wang gives tips
function drawFinaleSpeech() {
  if (battle.phase === 'attack') {
    const round = FINALE.rounds[battle.round];
    const bx = battle.bugX > 384 ? battle.bugX - 330 : battle.bugX + 100;
    drawBubble(Math.max(10, Math.min(VIEW_W - 250, bx)), 52, 240, `“${round.taunt}”`, '#2a0f3a', '#ffd6f6');
  }
  if (battle.tip) {
    drawBubble(Math.max(10, Math.min(VIEW_W - 220, wang.x - 110)), wang.y - 92, 210, '🤖 ' + battle.tip.text, '#e3f3f3', '#1f3b3b');
  }
}

function drawBubble(x, y, width, text, bg, fg) {
  ctx.font = 'bold 12px system-ui, sans-serif';
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > width - 16 && line) { lines.push(line); line = word; } else line = test;
  }
  if (line) lines.push(line);
  const h = lines.length * 15 + 12;
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, width, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, h);
  ctx.fillStyle = fg;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, x + 8, y + 13 + i * 15));
}

// BUG.exe's face for the dialogue box (cut from the team's sprite)
function makeBugPortrait() {
  const face = document.createElement('canvas');
  face.width = 64;
  face.height = 64;
  const g = face.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#1a0f2e';
  g.fillRect(0, 0, 64, 64);
  if (bugImage.complete && bugImage.naturalWidth) {
    const w = bugImage.naturalWidth;
    g.drawImage(bugImage, w * 0.26, w * 0.04, w * 0.48, w * 0.48, 0, 0, 64, 64);
  }
  return face;
}


/* ---------- J. BUTTONS ---------- */
bossHintBtn.addEventListener('click', showBossHint);
congratsKeep.addEventListener('click', closeCongrats);
congratsAgain.addEventListener('click', () => {
  // second click needed, like "New game" on the start screen
  if (congratsAgain.dataset.confirm !== 'yes') {
    congratsAgain.dataset.confirm = 'yes';
    congratsAgain.textContent = 'Click again to erase progress and restart';
    return;
  }
  clearSave();
  location.reload();
});
