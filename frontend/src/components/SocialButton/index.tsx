import { chakra, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { ReactNode } from 'react';

export type SocialButtonProps = {
    children: ReactNode;
    label: string;
    href: string;
};

function SocialButton({ children, label, href }: SocialButtonProps) {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded="full"
            w={8}
            h={8}
            cursor="pointer"
            as="a"
            href={href}
            target="_blank"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            transition="background 0.3s ease"
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
}

export default SocialButton;
