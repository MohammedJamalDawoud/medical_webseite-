import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="glass-card" style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-8)',
            maxWidth: '500px',
            margin: '0 auto'
        }}>
            <Icon
                size={48}
                style={{
                    margin: '0 auto var(--space-4)',
                    color: 'var(--text-muted)',
                    opacity: 0.5
                }}
            />
            <h3 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-3)',
                color: 'var(--text-main)'
            }}>
                {title}
            </h3>
            <p style={{
                color: 'var(--text-muted)',
                marginBottom: action ? 'var(--space-6)' : '0',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-relaxed)'
            }}>
                {description}
            </p>
            {action && (
                action.href ? (
                    <a href={action.href} className="btn btn-primary">
                        {action.label}
                    </a>
                ) : (
                    <button onClick={action.onClick} className="btn btn-primary">
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}
