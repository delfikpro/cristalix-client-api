/// <reference path="../reference/cristalix.d.ts" />

import * as index from './index';
import { number } from './simple-nbt';


const glPushMatrix = GL11.glPushMatrix;
const glPopMatrix = GL11.glPopMatrix;
const glMultMatrix = GL11.glMultMatrix;
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

export type ElementData = {

    offset?: V3;
    align?: V3;
    origin?: V3;
    scale?: V3;
    rotation?: Rotation;
    color?: Color;
    enabled?: boolean;
    beforeRender?: () => {};
    afterRender?: () => {};
    onClick?: (element: Element, button: number) => void;
    onHover?: (element: Element, hovered: boolean) => void;

}

export type RectData = {

    texture?: string | ResourceLocation;
    size?: V2;
    textureFrom?: V2;
    textureSize?: V2;
    children?: Element[];

} & ElementData;


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
    scaleFactor: number,
    screenWidth: number;
    screenHeight: number;
    unicodeFlag: boolean;
}


export class Task {
    
    constructor(
        public time: number,
        public action: () => void
    ) { }

}

export function schedule(delay: number, action: () => void) {
    runningTasks.push(new Task(getTime() + delay, action));
}

var runningTasks: Task[] = [];
var runningAnimations: Animation[] = [];

function updateAnimations() {
    let time = getTime();

    let newRunningTasks: Task[] = [];
    for (let task of runningTasks) {
        if (time >= task.time) task.action();
        else newRunningTasks.push(task);
    }
    runningTasks = newRunningTasks;

    let newRunningAnimations: Animation[] = [];
    for (let animation of runningAnimations) {
        if (animation.update(time)) newRunningAnimations.push(animation);
    }
    for (let animation of runningAnimations) {
        animation.element.cleanMatrices();
    }
    runningAnimations = newRunningAnimations
}

function hoverCulling(element: Element): boolean {
    let passed = false;
    if (element instanceof Rect) {
        for (let child of element.children) {
            if (hoverCulling(child)) {
                passed = true;
            }
        }
    }
    if (element.onHover || element.onClick) {
        passed = true;
    }
    element.passedHoverCulling = passed;
    return passed;

}

function updateHoverStates(element: Element, baseMatrix: Matrix4f, mouse: V2) {

    if (!element.passedHoverCulling) return;

    let matrix = new Matrix4f();
    matrix.load(baseMatrix);

    for (let m of element.matrices) {
        if (m) Matrix4f.mul(matrix, m, matrix);
    }

    if (element.onHover || element.onClick) {
        let sizeX = element.properties[index.sizeX];
        let sizeY = element.properties[index.sizeY];
        
        let vector = new Vector4f(mouse.x, mouse.y, 0, 1);
    
        let inv = new Matrix4f();
        Matrix4f.invert(matrix, inv);
        Matrix4f.transform(inv, vector, vector);
    
        // testText.text = vector.getX() + ' ' + vector.getY();

        let x = vector.getX();
        let y = vector.getY();
    
        let hovered = x >= 0 && x < sizeX && y >= 0 && y < sizeY;
        if (element.hovered != hovered) {
            if (element.onHover) element.onHover(element, hovered);
            element.hovered = hovered;
        }
        
    }
    

    if (element instanceof Rect) {
        for (let child of element.children) {
            // updateHoverStates(child, new Vector4f(w, x, y, z));
            updateHoverStates(child, matrix, mouse);
        }
    }

}

export function text(data: TextData): Text {
    let element = new Text(data);
    element.cleanMatrices();
    return element;
}

export function rect(data: RectData): Rect {
    let element = new Rect(data);
    element.cleanMatrices();
    return element;
}

let buffer = GLAllocation.createDirectFloatBuffer(16);

export abstract class Element {

    properties: number[];
    matrices: Matrix4f[];
    enabled: boolean;
    dirtyMatrices: number[];
    hovered: boolean;
    
    beforeRender?: () => void;
    afterRender?: () => void;

    passedHoverCulling: boolean;
    cachedHexColor: number;

    onHover?: (element: Element, hovered: boolean) => void;
    onClick?: (element: Element, button: number) => void;

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

        // properties.push(
        if (offset && offset.x) this.setProperty(index.offsetX, offset.x);
        if (offset && offset.y) this.setProperty(index.offsetY, offset.y);
        if (offset && offset.z) this.setProperty(index.offsetZ, offset.z);

        this.setProperty(index.scaleX, scale && scale.x ? scale.x : 1);
        this.setProperty(index.scaleY, scale && scale.y ? scale.y : 1);
        this.setProperty(index.scaleZ, scale && scale.z ? scale.z : 1);

        if (align && align.x) this.setProperty(index.alignX, align.x);
        if (align && align.y) this.setProperty(index.alignY, align.y);
        if (align && align.z) this.setProperty(index.alignZ, align.z);

        if (origin && origin.x) this.setProperty(index.originX, origin.x);
        if (origin && origin.y) this.setProperty(index.originY, origin.y);
        if (origin && origin.z) this.setProperty(index.originZ, origin.z);
        
        if (rotation && rotation.x) this.setProperty(index.rotationX, rotation.x);
        if (rotation && rotation.y) this.setProperty(index.rotationY, rotation.y);
        this.setProperty(index.rotationZ, rotation ? (rotation.z || 0) : 1);
        if (rotation && rotation.angle) this.setProperty(index.rotationAngle, rotation.angle);

        if (color) {
            this.setProperty(index.a, color.a == undefined ? 1 : color.a);
            this.setProperty(index.r, color.r == undefined ? 1 : color.r);
            this.setProperty(index.g, color.g == undefined ? 1 : color.g);
            this.setProperty(index.b, color.b == undefined ? 1 : color.b);
        }
        
