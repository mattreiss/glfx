# glfx
WebGL Effects

# usage
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
                        0.9,
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