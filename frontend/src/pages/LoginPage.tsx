import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import SEO from '../components/SEO';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Login" description="Sign in to your account" />
            <div className="page-container">
                <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: 'var(--space-16)' }}>
                    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                            <LogIn size={48} style={{ color: 'var(--primary)', margin: '0 auto var(--space-4)' }} />
                            <h1 style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 'var(--font-bold)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                Welcome Back
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                Sign in to your account
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-4)',
                                color: '#ef4444',
                                fontSize: 'var(--text-sm)'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    color: 'var(--text-main)'
                                }}>
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)',
                                        fontSize: 'var(--text-base)'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    color: 'var(--text-main)'
                                }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)',
                                        fontSize: 'var(--text-base)'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ width: '100%', marginBottom: 'var(--space-4)' }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div style={{
                                textAlign: 'center',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)'
                            }}>
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    style={{
                                        color: 'var(--primary)',
                                        textDecoration: 'none',
                                        fontWeight: 'var(--font-medium)'
                                    }}
                                >
                                    Register here
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
