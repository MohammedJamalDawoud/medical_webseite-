import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    aria-label="Back to top"
                >
                    <ArrowUp className="h-6 w-6" />
                </button>
            )}
        </div>
    );
};

export default BackToTop;
