import { Transaction, ImpactStory, TransactionType } from '../types';
import { SHEET_TRANSACTIONS_URL, SHEET_IMPACT_URL } from '../constants';

const parseCSV = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = [];
    let inQuote = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));
    
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as any);
  });
};

// Security: Validate URLs to prevent XSS and fix common formatting issues
const validateUrl = (url: string, allowIframe = false): string | undefined => {
  if (!url) return undefined;
  
  // Allow iframe src strings if explicitly allowed (for YouTube embeds)
  if (allowIframe && url.includes('<iframe') && url.includes('src="')) {
     return url; // ImpactFeed component handles parsing
  }

  let validUrl = url.trim();
  
  // Auto-prepend https:// if missing protocol
  if (!/^https?:\/\//i.test(validUrl)) {
    validUrl = 'https://' + validUrl;
  }

  try {
    const parsed = new URL(validUrl);
    // Ensure protocol is http or https
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return validUrl;
    }
  } catch (e) {
    // If it fails standard URL parsing but looks like a valid link (e.g. simplified format), return it sanitized
    // This helps with some copied links that might have odd characters
    if (/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(validUrl)) {
        return validUrl;
    }
  }
  return undefined;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(SHEET_TRANSACTIONS_URL);
    const text = await response.text();
    const data = parseCSV(text);
    
    return data.map((row: any, index: number) => ({
      id: `trans-${index}`,
      date: row['Date'] || '',
      description: row['Description'] || '',
      category: row['Category'] || 'General',
      amount: parseFloat((row['Amount'] || '0').replace(/[^0-9.-]+/g, '')),
      type: (row['Type'] === 'Credit' || row['Type'] === 'Incoming') ? TransactionType.CREDIT : TransactionType.DEBIT,
      // Enhanced check for various proof column names to handle different user inputs
      proofLink: validateUrl(
        row['Proof'] || 
        row['Link'] || 
        row['Receipt'] || 
        row['ProofLink'] || 
        row['Proof Link'] || 
        row['Proof URL'] ||
        row['Payment Proof'] ||
        row['Slip'] ||
        row['Url'] || 
        row['URL']
      )
    })).filter((t: Transaction) => t.date && !isNaN(t.amount));
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    return [];
  }
};

export const fetchImpactStories = async (): Promise<ImpactStory[]> => {
  try {
    const response = await fetch(SHEET_IMPACT_URL);
    const text = await response.text();
    const data = parseCSV(text);
    
    return data.map((row: any, index: number) => ({
      id: `story-${index}`,
      date: row['Date'] || '',
      title: row['Title'] || '',
      description: row['Description'] || '',
      // Enhanced ImageUrl mapping
      imageUrl: validateUrl(row['ImageUrl'] || row['Image'] || row['Media'] || row['Video'] || row['Link'], true)
    })).filter((s: ImpactStory) => s.title);
  } catch (error) {
    console.error("Failed to fetch stories", error);
    return [];
  }
};