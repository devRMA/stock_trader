import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithTheme } from '../../utils/testUtils';
import Footer from '.';

describe('<Footer />', () => {
    it('should render the footer', () => {
        renderWithTheme(<Footer />);
        const links = screen.getAllByRole('link');
        expect(links).not.toHaveLength(0);
    });
});
