import client from './client';
import { PublicationOrPoster } from '../types';

export const getPublications = async () => {
    const response = await client.get<{ results: PublicationOrPoster[] }>('/publications/');
    return response.data.results;
};
