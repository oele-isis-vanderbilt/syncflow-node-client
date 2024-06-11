const express = require('express');
const dotenv = require('dotenv');

// Replace this with the import statement for the SyncFlowClientBuilder in your project require("syncflow-node-client");
const { SyncFlowClientBuilder } = require('../../dist/index.cjs');

// Load environment variables from .env file
dotenv.config();

// Create an express app
const app = express();
// Set the port
const port = 5444;

const syncflowClient = new SyncFlowClientBuilder().build();

app.get('/list-rooms', (req, res) => {
    syncflowClient.listRooms().then((roomsResult) => {
        roomsResult
            .map((rooms) => {
                res.json(rooms).send();
            })
            .mapError((err) => {
                res.status(err.statusCode).send({ error: err.text });
            });
    });
});

app.get('/guest-token', (req, res) => {
    syncflowClient
        .generateLivekitToken('guest', {
            room: 'guest-room',
        })
        .then((tokenResult) => {
            tokenResult
                .map((token) => {
                    res.json(token).send();
                })
                .mapError((err) => {
                    res.status(err.statusCode).send({ error: err.text });
                });
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
