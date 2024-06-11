'use-strict';

import { Err, type Result } from 'ts-monads/lib/Result';
import { BaseClient } from './base-client';
import { BaseClientOptions, HttpError } from './base-client';
import type { EgressInfo, ParticipantInfo } from 'livekit-server-sdk';
import type {
    GenericResponse,
    CreateRoomOptions,
    LivekitRoom,
    TokenResponse,
    VideoGrants,
} from './models';

/**
 * SyncFlowClient class is used to interact with the SyncFlow server.
 */
export class SyncFlowClient {
    serverUrl: string;
    apiKey: string;
    apiSecret: string;
    client: BaseClient;

    /**
     * Creates a new instance of the SyncFlowClient.
     * @param {string} serverUrl - The URL of the SyncFlow server.
     * @param {string} apiKey - The API key for the SyncFlow server.
     * @param {string} apiSecret - The API secret for the SyncFlow server.
     * @param {BaseClientOptions | undefined} clientOpts - Optional client options.
     */
    constructor(
        serverUrl: string,
        apiKey: string,
        apiSecret: string,
        clientOpts: BaseClientOptions | undefined = undefined
    ) {
        this.serverUrl = serverUrl;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.client = new BaseClient(
            serverUrl,
            apiKey,
            apiSecret,
            clientOpts ? clientOpts.tokenTtl : 60 * 60,
            clientOpts ? clientOpts.autoRenewToken : true
        );
    }

    /**
     * Creates a new room on the SyncFlow connected LiveKit server for the user with the provided API key/secret pairs.
     * @param {string} name - The name of the room.
     * @param {Partial<CreateRoomOptions>} roomOptions - Optional room options.
     * @returns {Promise<Result<LivekitRoom, HttpError>>} - The result of the room creation operation.
     */
    public async createRoom(
        name: string,
        roomOptions: Partial<CreateRoomOptions>
    ): Promise<Result<LivekitRoom, HttpError>> {
        const url = 'livekit/create-room';
        const requestBody = {
            name,
            options: {
                emptyTimeout: 600,
                maxParticipants: 100,
                metadata: 'SyncFlow Room-NodeJS',
                ...roomOptions,
            },
        };

        return await this.client.authorizedFetch(url, 'POST', {}, requestBody);
    }

    /**
     * Lists all the active rooms created by the user with the provided API key/secret pairs.
     * @returns {Promise<Result<LivekitRoom[], HttpError>>} - The result of the list rooms operation.
     */

    public async listRooms(): Promise<Result<LivekitRoom[], HttpError>> {
        const url = 'livekit/list-rooms';
        return await this.client.authorizedFetch<LivekitRoom[]>(url, 'GET');
    }

    /**
     * Deletes the room with the provided name from the SyncFlow connected LiveKit server.
     * The room must have been created by the user with the provided API key/secret pairs.
     * @param {string} roomName - The name of the room to delete.
     * @returns {Promise<Result<LivekitRoom, HttpError>>} - The result of the delete room operation.
     */
    public async deleteRoom(
        roomName: string
    ): Promise<Result<LivekitRoom, HttpError>> {
        const url = `livekit/delete-room/${roomName}`;
        return await this.client.authorizedFetch<LivekitRoom>(url, 'DELETE');
    }

    /**
     * Gets the health status of the LiveKit server connected to the SyncFlow server.
     * @returns {Promise<Result<GenericResponse, HttpError>>} - The result of the get livekit server health operation.
     */
    public async getLivekitServerHealth(): Promise<
        Result<GenericResponse, HttpError>
    > {
        const url = 'livekit/health';
        return await this.client.authorizedFetch<GenericResponse>(url, 'GET');
    }

    /**
     * Lists all the active egresses from the room with the provided name.
     * The room must have been created by the user with the provided API key/secret pairs.
     * @param {string} roomName - The name of the room.
     * @returns {Promise<Result<EgressInfo[], HttpError>>} - The result of the list egresses operation.
     */
    public async listEgresses(
        roomName: string
    ): Promise<Result<EgressInfo[], HttpError>> {
        const url = `livekit/list-egresses/${roomName}`;
        return await this.client.authorizedFetch<EgressInfo[]>(url, 'GET');
    }

    /**
     * Lists all the participants in the room with the provided name.
     * The room must have been created by the user with the provided API key/secret pairs.
     * @param {string} roomName - The name of the room.
     * @returns {Promise<Result<ParticipantInfo[], HttpError>>} - The result of the list participants operation.
     */
    public async listParticipants(
        roomName: string
    ): Promise<Result<ParticipantInfo[], HttpError>> {
        const url = `livekit/list-participants/${roomName}`;
        return await this.client.authorizedFetch<ParticipantInfo[]>(url, 'GET');
    }

