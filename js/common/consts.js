import { Vector3 } from '../libs/three.min.js';
// 空间中的模型类型
export const OBJECT_TYPE = {
    CUBE: 'Cube',
    CUBE_GROUP: 'CubeGroup',
    CUBE_TRANSPARENT: 'CubeTransparent'
};

// 魔方转动的方向向量
export const DIRECTION_LINE = {
    X_POSITIVE: new Vector3(1, 0, 0), // x轴正方向
    X_NEGATIVE: new Vector3(-1, 0, 0), // x轴负方向
    Y_POSITIVE: new Vector3(0, 1, 0), // y轴正方向
    Y_NEGATIVE: new Vector3(0, -1, 0), // y轴负方向
    Z_POSITIVE: new Vector3(0, 0, 1), // z轴正方向
    Z_NEGATIVE: new Vector3(0, 0, -1) // z轴负方向
};

// 魔方转动的方向，顺时针逆时针皆是从坐标轴正方向看过去
export const DIRECTION = {
    X_POSITIVE: 1, // 绕x轴顺时针旋转90度
    X_NEGATIVE: -1, // 绕x轴逆时针旋转90度
    Y_POSITIVE: 2, // 绕y轴顺时针旋转90度
    Y_NEGATIVE: -2, // 绕y轴逆时针旋转90度
    Z_POSITIVE: 3, // 绕z轴顺时针旋转90度
    Z_NEGATIVE: -3  // 绕z轴逆时针旋转90度
};