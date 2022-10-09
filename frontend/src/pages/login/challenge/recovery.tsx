import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
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
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEffectOnce } from 'react-use';
import api from 'services/api';

interface FormInputs {
    code: string;
}

function Recovery() {
    const { t } = useTranslation('tfc');
    const router = useRouter();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm<FormInputs>();

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        const { code } = data;
        await api.get('/sanctum/csrf-cookie');
        try {
            await api.post('/two-factor-challenge', {
                recovery_code: code,
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
                <title>{t('recovery-title')}</title>
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
                                        {t('recovery-description')}
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
                                    <Input
                                        type="text"
                                        placeholder="gtokyazrwC-BVPTAq1lpd"
                                        maxLength={21}
                                        isDisabled={isLoading}
                                        {...register('code', {
                                            required: true,
                                        })}
                                    />
                                    <HStack spacing={5}>
                                        <Button
                                            w="full"
                                            onClick={() =>
                                                router.push('/login/challenge')
                                            }
                                            textTransform="uppercase"
                                        >
                                            {t('recovery-back')}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            isLoading={isLoading}
                                            type="submit"
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

export default Recovery;
