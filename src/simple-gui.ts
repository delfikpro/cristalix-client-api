/// <reference path="./cristalix.ts" />

import * as easing from './easing';
import * as vecmath from './vecmath';
// import * as renderhelper from './renderhelper';


const pushMatrix = GL11.glPushMatrix;
const popMatrix = GL11.glPopMatrix;
const translate = GL11.glTranslatef;
const rotate = GL11.glRotatef;
const scale = GL11.glScalef;
const depthMask = GL11.glDepthMask;
const color = GL11.glColor4f;


export const CENTER = {x: 0.5, y: 0.5};
export const LEFT = {x: 0, y: 0.5};
export const RIGHT = {x: 1, y: 0.5};
export const TOP = {x: 0.5, y: 0};
export const BOTTOM = {x: 0.5, y: 1};
export const TOP_RIGHT = {x: 1, y: 0};
export const TOP_LEFT = {x: 0, y: 0};
export const BOTTOM_RIGHT = {x: 1, y: 1};
export const BOTTOM_LEFT = {x: 0, y: 1};


export type Callback = () => void;

export class Animatable {

    started: number = 0;
    duration: number = 0;
    fromValue: number = 0;
    toValue: number = 0;
    easer: easing.Easer = easing.none;
    onFinish: Callback = null;

    constructor(public value: number) {
        this.toValue = value;
    }

    public transit(value: number, duration: number, easer: easing.Easer, onFinish?: Callback) : void {

        this.fromValue = this.value;
        this.toValue = value;
        this.started = getTime();
        this.duration = duration;
        this.easer = easer;
        this.onFinish = onFinish;

    }

    public update(time: number) : void {
        if (!this.started) return;
        let part = (time - this.started) / this.duration;
        if (part > 1.0) {
            this.value = this.toValue;
            this.started = 0.0;
            let finish = this.onFinish;
            this.onFinish = null;
            if (finish != null) finish();
        } else {
            part = this.easer(part);
            this.value = this.fromValue + (this.toValue - this.fromValue) * part;
        }
    }

}


export type Color = {
    a?: number,
    r?: number,
    g?: number,
    b?: number;
}

export function color2Hex(color: Color) : number {
    return colorParts2Hex(color.a, color.r, color.g, color.b);
}

export function colorParts2Hex(a: number, r: number, g: number, b: number) : number {
    return a * 255 << 24 | 
           r * 255 << 16 | 
           g * 255 << 8 | 
           b * 255;
}

export function hex2Color(value: number, includeAlpha?: boolean) : Color {
    let a = includeAlpha ? ((value >> 24) & 0xFF) / 255.0 : 1;
    let r = ((value >> 16) & 0xFF) / 255.0;
    let g = ((value >> 8) & 0xFF) / 255.0;
    let b = (value & 0xFF) / 255.0;
    return {a: a, r: r, g: g, b: b};
}


export function getTime(): number {
    return JavaSystem.currentTimeMillis();
}

export type MouseHandler = (screenState: ScreenState) => void;

export type ElementData = {
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly color?: Color;
    readonly scale?: number;
    readonly align?: vecmath.V2;
    readonly origin?: vecmath.V2;
    readonly rotationX?: number;
    readonly rotationY?: number;
    readonly rotationZ?: number;
    readonly enabled?: boolean;
    readonly noDepth?: boolean;
}

export type BoxData = {
    readonly width?: number;
    readonly height?: number;
    readonly uMin?: number;
    readonly vMin?: number;
    readonly uDelta?: number;
    readonly vDelta?: number;
    readonly textureWidth?: number;
    readonly textureHeight?: number;
    readonly children?: Element[];
    readonly texture?: string | ResourceLocation;
    readonly onLeftClick?: MouseHandler;
    readonly onRightClick?: MouseHandler;
    readonly temp_magic?: boolean;
    readonly afterRender?: () => void;
    readonly beforeRender?: () => void;
    readonly onHover?: (screenState: ScreenState, hovered: boolean) => void;
} & ElementData


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
    stackX: number;
    stackY: number;
    stackScale: number;
    leftClick: boolean;
    rightClick: boolean;
}

let el : ElementData;
el = {x: 1, color: {}};


export abstract class Element {

    x: Animatable;
    y: Animatable;
    z: Animatable;
    a: Animatable;
    r: Animatable;
    g: Animatable;
    b: Animatable;
    scale: Animatable;
    alignX: Animatable;
    alignY: Animatable;
    originX: Animatable;
    originY: Animatable;
    rotationX: Animatable;
    rotationY: Animatable;
    rotationZ: Animatable;
    animatables: Animatable[];
    noDepth: boolean;
    enabled: boolean;
    lastColor: number;

