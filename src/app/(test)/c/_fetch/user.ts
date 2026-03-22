import { api } from '@/lib/fetchwrapper';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export const fetchUsers = async (): Promise<User[]> => {
    return api.get<User[]>('/users');
};

export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
    return api.post<User>('/users', data);
};