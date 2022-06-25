import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type ColorHalftoneOptions = {
    angle: number;
    size: number;
    center: [number, number]
}

export function colorHalftone(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: ColorHalftoneOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).colorHalftone(
        options.center[0],
        options.center[1],
        options.angle,
        options.size
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default colorHalftone;