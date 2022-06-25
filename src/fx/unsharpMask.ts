import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type UnsharpMaskOptions = {
    radius: number;
    strength: number;
}

export function unsharpMask(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: UnsharpMaskOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).unsharpMask(
        options.radius,
        options.strength
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default unsharpMask;