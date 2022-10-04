import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import OAuthButtons from 'components/OAuthButtons';
import { GetStaticPropsContext } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useEffectOnce, useSearchParam } from 'react-use';
import api from 'services/api';

interface FormInputs {
    email: string;
    password: string;
    remember: boolean;
}

function Login() {
    const { t } = useTranslation('login');
    const errorCode = useSearchParam('code');
    const router = useRouter();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            remember: true,
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        const { email, password, remember } = data;
        await api.get('/sanctum/csrf-cookie');
        try {
            const resp = await api.post<{
                two_factor: boolean;
            }>('/login', {
                email,
                password,
                remember,
            });
            if (resp.data.two_factor) {
                router.push('/login/challenge');
            } else {
                router.push('/');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const resp = error.response;
                switch (resp.status) {
                    case 403:
                        router.push('/');
                        setIsLoading(false);
                        break;

                    case 422:
                        toast({
                            title: t('login-fail'),
                            status: 'error',
                            duration: 20_000,
                            position: 'top-right',
                            isClosable: true,
                        });
                        setIsLoading(false);
                        break;

                    default:
                        throw error;
                }
            } else {
                throw error;
            }
        }
    });

    useEffectOnce(() => {
        if (errorCode) {
            switch (errorCode) {
                case '1': {
                    toast({
                        title: t('toast-error-title'),
                        description: t('toast-error-code-1'),
                        status: 'error',
                        duration: 20_000,
                        position: 'top-right',
                        isClosable: true,
                    });
                    break;
                }
                case '2': {
                    toast({
                        title: t('toast-error-title'),
                        description: t('toast-error-code-2'),
                        status: 'error',
                        duration: 20_000,
                        position: 'top-right',
                        isClosable: true,
                    });
                    break;
                }
                case '3': {
                    toast({
                        title: t('toast-error-title'),
                        description: t('toast-error-code-3'),
                        status: 'error',
                        duration: 20_000,
                        position: 'top-right',
                        isClosable: true,
                    });
                    break;
                }

                // no default
            }
            router.push(router.pathname);
        }

        return () => toast.closeAll();
    });

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack w="full" spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center">
                    <Heading fontSize="4xl">{t('sign-in')}</Heading>
                    <Text fontSize="lg" color="gray.600">
                        {t('new-here')}
                        <NextLink href="/register" passHref>
                            <Link color="orange.400">
                                {t('create-account')}
                            </Link>
                        </NextLink>
                    </Text>
                </Stack>
                <form onSubmit={onSubmit}>
                    <Box
                        rounded="lg"
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="2xl"
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl
                                id="email"
                                isInvalid={Boolean(errors.email)}
                            >
                                <FormLabel htmlFor="email">
                                    {t('email')}
                                </FormLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register('email', {
                                        required: t('required'),
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl
                                id="password"
                                isInvalid={Boolean(errors.password)}
                            >
                                <FormLabel htmlFor="password">
                                    {t('password')}
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        id="password"
                                        placeholder="********"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        {...register('password', {
                                            required: t('required'),
                                        })}
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
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>
                            <Stack spacing={6}>
                                <Controller
                                    name="remember"
                                    control={control}
                                    render={({
                                        field: { onChange, value, ref },
                                    }) => (
                                        <Checkbox
                                            onChange={onChange}
                                            ref={ref}
                                            isChecked={value}
                                        >
                                            {t('remember')}
                                        </Checkbox>
                                    )}
                                />
                                <Button
                                    bg="orange.400"
                                    colorScheme="orange"
                                    _hover={{
                                        bg: 'orange.500',
                                    }}
                                    isLoading={isLoading}
                                    type="submit"
                                >
                                    {t('sign-in-btn')}
                                </Button>
                                <HStack>
                                    <Divider />
                                    <Text
                                        fontSize="sm"
                                        whiteSpace="nowrap"
                                        color="muted"
                                    >
                                        {t('or')}
                                    </Text>
                                    <Divider />
                                </HStack>
                                <OAuthButtons />
                            </Stack>
                        </Stack>
                    </Box>
                </form>
            </Stack>
        </Flex>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'pt', [
                'login',
                'oauth',
            ])),
        },
    };
}

export default Login;
