import * as THREE from 'three';

export class Enemy {
    constructor(world, x, z) {
        this.world = world;
        this.alive = true;
        this.hp = 3;

        // Geometry - "Virus" Shape
        const geometry = new THREE.IcosahedronGeometry(0.5, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.8,
            roughness: 0.1,
            metalness: 0.9
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, 2, z);
        this.mesh.castShadow = true;

        // Random spikes
        // In a real project we'd add child meshes for spikes
    }

    update(dt) {
        if (!this.alive) return;

        // Rotate
        this.mesh.rotation.x += dt;
        this.mesh.rotation.y += dt;

        // Chase Player
        const playerPos = this.world.player.mesh.position;
        const dist = this.mesh.position.distanceTo(playerPos);

        if (dist < 20 && dist > 1) {
            const dir = playerPos.clone().sub(this.mesh.position).normalize();
            this.mesh.position.addScaledVector(dir, 4 * dt); // Speed 4
        }
    }

    takeDamage() {
        this.hp--;
        // Flash white
        this.mesh.material.emissive.setHex(0xffffff);
        setTimeout(() => {
            if(this.alive) this.mesh.material.emissive.setHex(0xff0000);
        }, 100);

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        this.mesh.visible = false;
        // Particle explosion logic would go here

        // Remove from world entities
        const idx = this.world.entities.indexOf(this);
        if (idx > -1) {
            this.world.entities.splice(idx, 1);
        }
    }
}
