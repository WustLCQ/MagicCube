/**
 * 相机
 */
import { PerspectiveCamera, Vector3 } from '../libs/three.min.js';

export default class Camera extends PerspectiveCamera {
    constructor() {
        super ( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.init();
        this.addEventListener();
    }
    init() {
        this.position.z = 100;
        this.lookAt(new Vector3(0, 0, 0));
    }
    // 屏幕坐标转three.js空间坐标
    transToThreeCoord(x, y){
        let mouse = new Vector3();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        return mouse;
    }

    /**
    * 将three.js三维坐标转换成屏幕上的二维坐标
    * @param THREE.Vector3 vector three.js三维坐标
    * @return {x:int,y:int} 屏幕坐标
    */
    transToScreenCoord(vector) {
        var screenCoord = {};
        vector.project(this);
        screenCoord.x = (0.5 + vector.x / 2) * window.innerWidth;
        screenCoord.y = (0.5 - vector.y / 2) * window.innerHeight;
        return screenCoord;
    }
}