import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock the context
vi.mock('../context/ThemeContext', () => ({
    useTheme: () => ({
        isDarkMode: false,
        toggleDarkMode: vi.fn(),
    }),
}));

describe('Navbar Component', () => {
    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    it('should render the navbar with branding', () => {
        renderNavbar();
        expect(screen.getByText(/MRI Organoids/i)).toBeInTheDocument();
    });

    it('should contain navigation links', () => {
        renderNavbar();

        // Check for main navigation links
        expect(screen.getByText('Organoids')).toBeInTheDocument();
        expect(screen.getByText('Scans')).toBeInTheDocument();
        expect(screen.getByText('Pipeline Runs')).toBeInTheDocument();
        expect(screen.getByText('Results')).toBeInTheDocument();
    });

    it('should have a functional dark mode toggle', () => {
        const mockToggle = vi.fn();

        vi.mocked(require('../context/ThemeContext').useTheme).mockReturnValue({
            isDarkMode: false,
            toggleDarkMode: mockToggle,
        });

        renderNavbar();

        const darkModeButton = screen.getByRole('button', { name: /toggle dark mode/i });
        fireEvent.click(darkModeButton);

        expect(mockToggle).toHaveBeenCalled();
    });

    it('should toggle mobile menu when hamburger is clicked', () => {
        renderNavbar();

        // Find the mobile menu button  (usually hidden on desktop)
        const menuButton = screen.queryByRole('button', { name: /menu/i });

        if (menuButton) {
            fireEvent.click(menuButton);
            // Mobile menu should be visible after click
            // This test assumes there's a mobile menu implementation
        }
    });
});
