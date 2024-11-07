import { expect, describe, it } from 'vitest';
import { ProjectClientBuilder } from './project-client';
import { BaseClientOptions } from './base-client';

const randomSessionName = () => {
    const prefix = `NodeJSClient`;
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${random}-Test`;
};

describe('project client builder', () => {
    it('should be able to build project client successfully', () => {
        const builder = new ProjectClientBuilder();
        const client = builder
            .setApiKey('DUMMY_API_KEY')
            .setApiSecret('DUMMY_API_SECRET')
            .setServerUrl('HTTPS://DUMMY_SERVER_URL')
            .setProjectId('DUMMY_PROJECT_ID')
            .build();
        
        expect(client.serverUrl).eq('HTTPS://DUMMY_SERVER_URL');
        expect(client.apiKey).eq('DUMMY_API_KEY');
        expect(client.apiSecret).eq('DUMMY_API_SECRET');
        expect(client.projectId).eq('DUMMY_PROJECT_ID');
    });

    it('should be able to build from environment variables', () => {
        const builder = new ProjectClientBuilder();
        
        expect(() => builder.build()).not.toThrow();
    });

    it('should throw error if required parameters are missing', () => {
        const builder = new ProjectClientBuilder();
        
        expect(() => builder.build()).toThrow();
    });
});

describe('project client', () => {
    // Note: In a real-world scenario, you'd use actual credentials
    const client = new ProjectClientBuilder()
        .setApiKey('DUMMY_API_KEY')
        .setApiSecret('DUMMY_API_SECRET')
        .setServerUrl('HTTPS://DUMMY_SERVER_URL')
        .setProjectId('DUMMY_PROJECT_ID')
        .build();

    const sessionName = randomSessionName();

    it('should be able to create a session', async () => {
        const sessionCreationResult = await client.createSession({
            name: sessionName,
            emptyTimeout: 600,
            maxParticipants: 200,
        });

        expect(sessionCreationResult.ok().isSome()).toBe(true);
        const sessionDetails = sessionCreationResult.unwrap();
        expect(sessionDetails.name).toBe(sessionName);
        expect(sessionDetails.maxParticipants).toBe(200);
    });

    it('should be able to list sessions', async () => {
        const sessionsListResult = await client.getSessions();

        expect(sessionsListResult.ok().isSome()).toBe(true);
        const sessions = sessionsListResult.unwrap();
        expect(sessions.length).toBeGreaterThan(0);
        const names = sessions.map((s) => s.name);
        expect(names).toContain(sessionName);
    });

    it('should be able to generate a session token', async () => {
        // First, find the session we just created
        const sessionsResult = await client.getSessions();
        const session = sessionsResult.unwrap().find(s => s.name === sessionName);
        
        if (!session) {
            throw new Error('Session not found');
        }

        const tokenResult = await client.generateSessionToken(session.id, {
            identity: 'testUser',
            videoGrants: {
                room: session.livekitRoomName,
                roomJoin: true,
            }
        });

        expect(tokenResult.ok().isSome()).toBe(true);
        const tokenResponse = tokenResult.unwrap();
        expect(tokenResponse.identity).toBe('testUser');
        expect(tokenResponse.token).toBeTruthy();
    });

    it('should be able to get session details', async () => {
        // First, find the session we just created
        const sessionsResult = await client.getSessions();
        const session = sessionsResult.unwrap().find(s => s.name === sessionName);
        
        if (!session) {
            throw new Error('Session not found');
        }

        const sessionDetailsResult = await client.getSession(session.id);
        expect(sessionDetailsResult.ok().isSome()).toBe(true);
    });

    it('should be able to stop a session', async () => {
        // First, find the session we just created
        const sessionsResult = await client.getSessions();
        const session = sessionsResult.unwrap().find(s => s.name === sessionName);
        
        if (!session) {
            throw new Error('Session not found');
        }

        const stopSessionResult = await client.stopSession(session.id);
        expect(stopSessionResult.ok().isSome()).toBe(true);
    });
});

describe('project details', () => {
    const client = new ProjectClientBuilder()
        .setApiKey('DUMMY_API_KEY')
        .setApiSecret('DUMMY_API_SECRET')
        .setServerUrl('HTTPS://DUMMY_SERVER_URL')
        .setProjectId('DUMMY_PROJECT_ID')
        .build();

    it('should be able to get project details', async () => {
        const projectDetailsResult = await client.getProjectDetails();
        expect(projectDetailsResult.ok().isSome()).toBe(true);
    });

    it('should be able to get project summary', async () => {
        const projectSummaryResult = await client.summarizeProject();
        expect(projectSummaryResult.ok().isSome()).toBe(true);
    });
});