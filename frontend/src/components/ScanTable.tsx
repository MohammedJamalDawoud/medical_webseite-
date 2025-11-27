import React from 'react';
import type { MRIScan } from '../types';
import { Eye } from 'lucide-react';

interface ScanTableProps {
    scans: MRIScan[];
    onSelect: (scan: MRIScan) => void;
}

const ScanTable: React.FC<ScanTableProps> = ({ scans, onSelect }) => {
    if (scans.length === 0) {
        return <div className="text-gray-500 text-center py-8">No scans available for this organoid.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modality</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sequence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                    {scan.modality}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scan.sequence_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scan.resolution}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scan.acquisition_date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onSelect(scan)}
                                    className="text-primary hover:text-teal-900 flex items-center"
                                >
                                    <Eye className="h-4 w-4 mr-1" /> View Pipeline
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScanTable;
