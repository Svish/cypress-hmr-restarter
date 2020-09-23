# cypress-hmr-restarter

A rudimentary [Cypress](https://www.cypress.io/) plugin(?) for automatically restarting tests after [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR) updates.

[![npm version](https://img.shields.io/npm/v/cypress-hmr-restarter.svg?style=flat-square) ![npm downloads](https://img.shields.io/npm/dm/cypress-hmr-restarter?style=flat-square)](https://www.npmjs.com/package/cypress-hmr-restarter)

## Setup

### 1. Install

```shell
npm install --save-dev cypress-hmr-restarter
```

### 2. Import

```js
// E.g. in cypress/support/index.js
import 'cypress-hmr-restarter';

// When using gatsby or any other project that uses webpack-hot-middleware
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

When using the [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html) (`cypress open`), after the window has loaded, it will try to connect to the `webpack-dev-server` websocket, which is assumed to run at `wss://<baseUrl>/sockjs-node`, and listen for messages of type `invalid`. When using the `gatsby` import, it will try to connect to connect to the `<baseUrl>/____webpack_hmr` instead and listen for server side events containing the action of type 'built'.

When any of those are received, after a short delay, it will find the restart button in the sidebar and click it for you.
