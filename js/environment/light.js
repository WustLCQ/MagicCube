import { AmbientLight } from '../libs/three.min.js';

export default class Light extends AmbientLight {
    constructor(params) {
        super(params);
    }
}