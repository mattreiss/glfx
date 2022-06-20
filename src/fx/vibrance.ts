import { clamp, runFragmentShader } from '../canvas';


export type VibranceOptions = {
    amount: number;
}

export function vibrance(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: VibranceOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;
        uniform sampler2D texture;
        uniform float amount;
        varying vec2 texCoord;
        void main() {
            vec4 color = texture2D(texture, texCoord);
            float average = (color.r + color.g + color.b) / 3.0;
            float mx = max(color.r, max(color.g, color.b));
            float amt = (mx - average) * (-amount * 3.0);
            color.rgb = mix(color.rgb, vec3(mx), amt);
            gl_FragColor = color;
        }
    `, {
        amount: clamp(-1, options.amount, 1),
    });
}

export default vibrance;