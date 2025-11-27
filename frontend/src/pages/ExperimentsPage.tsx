import { useEffect, useState } from 'react';
import { getOrganoids } from '../api/organoids';
import { getScans } from '../api/scans';
import { getProcessingSteps } from '../api/processingSteps';
import { getSegmentationResults } from '../api/segmentations';
import type { OrganoidSample, MRIScan, ProcessingStep, SegmentationResult } from '../types';
import OrganoidList from '../components/OrganoidList';
import ScanTable from '../components/ScanTable';
import ProcessingTimeline from '../components/ProcessingTimeline';
import SegmentationCard from '../components/SegmentationCard';
import { AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';

const ExperimentsPage = () => {
    const [organoids, setOrganoids] = useState<OrganoidSample[]>([]);
    const [selectedOrganoid, setSelectedOrganoid] = useState<OrganoidSample | null>(null);
    const [scans, setScans] = useState<MRIScan[]>([]);
    const [selectedScan, setSelectedScan] = useState<MRIScan | null>(null);
    const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
    const [segmentationResults, setSegmentationResults] = useState<SegmentationResult[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchOrganoids = async () => {
            try {
                const data = await getOrganoids();
                setOrganoids(data);
                if (data.length > 0) {
                    // Optional: Auto-select first organoid
                    // setSelectedOrganoid(data[0]);
                }
            } catch (err) {
                setError('Failed to load organoid samples. Please ensure the backend API is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganoids();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrganoids = organoids.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(organoids.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (selectedOrganoid) {
            const fetchScans = async () => {
                try {
                    const data = await getScans(selectedOrganoid.id);
                    setScans(data);
                    setSelectedScan(null); // Reset selected scan when organoid changes
                    setProcessingSteps([]);
                } catch (err) {
                    console.error('Failed to load scans', err);
                }
            };
            fetchScans();
        }
    }, [selectedOrganoid]);

    useEffect(() => {
        if (selectedScan) {
            const fetchSteps = async () => {
                try {
                    const stepsData = await getProcessingSteps(selectedScan.id);
                    setProcessingSteps(stepsData);

                    // Also fetch all segmentation results to match with steps
                    // In a real app, we might want to filter this on the backend or fetch only relevant ones
                    const segData = await getSegmentationResults();
                    setSegmentationResults(segData);
                } catch (err) {
                    console.error('Failed to load processing steps', err);
                }
            };
            fetchSteps();
        }
    }, [selectedScan]);

    const getSegmentationForStep = (stepId: number) => {
        return segmentationResults.find(seg => seg.processing_step === stepId);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Skeleton height={40} width={300} className="mb-8" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <Skeleton height={24} width={150} />
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} height={48} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg p-6 h-96">
                            <Skeleton height="100%" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Experiments"
                description="Explore MRI scans, processing steps, and segmentation results for various brain organoid samples."
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Experiments & Data</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Organoid List */}
                    <div className="lg:col-span-1">
                        <OrganoidList
                            organoids={currentOrganoids}
                            onSelect={setSelectedOrganoid}
                            selectedId={selectedOrganoid?.id}
                        />
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4 px-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {!selectedOrganoid ? (
                            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <p className="text-gray-500">Select an organoid sample from the list to view its MRI scans.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        MRI Scans: {selectedOrganoid.name}
                                    </h2>
                                    <ScanTable scans={scans} onSelect={setSelectedScan} />
                                </div>

                                {selectedScan && (
                                    <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            Processing Pipeline: {selectedScan.sequence_name}
                                        </h2>

                                        <div className="mb-8">
                                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Pipeline Steps</h3>
                                            <ProcessingTimeline steps={processingSteps} />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Segmentation Results</h3>
                                            <div className="grid gap-6">
                                                {processingSteps
                                                    .filter(step => step.has_segmentation)
                                                    .map(step => {
                                                        const result = getSegmentationForStep(step.id);
                                                        return result ? <SegmentationCard key={result.id} result={result} /> : null;
                                                    })
                                                }
                                                {processingSteps.filter(step => step.has_segmentation).length === 0 && (
                                                    <p className="text-sm text-gray-500 italic">No segmentation results available yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExperimentsPage;
