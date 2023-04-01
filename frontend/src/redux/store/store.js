import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit'
import slotReducer from '../reducer/slotSlice'
import authReducer from "../reducer/authSlice"
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  slot : slotReducer,
  auth : authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer : persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false
  }),
})

export const persistor = persistStore(store);