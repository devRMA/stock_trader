import {
    ButtonGroup,
    Container,
    Divider,
    Select,
    Stack,
    Text,
} from '@chakra-ui/react';
import DarkModeSwitch from 'components/DarkModeSwitch';
import SocialButton from 'components/SocialButton';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { FaGithub } from 'react-icons/fa';

function Footer() {
    const router = useRouter();

    const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
        router.push(router.pathname, router.asPath, {
            locale: event.target.value,
            scroll: false,
        });
    };

    return (
        <Container as="footer" role="contentinfo">
            <Divider />
            <Stack
                pt="8"
                pb="12"
                justify="space-between"
                direction={{ base: 'column-reverse', md: 'row' }}
                align="center"
            >
                <Text fontSize="sm" color="subtle">
                    &copy; {new Date().getFullYear()} devRMA
                </Text>
                <ButtonGroup spacing={4}>
                    <SocialButton
                        label="Github"
                        href="https://github.com/devRMA/stock_trader"
                    >
                        <FaGithub />
                    </SocialButton>
                    <DarkModeSwitch />
                </ButtonGroup>
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
            </Stack>
        </Container>
    );
}

export default Footer;
