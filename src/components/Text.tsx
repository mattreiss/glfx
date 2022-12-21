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
    setHeight?: (height: number) => void;
    text: string;
    setText?: (text: string) => void;
    textStyles: TextStyle[];
    textSelection?: TextSelection;
    setTextSelection?: (selection: TextSelection) => void;
    fontFamily: string;
    fontSize: number;
    onClick?: () => void;
    focused?: boolean;
    setFocused?: (focused: boolean) => void;
};

const Text : React.FC<TextProps> = ({
    width,
    height,
    setHeight,
    text,
    setText,
    textStyles,
    textSelection,
    setTextSelection,
    fontFamily,
    fontSize,
    onClick,
    focused,
    setFocused,
}) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const clickRef = useRef<number>(0); 
    const clickTimeoutRef = useRef<any>(); 

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, width, height);

        // set text position
        const x = width / 2;
        const y = height / 2;

        // set text properties
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = 'black';
        ctx.fillText(text, x, y);
        console.log("draw text", text);
    }, [
        width,
        height,
        text,
        textStyles,
        textSelection,
        fontFamily,
        fontSize
    ]);

    const onDoubleClick = () => {
        setFocused?.(true);
    }

    const waitForDoubleClick = () => {
        clickRef.current += 1;
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }
        if (clickRef.current === 2) {
            onDoubleClick();
            clickRef.current = 0;
        }
        clickTimeoutRef.current = setTimeout(() => {
            if (clickRef.current === 1) {
                onClick?.();
            }
            clickRef.current = 0;
        }, 400);
    }

    return (
        <canvas 
            ref={ref}
            width={width}
            height={height}
            style={{ border: '1px solid red' }}
            onClick={waitForDoubleClick}
        />
    )
};

export default Text;