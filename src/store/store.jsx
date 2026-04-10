import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  userDetails: userReducer,
});
const actualStorage = storage.default || storage;

console.log(storage);
console.log(typeof storage.getItem);

const persistConfig = {
  key: "root",
  version: 1,
  storage: actualStorage,
  whitelist: [
    "userDetails",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
