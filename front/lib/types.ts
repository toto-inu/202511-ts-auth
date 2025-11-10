export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
