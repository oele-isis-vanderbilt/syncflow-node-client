import { joinRoom } from './room';
import './style.css';

document.querySelector('#app').innerHTML = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiveKit Session</title>
    <style>
        
    </style>
</head>

<body>
    <div class="container">
        <div class="left-panel">
            <h2>Join Session</h2>
            <div class="form-group">
                <label for="identity">Identity:</label>
                <input type="text" id="identity" placeholder="Enter your identity">
            </div>
            <div class="form-group">
                <label for="roomName">Room Name:</label>
                <input type="text" id="roomName" placeholder="Enter room name">
            </div>
            <button id="join_room">Join Room</button>

            <h3>Participants</h3>
            <ul id="participant-list"></ul>
        </div>

        <div class="main-panel">
        <div id="video-container"></div>
        </div>

    </div>
</body>

</html>
`;

joinRoom(document.querySelector('#join_room'));
