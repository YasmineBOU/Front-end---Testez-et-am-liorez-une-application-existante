export interface UserDetailInfo {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    role: 'USER' | 'ADMIN';
    created_at: string;
    updated_at: string;
}