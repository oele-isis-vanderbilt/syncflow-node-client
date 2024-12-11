import { type Result } from 'ts-monads/lib/Result';
import { BaseClient, ProjectTokenClaims } from './base-client';
import { BaseClientOptions, HttpError } from './base-client';
import type { ParticipantInfo } from 'livekit-server-sdk';
import type {
    TokenResponse,
    ProjectInfo,
    ProjectSummary,
    NewSessionRequest,
    ProjectSessionResponse,
    TokenRequest,
    DeviceResponse,
    DeviceRegisterRequest,
} from './models';

/**
 * ProjectClient provides methods to interact with the Syncflow server API,
 * managing projects, sessions, and devices within the Syncflow ecosystem.
 */
export class ProjectClient {
    serverUrl: string;
    apiKey: string;
    apiSecret: string;
    projectId: string;
    client: BaseClient;

    /**
     * Initializes a new ProjectClient instance for communicating with the Syncflow server.
     * @param {string} serverUrl - Base URL of the Syncflow server endpoint
     * @param {string} apiKey - Authentication API key for server access
     * @param {string} apiSecret - Secret key paired with the API key for authentication
     * @param {string} projectId - Unique identifier for the target project
     * @param {BaseClientOptions | undefined} clientOpts - Configuration options for the client connection
     */
    constructor(
        serverUrl: string,
        apiKey: string,
        apiSecret: string,
        projectId: string,
        clientOpts: BaseClientOptions | undefined = undefined
    ) {
        this.serverUrl = serverUrl;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.projectId = projectId;

        const claims = new ProjectTokenClaims(
            apiKey,
            apiSecret,
            projectId,
            3600 // default 1 hour expiration
        );

        this.client = new BaseClient(serverUrl, claims, {
            autoRenewToken: clientOpts?.autoRenewToken ?? true,
        });
    }

    /**
     * Retrieves detailed information about the current project.
     * @returns {Promise<Result<ProjectInfo, HttpError>>} Project details including configuration, status, and metadata
     */
    public async getProjectDetails(): Promise<Result<ProjectInfo, HttpError>> {
        const url = `projects/${this.projectId}`;
        return await this.client.authorizedFetch<ProjectInfo>(url, 'GET');
    }

    /**
     * Permanently removes the current project and all associated resources.
     * @returns {Promise<Result<ProjectInfo, HttpError>>} Confirmation of project deletion with final project state
     */
    public async deleteProject(): Promise<Result<ProjectInfo, HttpError>> {
        const url = `projects/${this.projectId}`;
        return await this.client.authorizedFetch<ProjectInfo>(url, 'DELETE');
    }

    /**
     * Generates a summary of the project's current state and usage statistics.
     * @returns {Promise<Result<ProjectSummary, HttpError>>} Overview of project metrics and status
     */
    public async summarizeProject(): Promise<
        Result<ProjectSummary, HttpError>
    > {
        const url = `projects/${this.projectId}/summarize`;
        return await this.client.authorizedFetch<ProjectSummary>(url, 'GET');
    }

    /**
     * Initiates a new session within the project on the LiveKit server.
     * @param {Partial<NewSessionRequest>} newSessionRequest - Session configuration parameters
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} Details of the created session
     */
    public async createSession(
        newSessionRequest: Partial<NewSessionRequest>
    ): Promise<Result<ProjectSessionResponse, HttpError>> {
        const url = `projects/${this.projectId}/create-session`;
        return await this.client.authorizedFetch(
            url,
            'POST',
            {},
            newSessionRequest
        );
    }

    /**
     * Retrieves all active sessions within the project.
     * @returns {Promise<Result<ProjectSessionResponse[], HttpError>>} List of all current session details
     */
    public async getSessions(): Promise<
        Result<ProjectSessionResponse[], HttpError>
    > {
        const url = `projects/${this.projectId}/sessions`;
        return await this.client.authorizedFetch<ProjectSessionResponse[]>(
            url,
            'GET'
        );
    }

