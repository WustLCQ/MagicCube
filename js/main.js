import './libs/weapp-adapter.js';
import './libs/symbol.js';
import Camera from './environment/camera';
import Light from './environment/light';
import CubeGroup from './base/cubeGroup';
import { Scene, WebGLRenderer, Vector3 } from './libs/three.min.js';
import OrbitControls from './libs/three-orbit-controls';
import TouchEvent from './action/touchEvent';

export default class Main {
    constructor() {
        this.init();
    }
    init() {
        const scene = new Scene();
        const camera = new Camera();
        const light = new Light(0xfefefe);
        const context = canvas.getContext('webgl');
        const renderer = new WebGLRenderer(context);

        renderer.setSize( window.innerWidth, window.innerHeight );
        canvas.appendChild( renderer.domElement );

        const cubeGroup = new CubeGroup();

        // 添加光线
        scene.add(light);
        // 添加魔方
        scene.add(cubeGroup);

        // 初始化视角控制
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        // 初始化触摸事件
        new TouchEvent(camera, scene, orbitControls, cubeGroup);

        function render() {
            requestAnimationFrame( render );
            renderer.clear();
            renderer.render( scene, camera );
        }
        render();
        // 显示转发
        wx.showShareMenu();
    }
}