import { runFragmentShader } from '../canvas';

// Define several convolution kernels
const kernels = {
    normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ],
    gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ],
    gaussianBlur3: [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ],
    unsharpen: [
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
    ],
    sharpness: [
        0,-1, 0,
        -1, 5,-1,
        0,-1, 0
    ],
    sharpen: [
        -1, -1, -1,
        -1, 16, -1,
        -1, -1, -1
    ],
    edgeDetect: [
        -0.125, -0.125, -0.125,
        -0.125,  1,     -0.125,
        -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
        -1, -1, -1,
        -1,  8, -1,
        -1, -1, -1
    ],
    edgeDetect3: [
        -5, 0, 0,
        0, 0, 0,
        0, 0, 5
    ],
    edgeDetect4: [
        -1, -1, -1,
        0,  0,  0,
        1,  1,  1
    ],
    edgeDetect5: [
        -1, -1, -1,
        2,  2,  2,
        -1, -1, -1
    ],
    edgeDetect6: [
        -5, -5, -5,
        -5, 39, -5,
        -5, -5, -5
    ],
    sobelHorizontal: [
        1,  2,  1,
        0,  0,  0,
        -1, -2, -1
    ],
    sobelVertical: [
        1,  0, -1,
        2,  0, -2,
        1,  0, -1
    ],
    previtHorizontal: [
        1,  1,  1,
        0,  0,  0,
        -1, -1, -1
    ],
    previtVertical: [
        1,  0, -1,
        1,  0, -1,
        1,  0, -1
    ],
    boxBlur: [
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111
    ],
    triangleBlur: [
        0.0625, 0.125, 0.0625,
        0.125,  0.25,  0.125,
        0.0625, 0.125, 0.0625
    ],
    emboss: [
        -2, -1,  0,
        -1,  1,  1,
        0,  1,  2
    ]
};

function computeKernelWeight(kernel: any[]) {
    var weight = kernel.reduce(function(prev: any, curr: any) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
}

export type KernelType = keyof typeof kernels;

export type FilterOptions = {
    name: KernelType;
}

export function filter(
    image: HTMLImageElement | HTMLCanvasElement,
    canvas: HTMLCanvasElement, 
    options: FilterOptions
) {
    runFragmentShader(image, canvas, `
        precision highp float;
    
        // our texture
        uniform sampler2D u_image;
        uniform vec2 u_textureSize;
        uniform float u_kernel[9];
        uniform float u_kernelWeight;
        
        // the texCoords passed in from the vertex shader.
        varying vec2 texCoord;
        
        void main() {
            vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
            vec4 colorSum =
                texture2D(u_image, texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
                texture2D(u_image, texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
                texture2D(u_image, texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
                texture2D(u_image, texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
                texture2D(u_image, texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
                texture2D(u_image, texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
                texture2D(u_image, texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
                texture2D(u_image, texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
                texture2D(u_image, texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
            
            // Divide the sum by the weight but just use rgb
            // we'll set alpha to 1.0
            gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
        }
    `, {
        "u_kernel[0]": kernels[options.name],
        u_kernelWeight: computeKernelWeight(kernels[options.name])
    });
}

export default filter;