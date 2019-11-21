import { combineReducers } from "redux";
import namedReducer from "./namedReducer";

const rootReducer = combineReducers({ named: namedReducer });

export default rootReducer;
