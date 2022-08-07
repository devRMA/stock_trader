import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SocialButton from '.';

describe('<SocialButton />', () => {
    it('should render the button', () => {
        render(
            <SocialButton label="Github" href="http://example.com">
                Example
            </SocialButton>,
        );
        const socialButton = screen.getByRole('link');
        expect(socialButton).toBeDefined();
        expect(socialButton.getAttribute('href')).toBe('http://example.com');
        expect(socialButton.firstChild).not.toBeNull();
        expect(socialButton.firstChild?.textContent).toBe('Github');
    });
});
