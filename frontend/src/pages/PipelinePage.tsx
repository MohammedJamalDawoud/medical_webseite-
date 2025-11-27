import { ArrowDown } from 'lucide-react';

const PipelinePage = () => {
    const steps = [
        {
            title: "1. MRI Acquisition",
            description: "High-resolution 3D MRI data acquisition at 9.4T using T1w, T2w, and Diffusion-Weighted Imaging sequences.",
            details: ["Isotropic resolution (100µm)", "Multiple modalities", "Longitudinal imaging"]
        },
        {
            title: "2. Preprocessing",
            description: "Standardizing the raw data to ensure consistent quality for downstream analysis.",
            details: ["N4 Bias Field Correction", "Denoising (Non-local means)", "Intensity Normalization (Z-score)"]
        },
        {
            title: "3. GMM Segmentation",
            description: "Unsupervised statistical segmentation using Gaussian Mixture Models to generate initial tissue probability maps.",
            details: ["3-5 Tissue Classes", "Spatial priors", "Probabilistic output"]
        },
        {
            title: "4. U-Net Refinement",
            description: "Deep learning-based refinement using a 3D U-Net architecture trained on manual annotations and GMM priors.",
            details: ["Multi-channel input", "3D Convolutions", "Dice Loss optimization"]
        },
        {
            title: "5. Evaluation",
            description: "Quantitative assessment of segmentation accuracy against ground truth.",
            details: ["Dice Similarity Coefficient", "Jaccard Index", "Volumetric analysis"]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-3xl font-bold text-gray-900">Processing Pipeline</h1>
                <p className="mt-4 text-xl text-gray-500">
                    From raw MRI data to quantitative tissue segmentation
                </p>
            </div>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200" aria-hidden="true" />

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="flex items-center justify-center">
                                <div className="bg-white border-4 border-primary rounded-full h-12 w-12 flex items-center justify-center z-10">
                                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                                </div>
                            </div>

                            <div className="mt-4 bg-white p-6 rounded-lg shadow-md border border-gray-100 relative z-10 max-w-2xl mx-auto">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{step.title}</h3>
                                <p className="text-gray-600 text-center mb-4">{step.description}</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {step.details.map((detail, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                                            {detail}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="flex justify-center mt-4 relative z-10">
                                    <ArrowDown className="h-6 w-6 text-gray-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PipelinePage;
