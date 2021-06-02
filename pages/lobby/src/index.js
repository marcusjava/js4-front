import LobbySocketBuilder from "./util/lobbySocket.js";
import { constants } from "../../_shared/constants.js";
import LobbyController from "./controller.js";
import View from "./view.js";
import userDB from "../../_shared/userDB.js";

const user = userDB.get();
if (!Object.keys(user).length) {
  View.redirectToLogin();
}

const socketBuilder = new LobbySocketBuilder({
  socketURL: constants.socketURL,
  namespace: constants.socketNamespaces.lobby,
});

const dependencies = { socketBuilder, user, view: View };

LobbyController.initialize(dependencies).catch((err) => {
  alert(err.message);
});
