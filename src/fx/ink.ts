import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type InkOptions = {
    strength: number;
}

export function ink(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: InkOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).ink(
        options.strength
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default ink;