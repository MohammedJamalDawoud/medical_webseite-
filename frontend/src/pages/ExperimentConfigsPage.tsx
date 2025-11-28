import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ExperimentConfig {
    id: string;
    name: string;
    description: string;
    config_json: Record<string, any>;
    created_at: string;
    updated_at: string;
    pipeline_runs_count: number;
}

export default function ExperimentConfigsPage() {
    const { addToast } = useToast();
    const [configs, setConfigs] = useState<ExperimentConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        config_json: '{\n  "n_components": 3,\n  "max_iter": 100\n}'
    });

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/experiment-configs/');
            setConfigs(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching configs:', error);
            addToast('Failed to load experiment configurations', 'error');
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validate JSON
            const parsedJson = JSON.parse(formData.config_json);

            await axios.post('http://localhost:8000/api/experiment-configs/', {
                name: formData.name,
                description: formData.description,
                config_json: parsedJson
            });

            addToast('Configuration created successfully', 'success');
            setShowCreateModal(false);
            setFormData({
                name: '',
                description: '',
                config_json: '{\n  "n_components": 3,\n  "max_iter": 100\n}'
            });
            fetchConfigs();
        } catch (error: any) {
            if (error.message?.includes('JSON')) {
                addToast('Invalid JSON format', 'error');
            } else {
                addToast('Failed to create configuration', 'error');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this configuration?')) return;

        try {
            await axios.delete(`http://localhost:8000/api/experiment-configs/${id}/`);
            addToast('Configuration deleted', 'success');
            fetchConfigs();
        } catch (error) {
            addToast('Failed to delete configuration', 'error');
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="text-center py-12">
                    <div className="loading-spinner"></div>
                    <p className="mt-4 text-gray-400">Loading configurations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Experiment Configurations</h1>
                    <p className="text-gray-400 mt-2">Manage reusable pipeline parameter sets</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Configuration
                </button>
            </div>

            {configs.length === 0 ? (
                <div className="glass-card text-center py-12">
                    <Settings size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">No configurations yet</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary mt-4"
                    >
                        Create First Configuration
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {configs.map((config) => (
                        <div key={config.id} className="glass-card hover-lift">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Settings className="text-blue-400" size={20} />
                                    <h3 className="font-semibold text-lg">{config.name}</h3>
                                </div>
                                <button
                                    onClick={() => handleDelete(config.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-4">
                                {config.description || 'No description'}
                            </p>

                            <div className="bg-slate-800/50 rounded p-3 mb-4">
                                <pre className="text-xs text-gray-300 overflow-x-auto">
                                    {JSON.stringify(config.config_json, null, 2)}
                                </pre>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    {config.pipeline_runs_count} run{config.pipeline_runs_count !== 1 ? 's' : ''}
                                </span>
                                <span className="text-gray-500">
                                    {new Date(config.updated_at).toLocaleDateString()}
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
                        <h2 className="text-2xl font-bold mb-6">Create Configuration</h2>

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
                                    placeholder="e.g., GMM_3components"
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
                                    placeholder="Purpose and details of this configuration"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    Configuration JSON *
                                </label>
                                <textarea
                                    value={formData.config_json}
                                    onChange={(e) => setFormData({ ...formData, config_json: e.target.value })}
                                    className="input-field font-mono text-sm"
                                    rows={8}
                                    required
                                    placeholder='{"n_components": 3}'
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter valid JSON configuration parameters
                                </p>
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
