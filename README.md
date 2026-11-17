# CoinHub

A crypto dashboard I started in 2024 and have been coming back to clean up. It’s built with React and uses CoinGecko for prices, charts, and exchange data.

## Running it

```sh
npm ci
npm start
```

Then open [localhost:3000](http://localhost:3000).

## What you can do

- Browse the top 100 assets and sort by price, daily change, or market cap.
- Pick a coin to see its price history, from one day to one year.
- Star coins to keep a watchlist in your browser.
- Search exchanges and compare their trust scores and trading volumes.
- Convert between crypto assets and USD, or swap the pair.

The layout adjusts for phones and tablets. On small screens, some table columns are hidden and wider tables scroll sideways.

## A few things to know

Prices aren’t streaming. They’re cached for a minute; charts and exchanges are cached for five minutes. Refreshing inside that window reuses the saved response. If CoinGecko is unavailable, the app shows saved data with a notice, or a retry button if there’s nothing saved yet.

The overview totals cover the assets in the app, not the entire crypto market. Conversions are estimates and don’t include fees or slippage. Exchange volume is shown in BTC.

Your watchlist and cached prices stay in localStorage. Clearing this site’s browser data clears them too.

## Checking changes

```sh
CI=true npm test -- --watchAll=false
npm run build
```

GitHub Actions runs both on pushes and pull requests. Commits here stay small, with short lowercase messages.

## Data and setup

Data comes from [CoinGecko](https://www.coingecko.com/) through its public API. No key is included in the app. Rate limits and service availability still apply; a bigger deployment would need an appropriate API plan and a server-side integration. See the [API docs](https://docs.coingecko.com/reference/introduction).

An old fiat-service key was removed from the code, but it’s still in earlier Git history and should be revoked with the original provider.
