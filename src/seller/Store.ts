import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  TypedUseSelectorHook,
} from "react-redux";

import authReducer from "../State/AuthSlice";
import sellerReducer from "./sellerSlice";
import sellerProductReducer from "../State/Seller/sellerProductSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  seller: sellerReducer,
  sellerProduct: sellerProductReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () =>
  useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;

export default store;