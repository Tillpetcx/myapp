export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
}
export type CombinedData = {
    users: User[];
    posts: Post[];
};