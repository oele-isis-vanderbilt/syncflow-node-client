## :factory: SyncFlowClient

SyncFlowClient class is used to interact with the SyncFlow server.

### Constructors

`public`: Creates a new instance of the SyncFlowClient.

Parameters:

* `serverUrl`: - The URL of the SyncFlow server.
* `apiKey`: - The API key for the SyncFlow server.
* `apiSecret`: - The API secret for the SyncFlow server.
* `clientOpts`: - Optional client options.


### Methods

- [createRoom](#gear-createroom)
- [listRooms](#gear-listrooms)
- [deleteRoom](#gear-deleteroom)
- [getLivekitServerHealth](#gear-getlivekitserverhealth)
- [listEgresses](#gear-listegresses)
- [listParticipants](#gear-listparticipants)
- [startTrackRecording](#gear-starttrackrecording)
- [stopRecording](#gear-stoprecording)
- [generateLivekitToken](#gear-generatelivekittoken)

#### :gear: createRoom

Creates a new room on the SyncFlow connected LiveKit server for the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `createRoom` | `(name: string, roomOptions: Partial<CreateRoomOptions>) => Promise<Result<LivekitRoom, HttpError>>` |

Parameters:

* `name`: - The name of the room.
* `roomOptions`: - Optional room options.


#### :gear: listRooms

Lists all the active rooms created by the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `listRooms` | `() => Promise<Result<LivekitRoom[], HttpError>>` |

#### :gear: deleteRoom

Deletes the room with the provided name from the SyncFlow connected LiveKit server.
The room must have been created by the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `deleteRoom` | `(roomName: string) => Promise<Result<LivekitRoom, HttpError>>` |

Parameters:

* `roomName`: - The name of the room to delete.


#### :gear: getLivekitServerHealth

Gets the health status of the LiveKit server connected to the SyncFlow server.

| Method | Type |
| ---------- | ---------- |
| `getLivekitServerHealth` | `() => Promise<Result<GenericResponse, HttpError>>` |

#### :gear: listEgresses

Lists all the active egresses from the room with the provided name.
The room must have been created by the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `listEgresses` | `(roomName: string) => Promise<Result<EgressInfo[], HttpError>>` |

Parameters:

* `roomName`: - The name of the room.


#### :gear: listParticipants

Lists all the participants in the room with the provided name.
The room must have been created by the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `listParticipants` | `(roomName: string) => Promise<Result<ParticipantInfo[], HttpError>>` |

Parameters:

* `roomName`: - The name of the room.


#### :gear: startTrackRecording

Starts recording the track with the provided track SID in the room with the provided name.
The room must have been created by the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `startTrackRecording` | `(roomName: string, trackSid: string) => Promise<Result<EgressInfo, HttpError>>` |

Parameters:

* `roomName`: - The name of the room.
* `trackSid`: - The SID of the track to record.


#### :gear: stopRecording

Stops recording the track with the provided track SID in the room with the provided name.
The room must have been created by the user with the provided API key/secret pairs.

| Method | Type |
| ---------- | ---------- |
| `stopRecording` | `(egressId: string) => Promise<Result<EgressInfo, HttpError>>` |

Parameters:

* `roomName`: - The name of the room.
* `trackSid`: - The SID of the track to stop recording.


#### :gear: generateLivekitToken

Generates a LiveKit token for the user with the provided identity and video grants.

| Method | Type |
| ---------- | ---------- |
| `generateLivekitToken` | `(identity: string, grants: Partial<VideoGrants>) => Promise<Result<TokenResponse, HttpError or SyncFlowClientError>>` |

Parameters:

* `identity`: - The identity of the user.
* `grants`: - The video grants for the user.



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
