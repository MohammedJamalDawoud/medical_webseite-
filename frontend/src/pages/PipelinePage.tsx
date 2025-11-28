import { Scan, Settings, BarChart3, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';

const PipelinePage = () => {
    const steps = [
        {
            number: 1,
            title: "MRI Acquisition",
            icon: Scan,
            color: '#3b82f6',
            description: "High-resolution 3D MRI data acquisition at 9.4T using multiple imaging modalities to capture comprehensive tissue information.",
            details: ["Isotropic resolution (100µm)", "T1w, T2w, DWI, MGE sequences", "Longitudinal imaging capability"]
        },
        {
            number: 2,
            title: "Preprocessing",
            icon: Settings,
            color: '#10b981',
            description: "Standardizing the raw data to ensure consistent quality and remove artifacts for downstream analysis.",
            details: ["N4 Bias Field Correction", "Non-local means denoising", "Intensity normalization (Z-score)"]
        },
        {
            number: 3,
            title: "GMM Segmentation",
            icon: BarChart3,
            color: '#f59e0b',
            description: "Unsupervised statistical segmentation using Gaussian Mixture Models to generate initial tissue probability maps.",
            details: ["3-5 tissue classes", "Spatial priors integration", "Probabilistic output maps"]
        },
        {
            number: 4,
            title: "U-Net Refinement",
            icon: Brain,
            color: '#8b5cf6',
            description: "Deep learning-based refinement using a 3D U-Net architecture trained on manual annotations and GMM priors.",
            details: ["Multi-channel input (MRI + GMM)", "3D convolutions", "Dice loss optimization"]
        },
        {
            number: 5,
            title: "Evaluation",
            icon: CheckCircle2,
            color: '#06b6d4',
            description: "Quantitative assessment of segmentation accuracy against ground truth annotations.",
            details: ["Dice Similarity Coefficient", "Jaccard Index (IoU)", "Volumetric analysis"]
        }
    ];

    return (
        <>
            <SEO
                title="Processing Pipeline"
                description="Detailed breakdown of the MRI processing pipeline: Acquisition, Preprocessing, GMM Segmentation, U-Net Refinement, and Evaluation."
            />
            <div className="page-container">
                <PageHeader
                    title="Processing Pipeline"
                    subtitle="From raw MRI data to quantitative tissue segmentation"
                />

                {/* Pipeline Steps */}
                <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
                    {/* Vertical connecting line */}
                    <div style={{
                        position: 'absolute',
                        left: '31px',
                        top: '40px',
                        bottom: '40px',
                        width: '2px',
                        background: 'linear-gradient(180deg, var(--border) 0%, var(--border-subtle) 100%)',
                        zIndex: 0
                    }} />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} style={{
                                position: 'relative',
                                marginBottom: index < steps.length - 1 ? 'var(--space-12)' : '0',
                                paddingLeft: '80px'
                            }}>
                                {/* Step number circle */}
                                <div style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '0',
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 4px 12px ${step.color}40`,
                                    zIndex: 1
                                }}>
                                    <Icon size={32} color="white" />
                                </div>

                                {/* Step content card */}
                                <div className="glass-card hover-lift" style={{
                                    padding: 'var(--space-6)',
                                    borderLeft: `3px solid ${step.color}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                        <span style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-bold)',
                                            color: step.color,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Step {step.number}
                                        </span>
                                        <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                                        <h3 style={{
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 'var(--font-semibold)',
                                            color: 'var(--text-main)',
                                            margin: 0
                                        }}>
                                            {step.title}
                                        </h3>
                                    </div>

                                    <p style={{
                                        fontSize: 'var(--text-base)',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 'var(--leading-relaxed)',
                                        marginBottom: 'var(--space-4)'
                                    }}>
                                        {step.description}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                        {step.details.map((detail, idx) => (
                                            <span key={idx} style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: 'var(--space-1) var(--space-3)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 'var(--font-medium)',
                                                background: `${step.color}20`,
                                                color: step.color,
                                                border: `1px solid ${step.color}40`
                                            }}>
                                                {detail}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pipeline Summary */}
                <div className="glass-card" style={{
                    marginTop: 'var(--space-16)',
                    padding: 'var(--space-8)',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-4)',
                        color: 'var(--text-main)'
                    }}>
                        End-to-End Automation
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--text-secondary)',
                        lineHeight: 'var(--leading-relaxed)',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        This pipeline combines the strengths of classical statistical methods (GMM) with modern deep learning (U-Net)
                        to achieve robust, accurate tissue segmentation while minimizing manual intervention and observer bias.
                    </p>
                </div>
            </div>
        </>
    );
};

export default PipelinePage;
