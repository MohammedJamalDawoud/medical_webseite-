
import SEO from '../components/SEO';

const ProjectOverviewPage = () => {
    return (
        <>
            <SEO
                title="Project Overview"
                description="Overview of the brain organoid MRI segmentation project, including GMM and U-Net methodologies."
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Overview</h1>

                <div className="prose prose-lg text-gray-500">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Brain Organoids as Model Systems</h2>
                        <p>
                            Brain organoids are three-dimensional in vitro tissue cultures derived from pluripotent stem cells
                            that mimic the structure and function of the developing brain. They offer a unique opportunity to study
                            human brain development and neurological disorders in a controlled environment. However, analyzing their
                            complex internal structure non-invasively remains a challenge.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Role of MRI</h2>
                        <p>
                            Magnetic Resonance Imaging (MRI) provides a non-destructive method to visualize the internal architecture
                            of organoids over time. Using ultra-high field MRI (9.4T), we can acquire high-resolution images with
                            various contrasts (T1, T2, Diffusion) that reveal different tissue properties. This longitudinal imaging
                            capability is crucial for tracking developmental trajectories without sacrificing the samples.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Automated Segmentation Pipeline</h2>
                        <p>
                            Manual segmentation of 3D MRI data is time-consuming and prone to observer bias. This project develops
                            an automated pipeline that combines classical statistical methods with modern deep learning:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>
                                <strong>Preprocessing:</strong> Bias field correction, denoising, and intensity normalization to prepare data.
                            </li>
                            <li>
                                <strong>GMM:</strong> Gaussian Mixture Models are used to generate initial tissue probability maps based on intensity distributions.
                            </li>
                            <li>
                                <strong>U-Net:</strong> A 3D U-Net architecture takes both the raw MRI data and the GMM probability maps as input to produce a refined, robust segmentation.
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ProjectOverviewPage;
