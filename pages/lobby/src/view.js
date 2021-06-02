import { constants } from "../../_shared/constants.js";
import Room from "./entities/room.js";
import { lobbyTemplate } from "./templates/lobbyTemplates.js";

const roomGrid = document.getElementById("roomGrid");
const imgUser = document.getElementById("imgUser");

const btnRoomWithoutTopic = document.getElementById(
  "btnCreateRoomWithoutTopic"
);
const btnRoomWithTopic = document.getElementById("btnCreateRoomWithTopic");
const txtTopic = document.getElementById("txtTopic");

export default class View {
  static updateUserImage({ img, username }) {
    imgUser.src = img;
    imgUser.alt = username;
  }

  static clearRoomList() {
    roomGrid.innerHTML = "";
  }
  static redirectToRoom(topic = "") {
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    window.location = View.generateRoomLink({ id, topic });
  }

  static redirectToLogin() {
    window.location = constants.pages.LOGIN;
  }

  static configureCreateRoomButton() {
    btnRoomWithTopic.addEventListener("click", () => {
      const topic = txtTopic.value;
      View.redirectToRoom(topic);
    });

    btnRoomWithoutTopic.addEventListener("click", () => {
      View.redirectToRoom();
    });
  }

  static generateRoomLink({ id, topic }) {
    return `./../room/index.html?id=${id}&topic=${topic}`;
  }

  static updateRoomList(rooms) {
    View.clearRoomList();
    rooms.forEach((room) => {
      console.log({ room });
      const params = new Room({
        ...room,
        roomLink: View.generateRoomLink(room),
      });
      const htmlTemplate = lobbyTemplate(params);
      roomGrid.innerHTML += htmlTemplate;
    });
  }
}
