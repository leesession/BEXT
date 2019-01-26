import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import chatSagas from './chat/saga';
import betSagas from './bet/saga';
import stakeSagas from './stake/saga';
import awardSagas from './award/saga';
export default function* rootSaga() {
  yield all([
    appSagas(),
    chatSagas(),
    betSagas(),
    stakeSagas(),
    awardSagas(),
  ]);
}
