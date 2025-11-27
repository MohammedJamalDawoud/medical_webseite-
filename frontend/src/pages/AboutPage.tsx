
const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">About the Project</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Master's Thesis</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        "A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation of In Vitro MRI Data"
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Student</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Mohammed Jamal Dawoud</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Institution</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                HAWK Hochschule für angewandte Wissenschaft und Kunst
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Collaboration</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                Deutsches Primatenzentrum (DPZ), Göttingen
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Supervisors</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Prof. Dr. Roman Grothausmann (HAWK)</li>
                                    <li>Prof. Dr. Susann Boretius (DPZ)</li>
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="prose prose-lg text-gray-500">
                <p>
                    This project represents the culmination of research into advanced medical image analysis techniques
                    applied to the specific domain of brain organoid imaging. The code and results presented here demonstrate
                    the practical application of the developed pipeline.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
