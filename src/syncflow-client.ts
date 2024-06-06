'use-strict';

import { Err, type Result } from 'ts-monads/lib/Result';
import { BaseClient } from './base-client';
import type { BaseClientOptions, HttpError } from './base-client';
import type {
    CreateRoomOptions,
    LivekitRoom,
    TokenResponse,
    VideoGrants,
} from './models';

export class SyncFlowClient {
    serverUrl: string;
    apiKey: string;
    apiSecret: string;
    client: BaseClient;

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

    //ToDos
    async createRoom(
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

    async listRooms(): Promise<Result<LivekitRoom[], HttpError>> {
        const url = 'livekit/list-rooms';
        return await this.client.authorizedFetch<LivekitRoom[]>(url, 'GET');
    }

    async deleteRoom(
        roomName: string
    ): Promise<Result<LivekitRoom, HttpError>> {
        const url = `livekit/delete-room/${roomName}`;
        return await this.client.authorizedFetch<LivekitRoom>(url, 'DELETE');
    }

    async getLivekitServerHealth() {}

    async listEgresses() {}

    async listParticipants() {}

    async beginTrackEgress() {}

    async generateLivekitToken(
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

export class SyncFlowClientBuilder {
    private serverUrl: string;
    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.serverUrl = process.env.SYNCFLOW_SERVER_URL || '';
        this.apiKey = process.env.SYNCFLOW_API_KEY || '';
        this.apiSecret = process.env.SYNCFLOW_API_SECRET || '';
    }

    setServerUrl(serverUrl: string): SyncFlowClientBuilder {
        this.serverUrl = serverUrl;
        return this;
    }

    setApiKey(apiKey: string): SyncFlowClientBuilder {
        this.apiKey = apiKey;
        return this;
    }

    setApiSecret(apiSecret: string): SyncFlowClientBuilder {
        this.apiSecret = apiSecret;
        return this;
    }

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
