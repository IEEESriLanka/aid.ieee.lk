export enum TransactionType {
  CREDIT = 'Credit',
  DEBIT = 'Debit'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  proofLink?: string;
}

export interface ImpactStory {
  id: string;
  slug: string; // New: for routing
  date: string; // Start Date
  endDate?: string; // New: End Date
  title: string;
  description: string;
  location?: string; // New: Location Name
  latitude?: number; // New: For Map
  longitude?: number; // New: For Map
  imageUrl?: string;
  gallery?: string[]; // New: Additional images
  videoLinks?: string[]; // New: YouTube/Drive links
}

export interface FinancialSummary {
  totalCollected: number;
  totalSpent: number;
  remainingBalance: number;
}