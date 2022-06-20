
type Render2dImagesFn = (
    images: Array<CanvasImageSource>,
    canvas: HTMLCanvasElement
) => void;

export const render2dImages: Render2dImagesFn = (images, canvas) => {
    const ctx = canvas.getContext('2d');
    // clear canvas
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
    // draw images
    images.forEach(image => {
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    })
}

type RenderWebGLImageFn = (
    image: TexImageSource, 
    canvas: HTMLCanvasElement
) => void;

export const renderWebGLImage: RenderWebGLImageFn = async (image, canvas) => {
    const gl = canvas.getContext('webgl');
    if (!gl) {
        throw "WebGL context could not be loaded!"
    }

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, `
        attribute vec2 position;
        varying vec2 v_coord;

        void main() {
            gl_Position = vec4(position, 0, 1);
            v_coord = gl_Position.xy * 0.5 + 0.5;
        }
    `);

    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        
        void main() {
            vec4 sampleColor = texture2D(u_texture, vec2(v_coord.x, 1.0 - v_coord.y));
            gl_FragColor = sampleColor;
        }
    `);
    
    const program = createProgram(gl, [vertexShader, fragmentShader]);
    
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    // const colorUniformLocation = gl.getUniformLocation(program, 'color');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // gl.STATIC_DRAW tells WebGL that the data are not likely to change.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, -1, 1, 1, -1,
        1, 1, 1, -1, -1, 1,
    ]), gl.STATIC_DRAW);

    const texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
 export function compileShader(
    gl: WebGLRenderingContext, 
    shaderType: number,
    shaderSource: string, 
): WebGLShader {
    // Create the shader object
    var shader = gl.createShader(shaderType);

    if (!shader) {
        throw "Could not create shader!"
    }

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation; get the error
        const error = "could not compile shader:" + gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw error;
    }

    return shader;
}

/**
 * Creates a program from shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} shaders A list of vertex shaders.
 * @param {string[]} [opt_attribs] An array of attribs names.
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @return {!WebGLProgram} A program.
 */
export function createProgram(
    gl: WebGLRenderingContext, 
    shaders: WebGLShader[], 
    opt_attribs?: string[],
    opt_locations?: number[],
): WebGLProgram {
    // create a program.
    var program = gl.createProgram();

    if (!program) {
        throw "Could not create program!"
    }
    
    // attach the shaders.
    shaders.forEach((shader) => {
        gl.attachShader(program!, shader);
    });
    if (opt_attribs) {
        opt_attribs.forEach(function(attrib, ndx) {
        gl.bindAttribLocation(
            program!,
            opt_locations ? opt_locations[ndx] : ndx,
            attrib);
        });
    }
    // link the program.
    gl.linkProgram(program);
    
    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        const error = ("program failed to link:" + gl.getProgramInfoLog (program));
        gl.deleteProgram(program);
        throw error;
    }
    
    return program;
};



/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:webgl-utils
 */
export function resizeCanvasToDisplaySize(
    canvas: HTMLCanvasElement, 
    multiplier?: number
): boolean {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
    }
    return false;
}
  
export function setRectangle(gl: { bufferData: (arg0: any, arg1: Float32Array, arg2: any) => void; ARRAY_BUFFER: any; STATIC_DRAW: any; }, x: number, y: number, width: any, height: any) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), gl.STATIC_DRAW);
}

function isArray(obj: any) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

function isNumber(obj: any) {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

export function setUniforms(gl: { useProgram: (arg0: any) => void; getUniformLocation: (arg0: any, arg1: string) => any; uniform1fv: (arg0: any, arg1: Float32Array) => void; uniform1i: (arg0: any, arg1: any) => void; uniform2fv: (arg0: any, arg1: Float32Array) => void; uniform3fv: (arg0: any, arg1: Float32Array) => void; uniform4fv: (arg0: any, arg1: Float32Array) => void; uniformMatrix3fv: (arg0: any, arg1: boolean, arg2: Float32Array) => void; uniformMatrix4fv: (arg0: any, arg1: boolean, arg2: Float32Array) => void; uniform1f: (arg0: any, arg1: any) => void; }, program: WebGLProgram, uniforms: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) {
    gl.useProgram(program);
    for (var name in uniforms) {
        if (!uniforms.hasOwnProperty(name)) continue;
        var location = gl.getUniformLocation(program, name);
        if (location === null) continue; // will be null if the uniform isn't used in the shader
        var value = uniforms[name];
        if (name.endsWith('[0]')) {
            gl.uniform1fv(location, value);
        } else if (name === "map") { // used in curves
            gl.uniform1i(location, value);
        } else if (isArray(value)) {
            switch (value.length) {
                case 1: gl.uniform1fv(location, new Float32Array(value)); break;
                case 2: gl.uniform2fv(location, new Float32Array(value)); break;
                case 3: gl.uniform3fv(location, new Float32Array(value)); break;
                case 4: gl.uniform4fv(location, new Float32Array(value)); break;
                case 9: gl.uniformMatrix3fv(location, false, new Float32Array(value)); break;
                case 16: gl.uniformMatrix4fv(location, false, new Float32Array(value)); break;
                default: throw 'dont\'t know how to load uniform "' + name + '" of length ' + value.length;
            }
        } else if (isNumber(value)) {
            gl.uniform1f(location, value);
        } else {
            throw 'attempted to set uniform "' + name + '" to invalid value ' + (value || 'undefined').toString();
        }
    }
}

export function clamp(lo: number, value: number, hi: number) {
    return Math.max(lo, Math.min(value, hi));
}

export function runFragmentShader(
    image: { width: any; height: any; }, 
    canvas: { getContext: (arg0: string) => any; }, 
    fragmentShaderString: string, 
    uniforms: any,
    _gl: WebGLRenderingContext | undefined=undefined) {
    const gl = _gl || canvas.getContext('webgl');

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        
        uniform vec2 u_resolution;
        
        varying vec2 texCoord;
        
        void main() {
            // convert the rectangle from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;
            
            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;
            
            // convert from 0->2 to -1->+1 (clipspace)
            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            
            // pass the texCoord to the fragment shader
            // The GPU will interpolate this value between points.
            texCoord = a_texCoord;
        }
    `);

    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);
    
    const program = createProgram(gl, [vertexShader, fragmentShader]);


    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle( gl, 0, 0, image.width, image.height);

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // resizeCanvasToDisplaySize(gl.canvas);
    
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // set the size of the image
    gl.uniform2f(textureSizeLocation, image.width, image.height);

    // lookup and set uniforms
    setUniforms(gl, program, uniforms);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

