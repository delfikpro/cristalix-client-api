/// <reference path="../../reference/cristalix.d.ts" />

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