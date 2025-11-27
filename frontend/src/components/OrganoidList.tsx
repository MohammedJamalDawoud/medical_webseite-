import React from 'react';
import type { OrganoidSample } from '../types';
import { Calendar, Info } from 'lucide-react';

interface OrganoidListProps {
    organoids: OrganoidSample[];
    onSelect: (organoid: OrganoidSample) => void;
    selectedId?: number;
}

const OrganoidList: React.FC<OrganoidListProps> = ({ organoids, onSelect, selectedId }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Organoid Samples</h2>
            <div className="grid gap-4">
                {organoids.map((organoid) => (
                    <div
                        key={organoid.id}
                        onClick={() => onSelect(organoid)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedId === organoid.id
                            ? 'border-primary bg-teal-50'
                            : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{organoid.name}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${organoid.species === 'HUMAN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {organoid.species}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {organoid.date_created}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{organoid.description}</p>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                            <Info className="h-3 w-3 mr-1" />
                            {organoid.scans_count} Scans Available
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrganoidList;
