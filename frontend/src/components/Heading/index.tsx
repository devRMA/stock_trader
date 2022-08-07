import { Heading as HeadingChakra } from '@chakra-ui/react';

export type HeadingProps = {
    children: React.ReactNode | string;
};

function Heading({ children }: HeadingProps) {
    return <HeadingChakra>{children}</HeadingChakra>;
}

export default Heading;