    constructor(data: ElementData) {

        this.x = new Animatable(data.x || 0);
        this.y = new Animatable(data.y || 0);
        this.z = new Animatable(data.z || 0);

        let color = data.color || {};

        this.a = new Animatable(color.a == null ? 1 : color.a);
        this.r = new Animatable(color.r == null ? 0 : color.r);
        this.g = new Animatable(color.g == null ? 0 : color.g);
        this.b = new Animatable(color.b == null ? 0 : color.b);

        this.scale = new Animatable(data.scale == null ? 1 : data.scale);

        let align = data.align || {x: 0, y: 0};
        this.alignX = new Animatable(align.x || 0);
        this.alignY = new Animatable(align.y || 0);

        let origin = data.origin || {x: 0, y: 0};
        this.originX = new Animatable(origin.x || 0);
        this.originY = new Animatable(origin.y || 0);

        this.rotationX = new Animatable(data.rotationX || 0);
        this.rotationY = new Animatable(data.rotationY || 0);
        this.rotationZ = new Animatable(data.rotationZ || 0);

        this.enabled = data.enabled == null ? true : data.enabled;

        this.noDepth = !!data.noDepth;

        this.animatables = [
                            this.x, this.y, this.z,
                            this.a, this.r, this.g, this.b, 
                            this.scale, 
                            this.rotationX, this.rotationY, this.rotationZ,
                            this.alignX, this.alignY, 
                            this.originX, this.originY, 
                           ];

    };

    public prepare(time: number, parentWidth: number, parentHeight: number, elementWidth: number, elementHeight: number): void {
        if (!this.enabled) return;
        
        // this.updateAnimatables(time);

        this.prepareAlign(parentWidth, parentHeight);
        this.prepareRotation();
        this.prepareOffset();
        this.prepareScale();
        this.prepareOrigin(elementWidth, elementHeight);
        this.lastColor = colorParts2Hex(this.a.value, this.r.value, this.g.value, this.b.value);
    }

    public updateAnimatables(time: number) {
        var animatables = this.animatables;
        for (var i = 0; i < animatables.length; i++) {
            var animatable = animatables[i];
            if (animatable.started) animatable.update(time);
        }
    }

    public prepareAlign(parentWidth: number, parentHeight: number) {
        if (this.alignX.value || this.alignY.value) translate(parentWidth * this.alignX.value, parentHeight * this.alignY.value, 0)        
    }

    public prepareRotation() {
        if (this.rotationX.value) rotate(this.rotationX.value, 1, 0, 0);
        if (this.rotationY.value) rotate(this.rotationY.value, 0, 1, 0);
        if (this.rotationZ.value) rotate(this.rotationZ.value, 0, 0, 1);
    }

    public prepareOffset() {
        if (this.x.value || this.y.value || this.z.value) translate(this.x.value, this.y.value, 0/*this.z.value*/);
    }

    public prepareScale() {
        if (this.scale.value != 1) scale(this.scale.value, this.scale.value, this.scale.value);
    }

    public prepareOrigin(elementWidth: number, elementHeight: number) {
        if (this.originX.value || this.originY.value) translate(-elementWidth * this.originX.value, -elementHeight * this.originY.value, 0);
    }

    public abstract render(time: number, parentWidth: number, parentHeight: number): void;

    public abstract checkHovered(screenState: ScreenState, parentWidth: number, parentHeight: number): void;

}

export class Hz {

    static i: number;

}

export function text(data: TextData): Text {
    return new Text(data);
}

export class Text extends Element {

    text: string;
    autoFit: boolean;
    shadow: boolean;

    constructor(data: TextData) {
        super(data);
        this.text = data.text || "";
        this.shadow = !!data.shadow;
        this.autoFit = !!data.autoFit;
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

    checkHovered(screenState: ScreenState, parentWidth: number, parentHeight: number): void {}

}

export function rect(data: BoxData): Box {
    return new Box(data);
}

export class Box extends Element {

    width: Animatable;
    height: Animatable;
    children: Element[];
    texture: string | ResourceLocation;
    uMin: number;
    vMin: number;
    uDelta: number;
    vDelta: number;
    textureWidth: number;
    textureHeight: number;
    temp_magic: boolean;
    onLeftClick: MouseHandler;
    onRightClick: MouseHandler;
    onHover: (screenState: ScreenState, hovered: boolean) => void;
    afterRender: () => void;
    beforeRender: () => void;
    hovered: boolean = false;

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

    checkHovered(screenState: ScreenState, parentWidth: number, parentHeight: number): void {}

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


export function register(listener: any) {
    Events.on(listener, 'gui_overlay_render', function(e) {

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

    Events.on(listener, 'game_loop', function(e) {      
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

}


