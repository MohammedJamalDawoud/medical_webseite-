import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import SEO from '../components/SEO';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError("Passwords don't match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData) {
                // Handle field-specific errors
                const errorMessages = Object.values(errorData)
                    .map((messages: any) => {
                        if (Array.isArray(messages)) {
                            return messages.join(' ');
                        }
                        return messages;
                    })
                    .join(' ');
                setError(errorMessages || 'Registration failed. Please try again.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Register" description="Create a new account" />
            <div className="page-container">
                <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: 'var(--space-16)' }}>
                    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                            <UserPlus size={48} style={{ color: 'var(--primary)', margin: '0 auto var(--space-4)' }} />
                            <h1 style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 'var(--font-bold)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                Create Account
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                Join the MRI Organoids platform
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: 'var(--space-2)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        color: 'var(--text-main)'
                                    }}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
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

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: 'var(--space-2)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        color: 'var(--text-main)'
                                    }}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
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
                            </div>

                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    color: 'var(--text-main)'
                                }}>
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
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

                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    color: 'var(--text-main)'
                                }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
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

                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    color: 'var(--text-main)'
                                }}>
                                    Password * <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(min. 8 characters)</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    minLength={8}
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
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    name="password_confirm"
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
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
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>

                            <div style={{
                                textAlign: 'center',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-muted)'
                            }}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{
                                        color: 'var(--primary)',
                                        textDecoration: 'none',
                                        fontWeight: 'var(--font-medium)'
                                    }}
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
