import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Collapse,
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    SkeletonCircle,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import { useAppSelector } from 'store';

interface NavItem {
    label: string;
    href: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Learn Design',
        href: '#foo',
    },
    {
        label: 'Hire Designers',
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
                            href={navItem.href}
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
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}
        >
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <NextLink href={navItem.href} passHref>
                        <Link
                            p={2}
                            href={navItem.href}
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

function Header() {
    const { t } = useTranslation('header');
    const { isOpen, onToggle } = useDisclosure();
    const { user, logged, loading } = useAppSelector((state) => state.user);

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
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
                    {logged ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded="full"
                                variant="link"
                                cursor="pointer"
                                minW={0}
                            >
                                <SkeletonCircle
                                    isLoaded={!loading}
                                    fadeDuration={1}
                                >
                                    <Avatar
                                        name={user.name}
                                        size="sm"
                                        src={user.avatar}
                                    />
                                </SkeletonCircle>
                            </MenuButton>
                            <MenuList>
                                <MenuGroup
                                    title={t('salutation', { name: user.name })}
                                >
                                    <NextLink href="#settings" passHref>
                                        <MenuItem
                                            as={Link}
                                            _hover={{ textDecoration: 'none' }}
                                        >
                                            {t('settings')}
                                        </MenuItem>
                                    </NextLink>
                                </MenuGroup>
                                <MenuDivider />
                                <NextLink href="#logout" passHref>
                                    <MenuItem
                                        as={Link}
                                        _hover={{ textDecoration: 'none' }}
                                    >
                                        {t('logout')}
                                    </MenuItem>
                                </NextLink>
                            </MenuList>
                        </Menu>
                    ) : (
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
                    )}
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

export default Header;
