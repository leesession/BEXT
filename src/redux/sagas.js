import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import chatSagas from './chat/saga';
import betSagas from './bet/saga';
export default function* rootSaga() {
  yield all([
    appSagas(),
    chatSagas(),
    betSagas(),
  ]);
}
