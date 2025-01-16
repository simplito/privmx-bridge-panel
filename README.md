# PrivMX Bridge Panel

PrivMX Bridge Panel is an end-to-end encrypted application used to manage [PrivMX Bridge](https://privmx.dev).

## Features

PrivMX Bridge Panel provides essential Platform management features. All the data exchanged within PrivMX Bridge Panel is end-to-end encrypted, meaning that only the end users can read (decrypt) their data. It means that even platform hosting provider cannot access user data.

## Requirements

- Node.js in 20.10 version;
- server that will serve static files;
- [PrivMX Bridge](https://github.com/simplito/privmx-bridge) Instance.

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

## License

[MIT](./LICENSE)
