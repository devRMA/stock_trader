import { Button, ButtonProps, useColorMode } from '@chakra-ui/react';
import { BsMoonStarsFill, BsSun } from 'react-icons/bs';

function DarkModeSwitch(props: ButtonProps) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button
            aria-label="Toggle Theme"
            onClick={toggleColorMode}
            _focus={{ boxShadow: 'none' }}
            w="fit-content"
            {...props}
        >
            {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
        </Button>
    );
}

export default DarkModeSwitch;
