import { constants } from "../../_shared/constants.js";
import Media from "../../_shared/media.js";
import PeerBuilder from "../../_shared/peerBuilder.js";
import RoomController from "./controller.js";
import RoomService from "./service.js";
import RoomSocketBuilder from "./util/roomSocket.js";
import View from "./view.js";

import userDB from "../../_shared/userDB.js";

const user = userDB.get();
if (!Object.keys(user).length) {
  View.redirectToLogin();
}

const urlParams = new URLSearchParams(window.location.search);

const keys = ["id", "topic"];

const urlData = keys.map((key) => [key, urlParams.get(key)]);

const socketBuilder = new RoomSocketBuilder({
  socketURL: constants.socketURL,
  namespace: constants.socketNamespaces.room,
});

const peerBuilder = new PeerBuilder({ peerConfig: constants.peerConfig });

const roomInfo = { room: { ...Object.fromEntries(urlData) }, user };

const roomService = new RoomService({ media: Media });

//não precisa dar new na view pois todos os seus metodos sao estaticos
const dependencies = {
  socketBuilder,
  roomInfo,
  view: View,
  peerBuilder,
  roomService,
};

RoomController.initialize(dependencies).catch((err) => {
  alert(err.message);
});
