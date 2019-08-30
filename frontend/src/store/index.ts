import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import boards from './boards/reducers';
import threads from './threads/reducers';
import replies from './replies/reducers';

const rootReducer = combineReducers({
  boards,
  threads,
  replies
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type AppState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

let persistor = persistStore(store);

export default function configureStore() {
  return {
    store,
    persistor,
    runSaga: sagaMiddleware.run
  };
}
