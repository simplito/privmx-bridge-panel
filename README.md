<div align="center">
   <h1>
      PrivMX Bridge Panel
   </h1>
<p>
PrivMX Bridge Panel is an end-to-end encrypted application that enabled you to manage <b>[PrivMX Platform](https://privmx.cloud)</b>.
</p>
</div>

## Features

PrivMX Bridge Panel provides essential Platform managemenet features. All data exchanged within PrivMX Bridge Panel is end-to-end encrypted, meaning that only the end users can read (decrypt) their data. It means that even platform hosting provider cannot access user data.

## Requirements

PrivMX Bridge Panel Requirements:

-   node.js in 20.10 version,
-   a server that will serve static files,
-   account on <b>[PrivMX Platform](https://privmx.cloud)</b>.

## How to start?

To begin, clone this repository. It includes the PrivMX Bridge Panel sources along with various helpful files.

#### **Bridge Instance**

You need a **PrivMX Bridge** instance.

#### **Node.js**

To build or develop the app, you need Node.js preferably in version **20.10 or higher**.

## How to run this software?

### .env.local file

Create `.env.local` file in the root of your project. You can copy **.env.example** or use snippets available in <b>[PrivMX Platform](https://privmx.cloud)</b>.

This is an example `.env.local` file:

```ENV
VITE_PRIVMX_BRIDGE_URL=http://localhost:9111
VITE_LOG_LEVEL=log
```

### Building the app

In a new terminal go to the project's root folder.

```sh
npm install
npm run build
```

During development you can run `npm run preview` to ensure everything works. For production: configure a server of your choice to serve static files from `dist/` directory.

### Running the app in dev mode

In a new terminal go to the project's root folder.

```sh
npm install
npm run dev
```

Check your app at <http://localhost:3000>.

## License

[MIT](./LICENSE)
