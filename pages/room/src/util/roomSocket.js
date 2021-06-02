import { constants } from "../../../_shared/constants.js";
import SocketBuilder from "../../../_shared/socketBuilder.js";

export default class RoomSocketBuilder extends SocketBuilder {
  constructor({ socketURL, namespace }) {
    super({ socketURL, namespace });
    this.onRoomUpdated = () => {};
    this.onUserProfileUpgraded = () => {};
    this.onSpeakRequest = () => {};
  }

  setOnRoomUpdated(fn) {
    this.onRoomUpdated = fn;
    return this;
  }

  setOnUserProfileUpgrade(fn) {
    this.onUserProfileUpgraded = fn;
    return this;
  }

  setOnSpeakerRequest(fn) {
    console.log("request speaker");
    this.onSpeakRequest = fn;
    return this;
  }

  build() {
    const socket = super.build();
    socket.on(constants.events.LOBBY_UPDATED, this.onRoomUpdated);
    socket.on(
      constants.events.UPGRADE_USER_PERMISSION,
      this.onUserProfileUpgraded
    );

    socket.on(constants.events.SPEAK_REQUEST, this.onSpeakRequest);

    return socket;
  }
}
