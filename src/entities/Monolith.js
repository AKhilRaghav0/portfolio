import * as THREE from 'three';
import { portfolioData } from '../data/portfolio.js';
import { showModal } from '../ui/Modal.js';

export class Monolith {
    constructor(world, x, z, data) {
        this.world = world;
        this.data = data;

        // Geometry
        const geometry = new THREE.BoxGeometry(2, 6, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.2,
            metalness: 0.9,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, 3, z);
        this.mesh.castShadow = true;

        // Floating Label/Icon
        // Since TextGeometry requires font loader, we'll use a simple glowing orb on top for now
        const orbGeo = new THREE.SphereGeometry(0.5);
        const orbMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.orb = new THREE.Mesh(orbGeo, orbMat);
        this.orb.position.y = 4;
        this.mesh.add(this.orb);

        // Interaction
        this.interactionRadius = 4;
    }

    update(dt) {
        // Rotate orb
        this.orb.position.y = 4 + Math.sin(Date.now() * 0.002) * 0.5;

        // Check Player Distance
        const playerPos = this.world.player.mesh.position;
        const dist = this.mesh.position.distanceTo(playerPos);

        if (dist < this.interactionRadius) {
            this.orb.scale.setScalar(1.5);
            // Trigger UI logic could go here, for now we check input in World or Player
            // But let's simple check if "Interact" key (E) is pressed
            if (this.world.engine.input.isPressed('KeyE')) {
                this.interact();
            }
        } else {
            this.orb.scale.setScalar(1.0);
        }
    }

    interact() {
        let content = "";
        if (this.data.desc) content += `<p>${this.data.desc}</p>`;
        if (this.data.category) content += `<p><em>${this.data.category}</em></p>`;
        if (this.data.link) content += `<p><a href="${this.data.link}" target="_blank">View Project</a></p>`;
        // Handle lists (skills)
        if (this.data.items) {
            content += this.data.items.map(i => `<span>${i.name}: ${i.val}%</span>`).join('<br>');
        }

        showModal(this.data.title, content);
    }
}
