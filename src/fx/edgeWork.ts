import * as fx from 'glfx-es6';
import { renderWebGLImage } from '../canvas';

export type EdgeWorkOptions = {
    radius: number;
}

export function edgeWork(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: EdgeWorkOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).edgeWork(
        options.radius
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
}

export default edgeWork;