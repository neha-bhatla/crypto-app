# CoinHub

A React cryptocurrency dashboard with searchable assets, price-history charts, exchange rankings, and a crypto/USD converter.

## Run locally

Use Node.js and npm, then run:

```sh
npm ci
npm start
```

Open http://localhost:3000. Market data comes from CoinCap's `/v2` API. Access depends on provider availability and access policies; failures show a retry option. No bundled sample prices are substituted for live data.

## Checks

```sh
CI=true npm test -- --watchAll=false
npm run build
```

## Features

- Search assets by name or symbol and select a price-history interval.
- Browse exchange rankings with pagination.
- Convert between loaded crypto assets and USD, including swapping currencies.
- Loading, empty, and retry states for data requests.

Conversions use the prices loaded when the app opens or when you retry. They are estimates and exclude fees and slippage. The converter no longer uses the original fiat-rate service or its hardcoded key. The historical key should be revoked at the original provider because removing it from source does not remove it from Git history.

## Development workflow

Keep changes in small, meaningful batches. Run relevant tests and the production build before committing, and use commit messages that explain the improvement.
