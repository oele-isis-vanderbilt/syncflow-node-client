import { Err, type Result } from 'ts-monads/lib/Result';
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
 * ProjectClient class is used to interact with the Syncflow server.
 */
export class ProjectClient {
    serverUrl: string;
    apiKey: string;
    apiSecret: string;
    projectId: string;
    client: BaseClient;


    /**
     * Creates a new instance of the ProjectClient.
     * @param {string} serverUrl - The URL of the Syncflow server.
     * @param {string} apiKey - The API key for the SyncFlow server.
     * @param {string} apiSecret - The API secret for the SyncFlow server.
     * @param {string} projectId - The project ID.
     * @param {BaseClientOptions | undefined} clientOpts - Optional client options.
     */
    constructor(
        serverUrl: string,
        apiKey: string,
        apiSecret: string,
        projectId: string,
        clientOpts: BaseClientOptions | undefined = undefined
    ) {
        this.serverUrl  = serverUrl;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.projectId = projectId;
        
        const claims = new ProjectTokenClaims(
            apiKey, 
            apiSecret, 
            projectId, 
            3600 // default 1 hour expiration
        );
        
        this.client = new BaseClient(
            serverUrl,
            claims,
            {
                autoRenewToken: clientOpts?.autoRenewToken ?? true
            }
        );
    }

    /**
     * Lists all the details of a project created by the user with the provided API key/secret pairs.
     * @returns {Promise<Result<ProjectInfo, HttpError>>} - The result of the get project details operation.
     */

    public async getProjectDetails(): Promise<Result<ProjectInfo, HttpError>> {
        const url = `projects/${this.projectId}`;
        return await this.client.authorizedFetch<ProjectInfo>(url, 'GET');
    }

    /**
     * Lists all the active projects created by the user with the provided API key/secret pairs.
     * @returns {Promise<Result<ProjectInfo, HttpError>>} - The result of the list rooms operation.
     */

    public async deleteProject(): Promise<Result<ProjectInfo, HttpError>> {
        const url = `projects/${this.projectId}`;
        return await this.client.authorizedFetch<ProjectInfo>(url, 'DELETE');
    }

    /**
     * Lists all the active projects created by the user with the provided API key/secret pairs.
     * @returns {Promise<Result<ProjectSummary, HttpError>>} - The result of the list rooms operation.
     */

    public async summarizeProject(): Promise<Result<ProjectSummary, HttpError>> {
        const url = `projects/${this.projectId}/summarize`;
        return await this.client.authorizedFetch<ProjectSummary>(url, 'GET');
    }

    /**
     * Creates a new room on the SyncFlow connected LiveKit server for the user with the provided API key/secret pairs.
     * @param {Partial<NewSessionRequest>} newSessionRequest - Optional room options.
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} - The result of the room creation operation.
     */
    public async createSession(
        newSessionRequest: Partial<NewSessionRequest>
    ): Promise<Result<ProjectSessionResponse, HttpError>> {
        const url = `projects/${this.projectId}/create-session`;
        return await this.client.authorizedFetch(url, 'POST', {}, newSessionRequest);
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @returns {Promise<Result<ProjectSessionResponse[], HttpError>>} - The result of the list rooms operation.
     */

    public async getSessions(): Promise<Result<ProjectSessionResponse[], HttpError>> {
        const url = `projects/${this.projectId}/sessions`;
        return await this.client.authorizedFetch<ProjectSessionResponse[]>(url, 'GET');
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @param {string} sessionId 
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} - The result of the list rooms operation.
     */

    public async getSession(
        sessionId : string
    ): Promise<Result<ProjectSessionResponse[], HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}`;
        return await this.client.authorizedFetch<ProjectSessionResponse>(url, 'GET');
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @param {string} sessionId 
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} - The result of the list rooms operation.
     */

    public async getParticipants(
        sessionId : string
    ): Promise<Result<ParticipantInfo[], HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/participants`;
        return await this.client.authorizedFetch<ParticipantInfo[]>(url, 'GET');
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @param {string} sessionId 
     * @returns {Promise<Result<any, HttpError>>} - The result of the list rooms operation.
     */

    public async getLivekitSessionInfo(
        sessionId : string
    ): Promise<Result<any, HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/livekit-session-info`;
        return await this.client.authorizedFetch(url, 'GET');
    }

    /**
     * Creates a new room on the SyncFlow connected LiveKit server for the user with the provided API key/secret pairs.
     * @param {string} sessionId - Optional room options.
     * @param {TokenRequest} tokenRequest - Optional room options.
     * @returns {Promise<Result<TokenResponse, HttpError>>} - The result of the room creation operation.
     */
    public async generateSessionToken(
        sessionId: string,
        tokenRequest: Partial<TokenRequest>
    ): Promise<Result<TokenResponse, HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/token`;
        return await this.client.authorizedFetch(url, 'POST', {}, tokenRequest);
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @param {string} sessionId 
     * @returns {Promise<Result<ProjectSessionResponse, HttpError>>} - The result of the list rooms operation.
     */

