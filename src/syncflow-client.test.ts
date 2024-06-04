import { expect, describe, it } from 'vitest';
import { SyncFlowClient, SyncFlowClientBuilder } from './syncflow-client';

const randomRoomName = () => {
    const prefix = `NodeJSClient`;
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${random}-Test`;
};

describe('client builder', () => {
    it('should be able build syncflow client successfully', () => {
        const builder = new SyncFlowClientBuilder();
        const client = builder
            .setApiKey('DUMMY_API_KEY')
            .setApiSecret('DUMMY_API_SECRET')
            .setServerUrl('HTTPS://DUMMY_SERVER_URL')
            .build();
        expect(client instanceof SyncFlowClient);
        expect(client.serverUrl).eq('HTTPS://DUMMY_SERVER_URL');
        expect(client.apiKey).eq('DUMMY_API_KEY');
        expect(client.apiSecret).eq('DUMMY_API_SECRET');
    });

    it('should be able to build from environment variables', () => {
        const builder = new SyncFlowClientBuilder();
        const client = builder.build();
        expect(client instanceof SyncFlowClient);
    });
});

describe('syncflow-client', () => {
    const client = new SyncFlowClientBuilder().build();
    const roomName = randomRoomName();

    it('should be able generate livekit tokens', async () => {
        const tokenResult = await client.generateLivekitToken('dummyIdentity', {
            room: roomName,
            roomCreate: true,
        });

        expect(tokenResult.ok().isSome()).toBe(true);
        const tokenResponse = tokenResult.unwrap();
        expect(tokenResponse.identity).toBe('dummyIdentity');
    });

    it('should be able to create/list/delete rooms', async () => {
        const roomCreationResult = await client.createRoom(roomName, {
            emptyTimeout: 600,
            maxParticipants: 200,
        });

        expect(roomCreationResult.ok().isSome()).toBe(true);
        const roomDetails = roomCreationResult.unwrap();
        expect(roomDetails.name).toBe(roomName);
        expect(roomDetails.maxParticipants).toBe(200);
        const roomListResult = await client.listRooms();
        expect(roomListResult.ok().isSome()).toBe(true);
        const rooms = roomListResult.unwrap();
        expect(rooms.length).toBeGreaterThan(0);
        const names = rooms.map((r) => r.name);
        expect(names).toContain(roomName);

        const deleteResult = await client.deleteRoom(roomName);
        expect(deleteResult.ok().isSome()).toBe(true);
        const deleteResponse = deleteResult.unwrap();
        expect(deleteResponse.name).toBe(roomName);
        expect(deleteResponse.sid).toBe(roomDetails.sid);
    });
});