    /**
     * Starts recording the track with the provided track SID in the room with the provided name.
     * The room must have been created by the user with the provided API key/secret pairs.
     * @param {string} roomName - The name of the room.
     * @param {string} trackSid - The SID of the track to record.
     * @returns {Promise<Result<EgressInfo, HttpError>>} - The result of the start track recording operation.
     */
    public async startTrackRecording(
        roomName: string,
        trackSid: string
    ): Promise<Result<EgressInfo, HttpError>> {
        const url = `livekit/begin-track-egress/${roomName}/${trackSid}`;
        return await this.client.authorizedFetch<EgressInfo>(url, 'POST');
    }

    /**
     * Stops recording the track with the provided track SID in the room with the provided name.
     * The room must have been created by the user with the provided API key/secret pairs.
     * @param {string} roomName - The name of the room.
     * @param {string} trackSid - The SID of the track to stop recording.
     * @returns {Promise<Result<EgressInfo, HttpError>>} - The result of the stop track recording operation.
     */
    public async stopRecording(
        egressId: string
    ): Promise<Result<EgressInfo, HttpError>> {
        const url = `livekit/stop-recording/${egressId}`;
        return await this.client.authorizedFetch<EgressInfo>(url, 'POST');
    }

    /**
     * Generates a LiveKit token for the user with the provided identity and video grants.
     * @param {string} identity - The identity of the user.
     * @param {Partial<VideoGrants>} grants - The video grants for the user.
     * @returns {Promise<Result<TokenResponse, HttpError | SyncFlowClientError>>} - The result of the generate LiveKit token operation.
     */
    public async generateLivekitToken(
        identity: string,
        grants: Partial<VideoGrants>
    ): Promise<Result<TokenResponse, HttpError | SyncFlowClientError>> {
        const url = 'livekit/token';
        const videoGrants: VideoGrants = {
            canPublish: false,
            canPublishData: false,
            canPublishSources: [],
            canSubscribe: false,
            canUpdateOwnMetadata: false,
            hidden: false,
            ingressAdmin: false,
            recorder: false,
            room: '',
            roomAdmin: false,
            roomCreate: true,
            roomJoin: true,
            roomList: false,
            roomRecord: false,
            ...grants,
        };

        if (!videoGrants.room) {
            return new Err(
                new SyncFlowClientError(
                    'Room name is required for video grants'
                )
            );
        }

        return await this.client.authorizedFetch(
            url,
            'POST',
            {},
            {
                identity,
                videoGrants,
            }
        );
    }
}

/**
 * SyncFlowClientBuilder class is used to build a SyncFlowClient instance.
 */
export class SyncFlowClientBuilder {
    private serverUrl: string;
    private apiKey: string;
    private apiSecret: string;

    /**
     * Creates a new instance of the SyncFlowClientBuilder.
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
    }

    /**
     * Sets the server URL for the SyncFlowClient.
     * @param {string} serverUrl - The URL of the SyncFlow server.
     * @returns {SyncFlowClientBuilder} - The SyncFlowClientBuilder instance.
     */
    setServerUrl(serverUrl: string): SyncFlowClientBuilder {
        this.serverUrl = serverUrl;
        return this;
    }

    /**
     * Sets the API key for the SyncFlowClient.
     * @param {string} apiKey - The API key for the SyncFlow server.
     * @returns {SyncFlowClientBuilder} - The SyncFlowClientBuilder instance.
     */
    setApiKey(apiKey: string): SyncFlowClientBuilder {
        this.apiKey = apiKey;
        return this;
    }

    /**
     * Sets the API secret for the SyncFlowClient.
     * @param {string} apiSecret - The API secret for the SyncFlow server.
     * @returns {SyncFlowClientBuilder} - The SyncFlowClientBuilder instance.
     */
    setApiSecret(apiSecret: string): SyncFlowClientBuilder {
        this.apiSecret = apiSecret;
        return this;
    }

    /**
     * Builds a SyncFlowClient instance with the provided server URL, API key, and API secret.
     * @returns {SyncFlowClient} - The SyncFlowClient instance.
     * @throws {SyncFlowClientError} - If the server URL, API key, or API secret is not provided and the environment variables are not set.
     */
    build(): SyncFlowClient {
        if (!this.serverUrl) {
            throw new SyncFlowClientError('Server URL is required');
        }
        if (!this.apiKey) {
            throw new SyncFlowClientError('API Key is required');
        }
        if (!this.apiSecret) {
            throw new SyncFlowClientError('API Secret is required');
        }

        return new SyncFlowClient(this.serverUrl, this.apiKey, this.apiSecret);
    }
}

export class SyncFlowClientError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
