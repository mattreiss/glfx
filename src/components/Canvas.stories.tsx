import React, { useEffect, useRef, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Canvas from './Canvas';

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