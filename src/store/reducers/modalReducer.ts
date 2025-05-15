import {
  CLOSE_MODAL,
  ModalActionTypes,
  OPEN_MODAL,
} from "../actions/modalActions";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const modalReducer = (
  state = initialState,
  action: ModalActionTypes,
): ModalState => {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, isOpen: true };
    case CLOSE_MODAL:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export default modalReducer;
