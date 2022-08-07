import { Meta, Story } from '@storybook/react/types-6-0';

import Heading, { HeadingProps } from '.';

export default {
    title: 'Heading',
    component: Heading,
    args: {
        text: 'Lorem Ipsum',
    },
    argTypes: {
        text: { type: 'string' },
    },
} as Meta;

export const Template: Story<HeadingProps> = (args) => <Heading {...args} />;
