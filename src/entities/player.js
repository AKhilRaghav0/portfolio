// Player Entity with Movement and State
export function spawnPlayer(posXY) {
    const SPEED = 120;

    const player = add([
        sprite("bean"), // Placeholder 'bean' until we have a better sprite
        pos(posXY),
        area(),
        body(),
        anchor("center"),
        "player",
        {
            speed: SPEED,
            dir: vec2(0, 0),
            hp: 100,
            maxHp: 100,
            xp: 0,
            level: 1,
            isAttacking: false
        }
    ]);

    // Camera Follow
    player.onUpdate(() => {
        camPos(player.pos);
    });

    // Movement Controls
    onKeyDown("w", () => {
        player.move(0, -player.speed);
        player.dir = vec2(0, -1);
    });
    onKeyDown("s", () => {
        player.move(0, player.speed);
        player.dir = vec2(0, 1);
    });
    onKeyDown("a", () => {
        player.move(-player.speed, 0);
        player.flipX = true;
        player.dir = vec2(-1, 0);
    });
    onKeyDown("d", () => {
        player.move(player.speed, 0);
        player.flipX = false;
        player.dir = vec2(1, 0);
    });

    // Attack
    onKeyPress("space", () => {
        if (player.isAttacking) return;
        player.isAttacking = true;

        // Visual feedback
        const slash = add([
            rect(40, 40),
            pos(player.pos.add(player.dir.scale(30))),
            anchor("center"),
            color(255, 255, 255),
            opacity(1),
            lifespan(0.1),
            area(),
            "sword" // Tag for collision
        ]);

        // Cooldown
        wait(0.3, () => {
            player.isAttacking = false;
        });
    });

    return player;
}
