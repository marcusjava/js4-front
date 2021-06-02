import { constants } from "../../_shared/constants.js";
import Attendee from "./entities/attendee.js";

export default class RoomController {
  constructor({ socketBuilder, roomInfo, view, peerBuilder, roomService }) {
    this.socketBuilder = socketBuilder;
    this.peerBuilder = peerBuilder;
    this.roomInfo = roomInfo;
    this.roomService = roomService;
    this.view = view;
    this.socket = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._init();
  }

  async _init() {
    this._setupViewEvents();
    this.roomService.init();
    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgraded())
      .setOnSpeakerRequest(this.onSpeakRequest())
      .build();
  }

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnConectionOpen(this.onPeerConnectionOpen())
      .setOnError(this.onPeerError())
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build();
  }

  _setupViewEvents() {
    this.view.configureClapButton(this.onClapPressed());
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
    this.view.configureLeaveButton();
    this.view.configureMicrophoneButton(this.onConfigureMicButton());
  }

  onStreamReceived() {
    return (call, stream) => {
      console.log("stream received ", call, stream);
      const callerId = call.peer;
      const { isCurrentId } = this.roomService.addReceivedPeer(call);
      this.view.renderAudioElement({ callerId, stream, isCurrentId });
    };
  }

  onCallClose() {
    return (call) => {
      console.log("call close", call);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallError() {
    return (call, error) => {
      console.log("call error", call, error);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallReceived() {
    return async (call) => {
      const stream = await this.roomService.getCurrentStream();
      console.log("answering call", call);
      call.answer(stream);
    };
  }

  onPeerConnectionOpen() {
    return (peer) => {
      console.log("peer opened", peer); //emitindo evento
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    };
  }

  onPeerError() {
    return (error) => console.log("peer error", error);
  }

  onConfigureMicButton() {
    return async () => {
      await this.roomService.toggleAudioActivation();
    };
  }

  onClapPressed() {
    return () => {
      this.socket.emit(constants.events.SPEAK_REQUEST, this.roomInfo.user);
    };
  }

  onRoomUpdated() {
    return (data) => {
      const users = data.map((item) => new Attendee(item));
      this.roomService.updateCurrentUserProfile(users);
      this.view.updateAttendeesOnHTML(users);
      this.activateUserFeature();
    };
  }

  onUserDisconnected() {
    return (user) => {
      console.log("user disconnected", user);
      const attendee = new Attendee(user);
      this.view.removeAttendeeOnHTML(attendee);
      const { peerId } = attendee;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onUserProfileUpgraded() {
    return (user) => {
      console.log("profile upgraded", user);
      if (user.isSpeaker) {
        this.roomService.upgradeUserPermission(user);
        this.view.addAttendeeOnHTML(user, true);
      }
      this.activateUserFeature();
    };
  }

  activateUserFeature() {
    const currentUser = this.roomService.getCurrentUser();
    console.log({ currentUser });
    this.view.showUserFeatures(currentUser.isSpeaker);
  }

  onUserConnected() {
    return (user) => {
      console.log("user connected", user);
      this.view.addAttendeeOnHTML(user);
      //ligando
      this.roomService.callNewUser(user);
    };
  }

  onSpeakRequest() {
    return (data) => {
      const attendee = new Attendee(data);
      const result = prompt(
        `${attendee.username} pediu para falar!!!. Aceitar? 1 - Sim, 0 - Não`
      );

      this.socket.emit(constants.events.SPEAKER_ANSWER, {
        answer: !!Number(result),
        user: attendee,
      });
    };
  }
}
