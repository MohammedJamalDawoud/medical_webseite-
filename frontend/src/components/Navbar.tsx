import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Brain, FileText, Home, Layers, Settings, GitCompare, User, LogOut, LogIn, Database, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navLinkClass = (path: string) => {
        const baseClass = "nav-link px-3 py-2 text-sm font-medium transition-all relative";
        return isActive(path)
            ? `${baseClass} text-primary nav-link-active`
            : `${baseClass} text-muted hover:text-primary`;
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/login');
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

                            {/* Data & Experiments - Show only if authenticated */}
                            {isAuthenticated && (
                                <>
                                    <Link to="/experiments" className={navLinkClass('/experiments')}>
                                        <Activity className="h-4 w-4 mr-1 inline" /> Experiments
                                    </Link>
                                    <Link to="/analysis" className={navLinkClass('/analysis')}>
                                        <Activity className="h-4 w-4 mr-1 inline" /> Analysis
                                    </Link>
                                    <Link to="/bids-datasets" className={navLinkClass('/bids-datasets')}>
                                        <Database className="h-4 w-4 mr-1 inline" /> BIDS
                                    </Link>
                                    <Link to="/docs-assistant" className={navLinkClass('/docs-assistant')}>
                                        <Sparkles className="h-4 w-4 mr-1 inline" /> Docs Assistant
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
                                </>
                            )}

                            {/* Info */}
                            <Link to="/publications" className={navLinkClass('/publications')}>
                                <FileText className="h-4 w-4 mr-1 inline" /> Publications
                            </Link>
                            <Link to="/about" className={navLinkClass('/about')}>
                                About
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Auth & Dark Mode */}
                    <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
                        {/* Authentication UI */}
                        {isAuthenticated ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                                    style={{
                                        background: showUserMenu ? 'var(--bg-elevated)' : 'transparent',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <User size={16} />
                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                        {user?.username}
                                    </span>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            right: 0,
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-lg)',
                                            boxShadow: 'var(--glass-shadow)',
                                            minWidth: '200px',
                                            zIndex: 1000
                                        }}
                                    >
                                        <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-main)' }}>
                                                {user?.username}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                                                {user?.email}
                                            </div>
                                        </div>

                                        <div style={{ padding: 'var(--space-2)' }}>
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-2)',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--text-main)',
                                                    textDecoration: 'none',
                                                    fontSize: 'var(--text-sm)',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <User size={16} />
                                                Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-2)',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--text-main)',
                                                    fontSize: 'var(--text-sm)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Link
                                    to="/login"
                                    className="btn btn-secondary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-2) var(--space-4)',
                                        fontSize: 'var(--text-sm)'
                                    }}
                                >
                                    <LogIn size={16} />
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-2) var(--space-4)',
                                        fontSize: 'var(--text-sm)'
                                    }}
                                >
                                    <User size={16} />
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Dark Mode Toggle */}
                        <DarkModeToggle />
                    </div>
                </div>
            </div>

            {/* Click outside to close menu */}
            {showUserMenu && (
                <div
                    onClick={() => setShowUserMenu(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;
