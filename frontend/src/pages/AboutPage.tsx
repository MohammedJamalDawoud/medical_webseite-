import { GraduationCap, Building2, Users } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

const AboutPage = () => {
    return (
        <>
            <SEO
                title="About"
                description="Master's thesis project on combined GMM and U-Net pipeline for multimodal tissue segmentation of in vitro MRI data."
            />
            <div className="page-container">
                <PageHeader
                    title="About the Project"
                    subtitle="Master's Thesis in Medical Image Analysis"
                />

                {/* Thesis Information Card */}
                <div className="glass-card" style={{
                    marginBottom: 'var(--space-12)',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    border: '1px solid var(--primary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)' }}>
                        <GraduationCap size={48} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <div>
                            <h2 style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                Master's Thesis
                            </h2>
                            <p style={{
                                fontSize: 'var(--text-lg)',
                                color: 'var(--text-secondary)',
                                fontStyle: 'italic',
                                marginBottom: 'var(--space-4)',
                                lineHeight: 'var(--leading-relaxed)'
                            }}>
                                "A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation of In Vitro MRI Data"
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                                <div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                                        Student
                                    </div>
                                    <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-main)', fontWeight: 'var(--font-medium)' }}>
                                        Mohammed Jamal Dawoud
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                                        Year
                                    </div>
                                    <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-main)', fontWeight: 'var(--font-medium)' }}>
                                        2025
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Institutions Section */}
                <Section title="Institutions & Collaboration">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="glass-card hover-lift">
                            <Building2 size={32} style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)' }} />
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                HAWK Göttingen
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                                Hochschule für angewandte Wissenschaft und Kunst
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                                Primary institution for the Master's program
                            </p>
                        </div>

                        <div className="glass-card hover-lift">
                            <Building2 size={32} style={{ color: 'var(--secondary)', marginBottom: 'var(--space-4)' }} />
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-2)',
                                color: 'var(--text-main)'
                            }}>
                                DPZ Göttingen
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                                Deutsches Primatenzentrum
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                                Research collaboration partner providing MRI data and expertise
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Supervisors Section */}
                <Section title="Supervisors">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="glass-card">
                            <Users size={24} style={{ color: 'var(--primary)', marginBottom: 'var(--space-3)' }} />
                            <h3 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-1)',
                                color: 'var(--text-main)'
                            }}>
                                Prof. Dr. Roman Grothausmann
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                HAWK Göttingen
                            </p>
                        </div>

                        <div className="glass-card">
                            <Users size={24} style={{ color: 'var(--secondary)', marginBottom: 'var(--space-3)' }} />
                            <h3 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-1)',
                                color: 'var(--text-main)'
                            }}>
                                Prof. Dr. Susann Boretius
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                Deutsches Primatenzentrum (DPZ)
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Project Summary */}
                <Section title="Project Summary">
                    <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                        <p style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-secondary)',
                            lineHeight: 'var(--leading-relaxed)',
                            marginBottom: 'var(--space-4)'
                        }}>
                            This project represents the culmination of research into advanced medical image analysis techniques
                            applied to the specific domain of brain organoid imaging.
                        </p>
                        <p style={{
                            fontSize: 'var(--text-base)',
                            color: 'var(--text-secondary)',
                            lineHeight: 'var(--leading-relaxed)'
                        }}>
                            The web application presented here demonstrates the practical implementation of the developed pipeline,
                            providing tools for data management, pipeline execution, and results analysis. It serves both as a
                            research tool and as documentation of the methodological approach.
                        </p>
                    </div>
                </Section>
            </div>
        </>
    );
};

export default AboutPage;
