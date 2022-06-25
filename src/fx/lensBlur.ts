import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type LensBlurOptions = {
    radius: number;
    brightness: number;
    angle: number;
}

export function lensBlur(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: LensBlurOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).lensBlur(
        options.radius,
        options.brightness,
        options.angle
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default lensBlur;