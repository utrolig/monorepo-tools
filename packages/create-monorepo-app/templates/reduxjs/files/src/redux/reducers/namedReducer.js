import { ACTION_NAME } from "../actions/actionTypes";

const initialState = {
  message: "This message is stored in redux store!"
};

const namedReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_NAME: {
      return { ...state, message: action.payload.message };
    }
    default:
      return state;
  }
};

export default namedReducer;
