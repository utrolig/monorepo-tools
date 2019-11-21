import { createStore } from "redux";
import rootReducer from "./reducers";

const chromeDevtoolsExtension =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(rootReducer, chromeDevtoolsExtension);

export default store;
