export const CREATE_USER = "CREATE_USER";
export const SET_USERS = "SET_USERS";
import ChatUser from "../../models/ChatUser";

export const Create_User = (name, profileImageUrl, description) => {
  return async (dispatch, getState) => {
    // Any async operations here
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const res = await fetch(
      `https://whatsapp-clone-tutorial-fa52b-default-rtdb.firebaseio.com/Users.json?auth${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          profileImageUrl,
          description,
          userId,
        }),
      }
    );

    const resData = await res.json();

    dispatch({
      type: CREATE_USER,
      UserData: {
        id: resData.name,
        name,
        image: profileImageUrl,
        description,
        UserId: userId,
      },
    });
  };
};

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(
        "https://whatsapp-clone-tutorial-fa52b-default-rtdb.firebaseio.com/Users.json"
      );
      if (!res.ok) {
        throw new Error("Something went wrong...");
      }

      const resData = await res.json();
      const userstobeloaded = [];
      for (const key in resData) {
        userstobeloaded.push(
          new ChatUser(
            key,
            resData[key].name,
            resData[key].description,
            resData[key].profileImageUrl,
            resData[key].userId
          )
        );
      }
      dispatch({ type: SET_USERS, Users: userstobeloaded });
    } catch (e) {
      throw e;
    }
  };
};
