import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';


export type TriangleBlurOptions = {
    radius: number;
    brightness: number;
    angle: number;
}

export function triangleBlur(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: TriangleBlurOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).triangleBlur(
        options.radius,
        options.brightness,
        options.angle
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default triangleBlur;