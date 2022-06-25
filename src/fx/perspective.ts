import matrixWarp, { getInverse, getSquareToQuad, multiply } from './matrixWarp';

type PerspectiveQuad = [
    number,  // x0
    number,  // y0
    number,  // x1
    number,  // y1
    number,  // x2
    number,  // y2
    number,  // x3
    number,  // y3
]

export type PerspectiveOptions = {
    before: PerspectiveQuad,
    after: PerspectiveQuad
}

export function perspective(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: PerspectiveOptions
) {
    const before = options.before;
    const after = options.after;
    var a = getSquareToQuad.apply(null, after);
    var b = getSquareToQuad.apply(null, before);
    var c = multiply(getInverse(a), b);
    matrixWarp(image, canvas, {
        matrix: c,
        inverse: false,
        useTextureSpace: false
    });
}

export default perspective;