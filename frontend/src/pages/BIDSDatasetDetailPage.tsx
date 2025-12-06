import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';

interface BIDSDataset {
    id: number;
    name: string;
    root_path: string;
    description: string;
    bids_version: string;
    last_validated_at: string | null;
    last_validation_status: 'NOT_RUN' | 'PASSED' | 'WARNINGS' | 'FAILED';
    last_validation_summary: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export default function BIDSDatasetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [dataset, setDataset] = useState<BIDSDataset | null>(null);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        fetchDataset();
    }, [id]);

    const fetchDataset = async () => {
        try {
            const response = await api.get(`/bids-datasets/${id}/`);
            setDataset(response.data);
        } catch (error) {
            console.error('Error fetching dataset:', error);
            toast.error('Failed to load dataset');
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async () => {
        setValidating(true);
        try {
            const response = await api.post(`/bids-datasets/${id}/validate/`);
            setDataset(response.data);
            toast.success('Validation completed successfully');
        } catch (error) {
            console.error('Error validating dataset:', error);
            toast.error('Validation failed');
        } finally {
            setValidating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            NOT_RUN: { bg: 'rgba(107, 114, 128, 0.1)', color: '#9CA3AF', icon: Clock },
            PASSED: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', icon: CheckCircle },
            WARNINGS: { bg: 'rgba(251, 191, 36, 0.1)', color: '#FBBF24', icon: AlertTriangle },
            FAILED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', icon: XCircle },
        };
        const { bg, color, icon: Icon } = styles[status as keyof typeof styles];
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: bg,
                color: color,
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)'
            }}>
                <Icon size={16} />
                {status.replace('_', ' ')}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-muted)' }}>Loading dataset...</p>
                </div>
            </div>
        );
    }

    if (!dataset) {
        return (
            <div className="page-container">
                <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Dataset not found</p>
                    <Link to="/bids-datasets" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                        Back to Datasets
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Breadcrumb */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <Link to="/bids-datasets" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)'
                }}>
                    <ArrowLeft size={16} />
                    Back to Datasets
                </Link>
            </div>

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-8)'
            }}>
                <div>
                    <h1 style={{
                        fontSize: 'var(--text-3xl)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--text-main)',
                        marginBottom: 'var(--space-2)'
                    }}>
                        {dataset.name}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                        Created {format(new Date(dataset.created_at), 'PPP')}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleValidate}
                        disabled={validating}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                        <RefreshCw size={16} className={validating ? 'spin' : ''} />
                        {validating ? 'Validating...' : 'Validate'}
                    </button>
                </div>
            </div>

            {/* Dataset Info */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--text-main)',
                    marginBottom: 'var(--space-4)'
                }}>
                    Dataset Information
                </h2>

                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--space-1)'
                        }}>
                            Root Path
                        </label>
                        <p style={{
                            color: 'var(--text-main)',
                            fontFamily: 'monospace',
                            fontSize: 'var(--text-sm)',
                            padding: 'var(--space-2)',
                            background: 'var(--bg-elevated)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)'
                        }}>
                            {dataset.root_path}
                        </p>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--space-1)'
                        }}>
                            Description
                        </label>
                        <p style={{ color: 'var(--text-main)' }}>
                            {dataset.description || 'No description provided'}
                        </p>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--space-1)'
                        }}>
                            BIDS Version
                        </label>
                        <p style={{ color: 'var(--text-main)' }}>
                            {dataset.bids_version}
                        </p>
                    </div>
                </div>
            </div>

            {/* Validation Status */}
            <div className="glass-card">
                <h2 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--text-main)',
                    marginBottom: 'var(--space-4)'
                }}>
                    Validation Status
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    {getStatusBadge(dataset.last_validation_status)}
                    {dataset.last_validated_at && (
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                            Last validated {format(new Date(dataset.last_validated_at), 'PPp')}
                        </span>
                    )}
                </div>

                {dataset.last_validation_summary && (
                    <div style={{
                        padding: 'var(--space-4)',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)'
                    }}>
                        <h3 style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--text-main)',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Validation Details
                        </h3>
                        <pre style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-muted)',
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {JSON.stringify(dataset.last_validation_summary, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
