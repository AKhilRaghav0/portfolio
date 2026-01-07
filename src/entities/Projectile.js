import * as THREE from 'three';

export class Projectile {
    constructor(world, position, direction) {
        this.world = world;
        this.direction = direction.normalize();
        this.speed = 40;
        this.life = 2.0; // Seconds

        // Geometry
        const geometry = new THREE.SphereGeometry(0.2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        // Light attached to projectile
        this.light = new THREE.PointLight(0x00ffff, 1, 5);
        this.mesh.add(this.light);

        this.world.addEntity(this);
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) {
            this.destroy();
            return;
        }

        // Move
        this.mesh.position.addScaledVector(this.direction, this.speed * dt);

        // Collision Detection (Simple Sphere)
        for (let entity of this.world.entities) {
            if (entity.constructor.name === "Enemy" && entity.alive) {
                const dist = this.mesh.position.distanceTo(entity.mesh.position);
                if (dist < 1.0) {
                    entity.takeDamage();
                    this.destroy();
                    return;
                }
            }
        }
    }

    destroy() {
        this.mesh.visible = false; // Quick hide
        // Remove from world
        const idx = this.world.entities.indexOf(this);
        if (idx > -1) {
            this.world.entities.splice(idx, 1);
            this.world.group.remove(this.mesh);
        }
    }
}
