/// <reference path="../reference/cristalix.d.ts" />

import * as easing from './easing';
import * as index from './index';
import { number } from './simple-nbt';
import * as vecmath from './vecmath';
// import * as renderhelper from './renderhelper';


const glPushMatrix = GL11.glPushMatrix;
const glPopMatrix = GL11.glPopMatrix;
const glMultMatrixf = GL11.glMultMatrixf;
const glColor = GL11.glColor4f;

export const CENTER = { x: 0.5, y: 0.5 };
export const LEFT = { x: 0, y: 0.5 };
export const RIGHT = { x: 1, y: 0.5 };
export const TOP = { x: 0.5, y: 0 };
export const BOTTOM = { x: 0.5, y: 1 };
export const TOP_RIGHT = { x: 1, y: 0 };
export const TOP_LEFT = { x: 0, y: 0 };
export const BOTTOM_RIGHT = { x: 1, y: 1 };
export const BOTTOM_LEFT = { x: 0, y: 1 };

export type Callback = () => void;

export class Animation {

    startedTime: number = 0;
    duration: number = 0;
    startValue: number = 0;
    targetValue: number = 0;
    easingId: number = 0;
    lastValue: number;

    constructor(
        public readonly element: Element,
        public readonly propertyId: number,
    ) {
        this.targetValue = this.lastValue = element.properties[propertyId];
    }

    public newTarget(value: number, duration: number, easingId: number): void {

        this.startValue = this.lastValue;
        this.targetValue = value;
        this.startedTime = getTime();
        this.duration = duration;
        this.easingId = easingId;

    }

    public update(time: number): boolean {
        // if (!this.startedTime) return NaN;
        let part = (time - this.startedTime) / this.duration;
        let alive = part <= 1.0;
        let value: number;
        if (alive) {
            let easingId = this.easingId;
            if (easingId) part = NativeRuntime.ease(part, easingId);
            let startValue = this.startValue;
            value = startValue + (this.targetValue - startValue) * part;
        } else {
            this.startedTime = 0.0;
            value = this.targetValue;
        }
        this.lastValue = value;
        this.element.setProperty(this.propertyId, value);
        return alive;
    }

}

export type V2 = { x?: number, y?: number };
export type V3 = V2 & { z?: number };
export type Rotation = V3 & { angle: number };

export type Texture = {
    resource: string,
    resourceWidth?: number | 256;
    resourceHeight?: number | 256;

    uMin?: number;
    vMin?: number;
    uDelta?: number;
    vDelta?: number;
}

export type ElementData = {

    offset?: V3;
    align?: V3;
    origin?: V3;
    scale?: V3;
    rotation?: Rotation;
    enabled?: boolean;
    beforeRender?: () => {};
    afterRender?: () => {};

}

export type RectData = {

    texture?: Texture;
    color?: Color;
    size?: V3;

}


export type Color = {
    a?: number,
    r?: number,
    g?: number,
    b?: number;
}

export function color2Hex(color: Color): number {
    return colorParts2Hex(color.a, color.r, color.g, color.b);
}

export function colorParts2Hex(a: number, r: number, g: number, b: number): number {
    return a * 255 << 24 |
        r * 255 << 16 |
        g * 255 << 8 |
        b * 255;
}

export function hex2Color(value: number, includeAlpha?: boolean): Color {
    let a = includeAlpha ? ((value >> 24) & 0xFF) / 255.0 : 1;
    let r = ((value >> 16) & 0xFF) / 255.0;
    let g = ((value >> 8) & 0xFF) / 255.0;
    let b = (value & 0xFF) / 255.0;
    return { a: a, r: r, g: g, b: b };
}


export function getTime(): number {
    return System.currentTimeMillis();
}

export type MouseHandler = (screenState: ScreenState) => void;


export type ItemData = {
    readonly item: ItemStack
} & ElementData


export type TextData = {
    readonly text?: string;
    readonly shadow?: boolean;
    readonly autoFit?: boolean;
} & ElementData


export type ScreenState = {
    factor: number,
    width: number;
    height: number;
    mouseX: number;
    mouseY: number;
    time: number;
    leftClick: boolean;
    rightClick: boolean;
}

var runningAnimations: Animation[] = [];

function updateAnimations() {
    let time = getTime();
    let newRunningAnimations: Animation[] = [];
    for (let animation of runningAnimations) {
        if (animation.update(time)) newRunningAnimations.push(animation);
    }
    for (let animation of runningAnimations) {
        let element = animation.element;
        let dirty = element.dirtyMatrices;
        if (!dirty || !dirty.length) continue;
        for (let dirtyMatrixId of dirty) {
            if (dirtyMatrixId == -2) continue;
            element.updateMatrix(dirtyMatrixId);
        }
        element.dirtyMatrices = null;
    }
    runningAnimations = newRunningAnimations
}

