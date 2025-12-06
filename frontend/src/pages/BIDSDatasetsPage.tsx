import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Plus, Folder, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';

interface BIDSDataset {
    id: string;
    name: string;
    root_path: string;
    description: string;
    bids_version: string;
    last_validated_at: string | null;
    last_validation_status: 'NOT_RUN' | 'PASSED' | 'WARNINGS' | 'FAILED';
    last_validation_summary: string;
    created_at: string;
}

export default function BIDSDatasetsPage() {
    const [datasets, setDatasets] = useState<BIDSDataset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bids-datasets/');
            setDatasets(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch BIDS datasets:', err);
            setError('Failed to load BIDS datasets');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PASSED':
                return <span className="badge badge-success flex items-center gap-1"><CheckCircle size={12} /> Passed</span>;
            case 'WARNINGS':
                return <span className="badge badge-warning flex items-center gap-1"><AlertTriangle size={12} /> Warnings</span>;
            case 'FAILED':
                return <span className="badge badge-error flex items-center gap-1"><XCircle size={12} /> Failed</span>;
            default:
                return <span className="badge badge-neutral flex items-center gap-1"><Clock size={12} /> Not Run</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Database className="text-primary" />
                        BIDS Datasets
                    </h1>
                    <p className="text-gray-400">Manage and validate Brain Imaging Data Structure (BIDS) datasets</p>
                </div>
                <Link to="/bids-datasets/new" className="btn btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    New Dataset
                </Link>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {datasets.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                    <Folder className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No BIDS Datasets Found</h3>
                    <p className="text-gray-400 mb-6">Register your first BIDS dataset to get started</p>
                    <Link to="/bids-datasets/new" className="btn btn-primary">
                        Register Dataset
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasets.map((dataset) => (
                        <div
                            key={dataset.id}
                            onClick={() => navigate(`/bids-datasets/${dataset.id}`)}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-primary transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Folder className="text-blue-500" size={24} />
                                </div>
                                {getStatusBadge(dataset.last_validation_status)}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{dataset.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {dataset.description || 'No description provided'}
                            </p>

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono bg-gray-900 px-2 py-1 rounded text-xs truncate max-w-full">
                                        {dataset.root_path}
                                    </span>
                                </div>
                                <div>
                                    Created: {format(new Date(dataset.created_at), 'MMM d, yyyy')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
