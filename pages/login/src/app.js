import { constants } from "../../_shared/constants.js";
import userDB from "../../_shared/userDB.js";

const btnLogin = document.getElementById("btnLogin");

const { firebaseConfig } = constants;

function redirectToLobby() {
  window.location = constants.pages.LOBBY;
}

function onLogin({ provider, firebase }) {
  return async () => {
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const { user } = result;

      const userData = {
        img: user.photoURL,
        username: user.displayName,
      };

      userDB.insert(userData);

      redirectToLobby();
    } catch (error) {
      alert(JSON.stringify(error.message));
      console.error("error ao efetuar o login", error.message);
    }
  };
}

const credentials = userDB.get();

if (Object.keys(credentials).length > 0) {
  redirectToLobby();
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var provider = new firebase.auth.GithubAuthProvider();
provider.addScope("read:user");

btnLogin.addEventListener("click", onLogin({ provider, firebase }));