    /**
     * Fetches details for a specific session by ID.
     * @param {string} sessionId - Unique identifier of the target session
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} Detailed session information
     */
    public async getSession(
        sessionId: string
    ): Promise<Result<ProjectSessionResponse, HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}`;
        return await this.client.authorizedFetch<ProjectSessionResponse>(
            url,
            'GET'
        );
    }

    /**
     * Lists all participants currently active in a specific session.
     * @param {string} sessionId - Unique identifier of the target session
     * @returns {Promise<Result<ParticipantInfo[], HttpError>>} Array of participant details
     */
    public async getParticipants(
        sessionId: string
    ): Promise<Result<ParticipantInfo[], HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/participants`;
        return await this.client.authorizedFetch<ParticipantInfo[]>(url, 'GET');
    }

    /**
     * Retrieves LiveKit-specific session metadata and configuration.
     * @param {string} sessionId - Unique identifier of the target session
     * @returns {Promise<Result<any, HttpError>>} LiveKit session configuration details
     */
    public async getLivekitSessionInfo(
        sessionId: string
    ): Promise<Result<any, HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/livekit-session-info`;
        return await this.client.authorizedFetch(url, 'GET');
    }

    /**
     * Creates an access token for a specific session.
     * @param {string} sessionId - Unique identifier of the target session
     * @param {TokenRequest} tokenRequest - Token configuration and permissions
     * @returns {Promise<Result<TokenResponse, HttpError>>} Generated session access token
     */
    public async generateSessionToken(
        sessionId: string,
        tokenRequest: Partial<TokenRequest>
    ): Promise<Result<TokenResponse, HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/token`;
        return await this.client.authorizedFetch(url, 'POST', {}, tokenRequest);
    }

    /**
     * Terminates an active session and disconnects all participants.
     * @param {string} sessionId - Unique identifier of the session to stop
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} Final state of the terminated session
     */
    public async stopSession(
        sessionId: string
    ): Promise<Result<ProjectSessionResponse, HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/stop`;
        return await this.client.authorizedFetch<ProjectSessionResponse>(
            url,
            'POST',
            {},
            {}
        );
    }

    /**
     * Lists all registered devices in the project.
     * @returns {Promise<Result<DeviceResponse[], HttpError>>} Array of device information
     */
    public async getDevices(): Promise<Result<DeviceResponse[], HttpError>> {
        const url = `projects/${this.projectId}/devices`;
        return await this.client.authorizedFetch<DeviceResponse[]>(url, 'GET');
    }

    /**
     * Retrieves information about a specific device.
     * @param {string} deviceId - Unique identifier of the target device
     * @returns {Promise<Result<DeviceResponse, HttpError>>} Detailed device information
     */
    public async getDevice(
        deviceId: string
    ): Promise<Result<DeviceResponse, HttpError>> {
        const url = `projects/${this.projectId}/devices/${deviceId}`;
        return await this.client.authorizedFetch<DeviceResponse>(url, 'GET');
    }

    /**
     * Registers a new device with the project.
     * @param {Partial<DeviceRegisterRequest>} deviceRegisterRequest - Device registration parameters
     * @returns {Promise<Result<DeviceResponse, HttpError>>} Confirmation of device registration
     */
    public async registerDevice(
        deviceRegisterRequest: Partial<DeviceRegisterRequest>
    ): Promise<Result<DeviceResponse, HttpError>> {
        const url = `projects/${this.projectId}/register-device`;
        return await this.client.authorizedFetch(
            url,
            'POST',
            {},
            deviceRegisterRequest
        );
    }

    /**
     * Removes a device from the project.
     * @param {string} deviceId - Unique identifier of the device to remove
     * @returns {Promise<Result<DeviceResponse, HttpError>>} Final state of the removed device
     */
    public async deleteDevice(
        deviceId: string
    ): Promise<Result<DeviceResponse, HttpError>> {
        const url = `projects/${this.projectId}/devices/${deviceId}`;
        return await this.client.authorizedFetch<DeviceResponse>(url, 'DELETE');
    }
}

/**
 * Builder pattern implementation for creating ProjectClient instances with
 * flexible configuration options and environment variable support.
 */
export class ProjectClientBuilder {
    private serverUrl: string;
    private apiKey: string;
    private apiSecret: string;
    private projectId: string;
    private options?: BaseClientOptions;

    /**
     * Initializes a new ProjectClientBuilder with optional environment variable configuration.
     * Supported environment variables:
     * - SYNCFLOW_SERVER_URL: Base server URL
     * - SYNCFLOW_API_KEY: Authentication API key
     * - SYNCFLOW_API_SECRET: Authentication secret
     * - SYNCFLOW_PROJECT_ID: Target project identifier
     */
    constructor() {
        this.serverUrl = process.env.SYNCFLOW_SERVER_URL || '';
        this.apiKey = process.env.SYNCFLOW_API_KEY || '';
        this.apiSecret = process.env.SYNCFLOW_API_SECRET || '';
        this.projectId = process.env.SYNCFLOW_PROJECT_ID || '';
    }

    /**
     * Configures the Syncflow server endpoint URL.
     * @param {string} serverUrl - Base URL for the Syncflow server
     * @returns {ProjectClientBuilder} Builder instance for method chaining
     */
    setServerUrl(serverUrl: string): ProjectClientBuilder {
        this.serverUrl = serverUrl;
        return this;
    }

    /**
     * Sets the API key for server authentication.
     * @param {string} apiKey - Authentication API key
     * @returns {ProjectClientBuilder} Builder instance for method chaining
     */
    setApiKey(apiKey: string): ProjectClientBuilder {
        this.apiKey = apiKey;
        return this;
    }

    /**
     * Sets the API secret for server authentication.
     * @param {string} apiSecret - Authentication secret key
     * @returns {ProjectClientBuilder} Builder instance for method chaining
     */
    setApiSecret(apiSecret: string): ProjectClientBuilder {
        this.apiSecret = apiSecret;
        return this;
    }

    /**
     * Sets the target project identifier.
     * @param {string} projectId - Unique project identifier
     * @returns {ProjectClientBuilder} Builder instance for method chaining
     */
    setProjectId(projectId: string): ProjectClientBuilder {
        this.projectId = projectId;
        return this;
    }

    /**
     * Configures additional client connection options.
     * @param {BaseClientOptions} options - Client configuration options
     * @returns {ProjectClientBuilder} Builder instance for method chaining
     */
    setOptions(options: BaseClientOptions): ProjectClientBuilder {
        this.options = options;
        return this;
    }

    /**
     * Creates a new ProjectClient instance with the configured parameters.
     * @returns {ProjectClient} Configured ProjectClient instance
     * @throws {ProjectClientError} If required configuration parameters are missing
     */
    build(): ProjectClient {
        if (!this.serverUrl) {
            throw new ProjectClientError('Server URL is required');
        }
        if (!this.apiKey) {
            throw new ProjectClientError('API Key is required');
        }
        if (!this.apiSecret) {
            throw new ProjectClientError('API Secret is required');
        }
        if (!this.projectId) {
            throw new ProjectClientError('Project ID is required');
        }

        return new ProjectClient(
            this.serverUrl,
            this.apiKey,
            this.apiSecret,
            this.projectId,
            this.options
        );
    }
}

export class ProjectClientError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