        properties[index.parentSizeX] = 0;
        properties[index.parentSizeY] = 0;
        properties[index.parentSizeZ] = 0;
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
                properties[index.a],
                properties[index.r],
                properties[index.g],
                properties[index.b],
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

    public abstract render(): void;

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
        if (!this.enabled) return;

        glPushMatrix();
        super.applyTransformations();

        // GL11.glDepthFunc(GL11.GL_LESS);
        // GlStateManager.disableDepth();

        // ToDo: colored text
        fontRenderer.drawString(this.text, 0, fontRenderer.getUnicodeFlag() ? 0 : 1, -1, this.shadow);

        // GL11.glDepthFunc(GL11.GL_LEQUAL);
        // GlStateManager.enableDepth();
        glPopMatrix();

    }

}

export class Rect extends Element {

    public children: Element[];
    public texture: string | ResourceLocation;

    constructor(data: RectData) {
        super(data);
        
        if (data.size) {
            if (data.size.x) this.setProperty(index.sizeX, data.size.x);
            if (data.size.y) this.setProperty(index.sizeY, data.size.y);
        }
        if (data.textureFrom) {
            if (data.textureFrom.x) this.setProperty(index.textureX, data.textureFrom.x);
            if (data.textureFrom.y) this.setProperty(index.textureY, data.textureFrom.y);
        }

        this.setProperty(index.textureWidth, data.textureSize ? data.textureSize.x || 1 : 1);
        this.setProperty(index.textureHeight, data.textureSize ? data.textureSize.y || 1 : 1);

        this.children = data.children || [];
        this.texture = data.texture || null;

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
        if (!this.enabled) return;

        glPushMatrix();
        super.applyTransformations();

        if (this.beforeRender) this.beforeRender();

        let properties = this.properties;

        if (this.texture) {
            GlStateManager.enableBlend();
            Textures.bindTexture(this.texture);

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
        if (this.afterRender) this.afterRender();


        // translate(0, 0, 0.01);
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].render();
        }

        glPopMatrix();

    }

}

export class Item extends Element {

    item: ItemStack;

    constructor(data: ItemData) {
        super(data);
        this.item = data.item;
        this.properties.push(16, 16, 0); // size
    }

    render(): void {
        if (!this.enabled) return;

        glPushMatrix();
        super.applyTransformations();
        RenderHelper.enableGUIStandardItemLighting();
        Draw.renderItemAndEffectIntoGUI(this.item, 0, 0);
        RenderHelper.disableStandardItemLighting();
        glPopMatrix();

    }
}


export function getScreenState(): ScreenState {
    let resolution = minecraft.getResolution();
    let scaleFactor = resolution.getScaleFactor();
    let screenWidth = resolution.getScaledWidth();
    let screenHeight = resolution.getScaledHeight();
    let unicodeFlag = fontRenderer.getUnicodeFlag();
    
    return {
        scaleFactor,
        screenWidth,
        screenHeight,
        unicodeFlag
    };
}

var lastScreenState = getScreenState();

// let mouseX = Mouse.getX() / factor;
// let mouseY = screenHeight - Mouse.getY() / factor;
// let time = getTime();

export const overlay: Element[] = [];

export var zIndex = 0;


Events.on(plugin, 'gui_overlay_render', function (e) {

    let screenState = getScreenState();
    if (
        lastScreenState.scaleFactor != screenState.scaleFactor || 
        lastScreenState.screenWidth != screenState.screenWidth || 
        lastScreenState.screenHeight != screenState.screenHeight || 
        lastScreenState.unicodeFlag != screenState.unicodeFlag
    ) {
        for (let element of overlay) {
            element.setProperty(index.parentSizeX, screenState.screenWidth);
            element.setProperty(index.parentSizeY, screenState.screenHeight);
        }
        lastScreenState = screenState;
    }

    updateAnimations();

    for (let element of overlay) {
        hoverCulling(element);
        // updateHoverStates(element, new Vector4f(Mouse.getX() / screenState.scaleFactor, (Display.getHeight() - Mouse.getY()) / screenState.scaleFactor, 0, 1));
        updateHoverStates(element, new Matrix4f().setIdentity(), {
            x: Mouse.getX() / screenState.scaleFactor, 
            y: (Display.getHeight() - Mouse.getY()) / screenState.scaleFactor
        });
        element.render();
    }

});

// let testText = text({text: 'hello world'});

// let test = rect({
//     size: {x: 100, y: 20},
//     color: {a: 1, r: 1, g: 0.5, b: 0.1},
//     offset: {x: 30, y: 10},
//     rotation: {angle: -100, x: 0, y: 0, z: 1},
//     children: [
//         testText
//     ],
//     onHover: (elem, hovered) => {
//         elem.setProperty(index.r, hovered ? 1 : 0);
//     }
// });

// overlay.push(test);

// Events.on(plugin, 'key_press', (e: KeyPressEvent) => {
//     if (e.key == Keyboard.KEY_J) {
//         test.setProperty(index.offsetX, Math.random() * 500, 1000, 0);
//     }
// })


// ToDo: one-time click detection
// const mouseButtons = [
//     {event: 'left_click', pressed: false, property: 'onLeftClick'},
//     {event: 'right_click', pressed: false, property: 'onRightClick'},
// ]

Events.on(plugin, 'game_loop', function (e) {
    let screenState = getScreenState();

    // for (let element of overlay) {
    //     element.checkHovered(screenState, screenState.width, screenState.height);
    // }

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
