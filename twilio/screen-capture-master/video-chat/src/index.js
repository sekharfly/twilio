'use strict';

var Video = require('twilio-video');

var activeRoom;
var previewTracks;
var identity;
var roomName;
var screenTrack;
var tracks;
var trks;
function isFirefox() {
  var mediaSourceSupport = !!navigator.mediaDevices.getSupportedConstraints()
    .mediaSource;
  var matchData = navigator.userAgent.match(/Firefox\/(\d+)/);
  var firefoxVersion = 0;
  if (matchData && matchData[1]) {
    firefoxVersion = parseInt(matchData[1], 10);
  }
  return mediaSourceSupport && firefoxVersion >= 52;
}

function isChrome() {
  return 'chrome' in window;
}

function canScreenShare() {
  return isChrome || isFirefox;
}

function getUserScreen() {
  var extensionId = 'bieifplkcogdbemdpgkgpdaigijkcfaj';
  if (!canScreenShare()) {
    return;
  }
  if (isChrome()) {
    return new Promise((resolve, reject) => {
      const request = {
        sources: ['screen','window', 'tab']
      };
      chrome.runtime.sendMessage(extensionId, request, response => {
        if (response && response.type === 'success') {
          resolve({ streamId: response.streamId });
        } else {
          reject(new Error('Could not get stream'));
        }
      });
    }).then(response => {
      return navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: response.streamId
          }
        }
      });
    });
  } else if (isFirefox()) {
    return navigator.mediaDevices.getUserMedia({
      video: {
        mediaSource: ['screen']
      }
    });room-controls
  }
}

// Attach the Tracks to the DOM.
function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    container.appendChild(track.attach());
  });
}

// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant, container) {
  tracks = Array.from(participant.tracks.values());
  trks = tracks;
  attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
function detachTracks(tracks) {
  tracks.forEach(function(track) {
    track.detach().forEach(function(detachedElement) {
      detachedElement.remove();
    });
  });
}

// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
  tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

// When we are about to transition away from this page, disconnect
// from the room, if joined.
window.addEventListener('beforeunload', leaveRoomIfJoined);

document.getElementById('identity-connect').onclick = function() {
  var id = document.getElementById('identity').value;
  if (!id) {
    alert('Please enter your name.');
    return;
  }
  document.getElementById('identity-controls').style.display = 'none';
  getToken(id);
};

// Obtain a token from the server in order to connect to the Room.
function getToken(id) {
  $.getJSON('/token?identity=' + encodeURIComponent(id), function(data) {
    identity = data.identity;
    log("Ready and connected as '" + identity + "'...");
    document.getElementById('room-controls').style.display = 'block';

    // Bind button to join Room.
    document.getElementById('button-join').onclick = function() {
      roomName = document.getElementById('room-name').value;
      if (!roomName) {
        alert('Please enter a room name.');
        return;
      }

      log("Joining room '" + roomName + "'...");
      var connectOptions = {
        name: roomName,
        logLevel: 'debug'
      };

      if (previewTracks) {
        connectOptions.tracks = previewTracks;
      }

      // Join the Room with the token from the server and the
      // LocalParticipant's Tracks.
      Video.connect(data.token, connectOptions).then(roomJoined, function(
        error
      ) {
        log('Could not connect to Twilio: ' + error.message);
      });
    };

    // Bind button to leave Room.
    document.getElementById('button-leave').onclick = function() {
      log('Leaving room...');
      activeRoom.disconnect();
    };

    document.getElementById('button-share-screen').onclick = function() {
      getUserScreen().then(function(stream) {
        screenTrack = stream.getVideoTracks()[0];
        activeRoom.localParticipant.publishTrack(screenTrack);
        document.getElementById('button-share-screen').style.display = 'none';
        document.getElementById('button-unshare-screen').style.display = 'inline';
      });
    };

    document.getElementById('button-unshare-screen').onclick = function() {
      activeRoom.localParticipant.unpublishTrack(screenTrack);
      screenTrack = null;
      document.getElementById('button-share-screen').style.display = 'inline';
      document.getElementById('button-unshare-screen').style.display = 'none';
    };
    
	  // audio mute and unmute
	  document.getElementById('audio-mute').style.display = 'none';
    document.getElementById('audio-unmute').style.display ='none';
    document.getElementById('audio-mute').onclick = function() {
          document.getElementById('audio-mute').style.display = 'none';
          document.getElementById('audio-unmute').style.display ='inline';
          room.localParticipant.audioTracks.forEach(function(track) {
            log("audio muted '" + identity + "'...");
            track.disable();
          });
      }; 
      document.getElementById('audio-unmute').onclick = function(track,participant) {
        document.getElementById('audio-mute').style.display = 'inline';
        document.getElementById('audio-unmute').style.display = 'none'; 
        room.localParticipant.audioTracks.forEach(function(track) {
          log("audio unmuted '" + identity + "'...");
          track.enable();
        });      

      };	

    // video mute and unmute
	  document.getElementById('video-mute').style.display = 'none';
    document.getElementById('video-unmute').style.display ='none';
    document.getElementById('video-mute').onclick = function() {
          document.getElementById('video-mute').style.display = 'none';
          document.getElementById('video-unmute').style.display ='inline';
          room.localParticipant.videoTracks.forEach(function(track) {
            log("video unmuted '" + identity + "'...");
            track.disable();
          });
      }; 
      document.getElementById('video-unmute').onclick = function(track,participant) {
        document.getElementById('video-mute').style.display = 'inline';
        document.getElementById('video-unmute').style.display = 'none'; 
        room.localParticipant.videoTracks.forEach(function(track) {
          log("video unmuted '" + identity + "'...");
          track.enable();
        });      
      };
  });
}

