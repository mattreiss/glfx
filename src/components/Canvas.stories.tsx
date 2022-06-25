import React, { useEffect, useRef, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Canvas from './Canvas';
import { getInverse, getSquareToQuad, multiply } from '../fx';
import { clamp } from '../canvas';

export default {
  title: 'components/Canvas',
  component: Canvas,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Canvas>;

let i = document.createElement('img');
i.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII';

const patternCanvas = document.createElement('canvas');
const patternContext = patternCanvas.getContext('2d');
if (patternContext) {
  patternCanvas.width = 20;
  patternCanvas.height = 20;
  patternContext.fillStyle = 'grey';
  patternContext.fillRect(0, 0, 10, 10);
  patternContext.fillRect(10, 10, 20, 20);
  patternContext.fillStyle = 'white';
  patternContext.fillRect(0, 10, 10, 20);
  patternContext.fillRect(10, 0, 20, 10);
}
const width = 300;
const height = 300;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
if (ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  ctx.fillStyle = pattern!;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const Template: ComponentStory<typeof Canvas> = (args) => {
  const ref = useRef<HTMLCanvasElement | undefined>();
  return (
    <Canvas {...args} 
      image={canvas} 
      innerRef={ref}
      width={width}
      height={height} />
  )
};

export const Default = Template.bind({});

Default.args = {
  effects: [{
  }]
};

export const Swirl = Template.bind({});

Swirl.args = {
  effects: [{
    swirl: {
      center: [ width / 2, height / 2 ],
      radius: width / 2,
      angle: -Math.PI * 2,
    }
  }]
};

export const BrightnessContrast = Template.bind({});

BrightnessContrast.args = {
  effects: [{
    brightnessContrast: {
      brightness: -0.1,
      contrast: 0.5,
    }
  }]
};

export const BulgePinch = Template.bind({});

BulgePinch.args = {
  effects: [{
    bulgePinch: {
      center: [ width / 2, height / 2 ],
      radius: width / 2,
      strength: 0.5,
    }
  }]
};

export const Curves = Template.bind({});

Curves.args = {
  effects: [{
    curves: {
      red: [[0,1], [1, 1]],
      green: [[0,0.2], [1,1]],
      blue: [[0,1], [0.5,0.7], [1,1]],
    }
  }]
};


export const Noise = Template.bind({});

Noise.args = {
  effects: [{
    noise: {
      amount: 0.4,
    }
  }]
};

export const Denoise = Template.bind({});

Denoise.args = {
  effects: [{
    denoise: {
      exponent: 0.4,
    }
  }]
};

export const HueSaturation = Template.bind({});

HueSaturation.args = {
  effects: [{
    curves: {
      red: [[0,1], [1, 1]],
      green: [[0,0.2], [1,1]],
      blue: [[0,1], [0.5,0.7], [1,1]],
    },
    hueSaturation: {
      hue: 0.9,
      saturation: 0.3
    }
  }]
};

export const Sepia = Template.bind({});

Sepia.args = {
  effects: [{
    sepia: {
      amount: 0.4,
    }
  }]
};


export const Vibrance = Template.bind({});

Vibrance.args = {
  effects: [{
    vibrance: {
      amount: 0.9,
    }
  }]
};

export const Vignette = Template.bind({});

Vignette.args = {
  effects: [{
    vignette: {
      amount: 0.9,
      size: 0.1,
    }
  }]
};

export const MatrixWarp = Template.bind({});

const before = [175,156,496,55,161,279,504,330].map(n => n/2);
const after = [277,229,418,221,269,297,409,315].map(n => n/2);
var a = getSquareToQuad.apply(null, after);
var b = getSquareToQuad.apply(null, before);
var c = multiply(getInverse(a), b);

MatrixWarp.args = {
  effects: [{
    matrixWarp: {
      matrix: c,
      inverse: false,
      useTextureSpace: false
    }
  }]
};


export const Perspective = Template.bind({});

Perspective.args = {
  effects: [{
    perspective: {
      before: [100,100, 200,100, 200,200, 100,200],
      after: [120,70, 180,70, 200,100, 100,100]
    }
  }]
};

export const ZoomBlur = Template.bind({});

ZoomBlur.args = {
  effects: [{
    zoomBlur: {
      strength: 0.1,
      center: [width / 2, height / 2]
    }
  }]
};

export const TiltShift = Template.bind({});

TiltShift.args = {
  effects: [{
    tiltShift: {
      startX: 45,
      startY: 180,
      endX: 240,
      endY: 145,
      blurRadius: 15,
      gradientRadius: 200
    }
  }]
};

export const TriangleBlur = Template.bind({});

TriangleBlur.args = {
  effects: [{
    triangleBlur: {
      radius: 12,
      brightness: 1,
      angle: 2.2
    }
  }]
};

export const LensBlur = Template.bind({});

LensBlur.args = {
  effects: [{
    lensBlur: {
      radius: 12,
      brightness: 1,
      angle: 2.2
    }
  }]
};

export const UnsharpMask = Template.bind({});

UnsharpMask.args = {
  effects: [{
    unsharpMask: {
      radius: 12,
      strength: 1,
    }
  }]
};


export const ColorHalftone = Template.bind({});

ColorHalftone.args = {
  effects: [{
    colorHalftone: {
      center: [width / 2, height / 2],
      size: 10,
      angle: 0.2
    }
  }]
};

export const DotScreen = Template.bind({});

DotScreen.args = {
  effects: [{
    dotScreen: {
      center: [width / 2, height / 2],
      scale: 10,
      angle: 0.9
    }
  }]
};

export const EdgeWork = Template.bind({});

EdgeWork.args = {
  effects: [{
    edgeWork: {
      radius: 20
    }
  }]
};


export const HexagonalPixelate = Template.bind({});

HexagonalPixelate.args = {
  effects: [{
    hexagonalPixelate: {
      center: [width / 2, height / 2],
      scale: 15,
    }
  }]
};

export const Ink = Template.bind({});

Ink.args = {
  effects: [{
    ink: {
      strength: 0.7
    }
  }]
};