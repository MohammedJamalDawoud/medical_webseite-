import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Save, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const BIDSDatasetForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        root_path: '',
        description: '',
        bids_version: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post('/bids-datasets/', formData);
            toast.success('BIDS Dataset registered successfully');
            navigate('/bids-datasets');
        } catch (err) {
            console.error('Failed to create dataset:', err);
            toast.error('Failed to register dataset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/bids-datasets')}
                className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Datasets
            </button>

            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Database className="text-primary" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Register BIDS Dataset</h1>
                            <p className="text-gray-400">Connect an existing BIDS dataset to the platform</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Dataset Name
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field w-full"
                                placeholder="e.g., Organoid Study 2024"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Root Path (Server Absolute Path)
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field w-full font-mono"
                                placeholder="/data/bids/dataset_001"
                                value={formData.root_path}
                                onChange={(e) => setFormData({ ...formData, root_path: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Must be accessible by the backend server
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                BIDS Version (Optional)
                            </label>
                            <input
                                type="text"
                                className="input-field w-full"
                                placeholder="e.g., 1.8.0"
                                value={formData.bids_version}
                                onChange={(e) => setFormData({ ...formData, bids_version: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                className="input-field w-full h-32 resize-none"
                                placeholder="Dataset details, source, and notes..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <Save size={18} />
                                )}
                                Register Dataset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BIDSDatasetForm;
