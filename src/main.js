import { Engine } from './core/Engine.js';
import { World } from './world/World.js';

// Initialize the Engine when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const engine = new Engine();
    window.engine = engine; // Expose for debugging

    // Create World
    const world = new World(engine);
    engine.setWorld(world);
});
