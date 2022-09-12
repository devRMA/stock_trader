import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    ButtonProps,
    chakra,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';

function DarkModeSwitch(props: ButtonProps) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded="full"
            w={8}
            h={8}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            transition="background 0.3s ease"
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}
            onClick={toggleColorMode}
            aria-label="Toggle Theme"
            _focus={{ boxShadow: 'none' }}
            {...props}
        >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </chakra.button>
    );
}

export default DarkModeSwitch;
