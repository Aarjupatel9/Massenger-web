import React, {  useEffect, useState } from "react";

import AuthService from "../services/auth.service";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { actionCreators } from "././../state/index";

//google apis
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

function Login() {
  const [loading, setLoading] = useState(false);
  const [massege, setMassege] = useState("");
  const [registerButton, setRegisterButton] = useState(false);

  const navigate = useNavigate();
  const dispach = useDispatch();
  const CurrentUser = useSelector((state) => state.CurrentUser);

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);

  const responseMessage = (response) => {
    console.log("Login Success responce : ", response);
    const token1 = response.credential.accessToken;
    const refresh_token1 = response.credential.refreshToken;
    console.log("Login Success token1 : ", token1);
    console.log("Login Success r_token1 : ", refresh_token1);

    setUser(response);

    var token = response.credential;
    const decode = jwt_decode(token);
    console.log("Login Success : ", decode);
    console.log("Login Success : ", decode.name);
    console.log("Login Success : ", decode.email);
    console.log("Login Success : ", decode.email_verified);
    console.log("Login Success : ", decode.picture);

    setUserData(decode);
    handleLogin(decode);
    /*aud: "754777254417-e177q2glmotv28lllmm7chn9p6krevpi.apps.googleusercontent.com";
    azp: "754777254417-e177q2glmotv28lllmm7chn9p6krevpi.apps.googleusercontent.com";
    email: "aarjupatel922003@gmail.com";
    email_verified: true;
    exp: 1681824150;
    family_name: "Patel";
    given_name: "Aarju";
    iat: 1681820550;
    iss: "https://accounts.google.com";
    jti: "5664e4469b85b6c6ecc695f5c6f86962e4e07d3b";
    name: "Aarju Patel";
    nbf: 1681820250;
    picture: "https://lh3.googleusercontent.com/a/AGNmyxZFTDO68K2LSEqoVbmjm8-AlE4FcRycI-YxXBNP=s96-c";
    sub: "107986972506806710128";*/
  };
  const errorMessage = (error) => {
    console.log("Login failed : ", error);
  };

  function handleLogin(credential) {
    setMassege("");
    setLoading(true);

    // form.validateAll();
    if (!credential.email_verified) {
      setMassege(
        "Your Email adress is not varified by google plese varify first to open account"
      );
      setLoading(false);
      return;
    }
    AuthService.loginService(credential)
      .then((userDetails) => {
        console.log(
          "in login component after login localstorage is ",
          AuthService.getCurrentUser()
        );
        dispach(actionCreators.SetCurrentUser(userDetails));
        window.alert("you login succesfull");
        navigate("/home");
      })
      .catch((error) => {
        var resMessage;
        console.log("in erro login component after login localstorage is ");
        if (error.status == 0) {
          resMessage =
            "this email is not register with massege, kindly signup first";
          setRegisterButton(true);
        } else if (error.status == 2) {
          resMessage = "wrong password";
        } else if (error.status == 1) {
          // resMessage = "wrong password";
        } else {
          resMessage = "unhandled status arrive";
        }
        setLoading(false);
        setMassege(resMessage);
      });
  }


  useEffect(() => {
    if (CurrentUser.token !== "") {
      navigate("/");
      console.log("login.js currentUser : ", CurrentUser);
      console.log("login.js currentUser.token : ", CurrentUser.token);
    }
    
  }, []);

  return (
    <>
      {/* <div className="Container">
        {userData ? (
          <div>
            <img src={userData.picture} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {userData.name}</p>
            <p>Email Address: {userData.email}</p>
          </div>
        ) : (
          <></>
        )}
      </div> */}
      <div className="container ">
        <div className="card card-container">
          <img
            src="https://i.ibb.co/NSfrfzs/ic-launcher.jpg"
            alt="profile-img"
            className="profile-img-card"
          />

          <div className="container mt-4 text-xl">
            <GoogleLogin
              onSuccess={responseMessage}
              onError={errorMessage}
              responseType="code"
              scope="openid profile email"
              buttonText="Sign in with Google"
              cookiePolicy={"single_host_origin"}
              uxMode={"popup"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

{
  /* <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                type="text"
                className="form-control"
                name="email"
                value={email}
                onChange={onChangeEmail}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={loading}
                onClick={() => {
                  handleLogin();
                }}
              >
                Login
              </button>
            </div>

            {massege && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {massege}
                </div>
              </div>
            )}
            {registerButton && (
              <div className="form-group text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    signUpRedirect();
                  }}
                >
                  signup
                </button>
              </div>
            )}
          </Form> */
}
