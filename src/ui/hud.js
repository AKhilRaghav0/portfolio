// HUD System
import { questState } from "../systems/quest.js";

export function initHUD() {
    const layerUI = add([
        fixed(),
        z(100)
    ]);

    // Health Bar Container
    const hpBarBg = layerUI.add([
        rect(200, 20),
        pos(20, 20),
        color(50, 50, 50),
        outline(2, rgb(255, 255, 255))
    ]);

    // Health Bar Fill
    const hpBar = layerUI.add([
        rect(200, 20),
        pos(20, 20),
        color(255, 50, 50)
    ]);

    // HP Text
    const hpText = layerUI.add([
        text("HP: 100/100", { size: 14, font: "Poppins" }),
        pos(30, 22),
        color(255, 255, 255)
    ]);

    // Quest Box
    const questBox = layerUI.add([
        rect(300, 80),
        pos(width() - 320, 20),
        color(0, 0, 0, 0.5),
        outline(1, rgb(200, 200, 200))
    ]);

    const questTitle = layerUI.add([
        text("No Active Quest", { size: 16, font: "Poppins" }),
        pos(width() - 310, 30),
        color(255, 200, 50)
    ]);

    const questDesc = layerUI.add([
        text("Explore the world.", { size: 12, font: "Poppins", width: 280 }),
        pos(width() - 310, 55),
        color(200, 200, 200)
    ]);

    // Update Function
    onUpdate(() => {
        const player = get("player")[0];
        if (player) {
            const hpPercent = player.hp / player.maxHp;
            hpBar.width = 200 * hpPercent;
            hpText.text = `HP: ${player.hp}/${player.maxHp}`;
        }

        if (questState.activeQuest) {
            questTitle.text = questState.activeQuest.title;
            questDesc.text = questState.activeQuest.desc;
        } else {
            questTitle.text = "No Active Quest";
            questDesc.text = "Find signs to start missions.";
        }
    });
}
