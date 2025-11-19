import client from './client';
import { SegmentationResult } from '../types';

export const getSegmentationResults = async () => {
    const response = await client.get<{ results: SegmentationResult[] }>('/segmentations/');
    return response.data.results;
};
