import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackToTop from './BackToTop';

describe('BackToTop Component', () => {
    it('should not be visible initially', () => {
        render(<BackToTop />);
        const button = screen.queryByRole('button', { name: /back to top/i });
        expect(button).not.toBeInTheDocument();
    });

    it('should become visible after scrolling down', () => {
        render(<BackToTop />);

        // Mock scroll
        window.pageYOffset = 400;
        fireEvent.scroll(window);

        const button = screen.getByRole('button', { name: /back to top/i });
        expect(button).toBeInTheDocument();
    });

    it('should scroll to top when clicked', () => {
        render(<BackToTop />);

        // Mock scroll to make it visible
        window.pageYOffset = 400;
        fireEvent.scroll(window);

        const button = screen.getByRole('button', { name: /back to top/i });

        // Mock window.scrollTo
        window.scrollTo = vi.fn();

        fireEvent.click(button);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });
});
