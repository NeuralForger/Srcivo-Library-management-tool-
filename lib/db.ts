
import { UserProfile, Book, BookCopy, UserRequest, Transaction, Fine } from '../types';

/**
 * A E G I S - Secure User Database
 * Credentials: Admin / Admin
 */
const USER_DATABASE: Record<string, { pass: string; name: string; role: 'reader' | 'librarian' | 'student' | 'admin', dept?: string }> = {
  'admin': { pass: 'Admin', name: 'admin', role: 'admin' },
  'student_01': { pass: '1710', name: 'Ravan', role: 'student', dept: 'Quantum Engineering' },
  'librarian_prime': { pass: '1710', name: 'Theodore', role: 'librarian' }
};

// --- ENTERPRISE SCALE GENERATORS ---

const CATEGORIES = ['Quantum Physics', 'Neural Arts', 'Bio-Ethics', 'History', 'Fiction', 'Dystopian', 'Philosophy', 'Architecture'];
const AUTHORS = ['Marcus Aurelius', 'Sarah J. Miller', 'Neo Rivera', 'Matt Haig', 'Isaac Asimov', 'Ursula Le Guin'];
const DEPARTMENTS = ['Quantum Engineering', 'Digital Philosophy', 'Neural Arts', 'Robotics', 'Ethical AI', 'Aerospace'];

export const generateBooks = (count: number): Book[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `B-${10000 + i}`,
    isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    title: `Artifact Title ${10000 + i}`,
    author: AUTHORS[i % AUTHORS.length],
    publisher: 'Aegis Publications',
    edition: 'v.2.4 Neural',
    category: CATEGORIES[i % CATEGORIES.length],
    cover: `https://picsum.photos/seed/book${i}/200/300`,
    mood: ['Analytical', 'Oceanic'],
    demandLevel: i % 10 === 0 ? 'critical' : i % 5 === 0 ? 'high' : 'medium',
    totalCopies: 5,
    availableCopies: 3
  }));
};

export const generateCopies = (books: Book[]): BookCopy[] => {
  const allCopies: BookCopy[] = [];
  // Generate copies for the first 500 books for search depth
  books.slice(0, 500).forEach((book, bIdx) => {
    for (let c = 1; c <= 3; c++) {
      allCopies.push({
        id: `ACC-${10000 + (bIdx * 3) + c}`,
        bookId: book.id,
        status: (bIdx + c) % 15 === 0 ? 'damaged' : (bIdx + c) % 8 === 0 ? 'issued' : 'available',
        condition: (bIdx + c) % 15 === 0 ? 'damaged' : 'good',
        shelfLocation: `S${Math.floor(bIdx / 20)}-R${c}`,
        lastHandledBy: (bIdx + c) % 8 === 0 ? `LIB-2024-STU-${10000 + (bIdx % 2000)}` : undefined
      });
    }
  });
  return allCopies;
};

export const generateStudents = (count: number): UserProfile[] => {
  return Array.from({ length: count }).map((_, i) => ({
    username: `member_${1000 + i}`,
    name: `Student Name ${1000 + i}`,
    role: 'student',
    libraryId: `LIB-2024-STU-${10000 + i}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    status: i % 100 === 0 ? 'suspended' : 'active',
    tier: i % 200 === 0 ? 'privileged' : 'normal',
    reliabilityScore: 75 + Math.floor(Math.random() * 25)
  }));
};

export const generateRequests = (count: number): UserRequest[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `REQ-${5000 + i}`,
    type: i % 2 === 0 ? 'book_acquisition' : 'user_enrollment',
    userId: i % 2 === 0 ? `member_${1000 + i}` : undefined,
    requestData: i % 2 === 0 
      ? { title: `Requested Artifact ${i}`, author: AUTHORS[i % AUTHORS.length] } 
      : { name: `Applicant ${i}`, dept: DEPARTMENTS[i % DEPARTMENTS.length] },
    status: 'pending',
    timestamp: new Date(Date.now() - Math.random() * 864000000).toISOString(),
    priority: i % 10 === 0 ? 'high' : 'medium'
  }));
};

export const INITIAL_BOOKS = generateBooks(6000);
export const INITIAL_COPIES = generateCopies(INITIAL_BOOKS);
export const INITIAL_STUDENTS = generateStudents(2000);
export const INITIAL_REQUESTS = generateRequests(60);

export async function authenticateUser(username: string, password: string): Promise<UserProfile | null> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const searchKey = username.trim().toLowerCase();
  let userData = USER_DATABASE[searchKey];
  let actualKey = searchKey;

  if (!userData) {
    const foundEntry = Object.entries(USER_DATABASE).find(([_, data]) => data.name.toLowerCase() === searchKey);
    if (foundEntry) {
      actualKey = foundEntry[0];
      userData = foundEntry[1];
    }
  }

  if (userData && userData.pass === password) {
    return {
      username: actualKey,
      name: userData.name,
      role: userData.role,
      libraryId: userData.role === 'admin' ? 'SYS-ADM-001' : `LIB-2024-${userData.role.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'active',
      tier: userData.role === 'admin' ? 'privileged' : 'normal',
      department: userData.dept,
      reliabilityScore: 92
    };
  }
  return null;
}

export const generateLibraryId = (role: string) => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `LIB-${year}-${role.toUpperCase().slice(0,3)}-${rand}`;
};
