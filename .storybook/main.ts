import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  // ❌ Remove addons like addon-essentials, actions, controls, docs, etc.
  addons: [],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  features: {
    actions: true,       // replaces addon-actions
    backgrounds: true,   // replaces addon-backgrounds
    controls: true,      // replaces addon-controls
  },

  docs: {
    // autodocs property removed to fix type error
  },
};

export default config;
