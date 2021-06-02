import UserStream from "./entities/userStream.js";

export default class RoomService {
  constructor({ media }) {
    this.currentPeer = {};
    this.currentUser = {};
    this.currentStream = {};
    this.media = media;
    this.peers = new Map();
    this.isAudioActive = true;
  }

  async init() {
    this.currentStream = new UserStream({
      stream: await this.media.getUserAudio(),
      isFake: false,
    });
  }

  setCurrentPeer(peer) {
    this.currentPeer = peer;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async _reconnectAsSpeaker() {
    return this.switchAudioStreamSource({ realAudio: true });
  }

  _reconnectPeers(stream) {
    for (const peer of this.peers.values()) {
      const peerId = peer.call.peer;
      peer.call.close();
      this.currentPeer.call(peerId, stream);
    }
  }

  async toggleAudioActivation() {
    console.log("toggle audio", this.isAudioActive);
    this.isAudioActive = !this.isAudioActive;
    this.switchAudioStreamSource({ realAudio: this.isAudioActive });
  }

  async switchAudioStreamSource({ realAudio }) {
    const userAudio = realAudio
      ? await this.media.getUserAudio()
      : this.media.createMediaStreamFake();

    this.currentStream = new UserStream({
      isFake: realAudio,
      stream: userAudio,
    });

    this.currentUser.isSpeaker = realAudio;
    this._reconnectPeers(this.currentStream.stream);
  }

  async upgradeUserPermission(user) {
    if (!user.isSpeaker) return;
    const isCurrentUser = user.id === this.currentUser.id;

    if (!isCurrentUser) return;

    this.currentUser = user;
    return this._reconnectAsSpeaker();
  }

  updateCurrentUserProfile(users) {
    this.currentUser = users.find(
      ({ peerId }) => peerId === this.currentPeer.id
    );
  }

  addReceivedPeer(call) {
    const callerId = call.peer;
    this.peers.set(callerId, { call });
    const isCurrentId = callerId === this.currentUser.id;
    return { isCurrentId };
  }

  async getCurrentStream() {
    const { isSpeaker } = this.currentUser;
    if (isSpeaker) {
      return this.currentStream.stream;
    }

    return this.media.createMediaStreamFake();
  }

  disconnectPeer({ peerId }) {
    if (!this.peers.has(peerId)) return;
    this.peers.get(peerId).call.close();
    this.peers.delete(peerId);
  }

  async callNewUser(user) {
    //se o usuario que entrou for speaker ele vai me ligar
    const { isSpeaker } = this.currentUser;
    if (!isSpeaker) return;

    const stream = await this.getCurrentStream();
    this.currentPeer.call(user.peerId, stream);
  }
}
