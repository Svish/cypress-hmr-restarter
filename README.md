# cypress-hmr-restarter

A rudimentary [Cypress](https://www.cypress.io/) plugin(?) for automatically restarting tests after Webpack [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR) updates.

[![npm version](https://img.shields.io/npm/v/cypress-hmr-restarter.svg?style=flat-square) ![npm downloads](https://img.shields.io/npm/dm/cypress-hmr-restarter?style=flat-square)](https://www.npmjs.com/package/cypress-hmr-restarter)

## Setup

### 1. Install

```shell
npm install --save-dev cypress-hmr-restarter
```

### 2. Import

```js
// E.g. in cypress/support/index.js

// For webpack HMR (used in e.g. create-react-app or angular 11+)
import 'cypress-hmr-restarter';

// For webpack-hot-middleware (used in e.g. gatsby)
import 'cypress-hmr-restarter/gatsby';
```

### 3. Make sure either `baseUrl` or `hmrUrl` is configured

```jsonc
// E.g. in cypress.json
{
  // Works with e.g. default create-react-app configuration
  "baseUrl": "http://localhost:3000"
}
```

## Options

```jsonc
{
  // Overriding then URL used to connect, otherwise created from the baseUrl
  "hmrUrl": "ws://localhost:3000/sockjs-node", // Default import
  "hmrUrl": "ws://localhost:3000/websocket", // Angular 11+ import
  "hmrUrl": "http://localhost:3000/__webpack_hmr", // Gatsby import

  // Overrides delay between event and restart (ms)
  "hmrRestartDelay": 1500
}
```

## What it does

When using the [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html) (`cypress open`), after the window has loaded, it will try to connect and listen for events. When an event signifying a change has happened, it will first try clicking the stop button, and then, after a short delay, it will click the restart button.

- The default import connects to the [`webpack-dev-server`](https://www.npmjs.com/package/webpack-dev-server) websocket at either `<hmrUrl>` or `ws://<baseUrl>/sockjs-node` (`wss:` if `https:`), and listens for messages with the type `invalid`.

  **IMPORTANT:** You need to ensure that [`transportMode`](https://webpack.js.org/configuration/dev-server/#devservertransportmode) option of `webpack-dev-server` is set to `ws` for the feature to work.

- The gatsby import connects to the [`webpack-hot-middleware`](https://www.npmjs.com/package/webpack-hot-middleware) event source at either `<hmrUrl>` or `<baseUrl>/__webpack_hmr`, and listens for messages with the action `built`.
