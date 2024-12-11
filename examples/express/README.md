# Syncflow Node Client with Express
This is a simple example on how to use the `syncflow-node-client` with express. 

## Installation
From the root of the repository, run the following command to install the dependencies:

```sh
$ cd examples/express
$ npm install
```

## Usage
Start the server by running the following command:

```sh
$ npm start
```

Currently, there are two routes available at `http://localhost:3000/`.

`POST` `/token`: This route generates a syncflow session token to join the session's livekit room. If the session name doesn't exist or is inactive, a new session will be created. The body expects the following json `{identity: string, roomName: string}`.
> **Important:** You need to create an `.env` file with the following variables before you run this project:
> ```
> SYNCFLOW_SERVER_URL="YOUR_SERVER_URL"
> SYNCFLOW_API_KEY="YOUR_API_KEY"
> SYNCFLOW_API_SECRET="YOUR_API_SECRET"
> SYNCFLOW_PROJECT_ID="YOUR_PROJECT_ID"
> ```


