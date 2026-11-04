# The AI Village Adventure – Giải cứu Làng AI

A 2D pixel-art educational game for the **AI Overview** module.
Play as **NIAN** with the robot companion **Wang**, restore nine areas of Làng AI, one per topic, and defeat **BUG.exe**, the glitch that filled the village with misconceptions.

**Play online:** `https://<your-github-username>.github.io/<repository-name>/` *(add the link after deploying)*

---

## How to play

| Key | Action |
|---|---|
| **W A S D** or **arrow keys** | Move NIAN |
| **E** | Talk to a villager or inspect an object |
| **Space / Enter** (or click) | Next dialogue line · choose an answer |
| **Tab** | Move between answer buttons in a puzzle |
| **H** | Ask Wang for a hint (in puzzles and the final battle) |
| **Esc** | Close a puzzle (it restarts next time) |
| **1 / 2 / 3** | Answer in the final battle |
| **🔊 Audio** button (top right) | Turn music, sound effects and voices on/off and set their volume |

- Follow the **yellow “!”**. If the next goal is off screen, a yellow arrow at the edge points to it.
- Each area has the same steps: **talk to the villager → inspect an object → mini-game → 5-question knowledge check** (4 of 5 correct to pass) **→ Knowledge Seal**.
- Earning a Seal unlocks the next area.
- After all nine Seals, a cosmic hole opens over the lotus pond. Walk into it to fight BUG.exe. In each of the nine rounds you **dodge** glitch blocks, **answer** one misconception from that topic, then move under BUG.exe and **strike** with your Seal (E or Space).
- **Sound** starts after your first click or key press (browsers block sound before that). Music changes with the scene: village, puzzles, the corrupted portal, the boss battle and victory. NIAN, Wang and BUG.exe each speak their lines in a different voice.
- Progress is **saved automatically** in your browser. Use **Continue** on the start screen to resume. **New game** needs two clicks.

## The nine areas

| # | Area | Topic | Villager | Mini-game |
|---|---|---|---|---|
| 1 | Workshop Square | Introduction to AI | Cô Lan | “AI, automation, or uncertain?” card sort |
| 2 | Elder’s Archive | History and Development of AI | Ông Tư | Rebuild the timeline wall |
| 3 | Training Ground | Types and Capabilities of AI | Anh Dũng | The Claim Inspector |
| 4 | Post Office | Machine Learning | Chị Thu | Be the human classifier |
| 5 | Banyan Forest | Deep Learning and Neural Networks | Bà Hương | Repair the Root Network |
| 6 | Scribe’s Pavilion | Generative AI and Large Language Models | Chú Minh | The Scribe’s Workshop (prompts and fact-checking) |
| 7 | Village Market | Real-World Applications of AI | Cô Hoa | Market Restoration (Application Canvas) |
| 8 | Communal Hall | Benefits, Risks and AI Ethics | Bác Trưởng thôn | The Ethics Council (ethical review checklist) |
| 9 | Observatory Hill | The Future of AI | Thầy Khoa | The Forecast Lens |
| ★ | BUG.exe’s core | Review of all nine topics | — | Boss battle: dodge, answer, strike |

## Run it on your computer

1. Download or clone this repository.
2. Double-click `index.html`. It opens in any modern browser (Chrome, Edge, Firefox or Safari).

No installation, server or internet connection is needed.

## Deploy to GitHub Pages

1. Put all game files in the **root** of the repository (see the file list below).
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then click **Save**.
4. Wait about a minute, then open `https://<username>.github.io/<repository-name>/`.

**File names are case-sensitive on GitHub Pages:** `script.js` works, but `Script.js` does not. Keep the names exactly as listed below.

## Files

