import * as THREE from 'three';
import { Input } from './Input.js';
import { Resources } from './Resources.js';

export class Engine {
    constructor() {
        this.container = document.getElementById('game-container');

        // Systems
        this.input = new Input();
        this.resources = new Resources();
        this.clock = new THREE.Clock();

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);
        this.scene.fog = new THREE.FogExp2(0x050505, 0.02);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Event Listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start Loop
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(dt) {
        // Placeholder for world update
        if (this.world) this.world.update(dt);
    }

    render() {
        if (this.world && this.world.environment && this.world.environment.composer) {
            this.world.environment.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const dt = this.clock.getDelta();
        this.update(dt);
        this.render();
    }

    setWorld(world) {
        this.world = world;
        this.scene.add(world.group);
    }
}
