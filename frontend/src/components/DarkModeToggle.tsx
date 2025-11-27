import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        return stored ? JSON.parse(stored) : true; // Default to dark mode
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDark));
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg transition-colors hover:bg-surface-light"
            aria-label="Toggle dark mode"
            style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--border)'
            }}
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-primary" />
            ) : (
                <Moon className="h-5 w-5 text-primary" />
            )}
        </button>
    );
};

export default DarkModeToggle;
