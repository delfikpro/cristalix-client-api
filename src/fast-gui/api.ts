import { Color } from "./colors";
import {AbstractElement, ItemElement, RectangleElement, TextElement} from './elements'
import { runningTasks } from "./fast-gui";

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

    texture?: string | ResourceLocation;
    size?: V2;
    textureFrom?: V2;
    textureSize?: V2;
    children?: AbstractElement[];

} & ElementData;

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


