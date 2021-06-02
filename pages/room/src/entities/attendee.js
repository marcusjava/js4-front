export default class Attendee {
  constructor({ id, username, img, isSpeaker, roomId, peerId }) {
    this.id = id;

    const name = username || "Usuario anônimo";
    const [firstName, lastName] = name.split(/\s/);
    this.username = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.img = img || "";
    this.isSpeaker = isSpeaker;
    this.roomId = roomId;
    this.peerId = peerId;
  }
}
