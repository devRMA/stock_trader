import { Button, Link } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import NextImage from 'next/image';
import NextLink from 'next/link';

export interface LogoProps {
    width?: number;
    height?: number;
    layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill';
}

const defaultProps = {
    width: 32,
    height: 32,
    layout: 'intrinsic',
};

function Logo({ width, height, layout }: LogoProps) {
    return (
        <NextLink href="/" passHref>
            <Button as={Link} variant="link">
                <NextImage
                    src={useColorModeValue('/logo.svg', '/logo-dark.svg')}
                    alt="Stock Trader Logo"
                    width={width}
                    height={height}
                    layout={layout}
                />
            </Button>
        </NextLink>
    );
}

Logo.defaultProps = defaultProps;

export default Logo;
