import { combineReducers } from "redux";

import {
  setContactIdReducer,
  setCurrentContactReducer,
  setMyContactsReducer,
  setCurrentUserReducer,
  setMySocketInstanceReducer,
} from "./reducers";

const reducers = combineReducers({
  ContactId: setContactIdReducer,
  CurrentUser: setCurrentUserReducer,
  CurrentContact: setCurrentContactReducer,
  MyContacts: setMyContactsReducer,
  MySocket : setMySocketInstanceReducer
});
export default reducers;
