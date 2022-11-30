# SOCSCI Frontend

## Environments

- [Develop - Nightly Builds](https://amos-sosci.die-degens.eu/dev/ui)
- [Integration - Latest Release Canidate](https://amos-sosci.die-degens.eu/int/ui)
- [Production - Latest Release](https://amos-sosci.die-degens.eu/prod/ui)

## Build the app

```shell
npm install
npm run build
```

## Run the app

```shell
npm run preview
```

Opens local vite server on port 4173

```shell
http://localhost:4173/
```

## Develop the app

```shell
npm run dev
```

Opens local vite server on port 5173

```shell
http://localhost:5173/
```

## Test the app

Run end-to-end tests with Cypress (Use as Release Manager)

```shell
npm run cypress:release
```

Run end-to-end tests interactively with Cypress (Use as Developer)

```shell
npm run cypress:open
```

chose `E2E Testing`, a browser (e.g. Electron), and a test (e.g. `visible.cy.js`)
