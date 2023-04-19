import AuthService from "./auth.service";

const API_URL = "http://localhost:10001/api/";

// const API_URL = "http://3.109.184.63:10001/api/auth/";

class UserService {
  getUserContactList() {
    // return axios.get(API_URL + "user", { headers: authHeader() });
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  updateUserProfileDetails(username, about) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        // credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          username: username,
          about: about,
          token: AuthService.getUserToken(),
        }),
      };
      fetch(API_URL + "auth/updateUserProfile", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("response in login arrive : ", response);

          if (response.status > 0) {
            const oldUser = AuthService.getCurrentUser();
            var userDetails = {
              username: username,
              token: oldUser.token,
              id: oldUser.id,
              email: oldUser.email,
              about: about,
            };
            localStorage.setItem("user", JSON.stringify(userDetails));
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch();
    });
  }

  newContactHandleMain(email, name) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          email: email,
          name: name,
        }),
      };
      fetch(API_URL + "user/newContactAddForUser", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("response in login arrive : ", response);
          resolve(response);
        });
    });
  }

  updateMyContacts(dispatch, actionCreators) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
        }),
      };
      fetch(API_URL + "user/updateMyContacts", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("response in login arrive : ", response);
          if (response.status > 0) {
            const MyContacts = response.data;
            console.log("MyCOntaccts is : ", MyContacts);
            dispatch(actionCreators.SetMyContacts(MyContacts));
            localStorage.setItem("MyContacts_basicInfo", MyContacts);
            resolve(response);
          } else {
            reject(response);
          }
        });
    });
  }
}

export default new UserService();
