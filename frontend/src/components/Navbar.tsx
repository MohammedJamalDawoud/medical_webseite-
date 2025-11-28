import { Link, useLocation } from 'react-router-dom';
import { Activity, Brain, FileText, Home, Layers, Settings, GitCompare } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navLinkClass = (path: string) => {
        const baseClass = "nav-link px-3 py-2 text-sm font-medium transition-all relative";
        return isActive(path)
            ? `${baseClass} text-primary nav-link-active`
            : `${baseClass} text-muted hover:text-primary`;
    };

    return (
        <nav className="border-b sticky top-0 z-50" style={{
            background: 'var(--bg-surface)',
            backdropFilter: 'blur(12px)',
            borderColor: 'var(--border-subtle)',
            height: 'var(--nav-height)'
        }}>
            <div className="container">
                <div className="flex justify-between items-center" style={{ height: 'var(--nav-height)' }}>
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center text-primary font-bold text-xl hover:text-primary-light transition-colors">
                                <Brain className="h-8 w-8 mr-2" />
                                <span>MRI Organoids</span>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden sm:flex items-center ml-10" style={{ gap: 'var(--space-1)' }}>
                            {/* Main Pages */}
                            <Link to="/" className={navLinkClass('/')}>
                                <Home className="h-4 w-4 mr-1 inline" /> Home
                            </Link>
                            <Link to="/project" className={navLinkClass('/project')}>
                                Project
                            </Link>
                            <Link to="/pipeline" className={navLinkClass('/pipeline')}>
                                <Layers className="h-4 w-4 mr-1 inline" /> Pipeline
                            </Link>

                            {/* Divider */}
                            <div style={{
                                width: '1px',
                                height: '20px',
                                background: 'var(--border)',
                                margin: '0 var(--space-2)'
                            }} />

                            {/* Data & Experiments */}
                            <Link to="/experiments" className={navLinkClass('/experiments')}>
                                <Activity className="h-4 w-4 mr-1 inline" /> Experiments
                            </Link>
                            <Link to="/organoids" className={navLinkClass('/organoids')}>
                                <Brain className="h-4 w-4 mr-1 inline" /> Organoids
                            </Link>
                            <Link to="/compare" className={navLinkClass('/compare')}>
                                <GitCompare className="h-4 w-4 mr-1 inline" /> Compare
                            </Link>

                            {/* Divider */}
                            <div style={{
                                width: '1px',
                                height: '20px',
                                background: 'var(--border)',
                                margin: '0 var(--space-2)'
                            }} />

                            {/* Configuration */}
                            <Link to="/experiment-configs" className={navLinkClass('/experiment-configs')}>
                                <Settings className="h-4 w-4 mr-1 inline" /> Configs
                            </Link>
                            <Link to="/model-versions" className={navLinkClass('/model-versions')}>
                                Models
                            </Link>

                            {/* Divider */}
                            <div style={{
                                width: '1px',
                                height: '20px',
                                background: 'var(--border)',
                                margin: '0 var(--space-2)'
                            }} />

                            {/* Info */}
                            <Link to="/publications" className={navLinkClass('/publications')}>
                                <FileText className="h-4 w-4 mr-1 inline" /> Publications
                            </Link>
                            <Link to="/about" className={navLinkClass('/about')}>
                                About
                            </Link>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center" style={{ marginLeft: 'var(--space-6)' }}>
                        <DarkModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
