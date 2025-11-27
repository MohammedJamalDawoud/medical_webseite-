import type { SegmentationResult } from '../types';
import { BarChart2, FileText } from 'lucide-react';

interface SegmentationCardProps {
    result: SegmentationResult;
}

const SegmentationCard: React.FC<SegmentationCardProps> = ({ result }) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                        {result.method === 'GMM' ? 'GMM Segmentation' :
                            result.method === 'UNET' ? 'U-Net Segmentation' :
                                result.method === 'GMM_UNET' ? 'Combined GMM + U-Net' : result.method}
                    </h3>
                    <span className="text-xs text-gray-500">
                        {new Date(result.created_at).toLocaleDateString()}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{result.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                        <dt className="text-xs font-medium text-gray-500 uppercase">Dice Score</dt>
                        <dd className="mt-1 text-2xl font-semibold text-primary">
                            {result.dice_score ? result.dice_score.toFixed(3) : 'N/A'}
                        </dd>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                        <dt className="text-xs font-medium text-gray-500 uppercase">Jaccard Index</dt>
                        <dd className="mt-1 text-2xl font-semibold text-secondary">
                            {result.jaccard_index ? result.jaccard_index.toFixed(3) : 'N/A'}
                        </dd>
                    </div>
                </div>

                {result.notes && (
                    <div className="mt-4 text-sm text-gray-500 border-t pt-3">
                        <div className="flex items-start">
                            <FileText className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{result.notes}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SegmentationCard;
