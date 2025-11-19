import React from 'react';
import { ProcessingStep } from '../types';
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';

interface ProcessingTimelineProps {
    steps: ProcessingStep[];
}

const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({ steps }) => {
    if (steps.length === 0) {
        return <div className="text-gray-500 text-sm italic">No processing steps recorded yet.</div>;
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'RUNNING':
                return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
            case 'FAILED':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Circle className="h-5 w-5 text-gray-300" />;
        }
    };

    const getStepLabel = (type: string) => {
        const labels: Record<string, string> = {
            'N4_BIAS': 'N4 Bias Correction',
            'NORMALIZATION': 'Intensity Normalization',
            'DENOISING': 'Denoising',
            'GMM_SEG': 'GMM Segmentation',
            'UNET_SEG': 'U-Net Segmentation',
            'PRIMUNET_SEG': 'PrimUNet Segmentation',
            'OTHER': 'Other Processing'
        };
        return labels[type] || type;
    };

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.id}>
                        <div className="relative pb-8">
                            {stepIdx !== steps.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                                        {getStatusIcon(step.status)}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{getStepLabel(step.step_type)}</p>
                                        <p className="text-xs text-gray-500 mt-1">{step.log_excerpt}</p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                        <time dateTime={step.updated_at}>{new Date(step.updated_at).toLocaleDateString()}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProcessingTimeline;
