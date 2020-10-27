import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from "./user";
import post from "./post";

/* 
  # async action creator
*/

/* 
  # 정적 action creator
  const changeNickname = {
    type: "CHANGE_NICKNAME",
    data: "boogi",
  };

  # 동적 action creator
  const changeNickname = (data) => {
    return {
      type: "CHANGE_NICKNAME",
      data,
    };
  };
*/

// (이전 상태, 액션) => 다음 상태
// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         console.log("HYDRATE", HYDRATE);
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });

/* ServerSide */
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const conbinedReducer = combineReducers({
        user,
        post,
      });

      return conbinedReducer(state, action);
    }
  }
};

export default rootReducer;
