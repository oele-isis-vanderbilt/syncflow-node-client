import { Room, VideoPresets } from "livekit-client";

export function joinRoom(element) {
    element.addEventListener("click", () => {

        const identity = document.getElementById('identity').value;
        const roomName = document.getElementById('roomName').value;

        if (!identity || !roomName) {
            alert('Please enter both identity and room name');
            return;
        }

        try {
            // Get token from server
            fetch('/token', {
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

                    const livekitRoom = new Room({// automatically manage subscribed video quality
                        adaptiveStream: true,

                        // optimize publishing bandwidth and CPU for published tracks
                        dynacast: true,

                        // default capture settings
                        videoCaptureDefaults: {
                            resolution: VideoPresets.h720.resolution,
                        },
                        stopLocalTrackOnUnpublish: true,
                    });
                    livekitRoom.prepareConnection(livekitServerUrl, token);
                    // Add awaits in sequence
                    await livekitRoom.connect(livekitServerUrl, token);
                    try {
                        let trackPublication = await livekitRoom.localParticipant.setCameraEnabled(true);
                        // Wait for 2 seconds (The new SDK doesn't work without this delay and enable camera and microphone separately)
                        // This example only enables the camera
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        displayLocalVideo(livekitRoom.localParticipant, trackPublication);

                    } catch (error) {
                        console.error('Error enabling camera and microphone:', error);
                    }

                })
                .catch(error => console.error('Error', error))
        } catch (error) {
            console.error('Error joining room:', error);
            alert(error.message || 'Failed to join room');
        }
    });
}

function displayLocalVideo(participant, trackPublication) {
    const track = trackPublication.track;
    const video = track.attach();

    video.setAttribute('data-identity', participant.identity);
    video.setAttribute('data-participant-sid', participant.sid);
    // set 300*300
    video.setAttribute('width', '300');
    video.setAttribute('height', '300');
    document.querySelector('#video-container').appendChild(video);
}