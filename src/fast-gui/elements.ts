/// <reference path="../../reference/cristalix.d.ts" />

import { AnimationFinisher, ElementData, RectData, ItemData, TextData, Rotation, V3 } from './api';
import { Color, colorParts2Hex } from './colors';
import { runningAnimations, Animation } from './fast-gui';
import * as index from './index';

export const buffer = GLAllocation.createDirectFloatBuffer(16);
const glPushMatrix = GL11.glPushMatrix;
const glPopMatrix = GL11.glPopMatrix;
const glMultMatrix = GL11.glMultMatrix;
const glColor = GL11.glColor4f;

export abstract class AbstractElement {

    public properties: number[];
    public matrices: Matrix4f[];
    public enabled: boolean;
    public dirtyMatrices: number[];
    public hovered: boolean;

    public beforeRender?: () => void;
    public afterRender?: () => void;

    public passedHoverCulling: boolean;
    public cachedHexColor: number;

    public onHover?: (element: AbstractElement, hovered: boolean) => void;
    public onClick?: (element: AbstractElement, down: boolean, button: number) => void;

    constructor(data: ElementData) {

        let { offset, scale, align, origin, rotation, enabled, color } = data;

        this.enabled = enabled == null ? true : enabled;

        let matrices = new Array<Matrix4f>(index.matrixFields);
        let properties = new Array<number>(index.valueFields);

        // NativeRuntime.fillIntArray(properties, 0, properties.length, 0);
        for (let i = 0; i < properties.length; i++) {
            properties[i] = 0;
        }

        this.properties = properties;
        this.matrices = matrices;

        if (offset) this.setOffset(offset);

        this.setProperty(index.scaleX, scale && scale.x ? scale.x : 1);
        this.setProperty(index.scaleY, scale && scale.y ? scale.y : 1);
        this.setProperty(index.scaleZ, scale && scale.z ? scale.z : 1);

        if (align) this.setAlign(align);

        if (origin) this.setOrigin(origin);
        
        if (rotation && rotation.x) this.setProperty(index.rotationX, rotation.x);
        if (rotation && rotation.y) this.setProperty(index.rotationY, rotation.y);
        this.setProperty(index.rotationZ, rotation ? (rotation.z || 0) : 1);
        if (rotation && rotation.angle) this.setProperty(index.rotationAngle, rotation.angle);

        if (color) {
            this.setProperty(index.colorA, color.a == undefined ? 1 : color.a);
            this.setProperty(index.colorR, color.r == undefined ? 1 : color.r);
            this.setProperty(index.colorG, color.g == undefined ? 1 : color.g);
            this.setProperty(index.colorB, color.b == undefined ? 1 : color.b);
        }
        
        this.setProperty(index.parentSizeX, 0);
        this.setProperty(index.parentSizeY, 0);
        this.setProperty(index.parentSizeZ, 0);
        // );

        this.onClick = data.onClick || null;
        this.onHover = data.onHover || null;
        this.beforeRender = data.beforeRender || null;
        this.afterRender = data.afterRender || null;

    };

    public applyTransformations(): void {

        if (!this.enabled) return;

        this.cleanMatrices();

        for (let i = 0; i < index.matrixFields; i++) {
            let matrix = this.matrices[i];
            if (matrix) {
                matrix.store(buffer);
                buffer.flip();
                glMultMatrix(buffer);
            }
        }
    }

    public setOffset(offset: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = offset.x;
        let y = offset.y;
        let z = offset.z;
        if ((x !== undefined) && (x === x)) this.setProperty(index.offsetX, x, duration, easingId, onFinish);
        if ((y !== undefined) && (y === y)) this.setProperty(index.offsetY, y, duration, easingId, onFinish);
        if ((z !== undefined) && (z === z)) this.setProperty(index.offsetZ, z, duration, easingId, onFinish);
    }

    public addOffset(offset: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setOffset({
            x: this.properties[index.offsetX] + offset.x,
            y: this.properties[index.offsetY] + offset.y,
            z: this.properties[index.offsetZ] + offset.z,
        }, duration, easingId, onFinish);
    }

