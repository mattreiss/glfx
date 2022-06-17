import React from 'react';

type CanvasProps = {
    width?: number;
    height?: number;
    onClick?: () => void;
}

const Canvas: React.FC<CanvasProps> = (props) => {
    console.log('render Canvas')
    return (
        <canvas {...props} />
    )
}

export default Canvas;