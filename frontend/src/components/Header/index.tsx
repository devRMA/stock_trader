import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Collapse,
    Flex,
    HStack,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useEffectOnce } from 'react-use';
import { selectUser, useAppDispatch, useAppSelector } from 'store/hooks';
import { loadUser, logoutUser } from 'store/User.store';
import { formatMoney } from 'utils/formats';

interface NavItem {
    label: string;
    href: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Foo',
        href: '#foo',
    },
    {
        label: 'Bar',
        href: '#bar',
    },
];

function DesktopNav() {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');

    return (
        <Stack direction="row" spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <NextLink href={navItem.href} passHref>
                        <Link
                            p={2}
                            fontSize="sm"
                            fontWeight={500}
                            color={linkColor}
                            _hover={{
                                textDecoration: 'none',
                                color: linkHoverColor,
                            }}
                        >
                            {navItem.label}
                        </Link>
                    </NextLink>
                </Box>
            ))}
        </Stack>
    );
}

function MobileNav() {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');

    return (
        <Stack
            bg={useColorModeValue('white', 'gray.900')}
            p={4}
            display={{ md: 'none' }}
        >
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <NextLink href={navItem.href} passHref>
                        <Link
                            p={2}
                            fontSize="sm"
                            fontWeight={500}
                            color={linkColor}
                            _hover={{
                                textDecoration: 'none',
                                color: linkHoverColor,
                            }}
                        >
                            {navItem.label}
                        </Link>
                    </NextLink>
                </Box>
            ))}
        </Stack>
    );
}

function UserDropdown() {
    const { t } = useTranslation('header');
    const { user, loading } = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const nameColor = useColorModeValue('gray.800', 'white');
    const balanceColor = useColorModeValue('gray.600', 'gray.500');
    const bgColor = useColorModeValue('white', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const router = useRouter();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push('/');
    };

    return (
        <Menu>
            <MenuButton
                as={Button}
                variant="link"
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
                _hover={{ textDecoration: 'none' }}
            >
                <HStack justify="center">
                    <SkeletonCircle isLoaded={!loading} fadeDuration={1}>
                        <Avatar size="sm" name={user.name} src={user.avatar} />
                    </SkeletonCircle>
                    <SkeletonText
                        isLoaded={!loading}
                        fadeDuration={1}
                        noOfLines={2}
                        display={{
                            base: 'none',
                            md: 'block',
                        }}
                    >
                        <VStack alignItems="flex-start" spacing="1px" ml="2">
                            <Text fontSize="sm" color={nameColor}>
                                {user.name}
                            </Text>
                            <Text fontSize="xs" color={balanceColor}>
                                {t('balance', {
                                    money: formatMoney(user.money),
                                })}
                            </Text>
                        </VStack>
                    </SkeletonText>
                    <Box
                        display={{
                            base: 'none',
                            md: 'flex',
                        }}
                    >
                        <FiChevronDown />
                    </Box>
                </HStack>
            </MenuButton>
            <MenuList bg={bgColor} borderColor={borderColor}>
                <Stack align="center" spacing={5} py={3}>
                    <SkeletonCircle
                        isLoaded={!loading}
                        fadeDuration={1}
                        size=""
                    >
                        <Avatar size="2xl" name={user.name} src={user.avatar} />
                    </SkeletonCircle>
                    <SkeletonText
                        isLoaded={!loading}
                        fadeDuration={1}
                        noOfLines={2}
                    >
                        <VStack alignItems="center" spacing="1px">
                            <Text fontSize="md" color={nameColor}>
                                {user.name}
                            </Text>
                            <Text fontSize="sm" color={balanceColor}>
                                {t('balance', {
                                    money: formatMoney(user.money),
                                })}
                            </Text>
                        </VStack>
                    </SkeletonText>
                </Stack>
                <MenuDivider />
                <MenuItem>Your Servers</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
            </MenuList>
        </Menu>
    );
}

const AuthLinks = () => {
    const { t } = useTranslation('header');

    return (
        <>
            <NextLink href="/login" passHref>
                <Button
                    as={Link}
                    fontSize="sm"
                    fontWeight={400}
                    variant="link"
                    _hover={{ textDecoration: 'none' }}
                >
                    {t('login')}
                </Button>
            </NextLink>
            <NextLink href="#register" passHref>
                <Button
                    as={Link}
                    display={{
                        base: 'none',
                        md: 'inline-flex',
                    }}
                    fontSize="sm"
                    fontWeight={600}
                    colorScheme="orange"
                    bg="orange.400"
                    _hover={{
                        textDecoration: 'none',
                        bg: 'orange.500',
                    }}
                >
                    {t('register')}
                </Button>
            </NextLink>
        </>
    );
};

function Header() {
    const { t } = useTranslation('header');
    const { isOpen, onToggle } = useDisclosure();
    const { logged } = useAppSelector(selectUser);
    const { user } = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffectOnce(() => {
        if (!logged) {
            dispatch(loadUser());
        }
    });

    useEffect(() => {
        const bannedAllowedRoutes = ['/banned'];
        if (
            user.banned &&
            user.bans.length > 0 &&
            !bannedAllowedRoutes.includes(router.pathname)
        ) {
            router.push('/banned');
        }
    }, [user, router]);

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.900')}
                color={useColorModeValue('gray.600', 'white')}
                minH="60px"
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle="solid"
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align="center"
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? (
                                <CloseIcon w={3} h={3} />
                            ) : (
                                <HamburgerIcon w={5} h={5} />
                            )
                        }
                        variant="ghost"
                        aria-label={t('toggle-navigation')}
                    />
                </Flex>
                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: 'center', md: 'start' }}
                >
                    <Text
                        textAlign={useBreakpointValue({
                            base: 'center',
                            md: 'left',
                        })}
                        fontFamily="heading"
                        color={useColorModeValue('gray.800', 'white')}
                    >
                        Logo
                    </Text>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav />
                    </Flex>
                </Flex>
                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify="flex-end"
                    direction="row"
                    spacing={6}
                >
                    {logged ? <UserDropdown /> : <AuthLinks />}
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

export default Header;
