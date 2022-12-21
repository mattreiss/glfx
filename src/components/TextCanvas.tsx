import React, { useEffect, useRef } from 'react';

export type TextStyleType = "bold" | "italic" | "underline" | "color";
export type TextSelection = [number, number];

export type TextStyle = {
    type: TextStyleType,
    selection: TextSelection,
    value?: string,
}

export type TextCanvasProps = {
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

const TextCanvas : React.FC<TextCanvasProps> = ({
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

        // measure text dimensions
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const textX = x - (textWidth / 2);
        const textY = y - (textHeight / 2);

        if (textSelection && focused) {
            // get selection position
            const selectionStart = ctx.measureText(text.substring(0, textSelection[0])).width;
            const selectionEnd = ctx.measureText(text.substring(0, textSelection[1])).width;

            // draw selection
            ctx.fillStyle = 'rgba(50,150,255,0.4)';
            ctx.fillRect(textX + selectionStart, textY, selectionEnd - selectionStart, textHeight);
            console.log(textX + selectionStart, textY, selectionEnd - selectionStart, textHeight);
        }


        // draw text
        ctx.fillStyle = 'black';
        ctx.fillText(text, x, y);
    }, [
        width,
        height,
        text,
        textStyles,
        textSelection,
        fontFamily,
        fontSize
    ]);

    useEffect(() => {
        if (!focused) return;
        function onKeyPress(e: KeyboardEvent) {
            let newText = text + e.key;
            if (textSelection) {
                // i is inclusive
                // j is exclusive
                const [i, j] = textSelection;
                if (i === 0) {
                    newText = text.substring(j);
                } else {
                    newText = text.substring(0, i);
                    newText += e.key;
                    newText += text.substring(j);
                }
            }
            setText?.(newText);
        }
        function onKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case "Escape":
                    setFocused?.(false);
                    break;
            }
        }
        document.addEventListener("keypress", onKeyPress);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keypress", onKeyPress);
            document.removeEventListener("keydown", onKeyDown);
        }
    }, [
        focused, 
        setFocused,
        text,
        setText,
        textSelection,
        setTextSelection
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

export default TextCanvas;