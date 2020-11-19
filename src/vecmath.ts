
export type V2 = {

    x: number;
    y: number;

}

export function normalize2(vector: V2): V2 {
    let length = module2(vector);
    return {
        x: vector.x / length,
        y: vector.y / length
    };
}

export function module2(vector: V2): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}


export type V3 = {z: number} & V2


export function normalize3(vector: V3): V3 {
    let length = module3(vector);
    return {
        x: vector.x / length,
        y: vector.y / length,
        z: vector.z / length
    };
}

export function module3(vector: V3): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}



