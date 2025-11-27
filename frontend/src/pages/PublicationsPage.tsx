import { useEffect, useState } from 'react';
import { getPublications } from '../api/publications';
import type { PublicationOrPoster } from '../types';
import PublicationList from '../components/PublicationList';
import { Loader, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const PublicationsPage = () => {
    const [publications, setPublications] = useState<PublicationOrPoster[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPubs = async () => {
            try {
                const data = await getPublications();
                setPublications(data);
            } catch (err) {
                setError('Failed to load publications.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPubs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-primary animate-spin" />
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

    const theses = publications.filter(p => p.pub_type === 'THESIS');
    const papers = publications.filter(p => p.pub_type === 'PAPER');
    const posters = publications.filter(p => p.pub_type === 'POSTER');
    const talks = publications.filter(p => p.pub_type === 'TALK');

    return (
        <>
            <SEO
                title="Publications"
                description="List of publications, posters, and talks related to the MRI organoid segmentation project."
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Scientific Output</h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Publications, posters, and presentations related to the project.
                    </p>
                </div>

                <div className="space-y-12">
                    {theses.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Theses</h2>
                            <PublicationList publications={theses} />
                        </section>
                    )}

                    {papers.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Papers</h2>
                            <PublicationList publications={papers} />
                        </section>
                    )}

                    {posters.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Posters</h2>
                            <PublicationList publications={posters} />
                        </section>
                    )}

                    {talks.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Talks</h2>
                            <PublicationList publications={talks} />
                        </section>
                    )}
                </div>
            </div>
        </>
    );
};

export default PublicationsPage;
