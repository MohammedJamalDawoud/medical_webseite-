import { Link } from 'react-router-dom';
import { Activity, Brain, FileText, Home, Layers } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    return (
        <nav className="border-b sticky top-0 z-50" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
            <div className="container">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center text-primary font-bold text-xl">
                                <Brain className="h-8 w-8 mr-2" />
                                <span>MRI Organoids</span>
                            </Link>
                        </div>
                        <div className="hidden sm:flex sm:space-x-8 ml-8">
                            <Link to="/" className="text-muted hover-text-primary px-1 py-2 text-sm font-medium transition-colors">
                                <Home className="h-4 w-4 mr-1 inline" /> Home
                            </Link>
                            <Link to="/project" className="text-muted hover-text-primary px-1 py-2 text-sm font-medium transition-colors">
                                Project
                            </Link>
                            <Link to="/pipeline" className="text-muted hover-text-primary px-1 py-2 text-sm font-medium transition-colors">
                                <Layers className="h-4 w-4 mr-1 inline" /> Pipeline
                            </Link>
                            <Link to="/experiments" className="text-muted hover-text-primary px-1 py-2 text-sm font-medium transition-colors">
                                <Activity className="h-4 w-4 mr-1 inline" /> Experiments
                            </Link>
                            <Link to="/publications" className="text-muted hover-text-primary px-1 py-2 text-sm font-medium transition-colors">
                                <FileText className="h-4 w-4 mr-1 inline" /> Publications
                            </Link>
                            <Link to="/about" className="text-muted hover-text-primary px-1 py-2 text-sm font-medium transition-colors">
                                About
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <DarkModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
