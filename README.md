# glfx
Rewrite of https://github.com/evanw/glfx.js

# usage
Apply effects with the Canvas component
```
import { Canvas } from '@mattreiss/glfx';

export const Preview = () => {
    const ref = useRef<HTMLCanvasElement>();
    return (
        <Canvas 
            innerRef={ref}
            image={image}
            effects={[
                {
                    denoise: {
                        exponent: 10,
                    }
                }, {
                    noise: {
                        amount: 0.5,
                    }
                }, {
                    hueSaturation: {
                        hue: 0.5,
                        saturation: 0.5,
                    }
                }, {
                    vibrance: {
                        amount: 0.9,
                    }
                }, {
                    sepia: {
                        amount: 0.9
                    }
                }, {
                    swirl: {
                        center: [ width / 2, height / 2 ],
                        radius: width / 2,
                        angle: -Math.PI * 2,
                    }
                }, {
                    curves: {
                        red: [[0,0], [1, 1]],
                        green: [[0,0], [1,1]],
                        blue: [[0,0], [1,1]],
                    }
                }, {
                    brightnessContrast: {
                        brightness:  0,
                        contrast:  0.01,
                    }
                }
            ]}
        />
    )
}
```
or with the applyEffects function
```
import { applyEffects } from '@mattreiss/glfx';

function render(canvas) {
    const _canvas = applyEffects(
        canvas, 
        [
            {
                denoise: {
                    exponent: 10,
                }
            }, {
                noise: {
                    amount: 0.5,
                }
            }, {
                hueSaturation: {
                    hue: 0.5,
                    saturation: 0.5,
                }
            }, {
                vibrance: {
                    amount: 0.9,
                }
            }, {
                sepia: {
                    amount: 0.9
                }
            }, {
                swirl: {
                    center: [ width / 2, height / 2 ],
                    radius: width / 2,
                    angle: -Math.PI * 2,
                }
            }, {
                curves: {
                    red: [[0,0], [1, 1]],
                    green: [[0,0], [1,1]],
                    blue: [[0,0], [1,1]],
                }
            }, {
                brightnessContrast: {
                    brightness:  0,
                    contrast:  0.01,
                }
            }
        ]
    );
    return _canvas;
}
```