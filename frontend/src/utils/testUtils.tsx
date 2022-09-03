import { ChakraProvider } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

export const renderWithTheme = (ui: ReactElement) => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
        <ChakraProvider>{children}</ChakraProvider>
    );

    return render(ui, { wrapper: Wrapper });
};
