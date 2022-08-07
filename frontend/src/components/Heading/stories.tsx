import { Meta, Story } from '@storybook/react/types-6-0';

import Heading, { HeadingProps } from '.';

export default {
    title: 'Heading',
    component: Heading,
    args: {
        children: 'Lorem Ipsum',
    },
    argTypes: {
        children: { type: 'string' },
    },
} as Meta;

export const Template: Story<HeadingProps> = (args) => <Heading {...args} />;
