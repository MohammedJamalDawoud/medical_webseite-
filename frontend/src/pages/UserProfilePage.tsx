import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

export default function UserProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        return null;
    }

    return (
        <>
            <SEO title="Profile" description="User profile and settings" />
            <div className="page-container">
                <PageHeader
                    title="User Profile"
                    subtitle="Manage your account information"
                />

                <Section>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {/* Profile Card */}
                        <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                            {/* User Avatar */}
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                                    fontSize: 'var(--text-4xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'white'
                                }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <h2 style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--text-main)',
                                    marginBottom: 'var(--space-2)'
                                }}>
                                    {user.first_name && user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : user.username}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                    @{user.username}
                                </p>
                            </div>

                            {/* Profile Information */}
                            <div style={{
                                display: 'grid',
                                gap: 'var(--space-6)',
                                marginBottom: 'var(--space-6)'
                            }}>
                                {/* Username */}
                                <div>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'var(--text-secondary)',
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        <User size={16} />
                                        Username
                                    </label>
                                    <div style={{
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)',
                                        fontSize: 'var(--text-base)'
                                    }}>
                                        {user.username}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'var(--text-secondary)',
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        <Mail size={16} />
                                        Email
                                    </label>
                                    <div style={{
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)',
                                        fontSize: 'var(--text-base)'
                                    }}>
                                        {user.email}
                                    </div>
                                </div>

                                {/* First Name */}
                                {user.first_name && (
                                    <div>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-secondary)',
                                            marginBottom: 'var(--space-2)'
                                        }}>
                                            First Name
                                        </label>
                                        <div style={{
                                            padding: 'var(--space-3)',
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-main)',
                                            fontSize: 'var(--text-base)'
                                        }}>
                                            {user.first_name}
                                        </div>
                                    </div>
                                )}

                                {/* Last Name */}
                                {user.last_name && (
                                    <div>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-secondary)',
                                            marginBottom: 'var(--space-2)'
                                        }}>
                                            Last Name
                                        </label>
                                        <div style={{
                                            padding: 'var(--space-3)',
                                            background: 'var(--bg-elevated)',
                                            border: 'var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-main)',
                                            fontSize: 'var(--text-base)'
                                        }}>
                                            {user.last_name}
                                        </div>
                                    </div>
                                )}

                                {/* Member Since */}
                                <div>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'var(--text-secondary)',
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        <Calendar size={16} />
                                        Member Since
                                    </label>
                                    <div style={{
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)',
                                        fontSize: 'var(--text-base)'
                                    }}>
                                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                paddingTop: 'var(--space-6)',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="btn btn-primary"
                                    disabled
                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                >
                                    Edit Profile (Coming Soon)
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    disabled
                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                >
                                    Change Password (Coming Soon)
                                </button>
                            </div>

                            {/* Info Message */}
                            <div style={{
                                marginTop: 'var(--space-6)',
                                padding: 'var(--space-4)',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-secondary)'
                            }}>
                                <strong>Note:</strong> Profile editing functionality will be added in a future update.
                                For now, you can view your account information here.
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </>
    );
}
