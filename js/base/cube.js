/**
 * 单个的立方体，魔方的基本组成模块
 */
import { BoxGeometry, MeshBasicMaterial, Mesh, Texture, MeshLambertMaterial, Quaternion, Vector3 } from '../libs/three.min.js';
import { OBJECT_TYPE, DIRECTION_LINE } from '../common/consts';

export default class Cube extends Mesh {
    constructor (length = 1) {
        super();
        this.objectType = OBJECT_TYPE.CUBE;
        this.init(length);
    }
    /**
     * 立方体初始化，为六面涂上不同的颜色
     */
    init(length) {
        const geometry = new BoxGeometry(length, length, length);
        const materials = [];
        const faces = [];

        faces.push(this.createFace('#009e60'))
        faces.push(this.createFace('#0051ba'))
        faces.push(this.createFace('#ffd500'))
        faces.push(this.createFace('#ff5800'))
        faces.push(this.createFace('#c41e3a'))
        faces.push(this.createFace('#ffffff'))

        // materials.push(new MeshBasicMaterial({color: 0x009e60}));
		// materials.push(new MeshBasicMaterial({color: 0x0051ba}));
		// materials.push(new MeshBasicMaterial({color: 0xffd500}));
		// materials.push(new MeshBasicMaterial({color: 0xff5800}));
		// materials.push(new MeshBasicMaterial({color: 0xc41e3a}));
        // materials.push(new MeshBasicMaterial({color: 0xffffff}));
        faces.forEach(item => {
            var texture = new Texture(item);
            texture.needsUpdate = true;
            materials.push(new MeshLambertMaterial({
                map: texture
            }));
        });
        this.geometry = geometry;
        this.material = materials;
    }
    /**
     * 创建每一面的文理
     * @param {String} rgbaColor
     */
    createFace(rgbaColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        //画一个宽高都是256的黑色正方形
        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fillRect(0, 0, 256, 256);
        //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
        context.rect(16, 16, 224, 224);
        context.lineJoin = 'round';
        context.lineWidth = 16;
        context.fillStyle = rgbaColor;
        context.strokeStyle = rgbaColor;
        context.stroke();
        context.fill();
        return canvas;
    }
    /**
     * 绕世界坐标系X轴旋转
     * @param {rad} rad 弧度
     */
    rotateAroundWordX(rad) {
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(DIRECTION_LINE.X_POSITIVE, rad);
        this.quaternion.premultiply(quaternion);
        this.position.applyAxisAngle(DIRECTION_LINE.X_POSITIVE, rad); // 位置绕x轴旋转rad度
    }
    /**
     * 绕世界坐标系Y轴旋转
     * @param {rad} rad 弧度
     */
    rotateAroundWordY(rad) {
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(DIRECTION_LINE.Y_POSITIVE, rad);
        this.quaternion.premultiply(quaternion);
        this.position.applyAxisAngle(DIRECTION_LINE.Y_POSITIVE, rad); // 位置绕y轴旋转rad度
    }
    /**
     * 绕世界坐标系Z轴旋转
     * @param {rad} rad 弧度
     */
    rotateAroundWordZ(rad) {
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(DIRECTION_LINE.Z_POSITIVE, rad);
        this.quaternion.premultiply(quaternion);
        this.position.applyAxisAngle(DIRECTION_LINE.Z_POSITIVE, rad); // 位置绕z轴旋转rad度
    }
}