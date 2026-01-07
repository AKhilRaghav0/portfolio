import { portfolioData } from "./data/portfolio.js";
import { initIntroScene } from "./scenes/intro.js";
import { initGameScene } from "./scenes/game.js";

// Initialize Kaboom
const k = kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true, // Allow debug mode (F1)
    background: [0, 0, 0], // Black background for cinematic feel
    // font: "Rye", // REMOVED: Using default font to prevent crashes if asset not loaded
});

// Expose game instance globally for debugging or external control if needed
window.gameInstance = k;

// Load global assets (fonts, basic sprites) here or in a dedicated loader
// We'll rely on system fonts for "Rye" via CSS, but Kaboom needs bitmap fonts or to load web fonts specifically if we want them in canvas.
// For now, we will use default font and load custom ones if needed.

// Load Assets
// Placeholder Sprites (Programmer Art - we will replace these or procedural generate them)
loadSprite("bean", "https://kaboomjs.com/sprites/bean.png");
loadSprite("ghosty", "https://kaboomjs.com/sprites/ghosty.png");
loadSprite("grass", "https://kaboomjs.com/sprites/grass.png");
loadSprite("steel", "https://kaboomjs.com/sprites/steel.png");
loadSprite("door", "https://kaboomjs.com/sprites/door.png");
loadSprite("key", "https://kaboomjs.com/sprites/key.png");
loadSprite("chest", "https://kaboomjs.com/sprites/chest.png");
loadSprite("sword", "https://kaboomjs.com/sprites/sword.png");

// Register Scenes
initIntroScene();
initGameScene();

// Start Game
go("intro");
