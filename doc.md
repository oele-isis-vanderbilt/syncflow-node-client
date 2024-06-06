## :factory: SyncFlowClient

SyncFlowClient class is used to interact with the SyncFlow server.

### Constructors

`public`: Creates a new instance of the SyncFlowClient.

Parameters:

* `serverUrl`: - The URL of the SyncFlow server.
* `apiKey`: - The API key for the SyncFlow server.
* `apiSecret`: - The API secret for the SyncFlow server.
* `clientOpts`: - Optional client options.


## :factory: SyncFlowClientBuilder

SyncFlowClientBuilder class is used to build a SyncFlowClient instance.

### Constructors

`public`: Creates a new instance of the SyncFlowClientBuilder. 
The server URL, API key, and API secret can also be set using environment variables.
Use the following environment variables to set the server URL, API key, and API secret:
- SYNCFLOW_SERVER_URL
- SYNCFLOW_API_KEY
- SYNCFLOW_API_SECRET



### Methods

- [setServerUrl](#gear-setserverurl)
- [setApiKey](#gear-setapikey)
- [setApiSecret](#gear-setapisecret)
- [build](#gear-build)

#### :gear: setServerUrl

Sets the server URL for the SyncFlowClient.

| Method | Type |
| ---------- | ---------- |
| `setServerUrl` | `(serverUrl: string) => SyncFlowClientBuilder` |

Parameters:

* `serverUrl`: - The URL of the SyncFlow server.


#### :gear: setApiKey

Sets the API key for the SyncFlowClient.

| Method | Type |
| ---------- | ---------- |
| `setApiKey` | `(apiKey: string) => SyncFlowClientBuilder` |

Parameters:

* `apiKey`: - The API key for the SyncFlow server.


#### :gear: setApiSecret

Sets the API secret for the SyncFlowClient.

| Method | Type |
| ---------- | ---------- |
| `setApiSecret` | `(apiSecret: string) => SyncFlowClientBuilder` |

Parameters:

* `apiSecret`: - The API secret for the SyncFlow server.


#### :gear: build

Builds a SyncFlowClient instance with the provided server URL, API key, and API secret.

| Method | Type |
| ---------- | ---------- |
| `build` | `() => SyncFlowClient` |


## :factory: SyncFlowClientError
