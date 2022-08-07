import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Heading from '.';

describe('<Heading />', () => {
    it('should render a heading', () => {
        render(<Heading>Example</Heading>);
        const heading = screen.getByRole('heading', { name: 'Example' });
        expect(heading).toBeDefined();
    });
});