    public async stopSession(
        sessionId : string
    ): Promise<Result<ProjectSessionResponse[], HttpError>> {
        const url = `projects/${this.projectId}/sessions/${sessionId}/stop`;
        return await this.client.authorizedFetch<ProjectSessionResponse>(url, 'POST', {}, {});
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @returns {Promise<Result<DeviceResponse[], HttpError>>} - The result of the list rooms operation.
     */

    public async getDevices(): Promise<Result<DeviceResponse[], HttpError>> {
        const url = `projects/${this.projectId}/devices`;
        return await this.client.authorizedFetch<DeviceResponse[]>(url, 'GET');
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @param {string} deviceId
     * @returns {Promise<Result<DeviceResponse, HttpError>>} - The result of the list rooms operation.
     */

    public async getDevice(
        deviceId: string
    ): Promise<Result<DeviceResponse[], HttpError>> {
        const url = `projects/${this.projectId}/devices/${deviceId}`;
        return await this.client.authorizedFetch<DeviceResponse>(url, 'GET');
    }

    /**
     * Creates a new room on the SyncFlow connected LiveKit server for the user with the provided API key/secret pairs.
     * @param {Partial<DeviceRegisterRequest>} deviceRegisterRequest - Optional room options.
     * @returns {Promise<Result<DeviceResponse, HttpError>>} - The result of the room creation operation.
     */
    public async registerDevice(
        deviceRegisterRequest: Partial<DeviceRegisterRequest>
    ): Promise<Result<DeviceResponse, HttpError>> {
        const url = `projects/${this.projectId}/create-session`;
        return await this.client.authorizedFetch(url, 'POST', {}, deviceRegisterRequest);
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @param {string} deviceId
     * @returns {Promise<Result<DeviceResponse, HttpError>>} - The result of the list rooms operation.
     */

    public async deleteDevice(
        deviceId: string
    ): Promise<Result<DeviceResponse[], HttpError>> {
        const url = `projects/${this.projectId}/devices/${deviceId}`;
        return await this.client.authorizedFetch<DeviceResponse>(url, 'DELETE');
    }
}

/**
 * ProjectClientBuilder class is used to build a ProjectClient instance.
 */
export class ProjectClientBuilder {
    private serverUrl: string;
    private apiKey: string;
    private apiSecret: string;
    private projectId: string;
    private options?: BaseClientOptions;

    /**
     * Creates a new instance of the ProjectClientBuilder.
     * The server URL, API key, and API secret can also be set using environment variables.
     * Use the following environment variables to set the server URL, API key, and API secret:
     * - SYNCFLOW_SERVER_URL
     * - SYNCFLOW_API_KEY
     * - SYNCFLOW_API_SECRET
     */
    constructor() {
        this.serverUrl = process.env.SYNCFLOW_SERVER_URL || '';
        this.apiKey = process.env.SYNCFLOW_API_KEY || '';
        this.apiSecret = process.env.SYNCFLOW_API_SECRET || '';
        this.projectId = process.env.SYNCFLOW_PROJECT_ID || '';
    }

    /**
     * Sets the server URL for the ProjectClient.
     * @param {string} serverUrl - The URL of the Project server.
     * @returns {ProjectClientBuilder} - The ProjectClientBuilder instance.
     */
    setServerUrl(serverUrl: string): ProjectClientBuilder {
        this.serverUrl = serverUrl;
        return this;
    }

    /**
     * Sets the API key for the ProjectClient.
     * @param {string} apiKey - The API key for the Project server.
     * @returns {ProjectClientBuilder} - The ProjectClientBuilder instance.
     */
    setApiKey(apiKey: string): ProjectClientBuilder {
        this.apiKey = apiKey;
        return this;
    }

    /**
     * Sets the API secret for the ProjectClient.
     * @param {string} apiSecret - The API secret for the Project server.
     * @returns {ProjectClientBuilder} - The ProjectClientBuilder instance.
     */
    setApiSecret(apiSecret: string): ProjectClientBuilder {
        this.apiSecret = apiSecret;
        return this;
    }

    /**
     * Sets the project ID for the ProjectClient.
     * @param {string} projectId - The project ID.
     * @returns {ProjectClientBuilder} - The ProjectClientBuilder instance.
     */
    setProjectId(projectId: string): ProjectClientBuilder {
        this.projectId = projectId;
        return this;
    }

    /**
     * Sets the client options for the ProjectClient.
     * @param {BaseClientOptions} options - The client options.
     * @returns {ProjectClientBuilder} - The ProjectClientBuilder instance.
     */
    setOptions(options: BaseClientOptions): ProjectClientBuilder {
        this.options = options;
        return this;
    }

    /**
     * Builds a ProjectClient instance with the provided server URL, API key, and API secret.
     * @returns {ProjectClient} - The ProjectClient instance.
     * @throws {ProjectClientError} - If the server URL, API key, or API secret is not provided and the environment variables are not set.
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