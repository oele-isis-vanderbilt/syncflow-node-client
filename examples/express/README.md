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

Currently, there are two routes available at `http://localhost:5444/`.

`GET` `/guest-token`: This route generates a livekit room join token with identity `guest`.
`GET` `/list-rooms`: This route lists all the rooms available in the SyncFlow server.
