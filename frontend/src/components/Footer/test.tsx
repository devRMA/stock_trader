import { screen } from '@testing-library/react';
import { renderWithTheme } from 'utils/testUtils';
import { describe, expect, it } from 'vitest';

import Footer from '.';

describe('<Footer />', () => {
    it('should render the footer', () => {
        renderWithTheme(<Footer />);
        const links = screen.getAllByRole('link');
        expect(links).not.toHaveLength(0);
    });
});