function updateClickables(ss: ScreenState) {

    overlay.

}

export abstract class Element {

    properties: number[];
    matrices: Matrix4f[];
    enabled: boolean;
    dirtyMatrices: number[];
    beforeRender?: () => void;
    afterRender?: () => void;

    constructor(data: ElementData) {

        let { offset, scale, align, origin, rotation, enabled } = data;

        this.enabled = enabled == null ? true : enabled;

        let properties = new Array<number>(index.valueFields);
        let matrices = new Array<Matrix4f>(index.matrixFields);

        this.properties = properties;
        this.matrices = matrices;

        for (let i = 0; i < index.matrixFields; i++) {
            matrices.push(null);
        }

        properties.push(
            offset ? (offset.x || 0) : 0,
            offset ? (offset.y || 0) : 0,
            offset ? (offset.z || 0) : 0,
            scale ? (scale.x || 0) : 0,
            scale ? (scale.y || 0) : 0,
            scale ? (scale.z || 0) : 0,
            align ? (align.x || 0) : 0,
            align ? (align.y || 0) : 0,
            align ? (align.z || 0) : 0,
            origin ? (origin.x || 0) : 0,
            origin ? (origin.y || 0) : 0,
            origin ? (origin.z || 0) : 0,
            rotation ? (rotation.x || 0) : 0,
            rotation ? (rotation.y || 0) : 0,
            rotation ? (rotation.z || 0) : 1,
            rotation ? (rotation.angle || 0) : 0
        );

    };

    public applyTransformations(): void {

        if (!this.enabled) return;

        for (let i = 0; i < index.matrixFields; i++) {
            let matrix = this.matrices[i];
            if (matrix) {
                let buffer = GLAllocation.createDirectFloatBuffer(16);
                matrix.store(buffer);
                glMultMatrixf(buffer);
                GLAllocation.freeBuffer(buffer);
            }
        }
    }

    public setOffset(offset: V3, duration?: number, easingId?: number): void {
        let x = offset.x;
        let y = offset.y;
        let z = offset.z;
        if (x !== undefined) this.setProperty(index.offsetX, x, duration, easingId);
        if (y !== undefined) this.setProperty(index.offsetY, y, duration, easingId);
        if (z !== undefined) this.setProperty(index.offsetZ, z, duration, easingId);
    }

    public setAlign(align: V3, duration?: number, easingId?: number): void {
        let x = align.x;
        let y = align.y;
        let z = align.z;
        if (x !== undefined) this.setProperty(index.alignX, x, duration, easingId);
        if (y !== undefined) this.setProperty(index.alignY, y, duration, easingId);
        if (z !== undefined) this.setProperty(index.alignZ, z, duration, easingId);
    }

    public setOrigin(origin: V3, duration?: number, easingId?: number): void {
        let x = origin.x;
        let y = origin.y;
        let z = origin.z;
        if (x !== undefined) this.setProperty(index.originX, x, duration, easingId);
        if (y !== undefined) this.setProperty(index.originY, y, duration, easingId);
        if (z !== undefined) this.setProperty(index.originZ, z, duration, easingId);
    }

    public setScale(scale: V3, duration?: number, easingId?: number): void {
        let x = scale.x;
        let y = scale.y;
        let z = scale.z;
        if (x !== undefined) this.setProperty(index.scaleX, x, duration, easingId);
        if (y !== undefined) this.setProperty(index.scaleY, y, duration, easingId);
        if (z !== undefined) this.setProperty(index.scaleZ, z, duration, easingId);
    }

    public setRotation(rotation: Rotation, duration?: number, easingId?: number): void {
        let x = rotation.x;
        let y = rotation.y;
        let z = rotation.z;
        let angle = rotation.angle;
        if (angle !== undefined) this.setProperty(index.rotationAngle, angle, duration, easingId);
        if (x !== undefined) this.setProperty(index.rotationX, x, duration, easingId);
        if (y !== undefined) this.setProperty(index.rotationY, y, duration, easingId);
        if (z !== undefined) this.setProperty(index.rotationZ, z, duration, easingId);
    }

    public setProperty(propertyId: number, value: number, duration?: number, easingId?: number): void {
        if (duration) {
            let animation: Animation;
            for (let existing of runningAnimations) {
                if (existing.element === this && existing.propertyId === propertyId) {
                    animation = existing;
                    break;
                }
            }
            if (!animation) animation = new Animation(this, propertyId);
            animation.newTarget(value, duration, easingId);
            runningAnimations.push(animation);
            return;
        }
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
            this.dirtyMatrices.push(matrixId);
        }
    }

    public updateMatrix(matrixId: number): void {
        let matrix: Matrix4f = new Matrix4f().setIdentity();
        let properties = this.properties;
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
        if (this.dirtyMatrices) {
            this.dirtyMatrices[this.dirtyMatrices.indexOf(matrixId)] = -2;
        }
        this.matrices[matrixId] = matrix;
    }

    public abstract render(time: number, parentWidth: number, parentHeight: number): void;

    public abstract checkHovered(screenState: ScreenState, parentWidth: number, parentHeight: number): void;

}

