import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createTransform,
  type PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/auth.slice";
import type { AuthState } from "./slices/auth.slice";

const rootReducer = combineReducers({
  auth: authReducer,
});
type RootReducerState = ReturnType<typeof rootReducer>;

const authTokenMemoryOnlyTransform = createTransform<AuthState, AuthState>(
  (inboundState) => inboundState,
  (outboundState) => ({
    ...outboundState,
    // Keep token runtime-only; never rehydrate from persisted storage.
    accessToken: null,
  }),
  { whitelist: ["auth"] }
);

const persistConfig: PersistConfig<RootReducerState> = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [authTokenMemoryOnlyTransform],
};

const persistedReducer = persistReducer<RootReducerState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
