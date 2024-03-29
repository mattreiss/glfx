import { themes } from '@storybook/theming';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    // Set the initial theme
    current: 'dark',
    // Override the default dark theme
    // dark: { ...themes.dark, appBg: 'black' },
    // // Override the default light theme
    // light: { ...themes.normal, appBg: 'red' }
  }
}