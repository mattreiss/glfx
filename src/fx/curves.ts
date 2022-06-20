import * as fx from 'glfx-es6';
import { clamp, renderWebGLImage, runFragmentShader, SplineInterpolator } from '../canvas';

// function splineInterpolate(points: any) {
//     const interpolator: any = SplineInterpolator(points);
//     const array = [];
//     for (var i = 0; i < 256; i++) {
//         array.push(clamp(0, Math.floor(interpolator.interpolate(i / 255) * 256), 255));
//     }
//     return array;
// }

export type Vec2 = [number, number]
export type CurvesOptions = {
    red: Vec2[];
    green?: Vec2[];
    blue?: Vec2[];
}

/**
 * 
 * @param image 
 * @param canvas 
 * @param options A list of points that define the function for each channel.
 *              Each point is a list of two values: the value before the mapping
 *              and the value after the mapping, both in the range 0 to 1. For
 *              example, [[0,1], [1,0]] would invert the color channel while
 *              [[0,0], [1,1]] would leave the color channel unchanged. If green
 *              and blue are omitted then this argument also applies to the
 *              green and blue channels.
 */
export function curves(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: CurvesOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).curves(options.red, options.green, options.blue).update();
    renderWebGLImage(fxcanvas, canvas);
    return;

    // const gl = canvas.getContext('webgl');
    // if (!gl) {
    //     throw "Error getting webgl context!"
    // }

    // let { red, green, blue } = options;
    // // create a ramp texture
    // red = splineInterpolate(red);
    // if (!green && !blue) {
    //     green = blue = red;
    // } else {
    //     green = splineInterpolate(green);
    //     blue = splineInterpolate(blue);
    // }
    // const array: any[] = [];
    // for (let i = 0; i < 256; i++) {
    //     array.splice(array.length, 0, red[i], green[i], blue[i], 255);
    // }
    // const texture = gl.createTexture();
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // // init from bytes
    // const width = 256;
    // const height = 1;
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(array));
    // // use texture
    // gl.activeTexture(gl.TEXTURE0 + 1);
    // gl.bindTexture(gl.TEXTURE_2D, texture);

    // runFragmentShader(image, canvas, `
    //     precision highp float;
    //     uniform sampler2D texture;
    //     uniform sampler2D map;
    //     varying vec2 texCoord;
    //     void main() {
    //         vec4 color = texture2D(texture, texCoord);
    //         color.r = texture2D(map, vec2(color.r)).r;
    //         color.g = texture2D(map, vec2(color.g)).g;
    //         color.b = texture2D(map, vec2(color.b)).b;
    //         gl_FragColor = color;
    //     }
    // `, {
    //     map: 1,
    // }, gl);
}


export default curves;