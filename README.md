# SKYBAR Finance Dashboard

Phase 1 foundation for a premium single-outlet restaurant finance dashboard built with HTML, Tailwind CSS, and vanilla JavaScript.

## Features

- Executive dashboard with month/year filtering for 2025–2040.
- KPI cards for daily revenue, MTD revenue, food/beverage revenue, cost percentages, GOP, and budget variance.
- Entry workflow for date, revenues, costs, and daily budget.
- Edit and delete support for saved daily entries.
- Local storage persistence through a repository abstraction that can be replaced with a future database/API adapter.
- Shared finance service for deterministic calculations used by dashboard, entry, analytics, and reporting views.

## Calculation rules

- `Food Cost % = Food Cost / Food Revenue × 100`
- `Beverage Cost % = Beverage Cost / Beverage Revenue × 100`
- `Fixed Cost % = Fixed Cost / Total Revenue × 100`
- `GOP = Total Revenue - Total Costs`
- `Budget Variance = Actual - Budget`

## Run locally

```bash
npm run dev
```

Open <http://127.0.0.1:4173/>.

## Test

```bash
npm test
```
