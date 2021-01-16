/// <reference path="../../reference/cristalix.d.ts" />

import * as index from './index';
import { AnimationFinisher, ItemData, RectData, Task, TextData, V2 } from './api';
import {AbstractElement, ItemElement, RectangleElement, TextElement} from './elements'


export type ScreenState = {
    scaleFactor: number,
    screenWidth: number;
    screenHeight: number;
    unicodeFlag: boolean;
}


export class Animation {

    startedTime: number = 0;
    duration: number = 0;
    startValue: number = 0;
    targetValue: number = 0;
    easingId: number = 0;
    lastValue: number;
    onFinish: AnimationFinisher;

    constructor(
        public readonly element: AbstractElement,
        public readonly propertyId: number,
    ) {
        this.targetValue = this.lastValue = element.properties[propertyId];
    }

    public newTarget(value: number, duration: number, easingId: number, onFinish?: AnimationFinisher): void {

        if (this.onFinish) this.onFinish(false);
        this.startValue = this.lastValue;
        this.targetValue = value;
        this.startedTime = System.currentTimeMillis();
        this.duration = duration;
        this.easingId = easingId;
        this.onFinish = onFinish;

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
            if (this.onFinish) this.onFinish(false);
            this.onFinish = null;
        }
        this.lastValue = value;
        this.element.setProperty(this.propertyId, value);
        return alive;
    }

}

export var runningTasks: Task[] = [];
export var runningAnimations: Animation[] = [];


function updateAnimations() {
    let time = System.currentTimeMillis();

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


function hoverCulling(element: AbstractElement): boolean {
    let passed = false;
    if (element instanceof RectangleElement) {
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

function updateHoverStates(element: AbstractElement, baseMatrix: Matrix4f, mouse: V2) {

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
    

    if (element instanceof RectangleElement) {
        for (let child of element.children) {
            // updateHoverStates(child, new Vector4f(w, x, y, z));
            updateHoverStates(child, matrix, mouse);
        }
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
var lastMouseState = [false, false, false];

// let mouseX = Mouse.getX() / factor;
// let mouseY = screenHeight - Mouse.getY() / factor;
// let time = getTime();

export const overlay: AbstractElement[] = [];


// export abstract class Context {

//     protected elements: AbstractElement[];

//     public push(...elements: AbstractElement[]): void {
        
//     }

// }

// export class OverlayContext extends Context {

    

// }


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
        element.transformAndRender();
    }

});

Events.on(plugin, 'mouse_press', (event: MousePressEvent) => {
});

function findLastClickable(elements: AbstractElement[]): AbstractElement {
    let lastClickable: AbstractElement
    for (let element of elements) {
        // stdout.println(element.hovered + " " + element.passedHoverCulling + " " + (element.onClick != null))
        if (!element.passedHoverCulling) continue;
        if (element.hovered && element.onClick) lastClickable = element;
        if (element instanceof RectangleElement) {
            lastClickable = findLastClickable(element.children) || lastClickable;
        }
    }
    return lastClickable;
}

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

Events.on(plugin, 'game_loop', function (event) {
    
    for (let button = 0; button < 3; button++) {
        let oldState = lastMouseState[button];
        let newState = Mouse.isButtonDown(button);
        if (oldState != newState) {
            let lastClickable = findLastClickable(overlay);
            if (lastClickable) lastClickable.onClick(lastClickable, newState, button);
        }
        lastMouseState[button] = newState;
    }

});
