import { ACTION_NAME } from "./actionTypes";

export const actionName = message => ({
  type: ACTION_NAME,
  payload: { message }
});
