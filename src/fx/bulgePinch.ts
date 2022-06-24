import { clamp, runFragmentShader } from '../canvas';


export type BulgePinchOptions = {
    radius: number;
    strength: number;
    center: [number, number];
}

export function bulgePinch(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: BulgePinchOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;
        uniform sampler2D texture;
        uniform float radius;
        uniform float strength;
        uniform vec2 center;
        uniform vec2 texSize;
        varying vec2 texCoord;
        void main() {
            vec2 coord = texCoord * texSize;
            coord -= center;
            float distance = length(coord);
            if (distance < radius) {
                float percent = distance / radius;
                if (strength > 0.0) {
                    coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);
                } else {
                    coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
                }
            }
            coord += center;
            gl_FragColor = texture2D(texture, coord / texSize);
            vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);
            if (coord != clampedCoord) {
                /* fade to transparent if we are outside the image */
                gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));
            }
        }
    `, {
        radius: options.radius,
        center: options.center,
        strength: clamp(-1, options.strength, 1),
        texSize: [image.width, image.height]
    });
}

export default bulgePinch;