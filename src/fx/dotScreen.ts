import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type DotScreenOptions = {
    angle: number;
    scale: number;
    center: [number, number]
}

export function dotScreen(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: DotScreenOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).dotScreen(
        options.center[0],
        options.center[1],
        options.angle,
        options.scale
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default dotScreen;