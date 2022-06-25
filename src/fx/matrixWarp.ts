import { clamp, runFragmentShader } from '../canvas';


type Vec2 = [number, number];
type Vec3 = [number, number, number];

export type MatrixWarpOptions = {
    matrix: number[] | Vec2[] | Vec3[];
    inverse: boolean;
    useTextureSpace: boolean;
}


export function getInverse(m: any[]) {
    var a = m[0], b = m[1], c = m[2];
    var d = m[3], e = m[4], f = m[5];
    var g = m[6], h = m[7], i = m[8];
    var det = a*e*i - a*f*h - b*d*i + b*f*g + c*d*h - c*e*g;
    return [
        (e*i - f*h) / det, (c*h - b*i) / det, (b*f - c*e) / det,
        (f*g - d*i) / det, (a*i - c*g) / det, (c*d - a*f) / det,
        (d*h - e*g) / det, (b*g - a*h) / det, (a*e - b*d) / det
    ];
}

export function multiply(a: number[], b: number[]) {
    return [
        a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
        a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
        a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
        a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
        a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
        a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
        a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
        a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
        a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
    ];
}


export function getSquareToQuad(
    x0: number, 
    y0: number, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    x3: number, 
    y3: number
) {
    var dx1 = x1 - x2;
    var dy1 = y1 - y2;
    var dx2 = x3 - x2;
    var dy2 = y3 - y2;
    var dx3 = x0 - x1 + x2 - x3;
    var dy3 = y0 - y1 + y2 - y3;
    var det = dx1*dy2 - dx2*dy1;
    var a = (dx3*dy2 - dx2*dy3) / det;
    var b = (dx1*dy3 - dx3*dy1) / det;
    return [
        x1 - x0 + a*x1, y1 - y0 + a*y1, a,
        x3 - x0 + b*x3, y3 - y0 + b*y3, b,
        x0, y0, 1
    ];
}

export function matrixWarp(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: MatrixWarpOptions
) {
    // Flatten all members of matrix into one big list
    let matrix = Array.prototype.concat.apply([], options.matrix);

    // Extract a 3x3 matrix out of the arguments
    if (matrix.length == 4) {
        matrix = [
            matrix[0], matrix[1], 0,
            matrix[2], matrix[3], 0,
            0, 0, 1
        ];
    } else if (matrix.length != 9) {
        throw 'can only warp with 2x2 or 3x3 matrix';
    }

    runFragmentShader(image, canvas, `
        precision highp float;
        uniform sampler2D texture;
        uniform mat3 matrix;
        uniform bool useTextureSpace;
        uniform vec2 texSize;
        varying vec2 texCoord;
        void main() {
            vec2 coord = texCoord * texSize;
            if (useTextureSpace) coord = coord / texSize * 2.0 - 1.0;
            vec3 warp = matrix * vec3(coord, 1.0);
            coord = warp.xy / warp.z;
            if (useTextureSpace) coord = (coord * 0.5 + 0.5) * texSize;
            gl_FragColor = texture2D(texture, coord / texSize);
            vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);
            if (coord != clampedCoord) {
                /* fade to transparent if we are outside the image */
                gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));
            }
        }
    `, {
        matrix: options.inverse ? getInverse(matrix) : matrix,
        useTextureSpace: options.useTextureSpace ? 1 : 0,
        texSize: [image.width, image.height]
    });
}

export default matrixWarp;