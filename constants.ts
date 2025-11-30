// IEEE Colors
export const IEEE_BLUE = '#00629B';
export const IEEE_BLUE_DARK = '#004e7a';
export const IEEE_BLUE_LIGHT = '#E6F0F5';

// ==============================================================================
// CONFIGURATION STEP:
// 1. Create a Google Sheet with two tabs: 'Transactions' and 'Impact'
// 2. Go to File -> Share -> Publish to Web
// 3. Select "Transactions" -> "Comma-separated values (.csv)" -> Copy Link -> Paste below
// 4. Select "Impact" -> "Comma-separated values (.csv)" -> Copy Link -> Paste below
// 5. Set USE_MOCK_DATA to false
// ==============================================================================

export const SHEET_TRANSACTIONS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQeYLdJAJBvNdCTmLQ_f2S3VKn7Lu_oUEJDQvELH3dEZ5cTXvmrW6WvflHAWQoye9h0MAauWKzqvwo/pub?gid=0&single=true&output=csv"; 
export const SHEET_IMPACT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQeYLdJAJBvNdCTmLQ_f2S3VKn7Lu_oUEJDQvELH3dEZ5cTXvmrW6WvflHAWQoye9h0MAauWKzqvwo/pub?gid=1511241343&single=true&output=csv";

export const USE_MOCK_DATA = false; // Set to true for initial testing

// ==============================================================================
// DEMO DATA (Used when USE_MOCK_DATA is true)
// ==============================================================================

export const MOCK_TRANSACTIONS = [
  { date: '2023-10-01', description: 'Initial Donation from IEEE R10', category: 'Grant', amount: 500000, type: 'Credit', proofLink: '#' },
  { date: '2023-10-02', description: 'Public Donation Campaign', category: 'Donation', amount: 150000, type: 'Credit', proofLink: '#' },
  { date: '2023-10-05', description: 'Emergency Dry Rations (500 packs)', category: 'Food Relief', amount: 200000, type: 'Debit', proofLink: '#' },
  { date: '2023-10-07', description: 'Medical Supplies for Base Hospital', category: 'Medical', amount: 120000, type: 'Debit', proofLink: '#' },
  { date: '2023-10-10', description: 'Transport Logistics for Relief Team', category: 'Logistics', amount: 25000, type: 'Debit', proofLink: '#' },
  { date: '2023-10-12', description: 'Corporate CSR Donation', category: 'Donation', amount: 300000, type: 'Credit', proofLink: '#' },
  { date: '2023-10-15', description: 'Temporary Shelter Material (Tarps/Ropes)', category: 'Shelter', amount: 180000, type: 'Debit', proofLink: '#' },
];

export const MOCK_IMPACT = [
  { 
    date: '2023-10-05', 
    title: 'First Batch of Rations Delivered', 
    description: 'Volunteers successfully distributed 500 packs of dry rations to families displaced in the Kalutara district. Each pack contains rice, dhal, sugar, and canned fish sufficient for 1 week.', 
    imageUrl: 'https://picsum.photos/800/600?random=1' 
  },
  { 
    date: '2023-10-08', 
    title: 'Medical Aid Handover', 
    description: 'Essential medicines and first aid kits were handed over to the Director of the regional hospital to treat flood-related injuries.', 
    imageUrl: '' // Testing the new default image
  }
];