    public setAlign(align: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = align.x;
        let y = align.y;
        let z = align.z;
        if (x !== undefined && x === x) this.setProperty(index.alignX, x, duration, easingId, onFinish);
        if (y !== undefined && y === y) this.setProperty(index.alignY, y, duration, easingId, onFinish);
        if (z !== undefined && z === z) this.setProperty(index.alignZ, z, duration, easingId, onFinish);
    }

    public addAlign(align: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setAlign({
            x: this.properties[index.alignX] + align.x,
            y: this.properties[index.alignY] + align.y,
            z: this.properties[index.alignZ] + align.z,
        }, duration, easingId, onFinish);
    }

    public setOrigin(origin: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = origin.x;
        let y = origin.y;
        let z = origin.z;
        if (x !== undefined && x === x) this.setProperty(index.originX, x, duration, easingId, onFinish);
        if (y !== undefined && y === y) this.setProperty(index.originY, y, duration, easingId, onFinish);
        if (z !== undefined && z === z) this.setProperty(index.originZ, z, duration, easingId, onFinish);
    }

    public addOrigin(origin: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setOrigin({
            x: this.properties[index.originX] + origin.x,
            y: this.properties[index.originY] + origin.y,
            z: this.properties[index.originZ] + origin.z,
        }, duration, easingId, onFinish);
    }

    public setScale(scale: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = scale.x;
        let y = scale.y;
        let z = scale.z;
        if (x !== undefined && x === x) this.setProperty(index.scaleX, x, duration, easingId, onFinish);
        if (y !== undefined && y === y) this.setProperty(index.scaleY, y, duration, easingId, onFinish);
        if (z !== undefined && z === z) this.setProperty(index.scaleZ, z, duration, easingId, onFinish);
    }

    public addScale(scale: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setAlign({
            x: this.properties[index.scaleX] + scale.x,
            y: this.properties[index.scaleY] + scale.y,
            z: this.properties[index.scaleZ] + scale.z,
        }, duration, easingId, onFinish);
    }

    public setColor(color: Color, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let a = color.a;
        let r = color.r;
        let g = color.g;
        let b = color.b;
        if (a !== undefined && a === a) this.setProperty(index.colorA, a, duration, easingId, onFinish);
        if (r !== undefined && r === r) this.setProperty(index.colorR, r, duration, easingId, onFinish);
        if (g !== undefined && g === g) this.setProperty(index.colorG, g, duration, easingId, onFinish);
        if (b !== undefined && b === b) this.setProperty(index.colorB, b, duration, easingId, onFinish);
    }

    public addColor(color: Color, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setColor({
            a: this.properties[index.colorA] + color.a,
            r: this.properties[index.colorR] + color.r,
            g: this.properties[index.colorG] + color.g,
            b: this.properties[index.colorB] + color.b,
        }, duration, easingId, onFinish);
    }

    public setRotation(rotation: Rotation, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = rotation.x;
        let y = rotation.y;
        let z = rotation.z;
        let angle = rotation.angle;
        if (angle !== undefined && angle == angle) this.setProperty(index.rotationAngle, angle, duration, easingId);
        if (x !== undefined && x === x) this.setProperty(index.rotationX, x, duration, easingId);
        if (y !== undefined && y === y) this.setProperty(index.rotationY, y, duration, easingId);
        if (z !== undefined && z === z) this.setProperty(index.rotationZ, z, duration, easingId);
    }

    public addRotation(angle: number, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setProperty(index.rotationAngle, angle, duration, easingId, onFinish);
    }

    public setProperty(propertyId: number, value: number, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        if (duration) {
            let animation: Animation;
            for (let existing of runningAnimations) {
                if (existing.element === this && existing.propertyId === propertyId) {
                    animation = existing;
                    break;
                }
            }
            if (!animation) animation = new Animation(this, propertyId);
            animation.newTarget(value, duration, easingId, onFinish);
            runningAnimations.push(animation);
            return;
        }
        // stdout.println('setting ' + propertyId + ' to ' + value);
        this.properties[propertyId] = value;
        let influence = index.matrixInfluence[propertyId];
        if (influence.length) {
            this.markDirty(influence);
        }
    }

