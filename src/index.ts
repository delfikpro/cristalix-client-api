
export const alignMatrix = 0;
export const rotationMatrix = 1;
export const offsetMatrix = 2;
export const scaleMatrix = 3;
export const originMatrix = 4;

export const matrixFields = 5;

export const childrenAlignMatrix = -1;


export const matrixInfluence: number[][] = [];

export const offsetX = 0; matrixInfluence.push([offsetMatrix]);
export const offsetY = 1; matrixInfluence.push([offsetMatrix]);
export const offsetZ = 2; matrixInfluence.push([offsetMatrix]);
export const scaleX = 3; matrixInfluence.push([scaleMatrix]);
export const scaleY = 4; matrixInfluence.push([scaleMatrix]);
export const scaleZ = 5; matrixInfluence.push([scaleMatrix]);
export const alignX = 6; matrixInfluence.push([alignMatrix]);
export const alignY = 7; matrixInfluence.push([alignMatrix]);
export const alignZ = 8; matrixInfluence.push([alignMatrix]);
export const originX = 9; matrixInfluence.push([originMatrix]);
export const originY = 10; matrixInfluence.push([originMatrix]);
export const originZ = 11; matrixInfluence.push([originMatrix]);
export const rotationX = 12; matrixInfluence.push([rotationMatrix]);
export const rotationY = 13; matrixInfluence.push([rotationMatrix]);
export const rotationZ = 14; matrixInfluence.push([rotationMatrix]);
export const rotationAngle = 15; matrixInfluence.push([rotationMatrix]);

export const a = 16; matrixInfluence.push([]);
export const r = 17; matrixInfluence.push([]);
export const g = 18; matrixInfluence.push([]);
export const b = 19; matrixInfluence.push([]);

export const sizeX = 20; matrixInfluence.push([childrenAlignMatrix, originMatrix]);
export const sizeY = 21; matrixInfluence.push([childrenAlignMatrix, originMatrix]);
export const sizeZ = 22; matrixInfluence.push([childrenAlignMatrix, originMatrix]);

export const parentSizeX = 23; matrixInfluence.push([]);
export const parentSizeY = 24; matrixInfluence.push([]);
export const parentSizeZ = 25; matrixInfluence.push([]);

export const valueFields = 26;
