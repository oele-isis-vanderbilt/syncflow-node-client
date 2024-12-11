# SyncFlow Node Client
<p align="center">
  <a href="https://github.com/oele-isis-vanderbilt/syncflow-node-client.git"><img src="./banner.png" alt="syncflow-node-client"></a>
</p>
<p align="center">
    <em>Reusable NodeJS client implementation for SyncFlow.</em>
</p>
<p align="center">
<a href="https://github.com/oele-isis-vanderbilt/syncflow-node-client/actions/workflows/test.yaml" target="_blank">
    <img src="https://github.com/oele-isis-vanderbilt/syncflow-node-client/actions/workflows/test.yaml/badge.svg" alt="Test">
</a>
</p>

This is a reusable NodeJS client implementation for [`SyncFlow`](https://syncflow.live). The idea here is to create necessary functionality to interact with the [`SyncFlow`](https://syncflow.live) api, in a NodeJS application. Primary beneficiaries of this package could be clients to [`SyncFlow`](https://syncflow.live), who have their own backend in NodeJS and want to integrate with [`SyncFlow`](https://syncflow.live).

## Features
- Manage sessions, participants and recordings in a SyncFlow Project
- Easy integration with existing Node.js applications

## Installation
Installation can be done via npm:

```sh
$ npm install syncflow-node-client
```

## Usage
In order to use the SyncFlow node client, you need the `SYNCFLOW_API_KEY`, `SYNCFLOW_API_SECRET` and `SYNCFLOW_SERVER_URL`, `SYNCFLOW_PROJECT_ID`. At this point, the server url is always going to be `https://api.syncflow.live`. To generate a key secret pair, login to `https://syncflow.live`, navigate to your project settings page and use API keys generation page to generate the keys. Once, you have your api keys, either set the aforementioned values as environment variables, or use directly with the `ProjectClientBuilder`.

```js
const {ProjectClientBuilder} = require('syncflow-node-client');

// Create a new client
const client = new ProjectClientBuilder()
                    .setServerUrl(process.env.SYNCFLOW_SERVER_URL)
                    .setApiKey(process.env.SYNCFLOW_API_KEY)
                    .setApiSecret(process.env.SYNCFLOW_API_SECRET)
                    .setProjectId(process.env.SYNCFLOW_PROJECT_ID).build();

// Now you can use the client to interact with SyncFlow Project
// Create a session token, results are returned as monads (Ok(SessionInfo) or Err(HttpError))
const newSessionRequest = {
    name: "Session Name",
    autoRecording: false,
    maxParticipants: 200,
    deviceGroups: []
};
const sessionResult = await client.createSession(newSessionRequest);

const sessionId = sessionResult.unwrap().id; // Throws an error if the request failed

const videoGrants = {
    canPublish: true,
    canPublishData: true,
    canPublishSources: ['camera', 'screen'],
    canSubscribe: true,
    canUpdateOwnMetadata: true,
    hidden: false,
    ingressAdmin: true,
    recorder: true,
    room: roomName,
    roomAdmin: true,
    roomCreate: true,
    roomJoin: true,
    roomList: true,
    roomRecord: true,
};

const tokenRequest = {
    identity,
    name: identity,
    videoGrants
};

// Get the Join Token
const sessionToken = await client.generateSessionToken(sessionId, tokenRequest)
```

Explore the [API documentation]((./doc.md)) for more details on the available methods and their usage. For a full example, see the express JS [example](./examples/express/). Which creates a simple camera sharing application with SyncFlow and Livekit clients.

## API Reference
See the [doc file](./doc.md).

## License
[Apache 2.0](./LICENSE)

## Funding Information
This work is supported by the National Science Foundation under Grant No. DRL-2112635.
