import { runFragmentShader } from '../canvas';


export type SwirlOptions = {
    radius: number;
    angle: number;
    center: [number, number];
}

export function swirl(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: SwirlOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;
        uniform sampler2D texture;
        uniform float radius;
        uniform float angle;
        uniform vec2 center;
        uniform vec2 texSize;
        varying vec2 texCoord;
        void main() {
            vec2 coord = texCoord * texSize;
            coord -= center;
            float distance = length(coord);
            if (distance < radius) {
                float percent = (radius - distance) / radius;
                float theta = percent * percent * angle;
                float s = sin(theta);
                float c = cos(theta);
                coord = vec2(
                    coord.x * c - coord.y * s,
                    coord.x * s + coord.y * c
                );
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
        angle: options.angle,
        texSize: [image.width, image.height]
    });
}

export default swirl;