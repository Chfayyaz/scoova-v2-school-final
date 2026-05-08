"use client";

import { type ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { initializeAuth } from "./slices/auth.slice";

type ReduxProviderProps = {
  children: ReactNode;
};

function AuthBootstrap() {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);
  return null;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrap />
        {children}
      </PersistGate>
    </Provider>
  );
}
