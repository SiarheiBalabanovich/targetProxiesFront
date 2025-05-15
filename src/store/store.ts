import { Action, combineReducers, createStore } from "redux";
import { ThunkAction } from "redux-thunk";
import modalReducer from "src/store/reducers/modalReducer";
import mobMenuReducer from "src/store/reducers/mobMenuReducer";
import userInfoReducer from "src/store/slices/userInfoSlice";

const rootReducer = combineReducers({
  menu: mobMenuReducer,
  modal: modalReducer,
  userInfo: userInfoReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

const store = createStore(rootReducer);

export default store;
