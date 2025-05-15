import {
  OPEN_MENU,
  CLOSE_MENU,
  TOGGLE_MENU,
  MenuActionTypes,
} from "../actions/mobMenuAction";

const initialState = {
  isMenuOpen: false,
};

const mobMenuReducer = (state = initialState, action: MenuActionTypes) => {
  switch (action.type) {
    case OPEN_MENU:
      return { ...state, isMenuOpen: true };
    case CLOSE_MENU:
      return { ...state, isMenuOpen: false };
    case TOGGLE_MENU:
      return { ...state, isMenuOpen: !state.isMenuOpen };
    default:
      return state;
  }
};

export default mobMenuReducer;
