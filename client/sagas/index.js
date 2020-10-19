import { all, fork } from "redux-saga/effects";
import axios from "axios";
// delay, debounce, throttle, takeLatest, takeEvery, takeLeading, takeMaybe ...
import userSaga from "./user";
import postSaga from "./post";

// cors
axios.defaults.baseURL = "http://localhost:3065/api";
axios.defaults.withCredentials = true; // cookie 전달 허용

/* 
  # all [동시 실행]
  # fork [동기 함수 실행]
  # call [비동기 함수 실행]
  # put [dispatch 역할]
*/

/* 
  function* watchLogIn() {
    yield take("LOG_IN_REQUEST", logIn);
  }
  
  generator 코드는 일회성을 띄고 있으며, 로그인 -> 로그아웃 -> 로그인과 같은 순서로 진행할 수 없다.
  이때 사용하는게 white(true) {} 를 사용하여 eventListener와 같이 만들 수 있다.

  또는, `takeEvery`를 사용한다.

  while (true) {
    yield take("LOG_IN_REQUEST", logIn);
  }

  yield takeEvery("LOG_IN_REQUEST", logIn);

  ---

  버튼과 같은 이벤트의 중복이 일어날 경우가 있을 경우 `takeLatest`를 사용한다.
  이때, '응답'을 취소하지만 요청은 두번 쌓이게 되기에 백엔드에서 이를 검사, 방지해주어야 한다.

  요청이 한번에 동시 너무 많이 되어 디도스 공격과 같이 된다면 `throttle`를 고려
*/

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga)]);
}
