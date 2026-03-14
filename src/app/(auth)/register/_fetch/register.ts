import { api } from "@/lib/fetchwrapper";

export interface RegisterRequest {
    email: string;
    password: string;
    username?: string;
    displayName?: string;
}

export interface RegisterResponse {
    id: string;
    email: string;
    username: string | null;
    displayName: string | null;
}

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post<RegisterResponse>("/register", data);
}