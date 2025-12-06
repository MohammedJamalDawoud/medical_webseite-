import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Package, Database, Brain, CheckCircle, Layers, Microscope, Server } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface AnalyticsData {
    counts: {
        num_organoids: number;
        num_scans: number;
        num_pipeline_runs: number;
        num_successful_runs: number;
        num_failed_runs: number;
        num_models: number;
        num_configs: number;
        success_rate: number;
    };
    scans_by_species: Array<{ label: string; value: number }>;
    scans_by_data_type: Array<{ label: string; value: number }>;
    scans_by_role: Array<{ label: string; value: number }>;
    scans_by_sequence_type: Array<{ label: string; value: number }>;
}

interface MetricsData {
    histogram_dice: Array<{ label: string; value: number }>;
    histogram_iou: Array<{ label: string; value: number }>;
    avg_dice_by_model: Array<{ label: string; value: number }>;
    avg_dice_by_config: Array<{ label: string; value: number }>;
}

export default function AnalysisDashboardPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [overviewRes, metricsRes] = await Promise.all([
                    api.get('/analytics/overview/'),
                    api.get('/analytics/metrics/')
                ]);
                setAnalytics(overviewRes.data);
                setMetrics(metricsRes.data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setError('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !analytics || !metrics) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
                <p>{error || 'No data available'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">Experiment Analytics</h1>
                    <p className="text-gray-400">Real-time insights into your MRI organoid experiments</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Organoids"
                        value={analytics.counts.num_organoids}
                        icon={Brain}
                        color="purple"
                    />
                    <StatCard
                        title="MRI Scans"
                        value={analytics.counts.num_scans}
                        icon={Database}
                        color="blue"
                    />
                    <StatCard
                        title="Pipeline Runs"
                        value={analytics.counts.num_pipeline_runs}
                        icon={Activity}
                        color="orange"
                    />
                    <StatCard
                        title="Success Rate"
                        value={`${analytics.counts.success_rate}%`}
                        icon={CheckCircle}
                        color="green"
                        trend={{ value: 0, label: 'vs last week', positive: true }}
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Scans by Role */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Layers className="mr-2 text-blue-400" size={20} />
                            Dataset Distribution (Train/Val/Test)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.scans_by_role}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="label" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Scans by Sequence */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Microscope className="mr-2 text-purple-400" size={20} />
                            MRI Sequence Types
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.scans_by_sequence_type}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.scans_by_sequence_type.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 - Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Dice Score Histogram */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Activity className="mr-2 text-green-400" size={20} />
                            Dice Score Distribution
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.histogram_dice}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="label" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Model Performance */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <Server className="mr-2 text-orange-400" size={20} />
                            Average Dice by Model
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.avg_dice_by_model} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis type="number" domain={[0, 1]} stroke="#9CA3AF" />
                                    <YAxis dataKey="label" type="category" width={100} stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
