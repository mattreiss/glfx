import * as fx from 'glfx-es6';
import { randomShaderFunc, renderWebGLImage, runFragmentShader } from '../canvas';


export type TiltShiftOptions = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    blurRadius: number;
    gradientRadius: number;
}

export function tiltShift(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: TiltShiftOptions
) {
    const fxcanvas = fx.canvas();
    const texture = fxcanvas.texture(image);
    fxcanvas.draw(texture).tiltShift(
        options.startX,
        options.startY,
        options.endX,
        options.endY,
        options.blurRadius,
        options.gradientRadius,
    ).update();
    renderWebGLImage(fxcanvas, canvas);
    return;
    // const fragmentShader = `
    //     precision highp float;
    //     uniform sampler2D texture;
    //     uniform vec2 center;
    //     uniform float strength;
    //     uniform vec2 texSize;
    //     varying vec2 texCoord;
    //     ${randomShaderFunc}
    //     void main() {
    //         vec4 color = vec4(0.0);
    //         float total = 0.0;
    //         vec2 toCenter = center - texCoord * texSize;
            
    //         /* randomize the lookup values to hide the fixed number of samples */
    //         float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
            
    //         for (float t = 0.0; t <= 40.0; t++) {
    //             float percent = (t + offset) / 40.0;
    //             float weight = 4.0 * (percent - percent * percent);
    //             vec4 sample = texture2D(texture, texCoord + toCenter * percent * strength / texSize);
                
    //             /* switch to pre-multiplied alpha to correctly blur transparent images */
    //             sample.rgb *= sample.a;
                
    //             color += sample * weight;
    //             total += weight;
    //         }
            
    //         gl_FragColor = color / total;
            
    //         /* switch back from pre-multiplied alpha */
    //         gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
    //     }
    // `;
    // const dx = options.endX - options.startX;
    // const dy = options.endY - options.startY;
    // const d = Math.sqrt(dx * dx + dy * dy);
    // runFragmentShader(image, canvas, fragmentShader, {
    //     blurRadius: options.blurRadius,
    //     gradientRadius: options.gradientRadius,
    //     start: [options.startX, options.startY],
    //     end: [options.endX, options.endY],
    //     delta: [dx / d, dy / d],
    //     texSize: [image.width, image.height]
    // });
    // runFragmentShader(canvas, canvas, fragmentShader, {
    //     blurRadius: options.blurRadius,
    //     gradientRadius: options.gradientRadius,
    //     start: [options.startX, options.startY],
    //     end: [options.endX, options.endY],
    //     delta: [-dy / d, dx / d],
    //     texSize: [image.width, image.height]
    // });
}

export default tiltShift;