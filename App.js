/* eslint no-underscore-dangle:[0] */
/* global window */

import React from "react";
import { createStore, applyMiddleware, compose } from "redux";
import { AsyncStorage } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { PersistGate } from "redux-persist/integration/react";

import reduxFileSync from "./src/reduxFileSync";
import Root from "./src/components/Root";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["errors"]
};

const persistedReducer = persistReducer(persistConfig, reduxFileSync.reducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(store);
// persistor.purge();

export default function Main() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <Root />
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
