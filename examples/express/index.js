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

                // Add awaits in sequence
                await livekitRoom.connect(livekitServerUrl, token);
                await livekitRoom.localParticipant.enableCameraAndMicrophone();
                displayLocalVideo(livekitRoom.localParticipant);
            })
            .catch(error => console.error('Error', error))
    } catch (error) {
        console.error('Error joining room:', error);
        alert(error.message || 'Failed to join room');
    }
}

function displayLocalVideo(participant) {
    participant.videoTracks.forEach(trackPublication => {
        const track = trackPublication.track;
        const video = track.attach();
        video.setAttribute('data-identity', participant.identity);
        video.setAttribute('data-participant-sid', participant.sid);
        // set 300*300
        video.setAttribute('width', '300');
        video.setAttribute('height', '300');
        document.querySelector('#video-container').appendChild(video);
    });
}

