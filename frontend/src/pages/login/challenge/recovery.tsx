import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { GetStaticPropsContext } from 'next';
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
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack w="full" spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center" spacing={5}>
                    <Heading fontSize="4xl">{t('recovery-title')}</Heading>
                    <Text fontSize="lg" color="gray.600">
                        {t('recovery-description')}
                    </Text>
                </Stack>
                <form onSubmit={onSubmit}>
                    <Box
                        rounded="lg"
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="2xl"
                        py={12}
                        px={6}
                    >
                        <Stack spacing={8}>
                            <HStack justify="center">
                                <Input
                                    type="text"
                                    placeholder="gtokyazrwC-BVPTAq1lpd"
                                    maxLength={21}
                                    isDisabled={isLoading}
                                    {...register('code', {
                                        required: true,
                                    })}
                                />
                            </HStack>
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
                                    bg="orange.400"
                                    colorScheme="orange"
                                    _hover={{
                                        bg: 'orange.500',
                                    }}
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
        </Flex>
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
