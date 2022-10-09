import { Button, Link } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import NextImage from 'next/future/image';
import NextLink from 'next/link';

export interface LogoProps {
    width?: number;
    height?: number;
}

const defaultProps = {
    width: 32,
    height: 32,
};

function Logo({ width, height }: LogoProps) {
    return (
        <NextLink href="/" passHref>
            <Button as={Link} variant="link">
                <NextImage
                    src={useColorModeValue('/logo.svg', '/logo-dark.svg')}
                    alt="Stock Trader Logo"
                    priority
                    width={width}
                    height={height}
                />
            </Button>
        </NextLink>
    );
}

Logo.defaultProps = defaultProps;

export default Logo;
