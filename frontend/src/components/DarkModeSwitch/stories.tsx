import { Meta, StoryFn } from '@storybook/react/types-6-0';

import DarkModeSwitch from '.';

export default {
    title: 'Dark Mode Stich',
    component: DarkModeSwitch,
} as Meta;

export const Basic: StoryFn = () => <DarkModeSwitch />;
