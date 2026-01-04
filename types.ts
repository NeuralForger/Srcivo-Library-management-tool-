
export type DashboardView = 'reader' | 'admin' | 'community' | 'actions';

export interface UserProfile {
  username: string;
  name: string;
  role: 'reader' | 'librarian' | 'student' | 'admin';
  libraryId?: string;
  department?: string;
  status: 'active' | 'suspended' | 'pending';
  tier: 'normal' | 'privileged' | 'restricted';
  reliabilityScore: number;
}

export interface BookCopy {
  id: string; // Accession Number
  bookId: string; // Link to master record
  status: 'available' | 'issued' | 'reserved' | 'damaged' | 'missing' | 'archived';
  condition: 'new' | 'good' | 'worn' | 'damaged' | 'unusable';
  lastHandledBy?: string;
  shelfLocation: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  category: string;
  cover: string;
  mood: string[];
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
  totalCopies: number;
  availableCopies: number;
}

export interface Transaction {
  id: string;
  userId: string;
  bookCopyId: string;
  bookTitle: string;
  type: 'issue' | 'return' | 'renewal';
  timestamp: string;
  dueDate?: string;
  fineAmount?: number;
  status: 'active' | 'completed' | 'overdue';
  handledBy: string;
}

export interface UserRequest {
  id: string;
  type: 'book_acquisition' | 'user_enrollment';
  userId?: string; // For book acquisition
  requestData: any; // Dynamic based on type
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Fine {
  id: string;
  userId: string;
  amount: number;
  reason: 'late_return' | 'damage' | 'loss';
  status: 'unpaid' | 'paid' | 'waived';
  timestamp: string;
  referenceId: string; // Transaction ID
}

export interface Rule {
  id: string;
  condition: string;
  action: string;
  isActive: boolean;
}
