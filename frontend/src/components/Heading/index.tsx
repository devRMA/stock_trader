import { Text } from '@chakra-ui/react';

export type HeadingProps = {
    text: string;
};

function Heading({ text }: HeadingProps) {
    return <Text>{text}</Text>;
}

export default Heading;
