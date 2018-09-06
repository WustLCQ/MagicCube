/**
 * 触摸事件
 */
import { Vector2, Raycaster, Matrix3 } from '../libs/three.min.js';
import { throttle } from '../common/utils';
import { OBJECT_TYPE, DIRECTION_LINE, DIRECTION } from '../common/consts';
export default class TouchEvent {
    constructor(camera, scene, orbitControls, cubeGroup) {
        this.camera = camera;
        this.scene = scene;
        this.orbitControls = orbitControls;
        this.cubeGroup = cubeGroup;
        this.touchStartCube = null; // 开始触摸时的立方块
        this.wordNormal = null; // 世界坐标系法向量
        this.direction = null; // 旋转方向
        this.isRotating = false; // 是否正在旋转中
        this.init();
    }
    init() {
        wx.onTouchStart(this.handleTouchStart.bind(this));
        wx.onTouchMove(throttle(this.handleTouchMove.bind(this), 100));
        wx.onTouchEnd(this.handleTouchEnd.bind(this));
    }
    handleTouchStart(event) {
        const intersect = this.getIntersect(event);
        if (intersect) {
            switch (intersect.object.objectType) {
                case OBJECT_TYPE.CUBE:
                    // 不在转动中
                    if (!this.isRotating) {
                        // 触摸的是魔方
                        this.touchStartCube = intersect;
                        // 关闭视角转动
                        this.orbitControls.enabled = false;
                    }
                    break;
            }
        } else if (!this.isRotating){
            // 触摸的是空白区域
            this.touchStartCube = null;
        }
    }
    handleTouchMove(event) {
        const intersect = this.getIntersect(event);
        if (intersect) {
            switch (intersect.object.objectType) {
                case OBJECT_TYPE.CUBE:
                    if (this.touchStartCube && !this.isRotating) {
                        // 是从魔方上开始滑动的，并且没有正在滑动中
                        // 从开始触摸点到此点的差值，即为转动向量
                        const sub = intersect.point.sub(this.touchStartCube.point);
                        this.setDirection(sub);
                        this.rotateCubes();
                    }
                    break;
                default:
                    break;
            }
        }
    }
    handleTouchEnd(event) {
        this.orbitControls.enabled = true;
    }
    // 获取触摸点
    getIntersect(event) {
        const touch = event.touches[0];
        const raycaster = new Raycaster();
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const touchPoint = new Vector2(); // 当前触摸点
        touchPoint.x = ( touch.clientX / window.innerWidth ) * 2 - 1;
        touchPoint.y = - ( touch.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera(touchPoint, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const transCube = intersects.find(item => item.object.objectType === OBJECT_TYPE.CUBE_TRANSPARENT);
        if (transCube) {
            this.wordNormal = transCube.face.normal;
        }
        return intersects.find(item => item.object.objectType === OBJECT_TYPE.CUBE);
    }
    // 获取转动方向
    setDirection(vector3) {
        const xPositive = vector3.angleTo(DIRECTION_LINE.X_POSITIVE);
        const xNegative = vector3.angleTo(DIRECTION_LINE.X_NEGATIVE);
        const yPositive = vector3.angleTo(DIRECTION_LINE.Y_POSITIVE);
        const yNegative = vector3.angleTo(DIRECTION_LINE.Y_NEGATIVE);
        const zPositive = vector3.angleTo(DIRECTION_LINE.Z_POSITIVE);
        const zNegative = vector3.angleTo(DIRECTION_LINE.Z_NEGATIVE);
        const minAngle = Math.min(xPositive, xNegative, yPositive, yNegative, zPositive, zNegative);
        // 将魔方初始六个面分为正面、反面、上面、下面、右面，旋转方向须根据旋转面来综合判定
        switch (minAngle) {
            case xPositive:
                this.direction = this.getXDirection();
                break;
            case xNegative:
                this.direction = -this.getXDirection();
                break;
            case yPositive:
                this.direction = this.getYDirection();
                break;
            case yNegative:
                this.direction = -this.getYDirection();
                break;
            case zPositive:
                this.direction = this.getZDirection();
                break;
            case zNegative:
                this.direction = -this.getZDirection();
                break;
            default:
                break;
        }
    }
    // 沿X轴正方向滑动
    getXDirection() {
        const normalVector = this.wordNormal;
        if (normalVector.equals(DIRECTION_LINE.Z_POSITIVE)) {
            // 滑动的是正面
            return DIRECTION.Y_NEGATIVE;
        } else if (normalVector.equals(DIRECTION_LINE.Z_NEGATIVE)) {
            // 滑动的是反面
            return DIRECTION.Y_POSITIVE;
        } else if (normalVector.equals(DIRECTION_LINE.Y_POSITIVE)) {
            // 滑动的是上面
            return DIRECTION.Z_POSITIVE;
        } else if (normalVector.equals(DIRECTION_LINE.Y_NEGATIVE)) {
            // 滑动的是下面
            return DIRECTION.Z_NEGATIVE;
        }
    }
    // 沿Y轴正方向滑动
    getYDirection() {
        const normalVector = this.wordNormal;
        if (normalVector.equals(DIRECTION_LINE.Z_POSITIVE)) {
            // 滑动的是正面
            return DIRECTION.X_POSITIVE;
        } else if (normalVector.equals(DIRECTION_LINE.Z_NEGATIVE)) {
            // 滑动的是反面
            return DIRECTION.X_NEGATIVE;
        } else if (normalVector.equals(DIRECTION_LINE.X_POSITIVE)) {
            // 滑动的是右面
            return DIRECTION.Z_NEGATIVE;
        } else if (normalVector.equals(DIRECTION_LINE.X_NEGATIVE)) {
            // 滑动的是左面
            return DIRECTION.Z_POSITIVE;
        }
    }
    // 沿Z轴正方向滑动
    getZDirection() {
        const normalVector = this.wordNormal;
        if (normalVector.equals(DIRECTION_LINE.X_POSITIVE)) {
            // 滑动的是右面
            return DIRECTION.Y_POSITIVE;
        } else if (normalVector.equals(DIRECTION_LINE.X_NEGATIVE)) {
            // 滑动的是左面
            return DIRECTION.Y_NEGATIVE;
        } else if (normalVector.equals(DIRECTION_LINE.Y_POSITIVE)) {
            // 滑动的是上面
            return DIRECTION.X_NEGATIVE;
        } else if (normalVector.equals(DIRECTION_LINE.Y_NEGATIVE)) {
            // 滑动的是下面
            return DIRECTION.X_POSITIVE;
        }
    }
    // 获取旋转对象
    getRotateObject() {
        const touchCubeVector3 = this.touchStartCube.object.position;
        const numberToAxes = {
            1: 'x',
            2: 'y',
            3: 'z'
        };
        return this.cubeGroup.getSamePlaneCubes(touchCubeVector3, numberToAxes[Math.abs(this.direction)]);
    }
    // 旋转90度
    rotateCubes() {
        const rotateTimes = 50;
        switch (this.direction) {
            case DIRECTION.X_POSITIVE:
                this.rotateAnimation(0, rotateTimes, 'rotateAroundWordX', 1);
                break;
            case DIRECTION.X_NEGATIVE:
                this.rotateAnimation(0, rotateTimes, 'rotateAroundWordX', -1);
                break;
            case DIRECTION.Y_POSITIVE:
                this.rotateAnimation(0, rotateTimes, 'rotateAroundWordY', 1);
                break;
            case DIRECTION.Y_NEGATIVE:
                this.rotateAnimation(0, rotateTimes, 'rotateAroundWordY', -1);
                break;
            case DIRECTION.Z_POSITIVE:
                this.rotateAnimation(0, rotateTimes, 'rotateAroundWordZ', 1);
                break;
            case DIRECTION.Z_NEGATIVE:
                this.rotateAnimation(0, rotateTimes, 'rotateAroundWordZ', -1);
                break;
            default:
                break;
        }
    }
    /**
     * 旋转动画
     * @param {Number} current 当前已旋转部分
     * @param {Number} total 总共旋转时长
     * @param {String} funcName 调用的函数名称，如rotateAroundWordX、rotateAroundWordY、rotateAroundWordZ
     * @param {Number} pOrN 顺时针还是逆时针，1表示顺时针，-1表示逆时针
     */
    rotateAnimation(current, total, funcName, pOrN) {
        const cubes = this.getRotateObject();
        this.isRotating = true;
        if (current < total) {
            cubes.forEach(item => {
                item[funcName]((-1) * pOrN * (Math.PI * 90 / 180) / total);
            });
            requestAnimationFrame(() => {
                this.rotateAnimation(++current, total, funcName, pOrN);
            });
        } else {
            // 旋转之后，位置可能不是整数，手动将其设置为-10或0或10之一的整数
            cubes.forEach(item => {
                const { x, y, z } = item.position;
                item.position.set(Math.round(x / 10) * 10, Math.round(y / 10) * 10, Math.round(z / 10) * 10);
            });
            this.isRotating = false;
            this.touchStartCube = null;
        }
    }
}