import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Logo from 'components/Logo';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useEffectOnce } from 'react-use';
import api from 'services/api';

interface FormInputs {
    code: string;
}

function Challenge() {
    const { t } = useTranslation('tfc');
    const router = useRouter();
    const toast = useToast();
    const submitBtn = useRef<HTMLButtonElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, setValue } = useForm<FormInputs>();

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        const { code } = data;
        await api.get('/sanctum/csrf-cookie');
        try {
            await api.post('/two-factor-challenge', {
                code,
            });
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const resp = error.response;
                switch (resp.status) {
                    case 422:
                        toast({
                            title: t('challenge-fail'),
                            status: 'error',
                            duration: 20_000,
                            position: 'top-right',
                            isClosable: true,
                        });
                        setValue('code', '', {
                            shouldValidate: false,
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
        return () => toast.closeAll();
    });

    return (
        <>
            <Head>
                <title>{t('title')}</title>
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
                                    {t('title')}
                                </Heading>
                                <HStack spacing="1" justify="center">
                                    <Text color="muted" textAlign="justify">
                                        {t('description')}
                                    </Text>
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
                                    <HStack justify="center">
                                        <Controller
                                            name="code"
                                            control={control}
                                            rules={{
                                                required: true,
                                                minLength: 6,
                                            }}
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <PinInput
                                                    onChange={onChange}
                                                    value={value}
                                                    isDisabled={isLoading}
                                                    onComplete={() =>
                                                        submitBtn.current?.click()
                                                    }
                                                >
                                                    <PinInputField />
                                                    <PinInputField />
                                                    <PinInputField />
                                                    <PinInputField />
                                                    <PinInputField />
                                                    <PinInputField />
                                                </PinInput>
                                            )}
                                        />
                                    </HStack>
                                    <HStack>
                                        <NextLink href="/login/challenge/recovery">
                                            <Button variant="link" size="sm">
                                                {t('another-way')}
                                            </Button>
                                        </NextLink>
                                    </HStack>
                                    <HStack spacing={5}>
                                        <Button
                                            w="full"
                                            onClick={() =>
                                                router.push('/login')
                                            }
                                            textTransform="uppercase"
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            isLoading={isLoading}
                                            type="submit"
                                            ref={submitBtn}
                                            w="full"
                                            textTransform="uppercase"
                                        >
                                            {t('send')}
                                        </Button>
                                    </HStack>
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
            ...(await serverSideTranslations(locale ?? 'pt', ['tfc'])),
        },
    };
}

export default Challenge;
