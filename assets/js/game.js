
// Initialize Kaboom
const k = kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    background: [0, 0, 0], // Black background
});

// Expose game instance for pausing
window.gameInstance = k;

// --- ASSETS ---

// Placeholder Sprites (Programmer Art)
loadSprite("player", "https://kaboomjs.com/sprites/bean.png"); // Using Bean as placeholder for now
loadSprite("ground", "https://kaboomjs.com/sprites/grass.png");
loadSprite("wall", "https://kaboomjs.com/sprites/steel.png");
loadSprite("chest", "https://kaboomjs.com/sprites/chest.png");
loadSprite("book", "https://kaboomjs.com/sprites/bag.png"); // Placeholder for Skills
loadSprite("door", "https://kaboomjs.com/sprites/door.png");
loadSprite("enemy_bug", "https://kaboomjs.com/sprites/bobo.png"); // Placeholder
loadSprite("enemy_error", "https://kaboomjs.com/sprites/ghosty.png"); // Placeholder
loadSprite("projectile", "https://kaboomjs.com/sprites/watermelon.png"); // Fireball placeholder

// We can define custom "ASCII" maps or generate sprites programmatically if needed.

// --- DATA EXTRACTION ---
// Function to scrape data from the hidden HTML to populate game content
function getPortfolioData() {
    // Use textContent instead of innerText because the parent div is hidden (display: none)
    const aboutText = document.querySelector('.about-text')?.textContent || "I am a developer.";
    const skills = Array.from(document.querySelectorAll('.skills-item')).map(item => ({
        name: item.querySelector('.h5')?.textContent,
        val: item.querySelector('data')?.value
    }));
    return { aboutText, skills };
}

const localData = getPortfolioData();

// --- GITHUB FETCH ---
let githubProjects = [];
async function fetchGithubProjects() {
    try {
        const res = await fetch('https://api.github.com/users/AkhilRaghav0/repos');
        const data = await res.json();
        if (Array.isArray(data)) {
            githubProjects = data;
        }
    } catch (e) {
        console.error("Failed to fetch GitHub data", e);
    }
}
fetchGithubProjects();

// --- SCENES ---

