import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import type { AddonOptionsVite } from '@storybook/addon-coverage';


const coverageConfig: AddonOptionsVite = {
  istanbul: {
    include: ['src/**'],
  },
};
 
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
    {
      name: '@storybook/addon-coverage',
      options: coverageConfig,
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  staticDirs: ["../sample"],
};
 
export default config;
