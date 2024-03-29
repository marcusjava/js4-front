import { constants } from "../../_shared/constants.js";
import Attendee from "./entities/attendee.js";
import { speakersTemplate } from "./templates/usersTemplates.js";

const imgUser = document.getElementById("imgUser");
const roomTopic = document.getElementById("pTopic");
const gridSpeakers = document.getElementById("gridSpeakers");
const gridAttendees = document.getElementById("gridAttendees");

const btnClipBoard = document.getElementById("btnClipBoard");
const btnClap = document.getElementById("btnClap");
const btnMicrophone = document.getElementById("btnMicrophone");
const toggleImage = document.getElementById("toggleImage");
const btnLeave = document.getElementById("btnLeave");

export default class View {
  static updateUserImage({ img, username }) {
    imgUser.src = img;
    imgUser.alt = username;
  }

  static redirectToLogin() {
    window.location = constants.pages.LOGIN;
  }

  static updateRoomTopic({ topic }) {
    roomTopic.innerHTML = topic;
  }

  static updateAttendeesOnHTML(users) {
    users.forEach((user) => View.addAttendeeOnHTML(user));
  }

  static _getExistingItemOnGrid({ id, baseElement = document }) {
    const existingItem = baseElement.querySelector(`[id="${id}"]`);

    return existingItem;
  }

  static removeAttendeeOnHTML({ id }) {
    const existingItem = View._getExistingItemOnGrid({ id });
    existingItem?.remove();
  }

  static _createAudioElement({ muted = true, srcObject }) {
    const audio = document.createElement("audio");
    audio.muted = muted;
    audio.srcObject = srcObject;

    audio.addEventListener("loadedmetadata", async () => {
      try {
        audio.play();
      } catch (error) {
        console.log("erro to play audio", error);
      }
    });
  }

  static _appendToHTMLTree(userId, audio) {
    const div = document.createElement("div");
    div.id = userId;
    div.append(audio);
  }

  static renderAudioElement({ callerId, stream, isCurrentId }) {
    View._createAudioElement({
      muted: isCurrentId,
      srcObject: stream,
    });
  }

  static addAttendeeOnHTML(item, removeFirst = false) {
    const attendee = new Attendee(item);
    const { id } = attendee;
    const speakersHTML = speakersTemplate(attendee);
    const baseElement = attendee.isSpeaker ? gridSpeakers : gridAttendees;
    if (removeFirst) {
      View.removeAttendeeOnHTML(attendee);
      baseElement.innerHTML += speakersHTML;
      return;
    }

    const existingItem = View._getExistingItemOnGrid({ id, baseElement });
    if (existingItem) {
      existingItem.innerHTML = speakersHTML;
      return;
    }
    baseElement.innerHTML += speakersHTML;
  }

  static showUserFeatures(isSpeaker) {
    console.log({ isSpeaker });
    //attendee
    if (!isSpeaker) {
      btnClap.classList.remove("hidden");
      btnMicrophone.classList.add("hidden");
      btnClipBoard.classList.add("hidden");
      return;
    }
    //speaker
    btnClap.classList.add("hidden");
    btnMicrophone.classList.remove("hidden");
    btnClipBoard.classList.remove("hidden");
  }

  static _onClapClick(command) {
    return () => {
      command();
      const basePath = "./../../assets/icons/";
      const handActive = "hand-solid.svg";
      const handInactive = "hand.svg";

      if (toggleImage.src.match(handInactive)) {
        toggleImage.src = `${basePath}${handActive}`;
        return;
      }
      toggleImage.src = `${basePath}${handInactive}`;
    };
  }

  static configureClapButton(command) {
    btnClap.addEventListener("click", this._onClapClick(command));
  }

  static _redirectToLobby() {
    window.location = constants.pages.LOBBY;
  }
  static configureLeaveButton() {
    btnLeave.addEventListener("click", () => {
      View._redirectToLobby();
    });
  }

  static _toggleMicrophoneIcon() {
    const icon = btnMicrophone.firstElementChild;
    const classes = [...icon.classList];

    const inactiveMicClass = "fa-microphone-slash";
    const activeMicClass = "fa-microphone";

    const isInactiveMic = classes.includes(inactiveMicClass);

    if (isInactiveMic) {
      icon.classList.remove(inactiveMicClass);
      icon.classList.add(activeMicClass);
      return;
    }
    icon.classList.add(inactiveMicClass);
    icon.classList.remove(activeMicClass);
  }

  static configureMicrophoneButton(command) {
    btnMicrophone.addEventListener("click", () => {
      View._toggleMicrophoneIcon();
      command();
    });
  }
}
