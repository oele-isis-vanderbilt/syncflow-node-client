## :factory: ProjectClient

ProjectClient provides methods to interact with the Syncflow server API,
managing projects, sessions, and devices within the Syncflow ecosystem.

### Constructors

`public`: Initializes a new ProjectClient instance for communicating with the Syncflow server.

Parameters:

* `serverUrl`: - Base URL of the Syncflow server endpoint
* `apiKey`: - Authentication API key for server access
* `apiSecret`: - Secret key paired with the API key for authentication
* `projectId`: - Unique identifier for the target project
* `clientOpts`: - Configuration options for the client connection


### Methods

- [getProjectDetails](#gear-getprojectdetails)
- [deleteProject](#gear-deleteproject)
- [summarizeProject](#gear-summarizeproject)
- [createSession](#gear-createsession)
- [getSessions](#gear-getsessions)
- [getSession](#gear-getsession)
- [getParticipants](#gear-getparticipants)
- [getLivekitSessionInfo](#gear-getlivekitsessioninfo)
- [generateSessionToken](#gear-generatesessiontoken)
- [stopSession](#gear-stopsession)
- [getDevices](#gear-getdevices)
- [getDevice](#gear-getdevice)
- [registerDevice](#gear-registerdevice)
- [deleteDevice](#gear-deletedevice)

#### :gear: getProjectDetails

Retrieves detailed information about the current project.

| Method | Type |
| ---------- | ---------- |
| `getProjectDetails` | `() => Promise<Result<ProjectInfo, HttpError>>` |

#### :gear: deleteProject

Permanently removes the current project and all associated resources.

| Method | Type |
| ---------- | ---------- |
| `deleteProject` | `() => Promise<Result<ProjectInfo, HttpError>>` |

#### :gear: summarizeProject

Generates a summary of the project's current state and usage statistics.

| Method | Type |
| ---------- | ---------- |
| `summarizeProject` | `() => Promise<Result<ProjectSummary, HttpError>>` |

#### :gear: createSession

Initiates a new session within the project on the LiveKit server.

| Method | Type |
| ---------- | ---------- |
| `createSession` | `(newSessionRequest: Partial<NewSessionRequest>) => Promise<Result<ProjectSessionResponse, HttpError>>` |

Parameters:

* `newSessionRequest`: - Session configuration parameters


#### :gear: getSessions

Retrieves all active sessions within the project.

| Method | Type |
| ---------- | ---------- |
| `getSessions` | `() => Promise<Result<ProjectSessionResponse[], HttpError>>` |

#### :gear: getSession

Fetches details for a specific session by ID.

| Method | Type |
| ---------- | ---------- |
| `getSession` | `(sessionId: string) => Promise<Result<ProjectSessionResponse, HttpError>>` |

Parameters:

* `sessionId`: - Unique identifier of the target session


#### :gear: getParticipants

Lists all participants currently active in a specific session.

| Method | Type |
| ---------- | ---------- |
| `getParticipants` | `(sessionId: string) => Promise<Result<ParticipantInfo[], HttpError>>` |

Parameters:

* `sessionId`: - Unique identifier of the target session


#### :gear: getLivekitSessionInfo

Retrieves LiveKit-specific session metadata and configuration.

| Method | Type |
| ---------- | ---------- |
| `getLivekitSessionInfo` | `(sessionId: string) => Promise<Result<any, HttpError>>` |

Parameters:

* `sessionId`: - Unique identifier of the target session


#### :gear: generateSessionToken

Creates an access token for a specific session.

| Method | Type |
| ---------- | ---------- |
| `generateSessionToken` | `(sessionId: string, tokenRequest: Partial<TokenRequest>) => Promise<Result<TokenResponse, HttpError>>` |

Parameters:

* `sessionId`: - Unique identifier of the target session
* `tokenRequest`: - Token configuration and permissions


#### :gear: stopSession

Terminates an active session and disconnects all participants.

| Method | Type |
| ---------- | ---------- |
| `stopSession` | `(sessionId: string) => Promise<Result<ProjectSessionResponse, HttpError>>` |

Parameters:

* `sessionId`: - Unique identifier of the session to stop


#### :gear: getDevices

Lists all registered devices in the project.

| Method | Type |
| ---------- | ---------- |
| `getDevices` | `() => Promise<Result<DeviceResponse[], HttpError>>` |

#### :gear: getDevice

Retrieves information about a specific device.

| Method | Type |
| ---------- | ---------- |
| `getDevice` | `(deviceId: string) => Promise<Result<DeviceResponse, HttpError>>` |

Parameters:

* `deviceId`: - Unique identifier of the target device


#### :gear: registerDevice

Registers a new device with the project.

| Method | Type |
| ---------- | ---------- |
| `registerDevice` | `(deviceRegisterRequest: Partial<DeviceRegisterRequest>) => Promise<Result<DeviceResponse, HttpError>>` |

Parameters:

* `deviceRegisterRequest`: - Device registration parameters


#### :gear: deleteDevice

Removes a device from the project.

| Method | Type |
| ---------- | ---------- |
| `deleteDevice` | `(deviceId: string) => Promise<Result<DeviceResponse, HttpError>>` |

Parameters:

* `deviceId`: - Unique identifier of the device to remove



## :factory: ProjectClientBuilder

Builder pattern implementation for creating ProjectClient instances with
flexible configuration options and environment variable support.

### Constructors

`public`: Initializes a new ProjectClientBuilder with optional environment variable configuration.
Supported environment variables:
- SYNCFLOW_SERVER_URL: Base server URL
- SYNCFLOW_API_KEY: Authentication API key
- SYNCFLOW_API_SECRET: Authentication secret
- SYNCFLOW_PROJECT_ID: Target project identifier



### Methods

- [setServerUrl](#gear-setserverurl)
- [setApiKey](#gear-setapikey)
- [setApiSecret](#gear-setapisecret)
- [setProjectId](#gear-setprojectid)
- [setOptions](#gear-setoptions)
- [build](#gear-build)

#### :gear: setServerUrl

Configures the Syncflow server endpoint URL.

| Method | Type |
| ---------- | ---------- |
| `setServerUrl` | `(serverUrl: string) => ProjectClientBuilder` |

Parameters:

* `serverUrl`: - Base URL for the Syncflow server


#### :gear: setApiKey

Sets the API key for server authentication.

| Method | Type |
| ---------- | ---------- |
| `setApiKey` | `(apiKey: string) => ProjectClientBuilder` |

Parameters:

* `apiKey`: - Authentication API key


#### :gear: setApiSecret

Sets the API secret for server authentication.

| Method | Type |
| ---------- | ---------- |
| `setApiSecret` | `(apiSecret: string) => ProjectClientBuilder` |

Parameters:

* `apiSecret`: - Authentication secret key


#### :gear: setProjectId

Sets the target project identifier.

| Method | Type |
| ---------- | ---------- |
| `setProjectId` | `(projectId: string) => ProjectClientBuilder` |

Parameters:

* `projectId`: - Unique project identifier


#### :gear: setOptions

Configures additional client connection options.

| Method | Type |
| ---------- | ---------- |
| `setOptions` | `(options: BaseClientOptions) => ProjectClientBuilder` |

Parameters:

* `options`: - Client configuration options


#### :gear: build

Creates a new ProjectClient instance with the configured parameters.

| Method | Type |
| ---------- | ---------- |
| `build` | `() => ProjectClient` |


## :factory: ProjectClientError
