import React, { MutableRefObject, useEffect } from 'react';
import { render2dImages, renderWebGLImage } from '../canvas';
import * as fx from '../fx';

type EffectProps = {
    brightnessContrast?: fx.BrightnessContrastOptions,
    denoise?: fx.DenoiseOptions,
    noise?: fx.NoiseOptions,
    hueSaturation?: fx.HueSaturationOptions,
    vibrance?: fx.VibranceOptions,
    sepia?: fx.SepiaOptions,
    swirl?: fx.SwirlOptions,
    curves?: fx.CurvesOptions
}

type CanvasProps = {
    width: number;
    height: number;
    onClick?: () => void;
    image: TexImageSource,
    innerRef: MutableRefObject<HTMLCanvasElement>,
    effects?: EffectProps[]
};

const Canvas : React.FC<CanvasProps> = ({
    width,
    height,
    image,
    effects,
    innerRef,
    ...props
}) => {
    useEffect(function applyEffects(){
        if (!innerRef.current) {
            return;
        }
        const _canvas = document.createElement('canvas');
        _canvas.width = width;
        _canvas.height = height;
        renderWebGLImage(image, _canvas);
        effects?.forEach((effectProps: EffectProps) => {
            console.log('render Canvas', effectProps);
            Object.keys(effectProps).forEach((name) => {
                const _name = name as keyof typeof effectProps;
                if (effectProps[_name]) {
                    const options: any = effectProps[_name];
                    fx[_name](_canvas, _canvas, options);
                }
            })
        })
        render2dImages([_canvas], innerRef.current);
    }, [
        width,
        height,
        image,
        effects,
        innerRef
    ]);

    return (
        <canvas 
            ref={innerRef}
            width={width}
            height={height}
            {...props} />
    )
};

export default Canvas;