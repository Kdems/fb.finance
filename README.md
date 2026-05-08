# SKYBAR Finance Dashboard

A clean, static restaurant finance dashboard for executive operators, controllers, and managers reviewing sales, prime cost, EBITDA, cash runway, and period-level operating results.

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

## Pages

- `index.html` is the main finance dashboard.
- `generic.html` is a reusable operating review layout.
- `elements.html` documents reusable UI components.

## Local Preview

Run a local static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

## Data

Dashboard values are loaded from `data/finance-data.json`. The JavaScript modules calculate revenue mix, prime cost, gross profit, EBITDA margin, cost ratios, and liquidity runway in the browser.
