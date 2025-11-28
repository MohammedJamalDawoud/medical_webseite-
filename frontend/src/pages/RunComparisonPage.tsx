import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart3 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';

interface RunComparison {
    id: string;
    stage: string;
    status: string;
    created_at: string;
    mri_scan: string;
    scan_info: {
        organoid_name: string;
        sequence_type: string;
    };
    experiment_config_name?: string;
    model_version_name?: string;
    has_result: boolean;
}

interface RunResult {
    metrics: {
        metric_name: string;
        metric_value: number;
        unit: string;
    }[];
    preview_image_path: string;
}

export default function RunComparisonPage() {
    const [searchParams] = useSearchParams();
    const { addToast } = useToast();

    const [runs, setRuns] = useState<RunComparison[]>([]);
    const [leftRunId, setLeftRunId] = useState<string>(searchParams.get('left') || '');
    const [rightRunId, setRightRunId] = useState<string>(searchParams.get('right') || '');

    const [leftResult, setLeftResult] = useState<RunResult | null>(null);
    const [rightResult, setRightResult] = useState<RunResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRuns();
    }, []);

    useEffect(() => {
        if (leftRunId) fetchResult(leftRunId, setLeftResult);
    }, [leftRunId]);

    useEffect(() => {
        if (rightRunId) fetchResult(rightRunId, setRightResult);
    }, [rightRunId]);

    const fetchRuns = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/pipeline-runs/?status=SUCCESS');
            setRuns(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching runs:', error);
            addToast('Failed to load pipeline runs', 'error');
            setLoading(false);
        }
    };

    const fetchResult = async (runId: string, setFunction: Function) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/segmentation-results/?pipeline_run=${runId}`);
            const results = response.data.results || response.data;
            if (results.length > 0) {
                setFunction(results[0]);
            } else {
                setFunction(null);
            }
        } catch (error) {
            console.error('Error fetching result:', error);
            setFunction(null);
        }
    };

    const MetricCard = ({ label, leftValue, rightValue, unit }: { label: string, leftValue?: number, rightValue?: number, unit?: string }) => {
        const diff = (leftValue && rightValue) ? leftValue - rightValue : 0;
        const better = diff > 0 ? 'left' : 'right'; // Assuming higher is better for now

        return (
            <div className="glass-card p-4 flex items-center justify-between">
                <span className="text-gray-400 font-medium">{label} {unit && `(${unit})`}</span>
                <div className="flex gap-8 items-center">
                    <span className={`font-bold ${better === 'left' && rightValue ? 'text-green-400' : 'text-white'}`}>
                        {leftValue?.toFixed(3) || '-'}
                    </span>
                    <span className={`font-bold ${better === 'right' && leftValue ? 'text-green-400' : 'text-white'}`}>
                        {rightValue?.toFixed(3) || '-'}
                    </span>
                </div>
            </div>
        );
    };

    if (loading) return <div className="page-container"><Skeleton height="400px" /></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Run Comparison</h1>
                    <p className="text-gray-400 mt-2">Compare metrics and results side-by-side</p>
                </div>
            </div>

            {/* Selection Controls */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <select
                    value={leftRunId}
                    onChange={(e) => setLeftRunId(e.target.value)}
                    className="input-field"
                >
                    <option value="">Select Run A</option>
                    {runs.map(run => (
                        <option key={run.id} value={run.id}>
                            {run.scan_info.organoid_name} - {run.stage} ({new Date(run.created_at).toLocaleDateString()})
                        </option>
                    ))}
                </select>

                <select
                    value={rightRunId}
                    onChange={(e) => setRightRunId(e.target.value)}
                    className="input-field"
                >
                    <option value="">Select Run B</option>
                    {runs.map(run => (
                        <option key={run.id} value={run.id}>
                            {run.scan_info.organoid_name} - {run.stage} ({new Date(run.created_at).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Comparison Grid */}
            {(leftRunId || rightRunId) && (
                <div className="space-y-6">
                    {/* Info Row */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Info */}
                        <div className="glass-card">
                            {leftRunId ? (
                                <>
                                    <h3 className="font-bold text-lg mb-2">Run A Details</h3>
                                    {runs.find(r => r.id === leftRunId) && (
                                        <div className="space-y-2 text-sm text-gray-400">
                                            <p>Config: {runs.find(r => r.id === leftRunId)?.experiment_config_name || 'N/A'}</p>
                                            <p>Model: {runs.find(r => r.id === leftRunId)?.model_version_name || 'N/A'}</p>
                                        </div>
                                    )}
                                </>
                            ) : <p className="text-gray-500 text-center py-4">No run selected</p>}
                        </div>

                        {/* Right Info */}
                        <div className="glass-card">
                            {rightRunId ? (
                                <>
                                    <h3 className="font-bold text-lg mb-2">Run B Details</h3>
                                    {runs.find(r => r.id === rightRunId) && (
                                        <div className="space-y-2 text-sm text-gray-400">
                                            <p>Config: {runs.find(r => r.id === rightRunId)?.experiment_config_name || 'N/A'}</p>
                                            <p>Model: {runs.find(r => r.id === rightRunId)?.model_version_name || 'N/A'}</p>
                                        </div>
                                    )}
                                </>
                            ) : <p className="text-gray-500 text-center py-4">No run selected</p>}
                        </div>
                    </div>

                    {/* Metrics Comparison */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BarChart3 size={20} /> Metrics Comparison
                        </h3>
                        <MetricCard
                            label="Dice Score"
                            leftValue={leftResult?.metrics.find(m => m.metric_name === 'Dice')?.metric_value}
                            rightValue={rightResult?.metrics.find(m => m.metric_name === 'Dice')?.metric_value}
                        />
                        <MetricCard
                            label="IoU"
                            leftValue={leftResult?.metrics.find(m => m.metric_name === 'IoU')?.metric_value}
                            rightValue={rightResult?.metrics.find(m => m.metric_name === 'IoU')?.metric_value}
                        />
                    </div>

                    {/* Visual Comparison */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="aspect-video bg-black/20 rounded-lg overflow-hidden border border-slate-700">
                            {leftResult?.preview_image_path ? (
                                <img
                                    src={`http://localhost:8000${leftResult.preview_image_path}`}
                                    className="w-full h-full object-cover"
                                    alt="Run A Preview"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No preview
                                </div>
                            )}
                        </div>
                        <div className="aspect-video bg-black/20 rounded-lg overflow-hidden border border-slate-700">
                            {rightResult?.preview_image_path ? (
                                <img
                                    src={`http://localhost:8000${rightResult.preview_image_path}`}
                                    className="w-full h-full object-cover"
                                    alt="Run B Preview"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No preview
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
