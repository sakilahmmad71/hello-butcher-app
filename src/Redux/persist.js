import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import rootReducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = applyMiddleware(thunk, logger)

const store = createStore(
    persistedReducer,
    middleware
);

const persistor = persistStore(store)

export { persistor, store }
