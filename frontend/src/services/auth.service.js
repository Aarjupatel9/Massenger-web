// const API_URL = "http://3.109.184.63:10001/api/auth/";
const API_URL = "http://localhost:10001/api/auth/";

class AuthService {
  loginService(credential) {
    console.log(credential);
    return new Promise(function (resolve, reject) {
      const options = {
        method: "POST",
        // credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          credential: credential,
        }),
      };
      fetch(API_URL + "login", options)
        .then((response) => {
          console.log("fetch then response :", response);
          return response.json();
        })
        .then((res) => {
          console.log("response in login arrive : ", res);
          if (res.status == 1) {
            var userDetails = {
              username: res.data.username,
              token: res.token,
              _id: res.data._id,
              email: res.data.email,
              picture: res.data.picture,
              about: res.data.about,
            };
            
            console.log("response in login arrive userDetails : ", userDetails);
            localStorage.setItem("user", JSON.stringify(userDetails));
            resolve(userDetails, res.Contacts);
          } else {
            reject(res);
          }
        })
        .catch((e) => {
          console.log("erre : ", e);
        });
      console.log("reached after fetchx");
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser._id;
  }
  getUserToken() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser.token;
  }
}
export default new AuthService();
