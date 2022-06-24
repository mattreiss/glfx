import React, { MutableRefObject, useEffect, useRef } from 'react';
import { render2dImages, renderWebGLImage } from '../canvas';
import * as fx from '../fx';

export type EffectProps = {
    brightnessContrast?: fx.BrightnessContrastOptions,
    denoise?: fx.DenoiseOptions,
    noise?: fx.NoiseOptions,
    hueSaturation?: fx.HueSaturationOptions,
    vibrance?: fx.VibranceOptions,
    sepia?: fx.SepiaOptions,
    swirl?: fx.SwirlOptions,
    curves?: fx.CurvesOptions
}

export function applyEffects(
    image:TexImageSource,
    effects?: EffectProps[]
) {
    const _canvas = document.createElement('canvas');
    _canvas.width = image.width;
    _canvas.height = image.height;
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
    return _canvas;
}

type CanvasProps = {
    width: number;
    height: number;
    image: TexImageSource,
    innerRef: MutableRefObject<HTMLCanvasElement | undefined>,
    effects?: EffectProps[]
    onClick?: () => void;
    onChange?: () => void;
};

const Canvas : React.FC<CanvasProps> = ({
    width,
    height,
    image,
    effects,
    innerRef,
    onChange,
    ...props
}) => {
    const ref = useRef<HTMLCanvasElement>();    
    useEffect(() => {
        const canvas = innerRef.current || ref.current;
        if (!canvas) {
            return;
        }
        const _canvas = applyEffects(image, effects);
        render2dImages([_canvas], canvas);
        onChange?.()
    }, [
        width,
        height,
        image,
        effects,
        innerRef
    ]);

    return (
        <canvas 
            ref={innerRef ? innerRef as any : ref}
            width={width}
            height={height}
            style={{ border: '1px solid red' }}
            {...props} />
    )
};

export default Canvas;