import client from './client';
import type { ProcessingStep } from '../types';

export const getProcessingSteps = async (scanId?: number) => {
    const params = scanId ? { scan: scanId } : {};
    const response = await client.get<{ results: ProcessingStep[] }>('/processing-steps/', { params });
    return response.data.results;
};
