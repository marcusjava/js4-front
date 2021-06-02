export const constants = {
  //socketURL: "http://localhost:3000",
  socketURL: "https://js4-server.herokuapp.com/",
  socketNamespaces: {
    room: "room",
    lobby: "lobby",
  },
  peerConfig: Object.values({
    id: undefined,
    /* config: {
        port: 9000, 
        host: 'localhost'
      } */
  }),
  pages: {
    LOBBY: "/pages/lobby",
    LOGIN: "/pages/login",
  },
  events: {
    CONNECTION: "connect",
    USER_CONNECTED: "userConnection",
    USER_DISCONNECTED: "userDisconnected",
    JOIN_ROOM: "joinRoom",
    LOBBY_UPDATED: "lobbyUpdated",
    UPGRADE_USER_PERMISSION: "upgradeUserPermission",
    SPEAK_REQUEST: "speakRequest",
    SPEAKER_ANSWER: "speakAnswer",
  },
  firebaseConfig: {
    apiKey: "AIzaSyBIgKVT_PVCI7xhvLxkWZ_pdoyxO6HUb5g",
    authDomain: "semanajs-expert-5d19f.firebaseapp.com",
    projectId: "semanajs-expert-5d19f",
    storageBucket: "semanajs-expert-5d19f.appspot.com",
    messagingSenderId: "221309296924",
    appId: "1:221309296924:web:e7bf0b76f0d67dc2395ad9",
    measurementId: "G-8N5QJT1HJV",
  },
  storageKey: "jsexpert:storage:user",
};
