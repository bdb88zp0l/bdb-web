/**
 * Configures and exports the Redux store for the application.
 * 
 * The store is created using the `configureStore` function from the `@reduxjs/toolkit` library.
 * It uses the `reducer` function from `./reducer` as the root reducer, and includes the `thunk` middleware
 * to handle asynchronous actions.
 * 
 * This store should be used throughout the application to manage the global state.
 */
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

const store = configureStore({
  reducer:reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