    public markDirty(matrixIds: number[]) {
        if (!this.dirtyMatrices) this.dirtyMatrices = [];
        loop: for (let matrixId of matrixIds) {
            for (let dirtyMatrix of this.dirtyMatrices) {
                if (dirtyMatrix == matrixId) continue loop;
            }
            // stdout.println('Marking ' + matrixId + ' as dirty');
            this.dirtyMatrices.push(matrixId);
        }
    }

    public cleanMatrices(): void {
        let dirty = this.dirtyMatrices;
        if (!dirty || !dirty.length) return;
        for (let dirtyMatrixId of dirty) {
            if (dirtyMatrixId == -128) continue;
            this.updateMatrix(dirtyMatrixId);
        }
        this.dirtyMatrices = null;
    }

    public updateMatrix(matrixId: number): void {
        // stdout.println('updating matrix ' + matrixId)
        let properties = this.properties;
        if (this.dirtyMatrices) {
            this.dirtyMatrices[this.dirtyMatrices.indexOf(matrixId)] = -128;
        }


        if (matrixId == index.colorMatrix) {
            this.cachedHexColor = colorParts2Hex(
                properties[index.colorA],
                properties[index.colorR],
                properties[index.colorG],
                properties[index.colorB],
            )
        }


        if (matrixId >= 0) {
            let matrix: Matrix4f = new Matrix4f().setIdentity();
            switch (matrixId) {
                case index.alignMatrix:
                    matrix.translate(new Vector3f(
                        properties[index.alignX] * properties[index.parentSizeX],
                        properties[index.alignY] * properties[index.parentSizeY],
                        properties[index.alignZ] * properties[index.parentSizeZ]
                    ));
                    break;
                case index.rotationMatrix:
                    matrix.rotate(properties[index.rotationAngle], new Vector3f(
                        properties[index.rotationX],
                        properties[index.rotationY],
                        properties[index.rotationZ]
                    ));
                    break;
                case index.offsetMatrix:
                    matrix.translate(new Vector3f(
                        properties[index.offsetX],
                        properties[index.offsetY],
                        properties[index.offsetZ]
                    ));
                    break;
                case index.scaleMatrix:
                    matrix.scale(new Vector3f(
                        properties[index.scaleX],
                        properties[index.scaleY],
                        properties[index.scaleZ]
                    ));
                    break;
                case index.originMatrix:
                    matrix.translate(new Vector3f(
                        -properties[index.originX] * properties[index.sizeX],
                        -properties[index.originY] * properties[index.sizeY],
                        -properties[index.originZ] * properties[index.sizeZ]
                    ));
                    break;
            }
            this.matrices[matrixId] = matrix;
        }
    }

    public transformAndRender(): void {
        if (!this.enabled) return;

        glPushMatrix();
        this.cleanMatrices();
        this.applyTransformations();

        if (this.beforeRender) this.beforeRender();

        this.render();

        if (this.afterRender) this.afterRender();

        glPopMatrix();
    }

    protected abstract render(): void;

}


export class TextElement extends AbstractElement {

    public text?: string;
    public autoFit: boolean;
    public shadow: boolean;

    constructor(data: TextData) {
        super(data);
        this.text = data.text || "";
        this.shadow = !!data.shadow;
        this.autoFit = !!data.autoFit;
        this.setProperty(index.sizeX, fontRenderer.getStringWidth(this.text));
        this.properties[index.sizeY] = 9;
    }

    public updateMatrix(matrixId: number): void {
        if ((matrixId == index.sizeMatrix || matrixId == index.scaleMatrix) && this.autoFit) {
            let textWidth = this.properties[index.sizeX];
            let parentWidth = this.properties[index.parentSizeX];
            if (textWidth) {
                let factor = (parentWidth - 2) / textWidth;
                if (factor < 1) this.properties[index.scaleX] = factor;
            }
        }
        super.updateMatrix(matrixId);
    }

