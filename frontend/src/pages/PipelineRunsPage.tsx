import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowLeft, Clock, CheckCircle, XCircle, Loader, BarChart3 } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';

interface PipelineRun {
    id: string;
    stage: string;
    status: string;
    qc_status: string;
    qc_notes: string;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
    scan_info: {
        id: string;
        organoid_name: string;
        sequence_type: string;
    };
    has_result: boolean;
}

const PipelineRunsPage = () => {
    const { scanId } = useParams<{ scanId: string }>();
    const [runs, setRuns] = useState<PipelineRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [editingQC, setEditingQC] = useState<string | null>(null);
    const [qcFormData, setQcFormData] = useState({ qc_status: '', qc_notes: '' });

    useEffect(() => {
        if (scanId) {
            fetchRuns();
        }
    }, [scanId]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchRuns();
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, scanId]);

    const fetchRuns = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/pipeline-runs/?mri_scan=${scanId}`);
            setRuns(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pipeline runs:', error);
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'FAILED':
                return <XCircle className="text-red-500" size={20} />;
            case 'RUNNING':
                return <Loader className="text-blue-500 animate-spin" size={20} />;
            case 'PENDING':
                return <Clock className="text-yellow-500" size={20} />;
            default:
                return <Activity className="text-muted" size={20} />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case 'SUCCESS':
                return `${baseClass} bg-green-500/20 text-green-400`;
            case 'FAILED':
                return `${baseClass} bg-red-500/20 text-red-400`;
            case 'RUNNING':
                return `${baseClass} bg-blue-500/20 text-blue-400`;
            case 'PENDING':
                return `${baseClass} bg-yellow-500/20 text-yellow-400`;
            default:
                return `${baseClass} bg-gray-500/20 text-gray-400`;
        }
    };

    const formatDuration = (started: string | null, finished: string | null) => {
        if (!started) return '-';
        if (!finished) return 'Running...';

        const start = new Date(started).getTime();
        const end = new Date(finished).getTime();
        const duration = (end - start) / 1000; // seconds

        if (duration < 60) return `${Math.round(duration)}s`;
        if (duration < 3600) return `${Math.round(duration / 60)}m`;
        return `${Math.round(duration / 3600)}h`;
    };

    const getQCBadgeColor = (qcStatus: string) => {
        switch (qcStatus) {
            case 'ACCEPTED': return 'bg-green-600';
            case 'REJECTED': return 'bg-red-600';
            case 'NOT_REVIEWED': return 'bg-gray-600';
            default: return 'bg-gray-600';
        }
    };

    const handleQCEdit = (run: PipelineRun) => {
        setEditingQC(run.id);
        setQcFormData({ qc_status: run.qc_status, qc_notes: run.qc_notes });
    };

    const handleQCSave = async (runId: string) => {
        try {
            await axios.patch(`http://localhost:8000/api/pipeline-runs/${runId}/`, qcFormData);
            setEditingQC(null);
            fetchRuns();
        } catch (error) {
            console.error('Error updating QC status:', error);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <Skeleton height="400px" />
            </div>
        );
    }

    const firstRun = runs[0];

    return (
        <>
            <SEO
                title="Pipeline Runs"
                description="View and monitor MRI segmentation pipeline execution"
            />
            <div className="container">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/organoids" className="text-primary hover:underline mb-4 inline-flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Organoids
                    </Link>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Pipeline Runs</h1>
                        {firstRun && (
                            <p className="text-muted">
                                {firstRun.scan_info.organoid_name} • {firstRun.scan_info.sequence_type}
                            </p>
                        )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-muted">Auto-refresh</span>
                    </label>
                </div>

                {/* Runs List */}
                {runs.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <Activity className="mx-auto mb-4 text-muted" size={48} />
                        <h3 className="text-xl font-semibold mb-2">No pipeline runs yet</h3>
                        <p className="text-muted">Start a pipeline run from the organoid detail page</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {runs.map((run) => (
                            <div key={run.id} className="glass-card">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(run.status)}
                                        <div>
                                            <h3 className="font-semibold text-lg">{run.stage}</h3>
                                            <p className="text-sm text-muted">
                                                Created {new Date(run.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={getStatusBadge(run.status)}>
                                        {run.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-muted mb-1">Started</p>
                                        <p className="text-sm">
                                            {run.started_at ? new Date(run.started_at).toLocaleTimeString() : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Finished</p>
                                        <p className="text-sm">
                                            {run.finished_at ? new Date(run.finished_at).toLocaleTimeString() : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Duration</p>
                                        <p className="text-sm">{formatDuration(run.started_at, run.finished_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Result</p>
                                        <p className="text-sm">
                                            {run.has_result ? (
                                                <Link
                                                    to={`/pipeline-runs/${run.id}/results`}
                                                    className="text-primary hover:underline flex items-center gap-1"
                                                >
                                                    <BarChart3 size={14} />
                                                    View
                                                </Link>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {run.status === 'RUNNING' && (
                                    <div className="mt-3">
                                        <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden">
                                            <div className="bg-primary h-full animate-pulse" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                )}

                                {/* QC Panel */}
                                {run.status === 'SUCCESS' && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-sm">Quality Control</h4>
                                            {editingQC !== run.id && (
                                                <button
                                                    onClick={() => handleQCEdit(run)}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Edit QC
                                                </button>
                                            )}
                                        </div>

                                        {editingQC === run.id ? (
                                            <div className="space-y-3">
                                                <select
                                                    value={qcFormData.qc_status}
                                                    onChange={(e) => setQcFormData({ ...qcFormData, qc_status: e.target.value })}
                                                    className="w-full px-3 py-2 rounded bg-surface-light border border-border"
                                                >
                                                    <option value="NOT_REVIEWED">Not Reviewed</option>
                                                    <option value="ACCEPTED">Accepted</option>
                                                    <option value="REJECTED">Rejected</option>
                                                </select>
                                                <textarea
                                                    value={qcFormData.qc_notes}
                                                    onChange={(e) => setQcFormData({ ...qcFormData, qc_notes: e.target.value })}
                                                    placeholder="QC notes and observations..."
                                                    className="w-full px-3 py-2 rounded bg-surface-light border border-border"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleQCSave(run.id)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingQC(null)}
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getQCBadgeColor(run.qc_status)}`}>
                                                    {run.qc_status.replace('_', ' ')}
                                                </span>
                                                {run.qc_notes && (
                                                    <p className="text-sm text-muted mt-2">{run.qc_notes}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PipelineRunsPage;
