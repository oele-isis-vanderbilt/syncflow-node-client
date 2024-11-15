// State management
let currentSession = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('join_room').addEventListener('click', joinRoom);
});

function joinRoom() {
    const identity = document.getElementById('identity').value;
    const roomName = document.getElementById('roomName').value;

    if (!identity || !roomName) {
        alert('Please enter both identity and room name');
        return;
    }

    try {
        // Get token from server
        fetch('http://localhost:5444/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity,
                roomName
            })
        })
            .then(r => r.json())
            .then(async (r) => {  // Make this callback async
                const token = r.value.token;
                const livekitServerUrl = r.value.livekitServerUrl;

                const livekitRoom = new LivekitClient.Room({// automatically manage subscribed video quality
                    adaptiveStream: true,

                    // optimize publishing bandwidth and CPU for published tracks
                    dynacast: true,

                    // default capture settings
                    videoCaptureDefaults: {
                        resolution: LivekitClient.VideoPresets.h720.resolution,
                    },
                });

                livekitRoom.prepareConnection(livekitServerUrl, token);

                livekitRoom
                    .on(LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed)
                    .on(LivekitClient.RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
                    .on(LivekitClient.RoomEvent.Disconnected, handleDisconnect)

                // Add awaits in sequence
                await livekitRoom.connect(livekitServerUrl, token);
                await livekitRoom.localParticipant.enableCameraAndMicrophone();  // Also pass the room as parameter
            })
            .catch(error => console.error('Error', error))
    } catch (error) {
        console.error('Error joining room:', error);
        alert(error.message || 'Failed to join room');
    }
}

async function enableLocalTracks(room) {
    const localParticipant = room.localParticipant;

    try {
        // Publish local camera and microphone
        await localParticipant.enableCameraAndMicrophone();

        // Attach local video to container
        const videoContainer = document.getElementById('video-container');
        const localVideoElement = document.createElement('div');
        localVideoElement.id = 'local-video';
        localVideoElement.className = 'video-element';
        videoContainer.appendChild(localVideoElement);

        localParticipant.on(LivekitClient.ParticipantEvent.TrackPublished, (publication) => {
            if (publication.track) {
                const element = publication.track.attach();
                localVideoElement.appendChild(element);
            }
        });
    } catch (error) {
        console.error('Error enabling local tracks:', error);
        alert('Failed to enable camera/microphone');
    }
}

function handleDisconnect(participant) {
    console.log('Participant disconnected:', participant.identity);
    updateParticipantList();

    // Remove participant's video container
    const container = document.getElementById(`participant-${participant.identity}`);
    if (container) {
        container.remove();
    }
}

function handleTrackSubscribed(track, publication, participant) {
    console.log('Track subscribed:', track.kind, participant.identity);
    const videoContainer = document.getElementById('video-container');

    console.log('Track subscribed:', track.kind, participant.identity);

    if (track.kind === LivekitClient.Track.Kind.Video || track.kind === LivekitClient.Track.Kind.Audio) {
        let participantContainer = document.getElementById(`participant-${participant.identity}`);
        console.log('Participant container:', participantContainer);

        if (!participantContainer) {
            participantContainer = document.createElement('div');
            participantContainer.id = `participant-${participant.identity}`;
            participantContainer.className = 'video-element';
            videoContainer.appendChild(participantContainer);
        }

        const element = track.attach();
        participantContainer.appendChild(element);
    }
}

function handleTrackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
}

async function updateParticipantList() {
    if (!currentSession) return;

    try {
        const response = await fetch(`/sessions/${currentSession.id}/participants`);
        if (!response.ok) throw new Error('Failed to fetch participants');

        const participants = await response.json();

        const participantList = document.getElementById('participant-list');
        participantList.innerHTML = '';

        participants.forEach(participant => {
            const li = document.createElement('li');
            li.textContent = `${participant.identity} ${participant.metadata ? `(${participant.metadata})` : ''}`;
            participantList.appendChild(li);
        });
    } catch (error) {
        console.error('Error updating participant list:', error);
    }
}

function setupControls() {
    const controls = document.getElementById('controls');
    controls.style.display = 'block';
}

async function leaveRoom() {
    if (currentRoom) {
        await currentRoom.disconnect();
        currentRoom = null;
        currentSession = null;

        // Clear video container
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = '';

        // Hide controls
        document.getElementById('controls').style.display = 'none';

        // Clear participant list
        document.getElementById('participant-list').innerHTML = '';
    }
}

// Setup periodic participant list updates
setInterval(updateParticipantList, 5000);