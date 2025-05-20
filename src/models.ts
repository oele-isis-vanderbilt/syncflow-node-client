export interface VideoGrantsWrapper {
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

export interface TokenRequest {
    identity: string;
    name?: string;
    videoGrants: VideoGrantsWrapper;
}

export interface TokenResponse {
    token: string;
    identity: string;
    livekitServerUrl?: string;
}

export interface NewSessionRequest {
    name?: string;
    comments?: string;
    emptyTimeout?: number;
    maxParticipants?: number;
    autoRecording?: boolean;
    deviceGroups?: string[];
}

export interface ProjectSessionResponse {
    id: string;
    name: string;
    startedAt: number;
    comments: string;
    empty_timeout: number;
    maxParticipants: number;
    livekitRoomName: string;
    projectId: string;
    status: string;
    numParticipants: number;
    numRecordings: number;
    participants?: SessionParticipant[];
    recordings?: SessionEgress[];
}

export interface SessionParticipant {
    id: string;
    identity: string;
    name?: string;
    joinedAt: number;
    leftAt: number;
    sessionId: string;
    tracks: SessionTrack[];
}

export interface SessionTrack {
    id: string;
    sid: String;
    name?: string;
    kind: string;
    source: string;
    participantId: string;
    multimediaDetails?: MultimediaDetails;
}

export interface MultimediaDetails {
    destination: string;
    fileName: string;
    presignedUrl: string;
    presignedUrlExpires: number;
    publisher: string;
    recordingStartTime: number;
    trackId: string;
}


export interface GenericResponse {
    message: string;
    status: number;
}

export interface ProjectInfo {
    id: string;
    name: string;
    description: string;
    livekitServerUrl: string;
    storageType: string;
    bucketName: string;
    endpoint: string;
    lastUpdated: number;
}

export interface ProjectSummary {
    numSessions: number;
    numActiveSessions: number;
    numParticipants: number;
    numRecordings: number;
}

export interface DeviceRegisterRequest {
    name: string;
    group: string;
    comments?: string;
}

export interface DeviceResponse {
    id: string;
    name: string;
    group: string;
    comments?: string;
    registered_at: number;
    registered_by: number;
    project_id: String;
    session_notification_exchange_name?: string;
    session_notification_binding_key?: string;
}

export interface SessionEgress {
    id: string;
    trackId: string;
    egressId: string;
    startedAt: number;
    egressType: string;
    status: string;
    destination: string;
    roomName: string;
    sessionId: string;
}
