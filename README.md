# SKYBAR Finance Dashboard

A static restaurant finance dashboard for entering daily SKYBAR revenue and cost data, storing it in the browser, filtering it by month and year, and recalculating executive KPIs in real time.

## File Structure

```text
/
├── index.html
├── generic.html
├── elements.html
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── dashboard.css
│   │   ├── components.css
│   ├── js/
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   ├── calculations.js
│   │   ├── storage.js
│   │   ├── filters.js
│   ├── img/
│   ├── icons/
├── data/
│   ├── finance-data.json
└── README.md
```

## Main Dashboard

`index.html` provides the core system build:

- Year filter from 2025 through 2040.
- Month filter for the selected reporting period.
- KPI cards for Daily Revenue, MTD Revenue, Food Revenue, Beverage Revenue, Food Cost %, Beverage Cost %, Fixed Cost %, GOP, and Budget Variance.
- Daily entry form with Date, Food Revenue, Beverage Revenue, Food Cost, Beverage Cost, Fixed Cost, and Daily Budget.
- Save Entry and Reset Form actions.
- Live entry table with Date, Total Revenue, Total Cost, GOP, Edit, and Delete columns.

## Calculations

The browser modules calculate:

- Total Revenue = Food Revenue + Beverage Revenue
- Total Cost = Food Cost + Beverage Cost + Fixed Cost
- Food Cost % = Food Cost / Food Revenue × 100
- Beverage Cost % = Beverage Cost / Beverage Revenue × 100
- Fixed Cost % = Fixed Cost / Total Revenue × 100
- GOP = Total Revenue - Total Cost
- Budget Variance = Total Revenue - Daily Budget

All formulas guard against divide-by-zero and empty inputs.

## Persistence

Entries are stored in `localStorage` under the `skybar.finance.dashboard.entries.v1` key. Data persists after refresh in the same browser. Duplicate dates are blocked unless the user is editing the existing row.

## Executive Analytics

The analytics panels use only entries saved by the user in browser `localStorage`; the dashboard does not load fake chart data from `data/finance-data.json`. Charts and cards refresh after saving, updating, deleting, or changing the month/year filters.

Analytics include:

- Daily Revenue Trend
- MTD Revenue Trend
- Food vs Beverage Revenue Comparison
- Food Cost %, Beverage Cost %, and Fixed Cost % performance indicators
- Daily GOP Trend, MTD GOP, best/worst GOP day, and GOP Margin %
- Actual Revenue vs Budget variance, variance %, target achievement %, and progress bar
- Best sales day, lowest sales day, average daily revenue, average GOP, and average cost %

## Local Preview

Run a local static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.
