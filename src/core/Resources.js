import * as THREE from 'three';

export class Resources {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        this.textures = {};
    }

    loadTexture(key, url) {
        this.textureLoader.load(url, (tex) => {
            this.textures[key] = tex;
        });
    }

    getTexture(key) {
        return this.textures[key];
    }
}
