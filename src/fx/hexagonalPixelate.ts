import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type HexagonalPixelateOptions = {
    scale: number;
    center: [number, number]
}

export function hexagonalPixelate(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: HexagonalPixelateOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).hexagonalPixelate(
        options.center[0],
        options.center[1],
        options.scale,
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default hexagonalPixelate;