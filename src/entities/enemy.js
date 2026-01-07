// Enemy Entity Logic
export function spawnEnemy(posXY, type) {
    // Type: 'bug' (fast, weak), 'error' (slow, tanky)

    let spriteName = "ghosty";
    let speed = 40;
    let hp = 1;
    let colorFilter = rgb(255, 255, 255);

    if (type === 'bug') {
        speed = 80;
        hp = 1;
        colorFilter = rgb(100, 255, 100); // Greenish
    } else if (type === 'error') {
        speed = 20;
        hp = 3;
        colorFilter = rgb(255, 100, 100); // Reddish
    }

    const enemy = add([
        sprite(spriteName, { color: colorFilter }),
        pos(posXY),
        area(),
        body(),
        anchor("center"),
        state("idle", ["idle", "chase", "attack"]),
        "enemy",
        {
            type: type,
            hp: hp,
            speed: speed,
            dir: vec2(0, 0)
        }
    ]);

    // AI States
    enemy.onStateEnter("idle", async () => {
        await wait(rand(1, 3));
        enemy.enterState("chase");
    });

    enemy.onStateUpdate("chase", () => {
        const player = get("player")[0];
        if (player) {
            const dir = player.pos.sub(enemy.pos).unit();
            enemy.move(dir.scale(enemy.speed));

            // If close enough, attack
            if (player.pos.dist(enemy.pos) < 40) {
                enemy.enterState("attack");
            }
        }
    });

    enemy.onStateEnter("attack", async () => {
        // Lunge forward
        const player = get("player")[0];
        if (player) {
            const dir = player.pos.sub(enemy.pos).unit();
            const attackBox = add([
                rect(20, 20),
                pos(enemy.pos.add(dir.scale(20))),
                color(255, 0, 0),
                opacity(0.5),
                area(),
                lifespan(0.1),
                "enemy_attack"
            ]);
        }
        await wait(1);
        enemy.enterState("chase");
    });

    return enemy;
}
