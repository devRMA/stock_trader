import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Logo from 'components/Logo';
import OAuthButtons from 'components/OAuthButtons';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useEffectOnce, useSearchParam } from 'react-use';
import api from 'services/api';

interface FormInputs {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

function Register() {
    const { t } = useTranslation('login');
    const errorCode = useSearchParam('code');
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onToggle } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        console.log(data);
        // const { email, password, remember } = data;
        // await api.get('/sanctum/csrf-cookie');
        // try {
        //     const resp = await api.post<{
        //         two_factor: boolean;
        //     }>('/login', {
        //         email,
        //         password,
        //         remember,
        //     });
        //     if (resp.data.two_factor) {
        //         router.push('/login/challenge');
        //     } else {
        //         router.push('/');
        //     }
        // } catch (error) {
        //     if (axios.isAxiosError(error) && error.response) {
        //         const resp = error.response;
        //         switch (resp.status) {
        //             case 403:
        //                 router.push('/');
        //                 setIsLoading(false);
        //                 break;

        //             case 422:
        //                 toast({
        //                     title: t('login-fail'),
        //                     status: 'error',
        //                     duration: 20_000,
        //                     position: 'top-right',
        //                     isClosable: true,
        //                 });
        //                 setIsLoading(false);
        //                 break;

        //             default:
        //                 throw error;
        //         }
        //     } else {
        //         throw error;
        //     }
        // }
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
        <>
            <Head>
                <title>{t('sign-in')}</title>
            </Head>
            <Stack minH="100vh" align="center" justify="center">
                <Container maxW="lg">
                    <Stack spacing="8">
                        <Stack spacing="6">
                            <Logo width={48} height={48} />
                            <Stack
                                spacing={{ base: '2', md: '3' }}
                                textAlign="center"
                            >
                                <Heading
                                    size={useBreakpointValue({
                                        base: 'xs',
                                        md: 'sm',
                                    })}
                                >
                                    {t('sign-in')}
                                </Heading>
                                <HStack spacing="1" justify="center">
                                    <Text color="muted">{t('new-here')}</Text>
                                    <NextLink href="/register" passHref>
                                        <Button
                                            variant="link"
                                            as={Link}
                                            colorScheme="orange"
                                        >
                                            {t('create-account')}
                                        </Button>
                                    </NextLink>
                                </HStack>
                            </Stack>
                        </Stack>
                        <form onSubmit={onSubmit}>
                            <Box
                                py={{ base: '0', sm: '8' }}
                                px={{ base: '4', sm: '10' }}
                                bg={useBreakpointValue({
                                    base: 'transparent',
                                    sm: 'bg-surface',
                                })}
                                boxShadow={{
                                    base: 'none',
                                    sm: useColorModeValue('md', 'md-dark'),
                                }}
                                borderRadius={{ base: 'none', sm: 'xl' }}
                            >
                                <Stack spacing="6">
                                    <Stack spacing="5">
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
                                                {errors.email &&
                                                    errors.email.message}
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
                                                        isOpen
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    autoComplete="current-password"
                                                    {...register('password', {
                                                        required: t('required'),
                                                    })}
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        variant="link"
                                                        icon={
                                                            isOpen ? (
                                                                <HiEyeOff />
                                                            ) : (
                                                                <HiEye />
                                                            )
                                                        }
                                                        aria-label={
                                                            isOpen
                                                                ? t(
                                                                      'mask-password',
                                                                  )
                                                                : t(
                                                                      'reveal-password',
                                                                  )
                                                        }
                                                        onClick={onToggle}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>
                                                {errors.password &&
                                                    errors.password.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </Stack>
                                    <HStack>
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
                                    </HStack>
                                    <Stack spacing="6">
                                        <Button
                                            variant="primary"
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
                                        <HStack justify="center">
                                            <OAuthButtons />
                                        </HStack>
                                    </Stack>
                                </Stack>
                            </Box>
                        </form>
                    </Stack>
                </Container>
            </Stack>
        </>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'pt', [
                'register',
                'header',
            ])),
        },
    };
}

export default Register;
