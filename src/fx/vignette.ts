import { clamp, runFragmentShader } from '../canvas';


export type VignetteOptions = {
    amount: number;
    size: number;
}

export function vignette(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: VignetteOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;
        uniform sampler2D texture;
        uniform float size;
        uniform float amount;
        varying vec2 texCoord;
        void main() {
            vec4 color = texture2D(texture, texCoord);
            float dist = distance(texCoord, vec2(0.5, 0.5));
            color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));
            gl_FragColor = color;
        }
    `, {
        size: clamp(0, options.size, 1),
        amount: clamp(0, options.amount, 1),
    });
}

export default vignette;