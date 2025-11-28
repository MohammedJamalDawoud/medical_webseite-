import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Activity, Play, Calendar, FileText } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

interface Organoid {
    id: string;
    name: string;
    species: string;
    experiment_id: string;
    description: string;
    created_at: string;
    notes: string;
}

interface MRIScan {
    id: string;
    sequence_type: string;
    acquisition_date: string;
    resolution: string;
    file_path: string;
    pipeline_runs_count: number;
}

const OrganoidDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { addToast } = useToast();
    const [organoid, setOrganoid] = useState<Organoid | null>(null);
    const [scans, setScans] = useState<MRIScan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrganoidDetails();
        }
    }, [id]);

    const fetchOrganoidDetails = async () => {
        try {
            setLoading(true);
            const [organoidRes, scansRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/organoids/${id}/`),
                axios.get(`http://localhost:8000/api/scans/?organoid=${id}`)
            ]);

            setOrganoid(organoidRes.data);
            setScans(scansRes.data.results || scansRes.data);
        } catch (error) {
            console.error('Error fetching organoid details:', error);
            addToast('Failed to load organoid details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const startPipeline = async (scanId: string, stage: string) => {
        try {
            await axios.post('http://localhost:8000/api/pipeline-runs/', {
                mri_scan: scanId,
                stage: stage,
                status: 'PENDING'
            });
            addToast(`${stage} pipeline started successfully`, 'success');
            fetchOrganoidDetails(); // Refresh to update counts
        } catch (error) {
            console.error('Error starting pipeline:', error);
            addToast('Failed to start pipeline', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <Skeleton height="400px" />
            </div>
        );
    }

    if (!organoid) {
        return (
            <div className="container">
                <div className="glass-card text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Organoid not found</h2>
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
                title={`${organoid.name} - Organoid Details`}
                description={`Details and MRI scans for ${organoid.name}`}
            />
            <div className="container">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/organoids" className="text-primary hover:underline mb-4 inline-flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Organoids
                    </Link>
                </div>

                {/* Organoid Info */}
                <div className="glass-card mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                            <Brain className="text-primary mr-3" size={32} />
                            <div>
                                <h1 className="text-3xl font-bold">{organoid.name}</h1>
                                <p className="text-muted">
                                    {organoid.species} • Created {new Date(organoid.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span className="badge badge-primary">{organoid.species}</span>
                    </div>

                    {organoid.experiment_id && (
                        <div className="mb-3">
                            <span className="text-muted">Experiment ID: </span>
                            <span className="font-mono">{organoid.experiment_id}</span>
                        </div>
                    )}

                    {organoid.description && (
                        <div className="mb-3">
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted">{organoid.description}</p>
                        </div>
                    )}

                    {organoid.notes && (
                        <div>
                            <h3 className="font-semibold mb-2">Notes</h3>
                            <p className="text-muted whitespace-pre-wrap">{organoid.notes}</p>
                        </div>
                    )}
                </div>

                {/* MRI Scans */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">MRI Scans ({scans.length})</h2>
                        <Link to={`/organoids/${id}/scans/new`} className="btn btn-secondary">
                            <FileText className="w-4 h-4 mr-2" />
                            Add Scan
                        </Link>
                    </div>

                    {scans.length === 0 ? (
                        <div className="glass-card text-center py-12">
                            <Activity className="mx-auto mb-4 text-muted" size={48} />
                            <h3 className="text-xl font-semibold mb-2">No MRI scans yet</h3>
                            <p className="text-muted mb-4">Add your first MRI scan to start processing</p>
                            <Link to={`/organoids/${id}/scans/new`} className="btn btn-primary">
                                <FileText className="w-4 h-4 mr-2" />
                                Add Scan
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {scans.map((scan) => (
                                <div key={scan.id} className="glass-card">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{scan.sequence_type}</h3>
                                            <p className="text-sm text-muted">
                                                <Calendar className="inline w-4 h-4 mr-1" />
                                                {scan.acquisition_date ? new Date(scan.acquisition_date).toLocaleDateString() : 'No date'}
                                            </p>
                                        </div>
                                        <span className="badge badge-secondary">{scan.resolution}</span>
                                    </div>

                                    {scan.file_path && (
                                        <p className="text-sm text-muted mb-3 font-mono truncate">
                                            {scan.file_path}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <span className="text-sm text-muted">
                                            {scan.pipeline_runs_count} pipeline run{scan.pipeline_runs_count !== 1 ? 's' : ''}
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/scans/${scan.id}/runs`}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                View Runs
                                            </Link>
                                            <button
                                                onClick={() => startPipeline(scan.id, 'GMM')}
                                                className="btn btn-primary btn-sm"
                                            >
                                                <Play className="w-3 h-3 mr-1" />
                                                Run GMM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrganoidDetailPage;
