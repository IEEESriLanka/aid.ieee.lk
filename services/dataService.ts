import { Transaction, ImpactStory, TransactionType } from '@/types';
import { SHEET_TRANSACTIONS_URL, SHEET_IMPACT_URL } from '@/constants';
import Papa from 'papaparse';

// Security: Validate URLs to prevent XSS and fix common formatting issues
const validateUrl = (url: string | undefined, allowIframe = false): string | undefined => {
  if (!url) return undefined;
  
  let validUrl = url.trim();

  // If empty after trim
  if (!validUrl) return undefined;

  // Allow iframe src strings if explicitly allowed (for YouTube embeds)
  if (allowIframe && validUrl.includes('<iframe') && validUrl.includes('src="')) {
     return validUrl; 
  }

  // Auto-prepend https:// if missing protocol (and not strictly relative or another protocol)
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(validUrl)) {
    validUrl = 'https://' + validUrl;
  }

  try {
    const parsed = new URL(validUrl);
    // Ensure protocol is http or https
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return validUrl;
    }
  } catch (e) {
    // If it fails standard URL parsing but looks like a valid link
    if (/^https?:\/\/[^\s]+$/i.test(validUrl)) {
        return validUrl;
    }
  }
  return undefined;
};

// Fetch text first, then parse. This is more robust for Google Sheets CSV exports.
const fetchCSV = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();

    return new Promise((resolve, reject) => {
        Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        // Critical: Trim and lowercase headers to ensure consistent matching regardless of Sheet capitalization
        transformHeader: (h) => h.trim().toLowerCase(), 
        complete: (results) => {
            resolve(results.data as T[]);
        },
        error: (error: any) => {
            console.error("CSV Parse Error:", error);
            reject(error);
        },
        });
    });
  } catch (err) {
      console.error("Network Error fetching CSV:", err);
      return [];
  }
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const rawData = await fetchCSV<any>(SHEET_TRANSACTIONS_URL);
  
  return rawData.map((row, index) => ({
    id: row['transaction id'] || `trans-${index}`,
    date: row['date'] || new Date().toISOString(),
    description: row['description'] || 'No description',
    category: row['category'] || 'Uncategorized',
    // Remove non-numeric characters except dot and minus for amount parsing
    amount: parseFloat((row['amount'] || '0').toString().replace(/[^0-9.-]+/g, '')),
    type: (row['type'] === 'Credit' || row['type'] === 'Incoming') ? TransactionType.CREDIT : TransactionType.DEBIT,
    // Check all lowercase variations
    proofLink: validateUrl(
      row['proof'] || 
      row['link'] || 
      row['receipt'] || 
      row['prooflink'] || 
      row['proof link'] || 
      row['proof url'] ||
      row['payment proof'] ||
      row['slip'] ||
      row['url'] || 
      row['document']
    )
  })).filter(t => !isNaN(t.amount));
};

export const fetchImpactStories = async (): Promise<ImpactStory[]> => {
  const rawData = await fetchCSV<any>(SHEET_IMPACT_URL);
  
  return rawData.map((row, index) => {
    // Handle AdditionalImages or Gallery column (comma separated)
    const rawGallery = row['additionalimages'] || row['gallery'] || row['images'];
    const gallery = rawGallery ? rawGallery.split(',').map((s: string) => validateUrl(s.trim(), false)).filter((s: string | undefined): s is string => !!s) : [];

    // Helper for video links
    const rawVideos = row['videos'] || row['videolinks'] || row['video links'];
    const videos = rawVideos ? rawVideos.split(',').map((s: string) => validateUrl(s.trim(), false)).filter((s: string | undefined): s is string => !!s) : [];

    return {
      id: row['id'] || `story-${index}`,
      slug: row['slug'] || row['title']?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `story-${index}`,
      date: row['startdate'] || row['start date'] || row['date'] || new Date().toISOString(),
      endDate: row['enddate'] || row['end date'] || undefined,
      title: row['title'] || 'Untitled Update',
      description: row['description'] || '',
      location: row['locationname'] || row['location name'] || row['location'] || undefined,
      latitude: row['latitude'] ? parseFloat(row['latitude']) : undefined,
      longitude: row['longitude'] ? parseFloat(row['longitude']) : undefined,
      // Check all lowercase variations for image url
      imageUrl: validateUrl(
        row['imageurl'] || 
        row['image url'] || 
        row['image'] || 
        row['media'] || 
        row['video'] || 
        row['link'], 
        true
      ),
      gallery: gallery,
      videoLinks: videos
    };
  }).filter((s: ImpactStory) => s.title && s.title !== 'Untitled Update');
};