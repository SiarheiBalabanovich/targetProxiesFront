export const OPEN_MENU = "OPEN_MENU";
export const CLOSE_MENU = "CLOSE_MENU";
export const TOGGLE_MENU = "TOGGLE_MENU";

interface OpenMenuAction {
  type: typeof OPEN_MENU;
}

interface CloseMenuAction {
  type: typeof CLOSE_MENU;
}

interface ToggleMenuAction {
  type: typeof TOGGLE_MENU;
}

export type MenuActionTypes =
  | OpenMenuAction
  | CloseMenuAction
  | ToggleMenuAction;

export const openMenu = (): MenuActionTypes => ({
  type: OPEN_MENU,
});

export const closeMenu = (): MenuActionTypes => ({
  type: CLOSE_MENU,
});

export const toggleMenu = (): MenuActionTypes => ({
  type: TOGGLE_MENU,
});
