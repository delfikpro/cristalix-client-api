/// <reference path="../../reference/cristalix.d.ts" />

import { overlay } from "../simple-gui";
import { Color } from "./colors";
import {AbstractElement, ItemElement, RectangleElement, TextElement} from './elements'
import { overlayLegacy, runningTasks, lastScreenState } from "./fast-gui";
import { parentSizeX, parentSizeY } from "./index";

export type V2 = { x?: number, y?: number };
export type V3 = V2 & { z?: number };
export type Rotation = V3 & { angle: number };

export const CENTER: V3 = { x: 0.5, y: 0.5 };
export const LEFT: V3 = { x: 0, y: 0.5 };
export const RIGHT: V3 = { x: 1, y: 0.5 };
export const TOP: V3 = { x: 0.5, y: 0 };
export const BOTTOM: V3 = { x: 0.5, y: 1 };
export const TOP_RIGHT: V3 = { x: 1, y: 0 };
export const TOP_LEFT: V3 = { x: 0, y: 0 };
export const BOTTOM_RIGHT: V3 = { x: 1, y: 1 };
export const BOTTOM_LEFT: V3 = { x: 0, y: 1 };

export type Task = {
    
    time: number;
    action: () => void;

}

export type AnimationFinisher = (completed: boolean) => void;

export function schedule(delay: number, action: () => void) {
    runningTasks.push({
        time: System.currentTimeMillis() + delay, 
        action
    });
}

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
    onClick?: (element: AbstractElement, down: boolean, button: number) => void;
    onHover?: (element: AbstractElement, hovered: boolean) => void;

}

export type RectData = {

    size?: V2;
    texture?: TextureData;
    children?: AbstractElement[];

} & ElementData;

export type TextureData = {

    resource?: string | ResourceLocation;
    start?: V2;
    size?: V2;

}

export function rect(data: RectData): RectangleElement {
    let element = new RectangleElement(data);
    element.cleanMatrices();
    return element;
}

export type TextData = {
    readonly text?: string;
    readonly shadow?: boolean;
    readonly autoFit?: boolean;
} & ElementData

export function text(data: TextData): TextElement {
    let element = new TextElement(data);
    element.cleanMatrices();
    return element;
}


export type ItemData = {
    readonly item: ItemStack
} & ElementData

export function item(data: ItemData): ItemElement {
    let element = new ItemElement(data);
    element.cleanMatrices();
    return element;
}

export function removeFromOverlay(...elements: AbstractElement[]) {
    for (let element of elements) {
        let index = overlayLegacy.indexOf(element);
        overlayLegacy.splice(index, 1);
    }
}

export function addToOverlay(...elements: AbstractElement[]) {

    for (let element of elements) {
        element.setProperty(parentSizeX, lastScreenState.screenWidth);
        element.setProperty(parentSizeY, lastScreenState.screenHeight);
    }

    overlayLegacy.push(...elements);

}