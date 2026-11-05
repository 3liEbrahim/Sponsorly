# Sponsorly prototype

Clickable prototype of a funding platform with three linked accounts:

- **Student team**: raise grants for competitions or travel, upload invoices to release escrow money, track sponsors.
- **Business owner**: request a micro-loan or offer equity, pay monthly installments, see lenders and the cap table.
- **Sponsor / investor**: fund grants, loans and equity, track repayments (on time / late), tax receipts, payment history.

All data is demo data, saved in the browser's localStorage. Use "Reset demo data" in the footer to start over.

## Run it

**Option 1: Node (no install needed)**

```
npm start
```

Then open http://localhost:5173. In VS Code you can also press **F5** ("Run Sponsorly server"), which opens the browser for you.

**Option 2: Live Server extension**

Install "Live Server" (VS Code will suggest it), right-click `public/index.html`, choose **Open with Live Server**.

**Option 3**

Double-click `public/index.html` to open it directly in a browser.

## Deploy to Vercel

The site is fully static (no build step). `vercel.json` tells Vercel to serve the `public` folder.

**From GitHub (recommended)**

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project** and import the repository.
3. Leave every setting as it is and click **Deploy**.

Every push to the main branch redeploys the site automatically.

**From the terminal**

```
npm i -g vercel
vercel          # first time: log in and answer the prompts (accept the defaults)
vercel --prod   # publish to your production URL
```

**Drag and drop**

You can also drag the whole folder onto the Vercel dashboard's import page.

## Files

```
public/index.html       page shell
public/css/styles.css   all styles (light and dark theme)
public/js/app.js        data, pages, dashboards and actions
server.js               local server for npm start (not used on Vercel)
vercel.json             Vercel settings
```
