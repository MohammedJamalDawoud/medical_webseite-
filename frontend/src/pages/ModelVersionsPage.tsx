import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Package, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ModelVersion {
    id: string;
    name: string;
    description: string;
    weights_path: string;
    training_dataset_description: string;
    created_at: string;
    pipeline_runs_count: number;
}

export default function ModelVersionsPage() {
    const { addToast } = useToast();
    const [versions, setVersions] = useState<ModelVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        weights_path: '',
        training_dataset_description: ''
    });

    useEffect(() => {
        fetchVersions();
    }, []);

    const fetchVersions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/model-versions/');
            setVersions(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching model versions:', error);
            addToast('Failed to load model versions', 'error');
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/api/model-versions/', formData);

            addToast('Model version created successfully', 'success');
            setShowCreateModal(false);
            setFormData({
                name: '',
                description: '',
                weights_path: '',
                training_dataset_description: ''
            });
            fetchVersions();
        } catch (error) {
            addToast('Failed to create model version', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this model version?')) return;

        try {
            await axios.delete(`http://localhost:8000/api/model-versions/${id}/`);
            addToast('Model version deleted', 'success');
            fetchVersions();
        } catch (error) {
            addToast('Failed to delete model version', 'error');
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="text-center py-12">
                    <div className="loading-spinner"></div>
                    <p className="mt-4 text-gray-400">Loading model versions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Model Versions</h1>
                    <p className="text-gray-400 mt-2">Track trained model weights and metadata</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Model Version
                </button>
            </div>

            {versions.length === 0 ? (
                <div className="glass-card text-center py-12">
                    <Package size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">No model versions yet</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary mt-4"
                    >
                        Add First Model
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {versions.map((version) => (
                        <div key={version.id} className="glass-card hover-lift">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="text-green-400" size={20} />
                                    <h3 className="font-semibold text-lg">{version.name}</h3>
                                </div>
                                <button
                                    onClick={() => handleDelete(version.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-3">
                                {version.description || 'No description'}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="bg-slate-800/50 rounded p-2">
                                    <p className="text-xs text-gray-500">Weights Path</p>
                                    <p className="text-sm text-gray-300 font-mono truncate">
                                        {version.weights_path}
                                    </p>
                                </div>

                                {version.training_dataset_description && (
                                    <div className="bg-slate-800/50 rounded p-2">
                                        <p className="text-xs text-gray-500">Training Dataset</p>
                                        <p className="text-sm text-gray-300">
                                            {version.training_dataset_description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    {version.pipeline_runs_count} run{version.pipeline_runs_count !== 1 ? 's' : ''}
                                </span>
                                <span className="text-gray-500">
                                    {new Date(version.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">Add Model Version</h2>

                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                    placeholder="e.g., UNet_v2.1"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                    placeholder="Training details, architecture notes"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Weights Path *
                                </label>
                                <input
                                    type="text"
                                    value={formData.weights_path}
                                    onChange={(e) => setFormData({ ...formData, weights_path: e.target.value })}
                                    className="input-field"
                                    required
                                    placeholder="/models/unet_v2.1.pth"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    Training Dataset Description
                                </label>
                                <textarea
                                    value={formData.training_dataset_description}
                                    onChange={(e) => setFormData({ ...formData, training_dataset_description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                    placeholder="Description of training dataset used"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