// from spline.js in glfx.js
// from SplineInterpolator.cs in the Paint.NET source code

export function SplineInterpolator(this: any, points: any[]) {
    var n = points.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];

    points.sort(function(a: number[], b: number[]) {
        return a[0] - b[0];
    });
    for (var i = 0; i < n; i++) {
        this.xa.push(points[i][0]);
        this.ya.push(points[i][1]);
    }

    this.u[0] = 0;
    this.y2[0] = 0;

    for (var i = 1; i < n - 1; ++i) {
        // This is the decomposition loop of the tridiagonal algorithm. 
        // y2 and u are used for temporary storage of the decomposed factors.
        var wx = this.xa[i + 1] - this.xa[i - 1];
        var sig = (this.xa[i] - this.xa[i - 1]) / wx;
        var p = sig * this.y2[i - 1] + 2.0;

        this.y2[i] = (sig - 1.0) / p;

        var ddydx = 
            (this.ya[i + 1] - this.ya[i]) / (this.xa[i + 1] - this.xa[i]) - 
            (this.ya[i] - this.ya[i - 1]) / (this.xa[i] - this.xa[i - 1]);

        this.u[i] = (6.0 * ddydx / wx - sig * this.u[i - 1]) / p;
    }

    this.y2[n - 1] = 0;

    // This is the backsubstitution loop of the tridiagonal algorithm
    for (var i = n - 2; i >= 0; --i) {
        this.y2[i] = this.y2[i] * this.y2[i + 1] + this.u[i];
    }
}

SplineInterpolator.prototype.interpolate = function(x: number) {
    var n = this.ya.length;
    var klo = 0;
    var khi = n - 1;

    // We will find the right place in the table by means of
    // bisection. This is optimal if sequential calls to this
    // routine are at random values of x. If sequential calls
    // are in order, and closely spaced, one would do better
    // to store previous values of klo and khi.
    while (khi - klo > 1) {
        var k = (khi + klo) >> 1;

        if (this.xa[k] > x) {
            khi = k; 
        } else {
            klo = k;
        }
    }

    var h = this.xa[khi] - this.xa[klo];
    var a = (this.xa[khi] - x) / h;
    var b = (x - this.xa[klo]) / h;

    // Cubic spline polynomial is now evaluated.
    return a * this.ya[klo] + b * this.ya[khi] + 
        ((a * a * a - a) * this.y2[klo] + (b * b * b - b) * this.y2[khi]) * (h * h) / 6.0;
};