    setText(text: string) {
        this.text = text;
        this.setProperty(index.sizeX, Draw.getStringWidth(text));
    }

    render(): void {
        // GL11.glDepthFunc(GL11.GL_LESS);
        // GlStateManager.disableDepth();

        // ToDo: colored text
        fontRenderer.drawString(this.text, 0, fontRenderer.getUnicodeFlag() ? 0 : 1, -1, this.shadow);

        // GL11.glDepthFunc(GL11.GL_LEQUAL);
        // GlStateManager.enableDepth();

    }

}

export class RectangleElement extends AbstractElement {

    public children: AbstractElement[];
    public texture: string | ResourceLocation;

    constructor(data: RectData) {
        super(data);
        
        if (data.size) {
            if (data.size.x) this.setProperty(index.sizeX, data.size.x);
            if (data.size.y) this.setProperty(index.sizeY, data.size.y);
        }

        let texture = data.texture;

        if (texture) {
            let start = texture.start;
            if (start) {
                if (start.x) this.setProperty(index.textureX, start.x);
                if (start.y) this.setProperty(index.textureY, start.y);
            }
    
            this.texture = texture.resource || null;
        }

        this.setProperty(index.textureWidth, (texture && texture.size) ? texture.size.x || 1 : 1);
        this.setProperty(index.textureHeight, (texture && texture.size) ? texture.size.y || 1 : 1);


        this.children = data.children || [];

    }

    updateMatrix(matrixId: number): void {

        if (matrixId === index.sizeMatrix) {
            let properties = this.properties;
            for (let child of this.children) {
                let childProperties = child.properties;
                childProperties[index.parentSizeX] = properties[index.sizeX];
                childProperties[index.parentSizeY] = properties[index.sizeY];
                childProperties[index.parentSizeZ] = properties[index.sizeZ];
                child.updateMatrix(index.alignMatrix);
            }
        }

        super.updateMatrix(matrixId);

    }

    render(): void {
        
        let properties = this.properties;

        if (this.texture) {
            GlStateManager.enableBlend();
            Textures.bindTexture(this.texture);
            GL11.glColor4f(1, 1, 1, 1);

            let precision = 0x4000_0000;

            Draw.drawScaledCustomSizeModalRect(0, 0, 
                properties[index.textureX] * precision, 
                properties[index.textureY] * precision, 
                properties[index.textureWidth] * precision, 
                properties[index.textureHeight] * precision, 
                properties[index.sizeX], 
                properties[index.sizeY], 
                precision,
                precision
            );
        }
        else {
            Draw.drawRect(0, 0, properties[index.sizeX], properties[index.sizeY], this.cachedHexColor);
        }

        for (let child of this.children) {
            child.transformAndRender();
        }

    }

    public setSize(size: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = size.x;
        let y = size.y;
        let z = size.z;
        if (x !== undefined && x === x) this.setProperty(index.sizeX, x, duration, easingId, onFinish);
        if (y !== undefined && y === y) this.setProperty(index.sizeY, y, duration, easingId, onFinish);
        if (z !== undefined && z === z) this.setProperty(index.sizeZ, z, duration, easingId, onFinish);
    }

    public addSize(size: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        this.setSize({
            x: this.properties[index.sizeX] + size.x,
            y: this.properties[index.sizeY] + size.y,
            z: this.properties[index.sizeZ] + size.z,
        }, duration, easingId, onFinish);
    }


}

export class ItemElement extends AbstractElement {

    item: ItemStack;

    constructor(data: ItemData) {
        super(data);
        this.item = data.item;
        this.setProperty(index.sizeX, 16);
        this.setProperty(index.sizeY, 16);
    }

    render(): void {
        RenderHelper.enableGUIStandardItemLighting();
        Draw.renderItemAndEffectIntoGUI(this.item, 0, 0);
        RenderHelper.disableStandardItemLighting();
    }
}