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
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { apiUrl } from 'services/api';

function Login() {
    // TODO : i18n
    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center">
                    <Heading fontSize="4xl">Log in</Heading>
                    <Text fontSize="lg" color="gray.600">
                        New here?{' '}
                        <NextLink href="/register" passHref>
                            <Link href="/register" color="orange.400">
                                Create an account
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
                            <Button as={Link} href={`${apiUrl}/auth/github`}>
                                <Icon as={FaGithub} w={6} h={6} />
                            </Button>
                            <Button as={Link} href={`${apiUrl}/auth/discord`}>
                                <Icon as={FaDiscord} w={6} h={6} />
                            </Button>
                        </Flex>
                        <Flex align="center">
                            <Divider />
                            <Text padding="2">or</Text>
                            <Divider />
                        </Flex>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align="start"
                                justify="space-between"
                            >
                                <Checkbox>Remember me</Checkbox>
                                <NextLink href="#forgot" passHref>
                                    <Link color="orange.400" href="#forgot">
                                        Forgot password?
                                    </Link>
                                </NextLink>
                            </Stack>
                            <Button
                                bg="orange.400"
                                color="white"
                                _hover={{
                                    bg: 'orange.500',
                                }}
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

export default Login;
