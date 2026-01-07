import * as THREE from 'three';
import { Environment } from './Environment.js';
import { Player } from '../entities/Player.js';
import { Monolith } from '../entities/Monolith.js';
import { Enemy } from '../entities/Enemy.js';
import { portfolioData } from '../data/portfolio.js';

export class World {
    constructor(engine) {
        this.engine = engine;
        this.group = new THREE.Group();

        this.environment = new Environment(engine);
        this.group.add(this.environment.group);

        this.entities = [];

        this.player = new Player(engine);
        this.addEntity(this.player);

        this.spawnContent();
    }

    spawnContent() {
        // Spawn Monoliths for Projects
        let i = 0;
        portfolioData.projects.forEach(proj => {
            const angle = (i / portfolioData.projects.length) * Math.PI * 2;
            const radius = 20;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const m = new Monolith(this, x, z, proj);
            this.addEntity(m);
            i++;
        });

        // About Monolith
        const aboutM = new Monolith(this, 0, -10, {
            title: "About Me",
            desc: portfolioData.about.join("<br><br>")
        });
        this.addEntity(aboutM);

        this.spawnEnemies();
    }

    spawnEnemies() {
        for(let i=0; i<5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 20;
            const enemy = new Enemy(this, Math.cos(angle)*dist, Math.sin(angle)*dist);
            this.addEntity(enemy);
        }
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.group.add(entity.mesh);
    }

    update(dt) {
        this.environment.update(dt);
        this.entities.forEach(e => e.update(dt));

        // Render via composer if available
        if (this.environment.composer) {
            this.environment.composer.render();
        }
    }
}
