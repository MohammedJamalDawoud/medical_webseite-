import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Plus, Search } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

interface Organoid {
    id: string;
    name: string;
    species: string;
    experiment_id: string;
    description: string;
    created_at: string;
    scans_count: number;
}

const OrganoidsPage = () => {
    const [organoids, setOrganoids] = useState<Organoid[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('');

    useEffect(() => {
        fetchOrganoids();
    }, [speciesFilter]);

    const fetchOrganoids = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (speciesFilter) params.append('species', speciesFilter);

            const response = await axios.get(`http://localhost:8000/api/organoids/?${params}`);
            setOrganoids(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching organoids:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrganoids = organoids.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.experiment_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <SEO
                title="Organoids"
                description="Manage brain organoid samples for MRI segmentation experiments"
            />
            <div className="page-container">
                <PageHeader 
                    title="Organoid Samples"
                    subtitle="Manage brain organoid samples and their MRI scans"
                    actions={
                        <Link to="/organoids/new" className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-2" style={{ marginRight: 'var(--space-2)' }} />
                            New Organoid
                        </Link>
                    }
                />

                {/* Filters */}
                <div className="glass-card mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or experiment ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded bg-surface border border-border focus:border-primary outline-none transition-colors"
                                style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <select
                            value={speciesFilter}
                            onChange={(e) => setSpeciesFilter(e.target.value)}
                            className="px-4 py-2 rounded bg-surface border border-border focus:border-primary outline-none transition-colors"
                            style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                        >
                            <option value="">All Species</option>
                            <option value="HUMAN">Human</option>
                            <option value="MARMOSET">Marmoset</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                {/* Organoids Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} height="200px" />
                        ))}
                    </div>
                ) : filteredOrganoids.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <Brain className="mx-auto mb-4 text-muted" size={48} />
                        <h3 className="text-xl font-semibold mb-2">No organoids found</h3>
                        <p className="text-muted mb-4">
                            {searchTerm || speciesFilter ? 'Try adjusting your filters' : 'Get started by creating your first organoid sample'}
                        </p>
                        <Link to="/organoids/new" className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Organoid
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrganoids.map((organoid) => (
                            <Link
                                key={organoid.id}
                                to={`/organoids/${organoid.id}`}
                                className="glass-card hover-lift transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        <Brain className="text-primary mr-2" size={24} />
                                        <h3 className="font-semibold text-lg">{organoid.name}</h3>
                                    </div>
                                    <span className="badge badge-primary">{organoid.species}</span>
                                </div>

                                {organoid.experiment_id && (
                                    <p className="text-sm text-muted mb-2">
                                        Experiment: {organoid.experiment_id}
                                    </p>
                                )}

                                <p className="text-muted text-sm mb-4 line-clamp-2">
                                    {organoid.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <span className="text-sm text-muted">
                                        {organoid.scans_count} scan{organoid.scans_count !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-sm text-muted">
                                        {new Date(organoid.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default OrganoidsPage;
