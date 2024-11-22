import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { ProjectClientBuilder } from '../../dist/index.cjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join("./")));
app.use(cors());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
            videoGrants
        };

        if (existingSession.value !== undefined) {
            existingSession.mapAsync((session) => {
                console.log("Existing session", session.id)
                projectClient.generateSessionToken(
                    session.id,
                    tokenRequest
                ).then((token) => {
                    return jsonOkResponse(res, token);
                }).catch((error) => {
                    return errorResponse(res, error);
                })
            });
        } else {
            console.log("Creating new session")
            // Create new session if none exists
            const newSessionRequest = {
                name: roomName,
                autoRecording: false,
                maxParticipants: 200,
                deviceGroups: []
            };
                (await projectClient.createSession(newSessionRequest))
                .mapAsync((session) => { 
                    console.log("Session", session.id)
                    projectClient.generateSessionToken(
                        session.id,
                        tokenRequest
                    ).then((token) => {
                        return jsonOkResponse(res, token);
                    }).catch((error) => {
                        return errorResponse(res, error);
                    })
                });
        }
    } catch (error) {
        console.log("error", error)
        return errorResponse(res, error);
    }
});


// Initialize server
const port = process.env.PORT || 5444;

// Initialize SyncFlow client
const projectClient = new ProjectClientBuilder(
    process.env.SYNCFLOW_API_URL,
    process.env.SYNCFLOW_API_KEY,
    process.env.SYNCFLOW_API_SECRET,
    process.env.SYNCFLOW_PROJECT_ID
).build();


// Start server
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
