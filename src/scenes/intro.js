export function initIntroScene() {
    scene("intro", () => {
        // Cinematic Background
        add([
            rect(width(), height()),
            color(0, 0, 0),
            fixed()
        ]);

        // Main Title - Sholay Style (Big, Bold, centered)
        // We use system font "Rye" if available, or fallback
        const titleText = add([
            text("AKHIL RAGHAV", {
                size: 64,
                font: "Rye", // This matches the Google Font loaded in index.html
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y - 100),
            anchor("center"),
            color(255, 200, 50), // Gold/Yellowish color
        ]);

        // Subtext
        add([
            text("THE FULL STACK CHRONICLES", {
                size: 24,
                font: "Poppins",
                width: width() - 100,
                align: "center"
            }),
            pos(center().x, center().y - 30),
            anchor("center"),
            color(200, 200, 200),
        ]);

        // "Start" Prompt
        const startText = add([
            text("PRESS SPACE TO START", {
                size: 32,
                font: "Rye",
            }),
            pos(center().x, center().y + 100),
            anchor("center"),
            color(255, 255, 255),
            opacity(1),
            "pulse"
        ]);

        // "Forza" Style Control Footer
        // Drawing a footer bar
        const footerY = height() - 80;

        // Helper to draw key hint
        function drawKeyHint(key, action, xPos) {
            // Key Box
            add([
                rect(40, 40, { radius: 5 }),
                pos(xPos, footerY),
                anchor("center"),
                color(50, 50, 50),
                outline(2, rgb(200, 200, 200))
            ]);
            // Key Text
            add([
                text(key, { size: 18, font: "Poppins" }),
                pos(xPos, footerY),
                anchor("center"),
                color(255, 255, 255)
            ]);
            // Action Text
            add([
                text(action, { size: 16, font: "Poppins" }),
                pos(xPos + 30, footerY),
                anchor("left"),
                color(150, 150, 150)
            ]);
        }

        const startX = center().x - 200;
        drawKeyHint("W", "MOVE", startX);
        drawKeyHint("SPC", "ATTACK", startX + 120);
        drawKeyHint("E", "INTERACT", startX + 260);

        // Animations
        onUpdate("pulse", (t) => {
            t.opacity = wave(0.5, 1, time() * 3);
        });

        // Interactions
        onKeyPress("space", () => {
            go("game");
        });

        onClick(() => {
            go("game");
        });
    });
}
