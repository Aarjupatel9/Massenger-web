import { connect, useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import AuthService from "./auth.service";
const API_URL = "http://localhost:10001/api/";

export function SocketServiceInit(Socket, dispatch, actionCreators) {
  const socket = io("https://localhost:10002");
  return socket;
}
