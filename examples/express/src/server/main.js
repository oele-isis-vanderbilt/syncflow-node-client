import express, { request } from 'express';
import ViteExpress from 'vite-express';
import dotenv from 'dotenv';
import { ProjectClientBuilder } from '../../../../dist/index.cjs';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    res.send('Hello Vite!');
});

// Helper functions for responses
const jsonOkResponse = (res, data) => {
    return res.status(200).json(data);
};

const errorResponse = (res, error) => {
    return res.status(500).json({ error: error.message });
};

// Token endpoint
app.post('/token', async (req, res) => {
    const { identity, roomName } = req.body;
    console.log('Requesting token:', { identity, roomName });

    try {
        const isActive = (session) => {
            return session.status === 'Started';
        };

        const isRoom = (session) => {
            return session.name === roomName;
        };

        const existingSession = await (
            await projectClient.getSessions()
        ).mapAsync(async (sessions) => {
            const activeSessions = sessions.filter(isActive);
            const roomSessions = activeSessions.filter(isRoom);
            if (roomSessions.length > 0) {
                return roomSessions[0];
            }
        });

        const videoGrants = {
            canPublish: true,
            canPublishData: true,
            canPublishSources: ['camera', 'screen'],
            canSubscribe: true,
            canUpdateOwnMetadata: true,
            hidden: false,
            ingressAdmin: true,
            recorder: true,
            room: roomName,
            roomAdmin: true,
            roomCreate: true,
            roomJoin: true,
            roomList: true,
            roomRecord: true,
        };

        const tokenRequest = {
            identity,
            name: identity,
            videoGrants,
        };

        if (existingSession.value !== undefined) {
            return existingSession.mapAsync(async (session) => {
                console.log('Existing session', session.id);
                return (
                    await projectClient.generateSessionToken(
                        session.id,
                        tokenRequest
                    )
                )
                    .map((token) => jsonOkResponse(res, token))
                    .unwrapOrElse((error) => errorResponse(res, error));
            });
        } else {
            console.log('Creating new session');
            // Create new session if none exists
            const newSessionRequest = {
                name: roomName,
                autoRecording: false,
                maxParticipants: 200,
                deviceGroups: [],
            };
            (await projectClient.createSession(newSessionRequest)).mapAsync(
                (session) => {
                    console.log('Session', session.id);
                    projectClient
                        .generateSessionToken(session.id, tokenRequest)
                        .then((token) => {
                            return jsonOkResponse(res, token);
                        })
                        .catch((error) => {
                            return errorResponse(res, error);
                        });
                }
            );
        }
    } catch (error) {
        console.log('error', error);
        return errorResponse(res, error);
    }
});

const projectClient = new ProjectClientBuilder()
    .setServerUrl(process.env.SYNCFLOW_SERVER_URL)
    .setApiKey(process.env.SYNCFLOW_API_KEY)
    .setApiSecret(process.env.SYNCFLOW_API_SECRET)
    .setProjectId(process.env.SYNCFLOW_PROJECT_ID)
    .build();

ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
);
