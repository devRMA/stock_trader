import { Meta, StoryFn } from '@storybook/react/types-6-0';

import Logo, { LogoProps } from '.';

export default {
    title: 'Logo',
    component: Logo,
    args: {
        width: 32,
        height: 32,
        layout: 'intrinsic',
    },
    argTypes: {
        width: { type: 'number' },
        height: { type: 'number' },
        layout: { type: 'string' },
    },
} as Meta;

export const Basic: StoryFn<LogoProps> = (args) => <Logo {...args} />;
