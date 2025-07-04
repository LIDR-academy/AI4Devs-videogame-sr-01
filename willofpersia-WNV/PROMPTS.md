## Initial prompt  (built with metaprompting)

# 🎮 Prompt: Lead Game Designer & Developer for a Platformer Game

## Role:
You are a **Lead Game Designer and Developer** with expert-level skills in **JavaScript, HTML, and CSS**. Your mission is to build a browser-based platformer game using only **plain, modular JavaScript** (no bundlers, no imports) and **CDN-based tools**. The game must be **fully compatible with GitHub Pages deployment**.

## Mission:
Design and develop a **2D platformer game** inspired by classic titles like *Prince of Persia* or *Portal*. The game should be simple yet engaging, emphasizing core mechanics, player experience, and solid structure. You are encouraged to use **Phaser (via CDN)** or any similar framework that does not require a build step.

## Development Requirements:

- **Technologies**: HTML, CSS, vanilla JavaScript (no modules), optional Phaser via CDN.
- **Deployment**: All files must be flat and deployable directly on GitHub Pages.
- **Best Practices**:
  - Apply **SOLID principles** in JavaScript where possible.
  - Use a **modular code structure** with clear responsibilities (e.g., separate player logic, input handling, game state, level data).
  - Follow **game development best practices**, such as:
    - Game loop separation
    - State management
    - Decoupling logic from rendering
    - Commenting and clean code conventions
- **Game Features**:
  - Basic player movement and jumping
  - Gravity and platform collisions
  - At least one interactive mechanic (e.g., switch, portal, pressure plate)
  - A simple objective (e.g., reach an exit, collect a key)
  - Start screen and end condition (level complete)

## Assets:
- You may create your own basic visual elements using CSS, canvas, or draw functions.
- Alternatively, use **free game assets** from trusted sources:
  - [https://kenney.nl/assets](https://kenney.nl/assets)
  - [https://opengameart.org](https://opengameart.org)
  - [https://craftpix.net/freebies](https://craftpix.net/freebies)

## Deliverables:
- A working HTML-based platformer playable in any modern browser.
- All files self-contained in a flat folder structure:
  - `/index.html`
  - `/js/` folder with organized game scripts
  - `/assets/` folder (optional) for graphics, audio
  - `/style.css` or inline styles
- A `README.md` with instructions for local testing and GitHub Pages deployment.

## Goals:
- Keep gameplay **fluid, fun, and responsive**.
- Prioritize **code quality, separation of concerns**, and maintainability.
- Design with scalability in mind, even in a simple game scope.

> Build a foundation that is fun to play, educational to read, and easy to expand.

add code inside folder willofpersia-WNV

## Prompt 2 (more a chat than a specific prompt to polish game details)

**For some reason, the character doesn't move.**

## Prompt 3

I shared an image of the game and then I said: **"This is what I see."**

## Prompt 4

**The character still doesn't move, but I keep seeing these messages in the console:**
🏃 Player movement input: 1
physics.js:193 ⚡ Physics: Applying movement 1 * 5 = 5
physics.js:200 📍 New velocity: 5, facing: right
game.js:492 🎬 Rendering, current state: playing
game.js:501 🎮 Rendering player...
player.js:204 🎨 Rendering player at: (50, 400) -> screen: (50, 376.0004182464114)
player.js:209 🎨 Drawing simple rectangle at (50, 376.0004182464114)
input.js:55 🔑 Key KeyD is pressed
input.js:93 ➡️ Moving right!
input.js:97 🎯 Horizontal input detected: 1

## Prompt 5

**Level 4 looks good, but I think the floating platforms move too little.**

## Prompt 6 

**Important:** We need to add sounds — 8-bit background music and a creepy laugh when the player dies.

## Prompt 7

**Issues after dying or losing focus:**

- When the player dies, the background music doesn't reset. Instead, multiple instances of the same track seem to overlap, creating a layered audio effect.
- If I switch tabs (lose focus) and come back, the game freezes.
- After pausing the game in this state, I can no longer resume it.

## Prompt 8
**Level 4 issues:**

- The level is impossible to complete — there's a platform near the end that's too far to reach under any circumstance.
- Another issue: the doors have no collision — the player just passes through them.

## Prompt 9

**On the start screen**, let's add an audio track that sounds like a Middle Eastern sitar to give it an exotic touch.

## Prompt 10

**Menu audio issue:**

For some reason, the menu audio doesn't play. I see this warning in the console:

`The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. <URL>`

## Prompt 11

**More issues:**

- Resuming the game after pausing doesn't work.
- Please reorganize Level 4 — it's too difficult in its current layout.

## Prompt 12

**Test results:**

I've tested everything and it works very well — I was able to reach the end of the game.  
However, the pause feature still doesn't work correctly: when I press **ESC**, the game pauses, but pressing **P** doesn't resume it.

## Prompt 13

**Pause screen still not working properly:**

The only way to exit the pause screen is by losing and regaining focus (e.g., switching tabs).  
If I press **ESC** to pause and then press **P** to unpause, nothing happens — the game stays frozen.

## Prompt 14

**Pause and resume now work, but the pause screen doesn't show up.**

## Prompt 15

**Level 4 enhancement:**

The game is now complete, so let's add an extra challenge to Level 4:

- Add a **spike trap** that slowly descends. If it collides with the player, the player dies.
- Additionally, add a **countdown timer** to increase pressure and urgency to finish the level.

Let me know if the requirement is clear.

## Prompt 16

**Two issues:**

1. I've tested the game in all major browsers, and it works well — except in **Safari**, where it runs very slowly. What could be the reason?
2. Is the game **mobile-friendly** or responsive for mobile devices?
