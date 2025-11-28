import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Image as ImageIcon, FileText } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';
import ImageGallery from '../components/ImageGallery';

interface Metric {
    id: string;
    metric_name: string;
    metric_value: number;
    unit: string;
}

interface SegmentationResult {
    id: string;
    mask_path: string;
    preview_image_path: string;
    preview_images: Record<string, string>;
    model_version: string;
    created_at: string;
    pipeline_run_info: {
        id: string;
        stage: string;
        organoid_name: string;
        sequence_type: string;
    };
    metrics: Metric[];
}

const SegmentationResultsPage = () => {
    const { runId } = useParams<{ runId: string }>();
    const [result, setResult] = useState<SegmentationResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (runId) {
            fetchResults();
        }
    }, [runId]);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/segmentation-results/?pipeline_run=${runId}`);
            const results = response.data.results || response.data;
            if (results.length > 0) {
                setResult(results[0]);
            }
        } catch (error) {
            console.error('Error fetching segmentation results:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMetricColor = (name: string) => {
        switch (name.toLowerCase()) {
            case 'dice':
                return 'text-blue-400';
            case 'iou':
                return 'text-green-400';
            case 'volume':
                return 'text-purple-400';
            default:
                return 'text-primary';
        }
    };

    const formatMetricValue = (value: number, unit: string) => {
        if (unit === 'score') {
            return value.toFixed(3);
        }
        if (unit === 'mm3') {
            return value.toFixed(1);
        }
        return value.toString();
    };

    if (loading) {
        return (
            <div className="container">
                <Skeleton height="400px" />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="container">
                <div className="glass-card text-center py-12">
                    <BarChart3 className="mx-auto mb-4 text-muted" size={48} />
                    <h2 className="text-2xl font-bold mb-4">No results available</h2>
                    <p className="text-muted mb-4">This pipeline run hasn't produced results yet</p>
                    <Link to="/organoids" className="btn btn-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Organoids
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Segmentation Results"
                description="View segmentation results and quantitative metrics"
            />
            <div className="container">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/organoids" className="text-primary hover:underline mb-4 inline-flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Organoids
                    </Link>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Segmentation Results</h1>
                    <p className="text-muted">
                        {result.pipeline_run_info.organoid_name} • {result.pipeline_run_info.sequence_type} • {result.pipeline_run_info.stage}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Metrics Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Quantitative Metrics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.metrics.map((metric) => (
                                <div key={metric.id} className="glass-card text-center">
                                    <BarChart3 className={`mx-auto mb-3 ${getMetricColor(metric.metric_name)}`} size={32} />
                                    <h3 className="text-sm text-muted mb-1">{metric.metric_name}</h3>
                                    <p className={`text-3xl font-bold ${getMetricColor(metric.metric_name)}`}>
                                        {formatMetricValue(metric.metric_value, metric.unit)}
                                    </p>
                                    {metric.unit && (
                                        <p className="text-xs text-muted mt-1">{metric.unit}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Interpretation Guide */}
                        <div className="glass-card">
                            <h3 className="font-semibold mb-3">Metric Interpretation</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-blue-400">Dice Score:</span>
                                    <span className="text-muted ml-2">
                                        Similarity coefficient (0-1). Higher is better. &gt;0.7 is good.
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-green-400">IoU:</span>
                                    <span className="text-muted ml-2">
                                        Intersection over Union (0-1). Measures overlap. &gt;0.5 is acceptable.
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-purple-400">Volume:</span>
                                    <span className="text-muted ml-2">
                                        Segmented tissue volume in cubic millimeters.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Info */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Result Details</h2>

                        <div className="glass-card">
                            <h3 className="font-semibold mb-3">Model Information</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-muted">Version:</span>
                                    <span className="ml-2 font-mono">{result.model_version}</span>
                                </div>
                                <div>
                                    <span className="text-muted">Created:</span>
                                    <span className="ml-2">{new Date(result.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <ImageIcon size={18} />
                                Segmentation Preview
                            </h3>
                            <ImageGallery
                                previewImages={result.preview_images}
                                primaryImage={result.preview_image_path}
                                title={`${result.pipeline_run_info.organoid_name} - ${result.pipeline_run_info.stage}`}
                            />
                        </div>

                        {result.mask_path && (
                            <div className="glass-card">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText size={18} />
                                    Mask File
                                </h3>
                                <p className="text-sm text-muted font-mono break-all">
                                    {result.mask_path}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SegmentationResultsPage;
