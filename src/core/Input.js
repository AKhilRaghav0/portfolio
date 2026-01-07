import * as THREE from 'three';

export class Input {
    constructor() {
        this.keys = {};
        this.mouse = new THREE.Vector2();
        this.isMouseDown = false;

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    onKeyDown(e) {
        this.keys[e.code] = true;
    }

    onKeyUp(e) {
        this.keys[e.code] = false;
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseDown(e) {
        this.isMouseDown = true;
    }

    onMouseUp(e) {
        this.isMouseDown = false;
    }

    isPressed(code) {
        return !!this.keys[code];
    }
}
