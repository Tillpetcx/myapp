import { User, Post } from "./types";
export async function fetchData(): Promise<{ users: User[]; posts: Post[] }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/data`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
}