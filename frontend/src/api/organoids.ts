import client from './client';
import { OrganoidSample } from '../types';

export const getOrganoids = async () => {
    constresponse = await client.get<{ results: OrganoidSample[] }>('/organoids/');
    return response.data.results;
};

export const getOrganoid = async (id: number) => {
    const response = await client.get<OrganoidSample>(`/organoids/${id}/`);
    return response.data;
};
