import { signIn } from "next-auth/react";

export interface LoginCredentials {
    email: string;
    password: string;
}

export async function login(credentials: LoginCredentials): Promise<boolean> {
    const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
    });

    if (result?.error) {
        throw new Error(result.error);
    }

    return true;
}