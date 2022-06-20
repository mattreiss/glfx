import { runFragmentShader } from '../canvas';


export type DenoiseOptions = {
    exponent: number;
}

export function denoise(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: DenoiseOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;

        uniform sampler2D texture;
        uniform float exponent;
        uniform float strength;
        uniform vec2 texSize;
        varying vec2 texCoord;
        void main() {
            vec4 center = texture2D(texture, texCoord);
            vec4 color = vec4(0.0);
            float total = 0.0;
            for (float x = -4.0; x <= 4.0; x += 1.0) {
                for (float y = -4.0; y <= 4.0; y += 1.0) {
                    vec4 sample = texture2D(texture, texCoord + vec2(x, y) / texSize);
                    float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));
                    weight = pow(weight, exponent);
                    color += sample * weight;
                    total += weight;
                }
            }
            gl_FragColor = color / total;
        }
    `, {
        exponent: Math.max(0, options.exponent),
        texSize: [image.width, image.height]
    });
}

export default denoise;