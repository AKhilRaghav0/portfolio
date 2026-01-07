// Level System - Manages the Map and Zones
import { spawnPlayer } from "../entities/player.js";

export function loadLevel() {
    // Map Symbols
    // @: Player Spawn
    // =: Wall (Steel)
    // .: Floor (Grass)
    // #: Hub Center (Safe Zone)
    // T: Tree (Forest)
    // D: Dungeon Door (Castle)

    // We will generate a large map programmatically or via a big array
    // For "Full Fledged" feel, let's make it reasonably sized (e.g. 40x30)

    const mapWidth = 40;
    const mapHeight = 30;

    // Helper to generate a room
    function generateRoom(w, h, type) {
        let room = [];
        for (let y = 0; y < h; y++) {
            let row = "";
            for (let x = 0; x < w; x++) {
                if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
                    row += "=";
                } else {
                    row += ".";
                }
            }
            room.push(row);
        }
        return room;
    }

    // Hand-crafting a layout for now to ensure Zones are distinct
    // Top-Left: Forest (Projects)
    // Center: Hub (About/Socials)
    // Bottom-Right: Castle (Resume/Skills)

    const layout = [
        "========================================",
        "=TTTTTTTTTTT=                      D   =",
        "=TTTTTTTTTTT=                      D   =",
        "=TTTTTTTTTTT=      @               D   =",
        "=TTTTTTTTTTT=                      =====",
        "=TTTT   TTTT=                          =",
        "=TTT     TTT=      #       #           =",
        "=TT       TT=                          =",
        "=T         T=      #       #           =",
        "=           =                          =",
        "=           =                          =",
        "=============                          =",
        "=                                      =",
        "=                                      =",
        "=                                      =",
        "=           ============================",
        "=           =CCCCCCCCCCCCCCCCCCCCCCCCCC=",
        "=           =CCCCCCCCCCCCCCCCCCCCCCCCCC=",
        "=           =CCCCCCCCCCCCCCCCCCCCCCCCCC=",
        "=           =CCCCCCCCCCCCCCCCCCCCCCCCCC=",
        "========================================",
    ];

    const levelConf = {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            "=": () => [
                sprite("steel"),
                area(),
                body({ isStatic: true }),
                "wall"
            ],
            ".": () => [
                sprite("grass"),
                z(-1)
            ],
            "T": () => [
                sprite("grass", { color: rgb(100, 200, 100) }), // Green tinted grass for forest
                area(),
                "forest_ground"
            ],
            "C": () => [
                sprite("steel", { color: rgb(150, 150, 200) }), // Blue tinted steel for castle
                area(),
                "castle_floor"
            ],
            "D": () => [
                sprite("door"),
                area(),
                body({ isStatic: true }),
                "castle_gate"
            ],
            "#": () => [
                sprite("chest"), // Placeholder for social shrines
                area(),
                body({ isStatic: true }),
                "shrine"
            ]
        }
    };

    const level = addLevel(layout, levelConf);

    // Spawn Player at the '@' symbol in the layout, or default center if missing
    // addLevel doesn't automatically spawn dynamic entities from the map string unless we tell it to.
    // Instead, we can find the coordinates or just hardcode spawn relative to map.
    // Let's iterate the layout to find '@'

    let spawnPos = vec2(100, 100);
    layout.forEach((row, y) => {
        [...row].forEach((char, x) => {
            if (char === '@') {
                spawnPos = vec2(x * 32, y * 32);
            }
        });
    });

    const player = spawnPlayer(spawnPos);

    // Add some "Juice" - Background color
    add([
        rect(width()*10, height()*10),
        pos(-width(), -height()),
        color(20, 20, 20), // Dark background for off-map areas
        z(-100)
    ]);

    return { level, player };
}
