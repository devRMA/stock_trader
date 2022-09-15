import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';
import { apiUrl } from 'services/api';

function Login() {
    const { t } = useTranslation('login');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center">
                    <Heading fontSize="4xl">{t('sign-in')}</Heading>
                    <Text fontSize="lg" color="gray.600">
                        {t('new-here')}
                        <NextLink href="/register" passHref>
                            <Link href="/register" color="orange.400">
                                {t('create-account')}
                            </Link>
                        </NextLink>
                    </Text>
                </Stack>
                <Box
                    rounded="lg"
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow="lg"
                    p={8}
                >
                    <Stack spacing={4}>
                        <Flex justify="center" gap="6">
                            <Tooltip label={t('tooltip-github')}>
                                <Button
                                    as={Link}
                                    href={`${apiUrl}/auth/github`}
                                >
                                    <Icon as={FaGithub} w={6} h={6} />
                                </Button>
                            </Tooltip>
                            <Tooltip label={t('tooltip-discord')}>
                                <Button
                                    as={Link}
                                    href={`${apiUrl}/auth/discord`}
                                >
                                    <Icon as={FaDiscord} w={6} h={6} />
                                </Button>
                            </Tooltip>
                            <Tooltip label={t('tooltip-google')}>
                                <Button
                                    as={Link}
                                    href={`${apiUrl}/auth/google`}
                                >
                                    <Icon as={FaGoogle} w={6} h={6} />
                                </Button>
                            </Tooltip>
                        </Flex>
                        <Flex align="center">
                            <Divider />
                            <Text padding="2">or</Text>
                            <Divider />
                        </Flex>
                        <FormControl id="email">
                            <FormLabel>{t('email')}</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>{t('password')}</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                />
                                <InputRightElement h="full">
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                    >
                                        {showPassword ? (
                                            <ViewIcon />
                                        ) : (
                                            <ViewOffIcon />
                                        )}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align="start"
                                justify="space-between"
                            >
                                <Checkbox defaultChecked>
                                    {t('remember')}
                                </Checkbox>
                            </Stack>
                            <Button
                                bg="orange.400"
                                color="white"
                                _hover={{
                                    bg: 'orange.500',
                                }}
                            >
                                {t('sign-in-btn')}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'pt', ['login'])),
        },
    };
}

export default Login;
