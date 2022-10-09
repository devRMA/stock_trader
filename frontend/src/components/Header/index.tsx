import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Container,
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
import Logo from 'components/Logo';
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

function AuthLinks({ isDesktop }: { isDesktop: boolean }) {
    const { t } = useTranslation('header');

    return (
        <HStack spacing="3">
            <NextLink href="/login" passHref>
                <Button
                    as={Link}
                    variant="ghost"
                    style={{ textDecoration: 'none' }}
                >
                    {t('login')}
                </Button>
            </NextLink>
            {isDesktop && (
                <NextLink href="#register" passHref>
                    <Button
                        as={Link}
                        variant="primary"
                        style={{ textDecoration: 'none' }}
                    >
                        {t('register')}
                    </Button>
                </NextLink>
            )}
        </HStack>
    );
}

function UserDropdown() {
    const { t } = useTranslation('header');
    const { user, loading } = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const nameColor = useColorModeValue('gray.800', 'white');
    const balanceColor = useColorModeValue('gray.600', 'gray.500');
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
                style={{ textDecoration: 'none' }}
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
            <MenuList bg="bg-surface">
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

function DesktopNav() {
    const { logged } = useAppSelector(selectUser);

    return (
        <Flex justify="space-between" flex="1">
            <ButtonGroup variant="link" spacing="8">
                {NAV_ITEMS.map((navItem) => (
                    <NextLink key={navItem.label} href={navItem.href} passHref>
                        <Button as={Link}>{navItem.label}</Button>
                    </NextLink>
                ))}
            </ButtonGroup>
            {logged ? <UserDropdown /> : <AuthLinks isDesktop />}
        </Flex>
    );
}

function MobileNav() {
    return (
        <Stack bg="bg-surface" p={4}>
            {NAV_ITEMS.map((navItem) => (
                <NextLink key={navItem.label} href={navItem.href} passHref>
                    <Button
                        as={Link}
                        variant="ghost"
                        style={{ textDecoration: 'none' }}
                    >
                        {navItem.label}
                    </Button>
                </NextLink>
            ))}
        </Stack>
    );
}

function Header() {
    const { t } = useTranslation('header');
    const { isOpen, onToggle } = useDisclosure();
    const { logged } = useAppSelector(selectUser);
    const { user } = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isDesktop = useBreakpointValue({ base: false, md: true });

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
        <Box as="section">
            <Box
                as="nav"
                bg="bg-surface"
                boxShadow={useColorModeValue('sm', 'sm-dark')}
            >
                <Container py={{ base: '3', lg: '4' }}>
                    <HStack justify="space-between" spacing="10">
                        <Flex>
                            {isDesktop || (
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
                            )}
                            <Logo />
                        </Flex>
                        {isDesktop && <DesktopNav />}
                        {isDesktop ||
                            (logged ? (
                                <UserDropdown />
                            ) : (
                                <AuthLinks isDesktop={false} />
                            ))}
                    </HStack>
                </Container>
            </Box>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

export default Header;