export function text(data: TextData): Text {
    return new Text(data);
}

export class Text extends Element {

    public text?: string;
    public autoFit: boolean;
    public shadow: boolean;

    constructor(data: TextData) {
        super(data);
        this.text = data.text || "";
        this.shadow = !!data.shadow;
        this.autoFit = !!data.autoFit;
    }

    setText(text: string) {
        this.text = text;
        this.setProperty(index.sizeX, Draw.getStringWidth(text));
    }

    render(time: number, parentWidth: number, parentHeight: number): void {
        if (!this.enabled) return;

        let textWidth = Draw.getStringWidth(this.text);
        let textHeight = 9;

        if (textWidth && this.autoFit) {
            let factor = (parentWidth - 2) / textWidth;
            if (factor < 1) this.scale.value = factor;
        }

        pushMatrix();
        super.prepare(time, parentWidth, parentHeight, textWidth, textHeight);

        // GL11.glDepthFunc(GL11.GL_LESS);
        // GlStateManager.disableDepth();

        if (this.scale.value) Draw.drawString(this.text, 0, fontRenderer.getUnicodeFlag() ? 0 : 1, -1, this.shadow);

        // GL11.glDepthFunc(GL11.GL_LEQUAL);
        // GlStateManager.enableDepth();
        popMatrix();

    }

    checkHovered(screenState: ScreenState, parentWidth: number, parentHeight: number): void { }

}

export function rect(data: BoxData): Box {
    return new Box(data);
}

export class Box extends Element {

    public children: Element[];
    public texture: string | ResourceLocation;
    public uMin: number;
    public vMin: number;
    public uDelta: number;
    public vDelta: number;
    public textureWidth: number;
    public textureHeight: number;
    public temp_magic: boolean;
    public onLeftClick: MouseHandler;
    public onRightClick: MouseHandler;
    public onHover: (screenState: ScreenState, hovered: boolean) => void;
    public afterRender: () => void;
    public beforeRender: () => void;
    public hovered: boolean = false;

    constructor(data: BoxData) {
        super(data);

        this.width = new Animatable(data.width || 0);
        this.height = new Animatable(data.height || 0);
        this.children = data.children || [];
        this.texture = data.texture || null;
        this.onLeftClick = data.onLeftClick || null;
        this.onRightClick = data.onRightClick || null;
        this.onHover = data.onHover || null;
        this.uMin = data.uMin || 0;
        this.vMin = data.vMin || 0;
        this.uDelta = data.uDelta || 256;
        this.vDelta = data.vDelta || 256;
        this.textureWidth = data.textureWidth || 256;
        this.textureHeight = data.textureHeight || 256;
        this.temp_magic = !!data.temp_magic;
        this.beforeRender = data.beforeRender || null;
        this.afterRender = data.afterRender || null;

    }

    updateMatrix(matrixId: number): void {

        if (matrixId >= 0) {
            super.updateMatrix(matrixId);
            return
        }
        if (matrixId === -1) {
            let properties = this.properties;
            for (let child of this.children) {
                let childProperties = child.properties;
                childProperties[index.parentSizeX] = properties[index.sizeX];
                childProperties[index.parentSizeY] = properties[index.sizeY];
                childProperties[index.parentSizeZ] = properties[index.sizeZ];
                child.updateMatrix(index.alignMatrix);
            }
        }
    }

