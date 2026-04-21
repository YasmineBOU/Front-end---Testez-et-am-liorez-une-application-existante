export interface UserBasicInfo {
    id: number;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';

    [key: string]: any;
}