import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Link,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { GetStaticPropsContext } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import api from 'services/api';

interface FormInputs {
    code: string;
}

function Challenge() {
    const { t } = useTranslation('tfc');
    const router = useRouter();
    const toast = useToast();
    const submitBtn = useRef<HTMLButtonElement>(null);
    const {
        control,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = useForm<FormInputs>();

    const onSubmit = handleSubmit(async (data) => {
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
                        break;

                    default:
                        throw error;
                }
            } else {
                throw error;
            }
        }
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
                    <Heading fontSize="4xl">{t('title')}</Heading>
                    <Text fontSize="lg" color="gray.600">
                        {t('description')}
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
                                <Controller
                                    name="code"
                                    control={control}
                                    rules={{
                                        required: true,
                                        minLength: 6,
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <PinInput
                                            onChange={onChange}
                                            value={value}
                                            isDisabled={isSubmitting}
                                            isInvalid={!!error}
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
                            <Stack>
                                <Text fontSize="sm">
                                    <NextLink
                                        href="/login/challenge/recovery"
                                        passHref
                                    >
                                        <Link>{t('another-way')}</Link>
                                    </NextLink>
                                </Text>
                            </Stack>
                            <HStack spacing={5}>
                                <Button
                                    w="full"
                                    onClick={() => router.push('/login')}
                                    textTransform="uppercase"
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    bg="orange.400"
                                    colorScheme="orange"
                                    _hover={{
                                        bg: 'orange.500',
                                    }}
                                    isLoading={isSubmitting}
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

export default Challenge;
