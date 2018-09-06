/**
 * 由27个小立方体组成的魔方
 */
import Cube from './cube';
import { Group, BoxGeometry, Mesh, MeshBasicMaterial, FaceColors } from '../libs/three.min.js';
import { OBJECT_TYPE } from '../common/consts';

export default class CubeGroup extends Group{
    constructor() {
        super();
        this.objectType = OBJECT_TYPE.CUBE_GROUP;
        this.length = 10; // 单个立方体边长
        this.init();
    }
    /**
     * 魔方初始化，添加27个小立方块
     */
    init() {
        for (let x = 0; x < 3; x ++) {
            for (let y = 0; y < 3; y ++) {
                for (let z = 0; z < 3; z ++) {
                    const subcube = new Cube(this.length);
                    // 设置透明立方体，法向量始终与世界坐标系一致
                    const transparentCube = new Mesh(
                        new BoxGeometry(this.length, this.length, this.length),
                        new MeshBasicMaterial({ vertexColors: FaceColors, opacity: 0, transparent: true })
                    );
                    transparentCube.objectType = OBJECT_TYPE.CUBE_TRANSPARENT;
                    subcube.position.set(x * this.length - this.length, y * this.length - this.length, z * this.length - this.length);
                    transparentCube.position.set(x * this.length - this.length, y * this.length - this.length, z * this.length - this.length);
                    this.add(subcube);
                    this.add(transparentCube);
                }
            }
        }
    }
    /**
     * 获取绕某一轴线上整个平面的立方体
     * @param {Vector3} vector3 当前立方体坐标
     * @param {String} axes 轴线，可取值为x, y, z
     */
    getSamePlaneCubes(vector3, axes) {
        return this.children.filter(item => {
            return item.position[axes] === vector3[axes] && item.objectType === OBJECT_TYPE.CUBE;
        });
    }
}