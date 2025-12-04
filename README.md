# IEEE Sri Lanka Disaster Relief Transparency Portal

<div align="center">
  <img src="public/logo.png" alt="IEEE Sri Lanka Section Logo" height="80" />
  <h3>Transparency. Integrity. Impact.</h3>
  <p>The official transparency and utilization dashboard for the IEEE Sri Lanka Section Disaster Relief Fund.</p>
  <p><a href="https://aid.ieee.lk"><strong>Visit Live Site</strong></a></p>
</div>

---

## Table of contents

- About
- How it works (Zero Backend)
- Features
- Tech stack
- Local development
- Data configuration (Google Sheets)
- Deployment (GitHub Pages / Vercel)
- Operations and data integrity
- Contribution guidelines
- Troubleshooting
- License

---

## About

In response to natural disasters affecting Sri Lanka, the IEEE Sri Lanka Section established a Disaster Relief Fund.
This web application acts as a public transparency ledger so donors and the public can verify:

- Funds raised: totals of donations received
- Utilization: a complete record of every disbursement
- Impact: evidence of relief distributions (photos and delivery notes)

---

## How it works (Zero Backend)

This project follows a Zero Backend architecture.

- Data is maintained in Google Sheets by authorized volunteers.
- The web app fetches live data from published CSV exports of those sheets.
- Calculations, summaries, charts, and transaction views are generated client side.

Why this approach works well for volunteer maintenance:
- No server cost or backend deployments
- Quick updates through Google Sheets
- Clear audit trail via transaction entries and proof links

---

## Features

- Live financial stats
  - Total collected
  - Total disbursed
  - Remaining balance
- Interactive charts
  - Utilization breakdown by category (Food, Medical, Shelter, etc.)
- Searchable transaction ledger
  - Filterable credit and debit history
  - Links to proof documents (receipts, invoices, approvals)
- Impact feed
  - News feed style updates with photos and captions
- Fully responsive UI
  - Optimized for mobile, tablet, and desktop

---

## Tech stack

- React 18 + Vite
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- Vercel / GitHub Pages (custom domain)
- Google Sheets (CSV export) as the data source

---

## Local development

### Prerequisites
- Node.js 18+
- npm

### Setup

Clone the repository:
```bash
git clone https://github.com/IEEESriLanka/aid.ieee.lk.git
cd aid.ieee.lk
```

Install dependencies:
```bash
npm install
```

Start the dev server:
```bash
npm run dev
```

Open:
- http://localhost:5173

### Useful scripts

```bash
npm run build
npm run preview
npm run lint
```

---

## Data configuration (Google Sheets)

This app reads from a Google Sheet that contains two worksheets (tabs):

- Transactions
- Impact

The URLs are configured in:
- `src/constants.ts`

Look for:
- `SHEET_TRANSACTIONS_URL`
- `SHEET_IMPACT_URL`

### Generate CSV export URLs

1. Open the Google Sheet.
2. Go to File > Share > Publish to web.
3. Under "Link":
   - Select the Transactions tab
   - Select Comma-separated values (.csv)
4. Copy the generated link and paste it as `SHEET_TRANSACTIONS_URL`.
5. Repeat for the Impact tab and paste it as `SHEET_IMPACT_URL`.

Important:
- Use the Data Administration Manual for the required column headers and formatting rules.
- Keep the header row unchanged once published. Changing column names can break parsing.

---

## Deployment

This project is optimized for deployment on Vercel or GitHub Pages.

### Vercel (Recommended)
1. Import the repository to Vercel.
2. The `vercel.json` file included in the root ensures single-page application routing works correctly.

### GitHub Pages
- A `public/CNAME` file contains:
  ```text
  aid.ieee.lk
  ```
- This ensures the custom domain setting persists after deployments.

---

## Operations and data integrity

Recommended operating practices for clean reporting:

- One transaction record per real world movement of funds (credit or debit).
- Every debit entry should include:
  - clear description
  - category
  - amount
  - date
  - proof link (receipt, invoice, approval note)
- Reconcile periodically:
  - confirm totals match bank statements or official deposit records
  - verify proof links remain accessible
- Access control:
  - restrict edit permissions on the sheet to clearly designated roles
  - avoid sharing edit access publicly

---

## Contribution guidelines

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-change
   ```
3. Make changes and keep them scoped.
4. Run checks:
   ```bash
   npm run lint
   npm run build
   ```
5. Commit and push your branch.
6. Open a pull request with:
   - what changed
   - why it changed
   - screenshots if UI was modified

---

## Troubleshooting

### The site loads but shows empty data
- Confirm the Google Sheet is published to the web.
- Confirm the exported format is CSV for the correct tab.
- Confirm the URLs in `src/constants.ts` point to the correct CSV endpoints.

### Charts or totals look wrong
- Check for non-numeric values in amount fields.
- Check for missing categories or inconsistent category naming.
- Check for duplicate transaction rows.

### Custom domain not working after deploy
- Verify `public/CNAME` exists and contains `aid.ieee.lk`.
- Confirm the DNS record is still correct.

---

## License

© IEEE Sri Lanka Section. All Rights Reserved.

Designed and developed by the IEEE Sri Lanka Section TechOps Team.
