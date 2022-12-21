import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TextCanvas from './TextCanvas';

export default {
  title: 'components/TextCanvas',
  component: TextCanvas,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof TextCanvas>;

const width = 300;
const height = 300;

const Template: ComponentStory<typeof TextCanvas> = (args) => {
  return (
    <TextCanvas {...args}
      width={width}
      height={height} />
  )
};

export const Default = Template.bind({});

Default.args = {
  text: "Sample Text",
  textStyles: [],
  textSelection: [0,0],
  fontFamily: "arial",
  fontSize: 48,
  focused: true,
  onClick: () => console.log("click"),
  setText: (text) => console.log("setText", text),
};

export const Selection = Template.bind({});

Selection.args = {
  text: "Sample Text",
  textStyles: [],
  textSelection: [3,10],
  fontFamily: "arial",
  fontSize: 48,
  focused: true,
  onClick: () => console.log("click"),
  setText: (text) => console.log("setText", text),
};
