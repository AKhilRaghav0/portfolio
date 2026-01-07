import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

export class Environment {
    constructor(engine) {
        this.engine = engine;
        this.group = new THREE.Group();

        this.setupLights();
        this.setupGrid();
        this.setupPostProcessing();
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0x404040, 2); // Darker ambient
        this.group.add(ambient);

        // Neon Blue Directional Light
        const dirLight = new THREE.DirectionalLight(0x00ffff, 1.5);
        dirLight.position.set(-5, 10, 5);
        dirLight.castShadow = true;
        this.group.add(dirLight);

        // Neon Pink Rim Light
        const spotLight = new THREE.SpotLight(0xff00ff, 5);
        spotLight.position.set(10, 10, -5);
        this.group.add(spotLight);
    }

    setupGrid() {
        // Infinite Grid Shader Material
        // Simulating a Tron-like grid
        const size = 200;
        const divisions = 100;

        // Helper Grid
        const gridHelper = new THREE.GridHelper(size, divisions, 0x00ffff, 0x220022);
        gridHelper.position.y = 0;
        this.group.add(gridHelper);

        // Reflective Floor Plane
        const planeGeometry = new THREE.PlaneGeometry(size, size);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(planeGeometry, planeMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.01; // Just below grid
        floor.receiveShadow = true;
        this.group.add(floor);

        // Random "Buildings" / Neon Pillars in distance
        const boxGeo = new THREE.BoxGeometry(2, 10, 2);
        const neonMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        for(let i=0; i<50; i++) {
            const mesh = new THREE.Mesh(boxGeo, neonMat);
            const x = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            // Don't spawn too close to center
            if(Math.abs(x) < 20 && Math.abs(z) < 20) continue;

            mesh.position.set(x, 5, z);
            mesh.scale.y = Math.random() * 2 + 0.5;
            this.group.add(mesh);
        }
    }

    setupPostProcessing() {
        // We need to hook into the engine's render loop for this.
        // For simplicity in this architecture, we will modify the engine's render method
        // or expose the composer here.
        this.composer = new EffectComposer(this.engine.renderer);

        const renderPass = new RenderPass(this.engine.scene, this.engine.camera);
        this.composer.addPass(renderPass);

        // Bloom
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // Strength
            0.4, // Radius
            0.85 // Threshold
        );
        this.composer.addPass(bloomPass);
    }

    update(dt) {
        // Animate grid or lights if needed
    }
}
