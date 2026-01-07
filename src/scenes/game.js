import { loadLevel } from "../systems/level.js";
import { initHUD } from "../ui/hud.js";
import { showModal } from "../ui/modal.js";
import { spawnEnemy } from "../entities/enemy.js";
import { questState, checkQuestProgress, startQuest } from "../systems/quest.js";
import { portfolioData } from "../data/portfolio.js";
import { fetchGithubData, githubProjects } from "../systems/github.js";

export function initGameScene() {
    scene("game", () => {
        // Pre-fetch Data
        fetchGithubData();

        // Initialize the world
        const { player, level } = loadLevel();

        // Initialize UI
        initHUD();

        // --- SPAWN CHESTS DYNAMICALLY ---
        // Find "forest_ground" tiles to spawn chests on
        const forestTiles = get("forest_ground");
        // Shuffle and pick a few spots
        for (let i = 0; i < 5; i++) {
            if (forestTiles.length > 0) {
                const idx = Math.floor(rand(0, forestTiles.length));
                const tile = forestTiles[idx];
                // Spawn a chest there
                add([
                    sprite("chest"),
                    pos(tile.pos),
                    area(),
                    body({ isStatic: true }),
                    anchor("center"), // Center on tile
                    "project_chest",
                    { projectIndex: i }
                ]);
                // Remove used tile from list to avoid stacking
                forestTiles.splice(idx, 1);
            }
        }

        // --- ENEMY SPAWNING ---
        spawnEnemy(vec2(150, 150), 'bug');
        spawnEnemy(vec2(200, 200), 'bug');
        spawnEnemy(vec2(500, 100), 'error'); // Near Castle?

        // --- COMBAT LOGIC ---
        onCollide("sword", "enemy", (sword, enemy) => {
            destroy(sword);
            enemy.hp--;

            // Particle Effect
            for (let i = 0; i < 4; i++) {
                add([
                    rect(4, 4),
                    pos(enemy.pos),
                    color(255, 255, 255),
                    move(choose([LEFT, RIGHT, UP, DOWN]), rand(50, 100)),
                    lifespan(0.3),
                    opacity(0.8)
                ]);
            }

            if (enemy.hp <= 0) {
                destroy(enemy);
                shake(2);

                // Update Stats
                if (enemy.type === 'bug') questState.stats.bugsKilled++;
                if (enemy.type === 'error') questState.stats.errorsFixed++;

                // Check Quest Completion
                const reward = checkQuestProgress();
                if (reward) {
                    add([
                        text(`QUEST COMPLETE!\nReward: ${reward}`, { size: 24, font: "Poppins" }),
                        pos(center()),
                        anchor("center"),
                        color(0, 255, 0),
                        lifespan(3),
                        fixed(),
                        z(200)
                    ]);
                }
            } else {
                // Knockback
                const dir = enemy.pos.sub(player.pos).unit();
                enemy.move(dir.scale(50));
            }
        });

        onCollide("enemy_attack", "player", (attack, p) => {
            destroy(attack);
            p.hp -= 10;
            shake(5);

            // Hurt Effect
            add([
                rect(width(), height()),
                color(255, 0, 0),
                opacity(0.3),
                lifespan(0.1),
                fixed(),
                z(200)
            ]);

            if (p.hp <= 0) {
                go("gameover");
            }
        });

        // --- INTERACTIONS ---

        // 1. About Sign (Hub)
        player.onCollide("shrine", () => {
            const aboutContent = portfolioData.about.map(p => `<p>${p}</p>`).join("");
            const socialContent = `
                <div style="margin-top:20px; border-top:1px solid #444; padding-top:10px;">
                    <h3>Connect</h3>
                    <p>Email: <a href="mailto:${portfolioData.personal.email}">${portfolioData.personal.email}</a></p>
                    <p>Twitter: <a href="${portfolioData.personal.socials.twitter}" target="_blank">@rghv064</a></p>
                </div>
            `;
            showModal("The Shrine of Identity", aboutContent + socialContent);
        });

        // 2. Castle Gate
        player.onCollide("castle_gate", () => {
            if (questState.completedQuests.includes("bug_hunt")) {
                const skillsContent = portfolioData.skills.map(s =>
                    `<div style="margin-bottom:5px;"><strong>${s.name}</strong>: <div style="display:inline-block; width:100px; background:#333; height:10px;"><div style="width:${s.val}%; background:#fec830; height:100%;"></div></div></div>`
                ).join("");

                showModal("Castle of Resume", `
                    <h3>Experience</h3>
                    <p>WIP - Present</p>
                    <h3>Skills</h3>
                    ${skillsContent}
                `);
            } else {
                showModal("Locked", "The gate is locked. The Forest Guardian says: 'Purge 5 Bugs to prove your worth!'");
                startQuest("bug_hunt");
            }
        });

        // 3. Project Chests
        player.onCollide("project_chest", (p, c) => {
            let projects = githubProjects.length > 0 ? githubProjects : portfolioData.projects;
            let proj = projects[c.projectIndex % projects.length];

            if (proj) {
                let link = proj.link ? `<p><a href="${proj.link}" target="_blank">View Project</a></p>` : "";
                showModal(proj.title, `<p>${proj.desc}</p><p><em>Category: ${proj.category || "General"}</em></p>${link}`);
            } else {
                showModal("Empty Chest", "This chest is empty.");
            }
        });

    });

    scene("gameover", () => {
        add([
            rect(width(), height()),
            color(0, 0, 0),
            fixed()
        ]);
        add([
            text("GAME OVER", { size: 64, color: rgb(255, 0, 0) }),
            pos(center()),
            anchor("center")
        ]);
        add([
            text("Press SPACE to Respawn", { size: 24, font: "Poppins" }),
            pos(center().x, center().y + 100),
            anchor("center")
        ]);
        onKeyPress("space", () => go("game"));
    });
}