// Successfully connected!
function roomJoined(room) {
  window.room = activeRoom = room;

  log("Joined as '" + identity + "'");
  document.getElementById('button-join').style.display = 'none';
  document.getElementById('button-leave').style.display = 'inline';
  if (canScreenShare()) {
    document.getElementById('button-share-screen').style.display = 'inline';
    document.getElementById('audio-mute').style.display = 'inline';
    document.getElementById('video-mute').style.display = 'inline';
  }

  // Attach LocalParticipant's Tracks, if not already attached.
  var previewContainer = document.getElementById('local-media');
  if (!previewContainer.querySelector('video')) {
    attachParticipantTracks(room.localParticipant, previewContainer);
  }

  // Attach the Tracks of the Room's Participants.
  room.participants.forEach(function(participant) {
    log("Already in Room: '" + participant.identity + "'");
    var previewContainer = document.getElementById('remote-media');
    attachParticipantTracks(participant, previewContainer);
  });

  // When a Participant joins the Room, log the event.
  room.on('participantConnected', function(participant) {
    log("Joining: '" + participant.identity + "'");
  });

  // When a Participant adds a Track, attach it to the DOM.
  room.on('trackAdded', function(track, participant) {
    log(participant.identity + ' added track: ' + track.kind);
    var previewContainer = document.getElementById('remote-media');
    attachTracks([track], previewContainer);
  });

  // When a Participant removes a Track, detach it from the DOM.
  room.on('trackRemoved', function(track, participant) {
    log(participant.identity + ' removed track: ' + track.kind);
    detachTracks([track]);
  });

  // When a Participant leaves the Room, detach its Tracks.
  room.on('participantDisconnected', function(participant) {
    log("Participant '" + participant.identity + "' left the room");
    detachParticipantTracks(participant);
  });

  // Once the LocalParticipant leaves the room, detach the Tracks
  // of all Participants, including that of the LocalParticipant.
  room.on('disconnected', function() {
    log('Left');
    if (previewTracks) {
      previewTracks.forEach(function(track) {
        track.stop();
      });
    }
    detachParticipantTracks(room.localParticipant);
    room.participants.forEach(detachParticipantTracks);
    activeRoom = null;
    document.getElementById('button-join').style.display = 'inline';
    document.getElementById('button-leave').style.display = 'none';
  });
}

// Preview LocalParticipant's Tracks.
document.getElementById('button-preview').onclick = function() {
  var localTracksPromise = previewTracks
    ? Promise.resolve(previewTracks)
    : Video.createLocalTracks();

  localTracksPromise.then(
    function(tracks) {
      window.previewTracks = previewTracks = tracks;
      var previewContainer = document.getElementById('local-media');
      if (!previewContainer.querySelector('video')) {
        attachTracks(tracks, previewContainer);
      }
    },
    function(error) {
      console.error('Unable to access local media', error);
      log('Unable to access Camera and Microphone');
    }
  );
};

// Activity log.
function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Leave Room.
function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}
