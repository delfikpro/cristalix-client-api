
export type Easer = (value: number) => number;

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = 2 * Math.PI / 3;
const c5 = 2 * Math.PI / 4.5;
const pow = Math.pow;
const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;
const PI = Math.PI;

export const none = (x: number) => x;
export const invert = (x: number) => 1 - x;

export const inQuad = (x: number) => x * x;
export const outQuad = (x: number) => 1 - (1 - x) * (1 - x);
export const bothQuad = (x: number) => x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;

export const inCubic = (x: number) => x * x * x;
export const outCubic = (x: number) => 1 - pow(1 - x, 3);
export const bothCubic = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;

export const inQuart = (x: number) => x * x * x * x;
export const outQuart = (x: number) => 1 - pow(1 - x, 4);
export const bothQuart = (x: number) => x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;

export const inQuint = (x: number) => x * x * x * x * x;
export const outQuint = (x: number) => 1 - Math.pow(1 - x, 5);
export const bothQuint = (x: number) => x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;

export const inSin = (x: number) => 1 - cos(x * PI / 2);
export const outSin = (x: number) => sin(x * PI / 2);
export const bothSin = (x: number) => -(cos(PI * x) - 1) / 2;

export const inCircle = (x: number) => 1 - sqrt(1 - pow(x, 2));
export const outCircle = (x: number) => sqrt(1 - pow(x - 1, 2));
export const bothCircle = (x: number) => x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;

export const inElastic = (x: number) => x == 0 ? 0 : x == 1 ? 1 : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
export const outElastic = (x: number) => x == 0 ? 0 : x == 1 ? 1 : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
export const bothElastic = (x: number) => x == 0 ? 0 : x == 1 ? 1 : x < 0.5 ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2 : pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5) / 2 + 1;

export const inBack = (x: number) => c3 * x * x * x - c1 * x * x;
export const outBack = (x: number) => 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
export const bothBack = (x: number) => x < 0.5 ? pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;

export const outBounce = (x: number) => {
	const n1 = 7.5625, d1 = 2.75;
	if (x < 1 / d1) return n1 * x * x;
	if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + .75;
	if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + .9375;
	return n1 * (x -= 2.625 / d1) * x + .984375;
};

export const inBounce = (x: number) => 1 - outBounce(1 - x);
export const bothBounce = (x : number) => x < 0.5 ? 
	(1 - outBounce(+1 - 2 * x) / 2) :
	(1 + outBounce(-1 + 2 * x) / 2);

