import React, { useEffect, useRef } from 'react';

type TextStyleType = "bold" | "italic" | "underline" | "color";
type TextSelection = [number, number];

type TextStyle = {
    type: TextStyleType,
    selection: TextSelection,
    value?: string,
}

type TextProps = {
    width: number;
    height: number;
    text: string;
    textStyles: TextStyle[];
    textSelection: TextSelection;
    fontFamily: string;
    fontSize: number;
    onClick?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onChange?: (text: string) => void;
    onSelection?: (selection: TextSelection) => void;
    onUpdateHeight?: (height: number) => void;
};

const Text : React.FC<TextProps> = ({
    width,
    height,
    text,
    textStyles,
    textSelection,
    fontFamily,
    fontSize,
    onClick,
    onFocus,
    onBlur,
    onChange,
    onSelection,
    onUpdateHeight
}) => {
    const ref = useRef<HTMLCanvasElement>(null);   

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // set text position
        const x = width / 2;
        const y = height / 2;

        // set text properties
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = 'black'
        ctx.fillText(text, x, y);
    }, [
        width,
        height,
        text,
        textStyles,
        textSelection,
        fontFamily,
        fontSize,
        onClick,
        onChange,
        onSelection,
    ]);

    return (
        <canvas 
            ref={ref}
            width={width}
            height={height}
            style={{ border: '1px solid red' }}
        />
    )
};

export default Text;