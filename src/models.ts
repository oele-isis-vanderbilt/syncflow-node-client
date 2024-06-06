export interface VideoGrants {
    canPublish: boolean;
    canPublishData: boolean;
    canPublishSources: string[];
    canSubscribe: boolean;
    canUpdateOwnMetadata: boolean;
    hidden: boolean;
    ingressAdmin: boolean;
    recorder: boolean;
    room: string;
    roomAdmin: boolean;
    roomCreate: boolean;
    roomJoin: boolean;
    roomList: boolean;
    roomRecord: boolean;
}

export interface TokenResponse {
    identity: string;
    token: string;
}

export interface CreateRoomOptions {
    emptyTimeout: number;
    maxParticipants: number;
    metadata: string;
}

export interface LivekitRoom {
    sid: string;
    name: string;
    emptyTimeout: number;
    maxParticipants: number;
    creationTime: number;
    turnPassword: string;
    enabledCodecs: string[];
    metadata: string;
    numParticipants: number;
    numPublishers: number;
    activeRecording: boolean;
}

export interface GenericResponse {
    message: string;
    status: number;
}