import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";

import storage from "redux-persist/lib/storage";

import userSlice from "./slices/userSlice";
import searchSlice from "./slices/searchSlice";
import detailSlice from "./slices/postSlice";
import followSlice from "./slices/followSlice";
import nameSlice from "./slices/nameSlice";

const reducers = combineReducers({
  user: userSlice,
  search: searchSlice,
  detail: detailSlice,
  follow: followSlice,
  name: nameSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});