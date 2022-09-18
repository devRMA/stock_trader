import {
    Box,
    Container,
    Select,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { FaGithub } from 'react-icons/fa';

import DarkModeSwitch from '../DarkModeSwitch';
import SocialButton from '../SocialButton';

function Footer() {
    const router = useRouter();

    const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
        router.push(router.pathname, router.asPath, {
            locale: event.target.value,
            scroll: false,
        });
    };

    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
        >
            <Container
                as={Stack}
                maxW="6xl"
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}
            >
                <Text>© 2022 devRMA</Text>
                <Stack direction="row" spacing={4}>
                    <SocialButton
                        label="Github"
                        href="https://github.com/devRMA/stock_trader"
                    >
                        <FaGithub />
                    </SocialButton>
                    <DarkModeSwitch />
                </Stack>
                <Stack>
                    <Select
                        variant="filled"
                        size={{
                            base: 'md',
                            md: 'sm',
                        }}
                        onChange={handleChangeLanguage}
                        defaultValue={router.locale}
                    >
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                    </Select>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;