scene("main", () => {
    // MAP GENERATION
    // We'll create a simple tiled map.
    // Symbols:
    // @: Player
    // =: Wall
    //  : Grass
    // *: Chest (Project)
    // ^: Enemy (Bug)
    // &: Enemy (Error)
    // #: Sign (About Me)
    // $: Book (Skills)

    const mapLayout = [
        "====================",
        "=                  =",
        "=  @      #   $    =",
        "=                  =",
        "=   ^^             =",
        "=       ======     =",
        "=       =    =     =",
        "=       =  * =     =",
        "=       =    =     =",
        "=       ======     =",
        "=                  =",
        "=   &              =",
        "=          *       =",
        "=                  =",
        "=     *            =",
        "=                  =",
        "====================",
    ];

    const levelCfg = {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            "=": () => [
                sprite("wall"),
                area(),
                body({ isStatic: true }),
                "wall"
            ],
            " ": () => [
                sprite("ground"),
                z(-1)
            ],
            "*": () => [
                sprite("chest"),
                area(),
                body({ isStatic: true }),
                "project_chest",
                { projectIndex: Math.floor(rand(0, 5)) } // Temporary random index
            ],
            "$": () => [
                sprite("book"),
                area(),
                body({ isStatic: true }),
                "skill_book"
            ],
            "#": () => [
                sprite("door"), // Using door as a "Sign" or "Portal"
                area(),
                body({ isStatic: true }),
                "about_sign"
            ],
            "^": () => [
                sprite("enemy_bug"),
                area(),
                body(),
                "enemy",
                "bug",
                { speed: 40, dir: choose([LEFT, RIGHT]) }
            ],
            "&": () => [
                sprite("enemy_error"),
                area(),
                body(),
                "enemy",
                "error",
                { hp: 3 }
            ]
        }
    };

    const gameLevel = addLevel(mapLayout, levelCfg);

    // PLAYER
    const player = add([
        sprite("player"),
        pos(80, 80),
        area(),
        body(),
        anchor("center"),
        "player",
        {
            speed: 120,
            hp: 3
        }
    ]);

    // CAMERA
    player.onUpdate(() => {
        camPos(player.pos);
    });

    // MOVEMENT
    onKeyDown("left", () => {
        player.move(-player.speed, 0);
        player.flipX = true;
    });
    onKeyDown("right", () => {
        player.move(player.speed, 0);
        player.flipX = false;
    });
    onKeyDown("up", () => {
        player.move(0, -player.speed);
    });
    onKeyDown("down", () => {
        player.move(0, player.speed);
    });

    // ATTACK
    onKeyPress("space", () => {
        // Simple attack logic: spawn a hitbox in front
        const dir = player.flipX ? LEFT : RIGHT;
        const hitbox = add([
            rect(40, 40),
            pos(player.pos.add(dir.scale(20))),
            color(255, 0, 0),
            opacity(0.5),
            area(),
            lifespan(0.1),
            "sword"
        ]);
    });

    // ENEMY LOGIC
    onUpdate("bug", (e) => {
        e.move(e.dir.scale(e.speed));
    });
    // Simple patrol for bugs
    loop(2, () => {
        get("bug").forEach(e => {
            e.dir = choose([LEFT, RIGHT, UP, DOWN]);
        });
    });

    // Witches/Chasers (if added) or just Error logic
    onUpdate("error", (e) => {
        // Errors move slowly towards player
        const dir = player.pos.sub(e.pos).unit();
        e.move(dir.scale(20));
    });

    // COMBAT
    onCollide("sword", "enemy", (s, e) => {
        destroy(e);
        shake(2);
    });

    onCollide("player", "enemy", (p, e) => {
        p.hp--;
        shake(5);
        if (p.hp <= 0) {
            go("gameover");
        } else {
            // Knockback
            const dir = p.pos.sub(e.pos).unit();
            p.move(dir.scale(400)); // Instant knockback
        }
    });

    // INTERACTIONS
    // Modal System
    function showModal(title, content) {
        // Create HTML modal overlay dynamically
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.border = '2px solid #000';
        modal.style.zIndex = '10000';
        modal.style.maxWidth = '80%';
        modal.style.maxHeight = '80%';
        modal.style.overflow = 'auto';
        modal.style.color = 'black';
        modal.innerHTML = `<h2>${title}</h2><div>${content}</div><button id="close-modal" style="margin-top:10px;">Close</button>`;

        document.body.appendChild(modal);

        // Pause game
        k.debug.paused = true;

        modal.querySelector('#close-modal').onclick = () => {
            document.body.removeChild(modal);
            k.debug.paused = false;
        };
    }

    player.onCollide("about_sign", () => {
        showModal("About Me", localData.aboutText);
    });

    player.onCollide("skill_book", () => {
        const content = localData.skills.map(s => `<p><strong>${s.name}</strong>: ${s.val}%</p>`).join("");
        showModal("My Skills", content || "No skills found.");
    });

    player.onCollide("project_chest", (p, c) => {
        let content = "Fetching projects...";
        let title = "Project";

        // Try to get from GitHub data if available, else local fallback
        if (githubProjects.length > 0) {
            const proj = githubProjects[c.projectIndex % githubProjects.length];
            if (proj) {
                title = proj.name;
                content = `<p>${proj.description || "No description"}</p><a href="${proj.html_url}" target="_blank">View on GitHub</a>`;
            }
        } else {
            // Fallback to scraping local projects
            const localProjects = document.querySelectorAll('.project-item');
            const localProj = localProjects[c.projectIndex % localProjects.length];
            if (localProj) {
                title = localProj.querySelector('.project-title')?.textContent;
                content = localProj.querySelector('.project-category')?.textContent;
            }
        }

        showModal(title, content);
    });

    // UI
    add([
        text("WASD to Move | SPACE to Attack", { size: 16 }),
        pos(10, 10),
        fixed(),
        z(100)
    ]);

    // Health UI
    const hpLabel = add([
        text("HP: 3", { size: 24, color: rgb(255, 0, 0) }),
        pos(10, 40),
        fixed(),
        z(100)
    ]);

    player.onUpdate(() => {
        hpLabel.text = "HP: " + player.hp;
    });

});

scene("gameover", () => {
    add([
        text("GAME OVER\nPress R to Restart", { size: 32 }),
        pos(width() / 2, height() / 2),
        anchor("center")
    ]);
    onKeyPress("r", () => {
        go("main");
    });
});

go("main");
