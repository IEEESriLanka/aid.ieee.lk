import { Transaction, ImpactStory, TransactionType } from '../types';
import { SHEET_TRANSACTIONS_URL, SHEET_IMPACT_URL } from '../constants';

// Security: Validate URLs to prevent javascript: XSS attacks
const isValidUrl = (urlString: string): boolean => {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
};

// Helper to check if string is an iframe embed code
const isIframeString = (str: string): boolean => {
  return typeof str === 'string' && str.trim().startsWith('<iframe') && str.includes('src="');
};

// Helper to parse CSV string to JSON
const parseCSV = (csvText: string) => {
  if (!csvText || typeof csvText !== 'string') return [];
  
  const lines = csvText.split('\n');
  if (lines.length < 2) return []; // Need at least headers and one row

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Safety Check
  if (!headers.includes('Date') && !headers.includes('date')) {
      console.warn('Invalid CSV format detected. Check your Google Sheet URL.');
      return [];
  }
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle commas inside quotes
    const currentLine = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || lines[i].split(',');

    const obj: any = {};
    headers.forEach((header, index) => {
        let val = currentLine[index] ? currentLine[index].trim() : '';
        val = val.replace(/^"|"$/g, ''); // Remove quotes
        obj[header] = val;
    });
    result.push(obj);
  }
  return result;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    if (!SHEET_TRANSACTIONS_URL) return [];

    const response = await fetch(SHEET_TRANSACTIONS_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const text = await response.text();
    const data = parseCSV(text);
    
    return data.map((row: any, index: number) => {
      // Sanitize inputs
      const proofLink = row.ProofLink && isValidUrl(row.ProofLink) ? row.ProofLink : undefined;
      
      return {
        id: `trans-${index}`,
        date: row.Date || '',
        description: row.Description || '',
        category: row.Category || 'General',
        amount: parseFloat(row.Amount ? row.Amount.replace(/,/g, '') : '0') || 0,
        type: row.Type === 'Credit' ? TransactionType.CREDIT : TransactionType.DEBIT,
        proofLink: proofLink
      };
    });
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    return [];
  }
};

export const fetchImpactStories = async (): Promise<ImpactStory[]> => {
  try {
    if (!SHEET_IMPACT_URL) return [];

    const response = await fetch(SHEET_IMPACT_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    const text = await response.text();
    const data = parseCSV(text);
    
    return data.map((row: any, index: number) => {
      // Sanitize inputs: Allow valid URLs OR iframe embed strings
      let imageUrl = undefined;
      const rawImageInput = row.ImageUrl || '';
      
      if (isValidUrl(rawImageInput)) {
        imageUrl = rawImageInput;
      } else if (isIframeString(rawImageInput)) {
        // Allow iframe strings to pass through; they will be parsed by the component
        imageUrl = rawImageInput;
      }

      return {
        id: `story-${index}`,
        date: row.Date || '',
        title: row.Title || '',
        description: row.Description || '',
        imageUrl: imageUrl
      };
    });
  } catch (error) {
    console.error("Failed to fetch impact stories", error);
    return [];
  }
};