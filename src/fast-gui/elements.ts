/// <reference path="../../reference/cristalix.d.ts" />

import { AnimationFinisher, ElementData, RectData, ItemData, TextData, Rotation, V3 } from './api';
import { Color, colorParts2Hex, WHITE } from './colors';
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

    public beforeRender?: () => any;
    public afterRender?: () => any;

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
        if (x !== undefined) this.setProperty(index.offsetX, x, duration, easingId, onFinish);
        if (y !== undefined) this.setProperty(index.offsetY, y, duration, easingId, onFinish);
        if (z !== undefined) this.setProperty(index.offsetZ, z, duration, easingId, onFinish);
    }

    public addOffset(offset: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = offset.x === undefined ? undefined : (offset.x + this.properties[index.offsetX]);
        let y = offset.y === undefined ? undefined : (offset.y + this.properties[index.offsetY]);
        let z = offset.z === undefined ? undefined : (offset.z + this.properties[index.offsetZ]);
        this.setOffset({x, y, z}, duration, easingId, onFinish);
    }

    public setAlign(align: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = align.x;
        let y = align.y;
        let z = align.z;
        if (x !== undefined) this.setProperty(index.alignX, x, duration, easingId, onFinish);
        if (y !== undefined) this.setProperty(index.alignY, y, duration, easingId, onFinish);
        if (z !== undefined) this.setProperty(index.alignZ, z, duration, easingId, onFinish);
    }

    public addAlign(align: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = align.x === undefined ? undefined : (align.x + this.properties[index.alignX]);
        let y = align.y === undefined ? undefined : (align.y + this.properties[index.alignY]);
        let z = align.z === undefined ? undefined : (align.z + this.properties[index.alignZ]);
        this.setAlign({x, y, z}, duration, easingId, onFinish);
    }

    public setOrigin(origin: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = origin.x;
        let y = origin.y;
        let z = origin.z;
        if (x !== undefined) this.setProperty(index.originX, x, duration, easingId, onFinish);
        if (y !== undefined) this.setProperty(index.originY, y, duration, easingId, onFinish);
        if (z !== undefined) this.setProperty(index.originZ, z, duration, easingId, onFinish);
    }

    public addOrigin(origin: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = origin.x === undefined ? undefined : (origin.x + this.properties[index.originX]);
        let y = origin.y === undefined ? undefined : (origin.y + this.properties[index.originY]);
        let z = origin.z === undefined ? undefined : (origin.z + this.properties[index.originZ]);
        this.setOrigin({x, y, z}, duration, easingId, onFinish);
    }

    public setScale(scale: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = scale.x;
        let y = scale.y;
        let z = scale.z;
        if (x !== undefined) this.setProperty(index.scaleX, x, duration, easingId, onFinish);
        if (y !== undefined) this.setProperty(index.scaleY, y, duration, easingId, onFinish);
        if (z !== undefined) this.setProperty(index.scaleZ, z, duration, easingId, onFinish);
    }

    public addScale(scale: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = scale.x === undefined ? undefined : (scale.x + this.properties[index.scaleX]);
        let y = scale.y === undefined ? undefined : (scale.y + this.properties[index.scaleY]);
        let z = scale.z === undefined ? undefined : (scale.z + this.properties[index.scaleZ]);
        this.setScale({x, y, z}, duration, easingId, onFinish);
    }

    public setColor(color: Color, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let a = color.a;
        let r = color.r;
        let g = color.g;
        let b = color.b;
        if (a !== undefined) this.setProperty(index.colorA, a, duration, easingId, onFinish);
        if (r !== undefined) this.setProperty(index.colorR, r, duration, easingId, onFinish);
        if (g !== undefined) this.setProperty(index.colorG, g, duration, easingId, onFinish);
        if (b !== undefined) this.setProperty(index.colorB, b, duration, easingId, onFinish);
    }

    public addColor(color: Color, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let a = color.a === undefined ? undefined : (color.a + this.properties[index.colorA]);
        let r = color.r === undefined ? undefined : (color.r + this.properties[index.colorR]);
        let g = color.g === undefined ? undefined : (color.g + this.properties[index.colorG]);
        let b = color.b === undefined ? undefined : (color.b + this.properties[index.colorB]);
        this.setColor({a, r, g, b}, duration, easingId, onFinish);
    }

    public setRotation(rotation: Rotation, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = rotation.x;
        let y = rotation.y;
        let z = rotation.z;
        let angle = rotation.angle;
        if (angle !== undefined) this.setProperty(index.rotationAngle, angle, duration, easingId);
        if (x !== undefined) this.setProperty(index.rotationX, x, duration, easingId);
        if (y !== undefined) this.setProperty(index.rotationY, y, duration, easingId);
        if (z !== undefined) this.setProperty(index.rotationZ, z, duration, easingId);
    }

    public addRotation(angle: number, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        if (angle !== undefined) this.setProperty(index.rotationAngle, angle, duration, easingId, onFinish);
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
        if (!data.color) data.color = WHITE;
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
        let alpha = this.cachedHexColor >>> 24;

        // There is a weird behaviour of vanilla fontRenderer, that disables transparency if the alpha value is lower than 5.
        // Perhaps that's yet another bodge by mojang to quickly implement some cool font-related effect.
        // Anyways, that's quite unnoticable, so fastgui just discards these barely visible text elements.
        if (alpha < 5) return;

        if (alpha != 1) GlStateManager.enableBlend();
        fontRenderer.drawString(this.text, 0, fontRenderer.getUnicodeFlag() ? 0 : 1, this.cachedHexColor, this.shadow);

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
    
    public removeChild(...elements: AbstractElement[]) {
        for (let element of elements) {
            let index = this.children.indexOf(element);
            this.children.splice(index, 1);
        }
    }

    public addChild(...elements: AbstractElement[]) {

        for (let element of elements) {
            element.setProperty(index.parentSizeX, this.properties[index.sizeX]);
            element.setProperty(index.parentSizeY, this.properties[index.sizeY]);
        }

        this.children.push(...elements);

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
            GL11.glColor4f(
                properties[index.colorR],
                properties[index.colorG],
                properties[index.colorB],
                properties[index.colorA],
            );

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
        if (x !== undefined) this.setProperty(index.sizeX, x, duration, easingId, onFinish);
        if (y !== undefined) this.setProperty(index.sizeY, y, duration, easingId, onFinish);
        if (z !== undefined) this.setProperty(index.sizeZ, z, duration, easingId, onFinish);
    }

    public addSize(size: V3, duration?: number, easingId?: number, onFinish?: AnimationFinisher): void {
        let x = size.x === undefined ? undefined : (size.x + this.properties[index.sizeX]);
        let y = size.y === undefined ? undefined : (size.y + this.properties[index.sizeY]);
        let z = size.z === undefined ? undefined : (size.z + this.properties[index.sizeZ]);
        this.setSize({x, y, z}, duration, easingId, onFinish);
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