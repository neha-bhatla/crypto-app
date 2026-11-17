# CoinHub

A responsive cryptocurrency dashboard built with React. Explore the top 100 assets, compare exchanges, save a watchlist, and convert between crypto assets and USD.

## Run locally

```sh
npm ci
npm start
```

Open [localhost:3000](http://localhost:3000). The development server reloads when source files change.

## Checks

```sh
CI=true npm test -- --watchAll=false
npm run build
```

GitHub Actions runs the tests and production build on pushes and pull requests.

## What works

- **Overview:** prices, tracked market capitalization, volume, and Bitcoin's share of the tracked market.
- **Charts:** select a coin and view 1 day, 1 week, 1 month, 6 months, or 1 year of USD price history.
- **Market table:** search names or symbols, sort numeric columns, and paginate through assets.
- **Watchlist:** star assets to save them in this browser; use the Watchlist tab to filter.
- **Exchanges:** search and paginate the top 100 exchanges ranked by CoinGecko trust score, with volume in BTC.
- **Converter:** change amount, select any loaded asset or USD, and swap the pair. Estimates exclude fees and slippage.
- **Responsive layout:** desktop sidebar becomes top navigation on smaller screens. Secondary table columns are hidden on mobile, with local table scrolling where needed.

## Market data

The app reads CoinGecko's public API directly from the browser. No API key is bundled. Public API availability, CORS, and rate limits can affect requests. For a larger production deployment, use a server-side integration with the provider's appropriate API plan.

- Market prices are cached for **60 seconds**.
- Exchange data and charts are cached for **5 minutes**.
- Duplicate requests share one in-flight request.
- Requests time out after **12 seconds**.
- During outages, previously cached data is displayed with a saved-data notice. Without a cache, an error and retry button appear.
- The refresh button reuses data until its cache duration expires. Prices do not stream or refresh automatically.

The headline market metrics cover the tracked assets, not the entire global market. USD stablecoin prices reflect actual provider quotes and are not assumed to equal $1.

Data attribution: [CoinGecko](https://www.coingecko.com/). [API documentation](https://docs.coingecko.com/reference/introduction).

## Storage and security

The watchlist and public market cache use localStorage. Clearing site storage resets both. No wallet, login, trading, or payment functionality is included.

The removed legacy fiat-service key remains in earlier Git history and should be revoked with its original provider.

## Commit workflow

Keep commits incremental, with short lowercase messages. Verify changes with relevant tests and a production build before pushing.
