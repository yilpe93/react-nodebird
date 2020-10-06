import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// import thunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";

import reducer from "../reducers";
import rootSaga from "../sagas";

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
};

/* 
  # redux-thunk

  # redux-saga

  # 차이점
    action은 'Object' 이며, redux-saga에서는 action을 'Function' 으로 받을 수 있다.
    
    ```
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    ```

    위와 같이 함수일 경우 지연 함수로서 사용할 수 있다. 
*/

const configureStore = () => {
  const sagaMiddleaware = createSagaMiddleware();
  const middlewares = [sagaMiddleaware, loggerMiddleware];
  /* devtools 연동 */
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleaware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  // debug: process.env.NODE_ENV === "development",
  debug: false,
});

export default wrapper;
