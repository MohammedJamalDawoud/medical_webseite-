import { Link } from 'react-router-dom';
import { Brain, Activity, Layers, ArrowRight, Database, Microscope, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';

const HomePage = () => {
    return (
        <>
            <SEO
                title="Home"
                description="Multimodal MRI-Based Tissue Segmentation using combined GMM and U-Net approaches for brain organoid analysis."
            />

            {/* Hero Section - Split Layout */}
            <div className="page-container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-12)',
                    alignItems: 'center',
                    marginBottom: 'var(--space-16)'
                }}>
                    {/* Left Column - Content */}
                    <div>
                        <h1 style={{
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 'var(--font-bold)',
                            lineHeight: 'var(--leading-tight)',
                            marginBottom: 'var(--space-6)',
                            color: 'var(--text-main)'
                        }}>
                            Multimodal MRI-Based Tissue Segmentation
                        </h1>
                        <p style={{
                            fontSize: 'var(--text-xl)',
                            color: 'var(--text-secondary)',
                            lineHeight: 'var(--leading-relaxed)',
                            marginBottom: 'var(--space-8)',
                            maxWidth: '90%'
                        }}>
                            A combined GMM and U-Net pipeline for precise tissue segmentation of in vitro brain organoid MRI data.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <Link to="/experiments" className="btn btn-primary btn-lg">
                                View Experiments <ArrowRight className="ml-2 h-5 w-5" style={{ marginLeft: 'var(--space-2)' }} />
                            </Link>
                            <Link to="/pipeline" className="btn btn-outline btn-lg">
                                Explore Pipeline
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Visual Card */}
                    <div className="glass-card" style={{
                        padding: 'var(--space-8)',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                    }}>
                        <Brain size={120} style={{
                            margin: '0 auto var(--space-6)',
                            color: 'var(--primary)',
                            opacity: 0.8
                        }} />
                        <h3 style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-semibold)',
                            marginBottom: 'var(--space-3)',
                            color: 'var(--text-main)'
                        }}>
                            Master's Thesis Project
                        </h3>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: 'var(--text-base)',
                            lineHeight: 'var(--leading-relaxed)'
                        }}>
                            Advanced segmentation pipeline for multimodal MRI analysis of brain organoids
                        </p>
                    </div>
                </div>

                {/* Project Highlights */}
                <div style={{ marginTop: 'var(--space-16)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h2 style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'var(--font-bold)',
                            marginBottom: 'var(--space-3)',
                            color: 'var(--text-main)'
                        }}>
                            Project Highlights
                        </h2>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            color: 'var(--text-muted)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Bridging the gap between high-resolution MRI acquisition and automated analysis
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-6)'
                    }}>
                        {/* Card 1 */}
                        <div className="glass-card hover-lift" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-4)'
                            }}>
                                <Microscope size={32} color="white" />
                            </div>
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-3)',
                                color: 'var(--text-main)'
                            }}>
                                Brain Organoids
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: 'var(--text-base)',
                                lineHeight: 'var(--leading-relaxed)'
                            }}>
                                Analysis of human and marmoset brain organoids as models for cortical development and disease
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="glass-card hover-lift" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--secondary) 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-4)'
                            }}>
                                <Activity size={32} color="white" />
                            </div>
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-3)',
                                color: 'var(--text-main)'
                            }}>
                                Multimodal MRI
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: 'var(--text-base)',
                                lineHeight: 'var(--leading-relaxed)'
                            }}>
                                Processing of T1w, T2w, DWI, and MGE sequences acquired at 9.4T ultra-high field strength
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-card hover-lift" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-4)'
                            }}>
                                <Layers size={32} color="white" />
                            </div>
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-3)',
                                color: 'var(--text-main)'
                            }}>
                                Hybrid Segmentation
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: 'var(--text-base)',
                                lineHeight: 'var(--leading-relaxed)'
                            }}>
                                Novel workflow using GMM probability maps as priors for U-Net training to improve accuracy
                            </p>
                        </div>
                    </div>
                </div>

                {/* Platform Features */}
                <div style={{ marginTop: 'var(--space-16)', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-8)',
                        color: 'var(--text-main)'
                    }}>
                        What This Platform Provides
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-6)',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        <div style={{ textAlign: 'left' }}>
                            <Database size={24} style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)' }} />
                            <h4 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-medium)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                Data Management
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                Organize organoid samples and MRI scans with metadata tracking
                            </p>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <TrendingUp size={24} style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)' }} />
                            <h4 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-medium)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                Pipeline Execution
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                Run segmentation workflows and track experiment configurations
                            </p>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <Brain size={24} style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)' }} />
                            <h4 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-medium)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                Results Analysis
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                Compare runs, visualize segmentations, and evaluate metrics
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
