import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import reducer from "../Redux/reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({ app: reducer });

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
