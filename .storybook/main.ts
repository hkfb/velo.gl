import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
 
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  staticDirs: ["../sample"],
};
 
export default config;
