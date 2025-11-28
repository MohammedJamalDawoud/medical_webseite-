import { Microscope, Activity, Cpu, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

const ProjectOverviewPage = () => {
    return (
        <>
            <SEO
                title="Project Overview"
                description="Overview of the brain organoid MRI segmentation project, including GMM and U-Net methodologies."
            />
            <div className="page-container">
                <PageHeader
                    title="Project Overview"
                    subtitle="A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation"
                />

                {/* Introduction Card */}
                <div className="glass-card" style={{ marginBottom: 'var(--space-12)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', color: 'var(--text-main)' }}>
                        Master's Thesis Project
                    </h2>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                        This research develops an automated segmentation pipeline for analyzing brain organoid MRI data,
                        combining classical statistical methods with modern deep learning to achieve precise tissue classification.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-6)' }}>
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>Institution</div>
                            <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-main)', fontWeight: 'var(--font-medium)' }}>HAWK Göttingen & DPZ</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>Field Strength</div>
                            <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-main)', fontWeight: 'var(--font-medium)' }}>9.4 Tesla</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>Modalities</div>
                            <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-main)', fontWeight: 'var(--font-medium)' }}>T1w, T2w, DWI, MGE</div>
                        </div>
                    </div>
                </div>

                {/* Brain Organoids Section */}
                <Section title="Brain Organoids as Model Systems">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)', alignItems: 'start' }}>
                        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <Microscope size={64} style={{ margin: '0 auto var(--space-4)', color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-main)' }}>
                                3D Tissue Cultures
                            </h3>
                        </div>
                        <div>
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                                Brain organoids are three-dimensional in vitro tissue cultures derived from pluripotent stem cells
                                that mimic the structure and function of the developing brain.
                            </p>
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                                They offer a unique opportunity to study human brain development and neurological disorders in a
                                controlled environment. However, analyzing their complex internal structure non-invasively remains a challenge.
                            </p>
                            <div className="glass-card" style={{ padding: 'var(--space-4)', background: 'rgba(59, 130, 246, 0.05)' }}>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Key Advantages</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                        <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Human-relevant model system</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                        <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Longitudinal tracking possible</span>
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Non-destructive analysis</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* MRI Section */}
                <Section title="The Role of MRI">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
                        <div>
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                                Magnetic Resonance Imaging (MRI) provides a non-destructive method to visualize the internal architecture
                                of organoids over time. Using ultra-high field MRI (9.4T), we can acquire high-resolution images with
                                various contrasts that reveal different tissue properties.
                            </p>
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
                                This longitudinal imaging capability is crucial for tracking developmental trajectories without
                                sacrificing the samples.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                                <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--primary)', marginBottom: 'var(--space-1)' }}>T1-weighted</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Anatomical structure</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--primary)', marginBottom: 'var(--space-1)' }}>T2-weighted</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Tissue contrast</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--primary)', marginBottom: 'var(--space-1)' }}>DWI</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Diffusion properties</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--primary)', marginBottom: 'var(--space-1)' }}>MGE</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Multi-gradient echo</div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <Activity size={64} style={{ margin: '0 auto var(--space-4)', color: 'var(--secondary)' }} />
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-main)', marginBottom: 'var(--space-2)' }}>
                                Ultra-High Field
                            </h3>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary)' }}>9.4T</div>
                        </div>
                    </div>
                </Section>

                {/* Pipeline Section */}
                <Section title="Automated Segmentation Pipeline">
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
                        Manual segmentation of 3D MRI data is time-consuming and prone to observer bias. This project develops
                        an automated pipeline that combines classical statistical methods with modern deep learning.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
                        {/* Step 1 */}
                        <div className="glass-card hover-lift">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-4)',
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-bold)',
                                color: 'white'
                            }}>1</div>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-main)' }}>
                                Preprocessing
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                                Bias field correction, denoising, and intensity normalization to prepare data for analysis
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-card hover-lift">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--secondary) 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-4)',
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-bold)',
                                color: 'white'
                            }}>2</div>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-main)' }}>
                                GMM Segmentation
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                                Gaussian Mixture Models generate initial tissue probability maps based on intensity distributions
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-card hover-lift">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-4)',
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-bold)',
                                color: 'white'
                            }}>3</div>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-main)' }}>
                                U-Net Refinement
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                                3D U-Net architecture uses raw MRI and GMM maps as input to produce refined, robust segmentation
                            </p>
                        </div>
                    </div>

                    {/* Innovation Highlight */}
                    <div className="glass-card" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid var(--accent)' }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)' }}>
                            <Cpu size={32} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)', color: 'var(--text-main)' }}>
                                    Novel Hybrid Approach
                                </h3>
                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                                    By using GMM probability maps as additional input channels to the U-Net, we leverage both
                                    statistical priors and learned features, improving segmentation accuracy especially in regions
                                    with ambiguous intensity profiles.
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </>
    );
};

export default ProjectOverviewPage;
