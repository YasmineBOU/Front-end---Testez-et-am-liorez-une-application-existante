export interface AddUser {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  role: 'USER' | 'ADMIN';
}