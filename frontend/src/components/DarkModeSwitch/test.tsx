import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DarkModeSwitch from '.';

describe('<DarkModeSwitch />', () => {
    it('should render the button', () => {
        render(<DarkModeSwitch />);
        const darkModeSwitch = screen.getByRole('button');
        expect(darkModeSwitch).toBeDefined();
    });
});
