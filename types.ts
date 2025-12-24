
export enum BookStatus {
  AVAILABLE = 'Available',
  BORROWED = 'Borrowed',
  MAINTENANCE = 'Maintenance'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: BookStatus;
  coverImage: string;
  description: string;
  publishedYear: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  borrowedCount: number;
  avatar: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'completed' | 'overdue';
}

export type View = 'dashboard' | 'catalog' | 'members' | 'lending' | 'inventory';
