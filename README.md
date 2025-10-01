# PrivMX Bridge Panel

PrivMX Bridge Panel is an application used to manage [PrivMX Bridge](https://privmx.dev).

## Requirements

- Node.js v24.0+,
- a running [PrivMX Bridge](https://github.com/simplito/privmx-bridge) instance,
- [privmx-components](https://gitlab2.simplito.com/web/privmx-components) installed and built in `../` (this requirement will be removed as soon as development of `privmx-components` slows down),
- deployment: a server that will serve static files.

## How to start

First, clone this repository. It includes the PrivMX Bridge Panel sources along with various helpful files.

#### Bridge Instance

Go to [Bridge CLI repo](https://github.com/simplito/privmx-bridge-docker) to find scripts to create and initialize PrivMX Bridge on your local machine.

#### Node.js

To build or develop the app, you need Node.js preferably in version **20.10 or higher**.

## How to run this software

### .env.local file

Create `.env.local` file in the root of your project and paste the content of `.env.example`.

This is an example `.env.local` file:

```ENV
VITE_PRIVMX_BRIDGE_URL=http://localhost:9111
VITE_LOG_LEVEL=log
```

### Build the app

In a new terminal, go to the project's root folder.

```sh
npm install
npm run build
```

During development you can run `npm run preview` to ensure everything works. For production: configure a server of your choice to serve static files from `dist/` directory.

### Running the app in dev mode

In a new terminal, go to the project's root folder and use:

```sh
npm install
npm run dev
```

Check your app at <http://localhost:3000/panel>.

### Building for PrivMX Bridge

If you want to build a panel for PrivMX Bridge working at the same domain, use `.env.local` with the content below

```ENV
VITE_PRIVMX_BRIDGE_URL=/
VITE_LOG_LEVEL=error
```

### Npm scripts

Run `npm run X` where `X` is:

- `lint-check` - eslint (w/o fixing code),
- `prettier-check` - prettier (w/o fixing code),
- `tsc-check` - checking types (`tsc --noEmit`),
- `lint-fix` - eslint (w/ fixing auto-fixable problems with code),
- `prettier-fix` - prettier (w/ fixing auto-fixable problems with code),
- `check-all` - runs all `*-check` commands,
- `pre-commit-checks` - runs all check required before committing.

## License

[MIT](./LICENSE)
