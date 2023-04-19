import React, { Component, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import ContactList from "./child-component/ContactListArea.home";
import MainDisplayArea from "./child-component/MainDisplayArea.home";
import AuthService from "../services/auth.service";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../state/index";

import { connect } from "react-redux";

import "../mainstyle.css";
import userService from "../services/user.service";

function Home() {
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(null);
  const [content, setContent] = useState("");
  const [contactId, setContactId] = useState("-1");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser == null) {
      // console.log("set redirect to home");
      setRedirect("/login");
    } else {
      updateMyContacts();
      UserService.getUserContactList().then(
        (response) => {
          setContent(response.data);
        },
        (error) => {
          setContent(
            (error.response && error.response.data) ||
              error.message ||
              error.toString()
          );
        }
      );
    }
  }, []);

  function updateMyContacts() {
    userService
      .updateMyContacts(dispatch, actionCreators)
      .then((response) => {console.log("updateMyContacts then...");})
      .catch((e) => {
        console.log("error while fetch Contacts info");
      });
  }

  function onSelectContact(contactId) {
    console.log("in onSelectContact and contact id is : ", contactId);
    setContactId(contactId);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="Home">
      <div className="ContactList  ">
        <ContactList />
      </div>
      <div className="MainDisplayArea ">
        <MainDisplayArea hi={"hello"} />
      </div>
    </div>
  );
}

export default Home;
