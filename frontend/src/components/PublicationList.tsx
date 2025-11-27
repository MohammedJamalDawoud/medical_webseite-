import React from 'react';
import type { PublicationOrPoster } from '../types';
import { BookOpen, Presentation, FileText, Mic } from 'lucide-react';

interface PublicationListProps {
    publications: PublicationOrPoster[];
}

const PublicationList: React.FC<PublicationListProps> = ({ publications }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'PAPER':
                return <FileText className="h-6 w-6 text-blue-500" />;
            case 'THESIS':
                return <BookOpen className="h-6 w-6 text-purple-500" />;
            case 'POSTER':
                return <Presentation className="h-6 w-6 text-green-500" />;
            case 'TALK':
                return <Mic className="h-6 w-6 text-orange-500" />;
            default:
                return <FileText className="h-6 w-6 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {publications.map((pub) => (
                <div key={pub.id} className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mr-4 mt-1">
                                {getIcon(pub.pub_type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {pub.title}
                                </h3>
                                <div className="mt-1 max-w-2xl text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">{pub.authors}</span>
                                    <span className="mx-2">•</span>
                                    <span>{pub.year}</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 italic">
                                    {pub.venue}
                                </p>
                                {pub.abstract && (
                                    <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                                        <p>{pub.abstract}</p>
                                    </div>
                                )}
                                {pub.link && (
                                    <div className="mt-3">
                                        <a
                                            href={pub.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:text-teal-700"
                                        >
                                            View Resource &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pub.pub_type === 'THESIS' ? 'bg-purple-100 text-purple-800' :
                                    pub.pub_type === 'PAPER' ? 'bg-blue-100 text-blue-800' :
                                        pub.pub_type === 'POSTER' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {pub.pub_type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PublicationList;
