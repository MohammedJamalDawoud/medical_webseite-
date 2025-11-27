import client from './client';
import type { MRIScan } from '../types';

export const getScans = async (organoidId?: number) => {
    const params = organoidId ? { organoid: organoidId } : {};
    const response = await client.get<{ results: MRIScan[] }>('/scans/', { params });
    return response.data.results;
};

export const getScan = async (id: number) => {
    const response = await client.get<MRIScan>(`/scans/${id}/`);
    return response.data;
};
