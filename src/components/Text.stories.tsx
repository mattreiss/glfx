import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Text from './Text';
import { getInverse, getSquareToQuad, multiply } from '../fx';

export default {
  title: 'components/Text',
  component: Text,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Text>;

const width = 300;
const height = 300;

const Template: ComponentStory<typeof Text> = (args) => {
  return (
    <Text {...args}
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
  onClick: () => console.log("click")
};
