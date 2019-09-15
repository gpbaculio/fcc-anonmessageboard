import { runSaga, Saga, SagaIterator } from 'redux-saga';
import { AnyAction } from 'redux';

export const recordSaga = async (saga: Saga<any>, initialAction: AnyAction) => {
  const dispatched: AnyAction[] = [];

  await runSaga(
    {
      dispatch: (action: AnyAction) => dispatched.push(action)
    },
    saga,
    initialAction
  ).toPromise;
  console.log('initialAction ', initialAction);
  return dispatched;
};