| File | What it contains |
|---|---|
| `index.html` | The page: game screen, panels, side panel. Loads the scripts **in this order**: `levels.js`, `finale-assets.js`, `finale.js`, `audio.js`, `script.js`. |
| `style.css` | Colours, layout and panel styles |
| `levels.js` | **All learning content**: dialogue, mini-games, quizzes, hints, Seals and key takeaways for the nine areas, plus the final battle (`FINALE`). Edit the text here. |
| `script.js` | Game engine: map, movement, dialogue, puzzle panel, quizzes, objectives and saving |
| `finale.js` | Final stage: earthquake, cosmic hole, jump, boss battle, victory and ending |
| `finale-assets.js` | BUG.exe sprite and cosmic sky picture, stored as text (data URLs) |
| `audio.js` | Sound system: music and sound effects made with the Web Audio API, character voices with the Web Speech API, and the audio settings panel |

All paths are relative. There are no external fonts, no audio files (all music and sounds are generated in code) and no images to upload separately: NIAN’s portrait and the final-stage pictures are stored inside the `.js` files.

### Editing content

- Change text in `levels.js` only, keeping the quotes and commas.
- Facts carry their source section, for example `(§4.7)`. In the game these show as small grey “Source” tags. To hide them from players, set `const SHOW_SOURCES = false;` near the top of `script.js`.
- Answers that apply the topic files rather than quote them are marked “derived” in comments. The team approved them during design.

## Accessibility

- Fully playable with the keyboard. Puzzles have no time limit.
- Dialogue lines are announced to screen readers. Puzzle and quiz text is normal page text.
- The game respects the computer’s “reduce motion” setting: no screen shake, and calmer effects.
- Every sound can be turned off or adjusted separately: music, sound effects and voices. Settings are saved in the browser.
- Voices only read lines aloud; all spoken text is also shown on screen.
- Glitch effects change at most about twice per second (no fast flashing).
- Text contrast meets WCAG AA (4.5:1) for all panel text.

## Credits

**Learning content:** *AI Overview* module, team 旺仔牛奶: Nguyen Van Nghi, Tran Khanh Quyen, Le Xuan Mai, Tran Thao Nguyen, Nguyen Tran Khanh Ngoc. All facts, questions and explanations come from the module’s topic files, Study Guide and Test Bank.

**Story, characters and places:** created for this game.

**Art:**

| Asset | Source | Licence / permission |
|---|---|---|
| NIAN character art (dialogue portrait) | *TODO: who drew it?* | *TODO* |
| BUG.exe sprite (`finale-assets.js`) | *TODO: who made it, and with which tool?* | *TODO* |
| Cosmic sky inside the hole (`finale-assets.js`) | *TODO: original image source* | *TODO* |
| Village tiles, villagers, Wang, NIAN map sprite | Drawn in code (placeholder pixel shapes) | Part of this project |
| Music, sound effects | Generated in code with the Web Audio API | Part of this project |
| Character voices | The browser’s built-in speech voices (Web Speech API) | Provided by the operating system |
| Object icons (🤖 📜 ♟️ 📮 🏮 📃 🎵 📢) | Emoji from the player’s operating system font | System font |

**Code:** *TODO: list who wrote the code. If an AI assistant was used, disclose it here as your course requires.*

## Known limitations

- Progress is saved in one browser on one device. Private windows or clearing site data erase it.
- Keyboard and mouse only: there are no touch controls for phones yet.
- Character voices depend on the speech voices installed on the computer, so they sound different on Windows, macOS, Chrome and Firefox. Some browsers (or Linux without speech packages) have no voices; the game then stays silent for dialogue.
- Vietnamese names and words are read by an English voice.
- The game map is drawn on a canvas, so screen readers can’t describe the village itself (dialogue and puzzles are readable).
- Object icons are emoji, so they look slightly different on Windows, macOS and Linux.
- Answer keys are visible in the source code, so the game is a learning tool, not a graded test.
- The game interface is in English.

## Version

**0.4**: audio system (generated music and sound effects, character voices, audio settings).
**0.3**: nine areas plus the final BUG.exe battle and ending.
