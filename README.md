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

// For webpack HMR (used in e.g. create-react-app)
import 'cypress-hmr-restarter';

// For webpack-hot-middleware (used in e.g. gatsby)
import 'cypress-hmr-restarter/gatsby';
```

### 3. Make sure `baseUrl` is defined in your `cypress.json`

```jsonc
{
  // E.g. when using default config of create-react-app:
  "baseUrl": "http://localhost:3000"
}
```

## What it does

When using the [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html) (`cypress open`), after the window has loaded, it will try to connect and listen for events. When an event signifying a change has happened, after a short delay, it will find the restart button in the sidebar and click it for you.

- The default import connects to the `webpack-dev-server` websocket, which is assumed to run at `wss://<baseUrl>/sockjs-node`, and listens for messages with the type `invalid`.

- The gatsby import connects to the `webpack-hot-middleware` endpoint, assumed to run at `<baseUrl>/__webpack_hmr`, and listens for messages with the action `built`.
