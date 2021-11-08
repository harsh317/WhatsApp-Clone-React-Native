import ChatUser from "../../models/ChatUser";
import { CREATE_USER, SET_USERS } from "../actions/AllUsers";

const initialState = {
  users: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER:
      const NewUser = new ChatUser(
        action.UserData.id.toString(),
        action.UserData.name,
        action.UserData.description,
        action.UserData.image,
        action.UserData.UserId
      );
      return {
        users: state.users.concat(NewUser),
      };
    case SET_USERS:
      return {
        users: action.Users,
      };
    default:
      return state;
  }
};
