import { constants } from "./constants.js";

//Builder pattern
constants;
class SocketBuilder {
  constructor({ socketURL, namespace }) {
    this.socketURL = `${socketURL}/${namespace}`;
    this.onUserConnected = () => {};
    this.onUserDisconnected = () => {};
  }

  setOnUserConnected(fn) {
    this.onUserConnected = fn;
    return this;
  }
  setOnUserDisconnected(fn) {
    this.onUserDisconnected = fn;
    return this;
  }

  build() {
    console.log("Socket Builder");
    const socket = globalThis.io.connect(this.socketURL, {
      withCredentials: false,
    });
    socket.on(constants.events.CONNECTION, () =>
      console.log("socket connected")
    );
    socket.on(constants.events.USER_CONNECTED, this.onUserConnected);
    socket.on(constants.events.USER_DISCONNECTED, this.onUserDisconnected);
    return socket;
  }
}

export default SocketBuilder;
