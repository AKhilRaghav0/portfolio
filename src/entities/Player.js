import * as THREE from 'three';
import { Projectile } from './Projectile.js';

export class Player {
    constructor(engine) {
        this.engine = engine;
        this.world = engine.world; // Engine will inject world later, or we pass it
        this.input = engine.input;

        // Physics stats
        this.speed = 10;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        // Mesh
        const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x00ffff,
            emissiveIntensity: 0.2
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = 1;
        this.mesh.castShadow = true;

        // Camera rig
        this.cameraTarget = new THREE.Object3D();
        this.cameraTarget.position.y = 1.5;
        this.mesh.add(this.cameraTarget);
    }

    update(dt) {
        // Sync world reference if needed (lazy init)
        if(!this.world) this.world = this.engine.world;

        this.handleMovement(dt);
        this.handleCamera(dt);
        this.handleCombat(dt);
    }

    handleCombat(dt) {
        if (this.input.isPressed('Space')) {
            if (!this.lastShot || Date.now() - this.lastShot > 300) {
                this.shoot();
                this.lastShot = Date.now();
            }
        }
    }

    shoot() {
        if (!this.world) return;

        // Get shooting direction (where player is facing)
        const direction = new THREE.Vector3(0, 0, 1);
        direction.applyQuaternion(this.mesh.quaternion);

        const startPos = this.mesh.position.clone();
        startPos.y += 1; // Chest height
        startPos.addScaledVector(direction, 1);

        new Projectile(this.world, startPos, direction);
    }

    handleMovement(dt) {
        // Friction
        this.velocity.x -= this.velocity.x * 10.0 * dt;
        this.velocity.z -= this.velocity.z * 10.0 * dt;

        // Input
        this.direction.z = Number(this.input.isPressed('KeyW')) - Number(this.input.isPressed('KeyS'));
        this.direction.x = Number(this.input.isPressed('KeyA')) - Number(this.input.isPressed('KeyD'));
        this.direction.normalize();

        // Move relative to camera
        if (this.input.isPressed('KeyW') || this.input.isPressed('KeyS') || this.input.isPressed('KeyA') || this.input.isPressed('KeyD')) {
            // Get camera direction (flat on Y)
            const camDir = new THREE.Vector3();
            this.engine.camera.getWorldDirection(camDir);
            camDir.y = 0;
            camDir.normalize();

            const camSide = new THREE.Vector3();
            camSide.crossVectors(camDir, new THREE.Vector3(0, 1, 0));

            const moveDir = new THREE.Vector3();
            moveDir.addScaledVector(camDir, this.direction.z);
            moveDir.addScaledVector(camSide, -this.direction.x); // Flipped A/D logic for standard WASD
            moveDir.normalize();

            this.velocity.addScaledVector(moveDir, this.speed * 100.0 * dt); // Acceleration

            // Rotate player to face movement
            const targetRotation = Math.atan2(moveDir.x, moveDir.z);
            // Simple lerp rotation
            this.mesh.rotation.y = targetRotation;
        }

        // Apply velocity
        this.mesh.position.x += this.velocity.x * dt;
        this.mesh.position.z += this.velocity.z * dt;

        // Clamp velocity
        const maxSpeed = 10;
        if(this.velocity.length() > maxSpeed) {
            this.velocity.normalize().multiplyScalar(maxSpeed);
        }
    }

    handleCamera(dt) {
        // Third Person Camera Logic
        // In a real game we'd use PointerLockControls for look.
        // For simplicity here, we'll have a fixed offset camera that follows smoothly,
        // OR we implement simple mouse look logic here.

        // Let's implement simple Orbit logic based on mouse X
        const mouseX = this.input.mouse.x; // -1 to 1

        // Calculate desired camera position
        const offset = new THREE.Vector3(0, 5, -10); // Behind and up
        // Rotate offset based on time or mouse (optional)

        // Smooth follow
        const targetPos = this.mesh.position.clone().add(new THREE.Vector3(0, 5, 10));
        this.engine.camera.position.lerp(targetPos, 5 * dt);
        this.engine.camera.lookAt(this.mesh.position);
    }
}
