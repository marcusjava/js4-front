export default class LobbyController {
  constructor({ socketBuilder, user, view }) {
    this.socketBuilder = socketBuilder;
    this.user = user;
    this.view = view;
    this.socket = {};
  }

  static initialize(deps) {
    return new LobbyController(deps)._init();
  }

  async _init() {
    this._setupViewEvents();
    this.socket = this._setupSocket();
  }

  onLobbyUpdated() {
    return (rooms) => {
      console.log("lobby", rooms);
      this.view.updateRoomList(rooms);
    };
  }
  _setupViewEvents() {
    this.view.updateUserImage(this.user);
    this.view.configureCreateRoomButton();
  }

  _setupSocket() {
    return this.socketBuilder.setOnLobbyUpdated(this.onLobbyUpdated()).build();
  }
}