    render(time: number, parentWidth: number, parentHeight: number): void {
        if (!this.enabled) return;

        this.width.update(time);
        this.height.update(time);

        let width = this.width.value;
        let height = this.height.value;

        pushMatrix();
        super.prepare(time, parentWidth, parentHeight, width, height);

        this.render0(width, height);


        translate(0, 0, 0.01);
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].render(time, width, height);
        }

        popMatrix();

    }

    render0(width: number, height: number) {

        if (this.scale.value) {

            if (this.beforeRender) this.beforeRender();

            if (this.texture) {
                GlStateManager.enableBlend();
                Textures.bindTexture(this.texture);
                color(
                    this.a.value,
                    this.r.value,
                    this.g.value,
                    this.b.value
                );
                Draw.drawScaledCustomSizeModalRect(0, 0, this.uMin, this.vMin, this.uDelta, this.vDelta, width, height, this.textureWidth, this.textureHeight);
            }
            else {
                Draw.drawRect(0, 0, width, height, this.lastColor);
            }
            if (this.afterRender) this.afterRender();
        }
    }

    checkHovered(ss: ScreenState, parentWidth: number, parentHeight: number): void {

        if (!this.enabled) return;

        // if (!stack.enabled || !(this.children.length || action)) return;

        let originX = this.originX.value;
        let originY = this.originY.value;
        let alignX = this.alignX.value;
        let alignY = this.alignY.value;
        let width = this.width.value;
        let height = this.height.value;
        let scale = this.scale.value;
        let x = this.x.value;
        let y = this.y.value;

        ss.stackX += parentWidth * alignX * ss.stackScale;
        ss.stackY += parentHeight * alignY * ss.stackScale;
        ss.stackX += x * ss.stackScale;
        ss.stackY += y * ss.stackScale;
        ss.stackScale *= scale;
        ss.stackX -= width * originX * ss.stackScale;
        ss.stackY -= height * originY * ss.stackScale;

        let dx = ss.mouseX - ss.stackX;
        let dy = ss.mouseY - ss.stackY;

        let hovered = dx >= 0 && dx < width * ss.stackScale && dy >= 0 && dy < height * ss.stackScale;
        if (this.hovered != hovered && this.onHover) {
            this.onHover(ss, hovered);
        }
        this.hovered = hovered;

        if (this.hovered) {
            if (ss.leftClick && this.onLeftClick) this.onLeftClick(ss);
            if (ss.rightClick && this.onRightClick) this.onRightClick(ss);
        }

        for (let child of this.children)
            child.checkHovered(ss, parentWidth, parentHeight);

        // str = "stack: " + ss.stackX + " " + ss.stackY + " " + ss.stackScale + 
        //  ", d: " + dx + " " + dy + ", pos: " + this.stack.x.value + " " + this.stack.y.value;

        ss.stackX += width * originX * ss.stackScale;
        ss.stackY += height * originY * ss.stackScale;
        ss.stackScale /= scale;
        ss.stackX -= x * ss.stackScale;
        ss.stackY -= y * ss.stackScale;
        ss.stackX -= parentWidth * alignX * ss.stackScale;
        ss.stackY -= parentHeight * alignY * ss.stackScale;

    }

}

export class Item extends Element {

    item: ItemStack;

    constructor(data: ItemData) {
        super(data);
        this.item = data.item;
    }

    render(time: number, parentWidth: number, parentHeight: number): void {
        if (!this.enabled) return;

        pushMatrix();
        RenderHelper.enableGUIStandardItemLighting();
        // GL11.glTranslatef(0, 0, +100);
        super.prepare(time, parentWidth, parentHeight, 16, 16);
        Draw.renderItemAndEffectIntoGUI(this.item, this.x.value, this.y.value);
        RenderHelper.disableStandardItemLighting();
        popMatrix();

    }

    checkHovered(screenState: ScreenState, parentWidth: number, parentHeight: number): void { }

}


export function getScreenState(): ScreenState {
    let factor = Draw.getResolution().getScaleFactor();
    let screenWidth = Display.getWidth() / factor;
    let screenHeight = Display.getHeight() / factor;
    let mouseX = Mouse.getX() / factor;
    let mouseY = screenHeight - Mouse.getY() / factor;
    let leftClick = Mouse.isButtonDown(0);
    let rightClick = Mouse.isButtonDown(1);
    let time = getTime();
    return {
        factor: factor,
        width: screenWidth,
        height: screenHeight,
        mouseX: mouseX,
        mouseY: mouseY,
        time: time,
        leftClick: leftClick,
        rightClick: rightClick,
        stackX: 0,
        stackY: 0,
        stackScale: 1
    };
}


export const overlay: Element[] = [];

export var zIndex = 0;


Events.on(plugin, 'gui_overlay_render', function (e) {

    // Draw.drawString(str, 10, 10);

    let screenState = getScreenState();

    translate(0, 0, +zIndex);

    for (let element of overlay)
        element.render(screenState.time, screenState.width, screenState.height);

    translate(0, 0, -zIndex);

});

// ToDo: one-time click detection
// const mouseButtons = [
//     {event: 'left_click', pressed: false, property: 'onLeftClick'},
//     {event: 'right_click', pressed: false, property: 'onRightClick'},
// ]

Events.on(plugin, 'game_loop', function (e) {
    let screenState = getScreenState();

    for (let element of overlay) {
        element.checkHovered(screenState, screenState.width, screenState.height);
    }

    // for (var i = 0; i < mouseButtons.length; i++) {
    //     let button = mouseButtons[i];
    //     if (!Mouse.isButtonDown(i)) {
    //         button.pressed = false;
    //         continue;
    //     }
    //     if (button.pressed) continue;
    //     button.pressed = true;
    //     for (var j = 0; j < root.children.length; j++) {
    //         if (root.children[j].executeHovered) 
    //             root.children[j].executeHovered(screenState, button.property, screenState.width, screenState.height);
    //     }
    //     Events.post(button.event, screenState);
    // }
});
