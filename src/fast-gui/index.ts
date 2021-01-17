/// <reference path="../../reference/cristalix.d.ts" />

// Positive numbers are matrices that are directly converted to GL transformations
export const alignMatrix = 0;
export const rotationMatrix = 1;
export const offsetMatrix = 2;
export const scaleMatrix = 3;
export const originMatrix = 4;

// Amount of direct GL matrices for preallocations
export const matrixFields = 5;

// Negative numbers are markers for non-gl properties updates to smh influence the gl matrices

// Examples of marker sizeMatrix being used:
// to update autoFit scale when text content changes; 
// to update align matrices of rect's children when its width/height changes
export const sizeMatrix = -1;
export const colorMatrix = -2;
export const uvMatrix = -3;

export const allMatrices = [alignMatrix, rotationMatrix, offsetMatrix, scaleMatrix, originMatrix, sizeMatrix, colorMatrix, uvMatrix];

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

export const colorA = 16; matrixInfluence.push([colorMatrix]);
export const colorR = 17; matrixInfluence.push([colorMatrix]);
export const colorG = 18; matrixInfluence.push([colorMatrix]);
export const colorB = 19; matrixInfluence.push([colorMatrix]);

export const parentSizeX = 20; matrixInfluence.push([alignMatrix]);
export const parentSizeY = 21; matrixInfluence.push([alignMatrix]);
export const parentSizeZ = 22; matrixInfluence.push([alignMatrix]);

export const sizeX = 23; matrixInfluence.push([sizeMatrix, originMatrix]);
export const sizeY = 24; matrixInfluence.push([sizeMatrix, originMatrix]);
export const sizeZ = 25; matrixInfluence.push([sizeMatrix, originMatrix]);

export const textureX = 26; matrixInfluence.push([uvMatrix]);
export const textureY = 27; matrixInfluence.push([uvMatrix]);
export const textureWidth = 28; matrixInfluence.push([uvMatrix]);
export const textureHeight = 29; matrixInfluence.push([uvMatrix]);

export const valueFields = 30;

export const leftMouseButton = 0;
export const rightMouseButton = 1;
export const middleMouseButton = 2;
