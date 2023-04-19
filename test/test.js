const API_URL = "http://localhost:10001/api/auth/";
const options = {
  method: "POST",
  // credentials: 'include',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
  body: JSON.stringify({
    email: "a@gmail.com",
    password: "mhk123",
  }),
};

fetch(API_URL + "login", options)
  .then((response) => {
    console.log("ggff : ", response);
    response.json();
  })
  .then((res) => {
    console.log("response in login arrive : ", res);
  })
  .catch((e) => {
    console.log("erre : ", e);
  });
