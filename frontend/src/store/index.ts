import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import boards from './boards/reducers';
import threads from './threads/reducers';
// import replies from './replies/reducers';

const rootReducer = combineReducers({
  boards,
  threads
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  return {
    ...createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(sagaMiddleware))
    ),
    runSaga: sagaMiddleware.run
  };
}
