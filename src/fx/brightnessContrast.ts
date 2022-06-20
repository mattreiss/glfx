import { clamp, runFragmentShader } from '../canvas';


export type BrightnessContrastOptions = {
    brightness: number;
    contrast: number;
}

export function brightnessContrast(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: BrightnessContrastOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;

        uniform sampler2D image;

        uniform float brightness;
        uniform float contrast;

        varying vec2 texCoord;

        void main() {
            vec4 color = texture2D(image, texCoord);
            color.rgb += brightness;
            if (contrast > 0.0) {
                color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
            } else {
                color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
            }
            gl_FragColor = color;
        }
    `, {
        brightness: clamp(-1, options.brightness, 1),
        contrast: clamp(-1, options.contrast, 1)
    });
}

export default brightnessContrast;