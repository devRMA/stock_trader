import { Meta, StoryFn } from '@storybook/react/types-6-0';
import { FaFacebook, FaGithub } from 'react-icons/fa';

import SocialButton, { SocialButtonProps } from '.';

const icons = {
    FaFacebook: <FaFacebook />,
    FaGithub: <FaGithub />,
};

export default {
    title: 'Social Button',
    component: SocialButton,
    args: {
        children: <FaGithub />,
        label: 'Github',
        href: 'https://github.com/devRMA',
    },
    argTypes: {
        children: {
            options: Object.keys(icons),
            mapping: icons,
            control: {
                labels: {
                    FaGithub: 'Github',
                    FaFacebook: 'Facebook',
                },
            },
        },
        label: { type: 'string' },
        href: { type: 'string' },
    },
} as Meta;

export const Basic: StoryFn<SocialButtonProps> = (args) => (
    <SocialButton {...args} />
);
