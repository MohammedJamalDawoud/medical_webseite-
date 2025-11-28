import React from 'react';

interface SectionProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Section({ title, subtitle, children, className = '' }: SectionProps) {
    return (
        <section className={`section ${className}`} style={{ marginBottom: 'var(--space-12)' }}>
            {(title || subtitle) && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    {title && <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{title}</h2>}
                    {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-lg)' }}>{subtitle}</p>}
                </div>
            )}
            {children}
        </section>
    );
}
