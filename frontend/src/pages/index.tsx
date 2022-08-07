import { Center, Container, Heading } from '@chakra-ui/react';

import DarkModeSwitch from '../components/DarkModeSwitch';

function Index() {
    return (
        <Container>
            <Center>
                <Heading>Hello World.</Heading>
                <DarkModeSwitch />
            </Center>
        </Container>
    );
}

export default Index;
