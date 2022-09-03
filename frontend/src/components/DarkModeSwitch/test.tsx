import { act, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithTheme } from '../../utils/testUtils';
import DarkModeSwitch from '.';

describe('<DarkModeSwitch />', () => {
    it('should render the button', () => {
        renderWithTheme(<DarkModeSwitch />);
        const darkModeSwitch = screen.getByRole('button');
        expect(darkModeSwitch).toBeDefined();
        const icon = darkModeSwitch.innerHTML;
        act(() => darkModeSwitch.click());
        expect(icon).not.toBe(darkModeSwitch.innerHTML);
    });
});
