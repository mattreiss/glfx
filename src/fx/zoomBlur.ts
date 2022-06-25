import { randomShaderFunc, runFragmentShader } from '../canvas';

export type ZoomBlurOptions = {
    strength: number;
    center: [number, number];
}

export function zoomBlur(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: ZoomBlurOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;
        uniform sampler2D texture;
        uniform vec2 center;
        uniform float strength;
        uniform vec2 texSize;
        varying vec2 texCoord;
        ${randomShaderFunc}
        void main() {
            vec4 color = vec4(0.0);
            float total = 0.0;
            vec2 toCenter = center - texCoord * texSize;
            
            /* randomize the lookup values to hide the fixed number of samples */
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
            
            for (float t = 0.0; t <= 40.0; t++) {
                float percent = (t + offset) / 40.0;
                float weight = 4.0 * (percent - percent * percent);
                vec4 sample = texture2D(texture, texCoord + toCenter * percent * strength / texSize);
                
                /* switch to pre-multiplied alpha to correctly blur transparent images */
                sample.rgb *= sample.a;
                
                color += sample * weight;
                total += weight;
            }
            
            gl_FragColor = color / total;
            
            /* switch back from pre-multiplied alpha */
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
        }
    `, {
        center: options.center,
        strength: options.strength,
        texSize: [image.width, image.height]
    });
}

export default zoomBlur;