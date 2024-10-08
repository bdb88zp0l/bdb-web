/**
 * The main reducer function for the application's state.
 * It handles various actions related to authentication, theming, and ecommerce data.
 *
 * @param {object} state - The current state of the application.
 * @param {object} action - The action object containing the type and payload.
 * @returns {object} The updated state of the application.
 */
import { Itemsdata1 } from "../data/pages/ecommerces/ecommercedata";
import authReducer from "./store/slices/authSlice";

let initialState = {
  auth: authReducer(undefined, { type: "@@INIT" }), // Initialize auth with its own initial state

  lang: "en",
  dir: "ltr",
  class: "light",
  dataMenuStyles: "light",
  dataNavLayout: "horizontal",
  dataHeaderStyles: "light",
  dataVerticalStyle: "overlay",
  dataToggled: "menu-hover-closed",
  dataNavStyle: "menu-hover",
  horStyle: "",
  dataPageStyle: "regular",
  dataWidth: "fullwidth",
  dataMenuPosition: "fixed",
  dataHeaderPosition: "fixed",
  loader: "disable",
  iconOverlay: "",
  colorPrimaryRgb: "204 0 51",
  colorPrimary: "204 0 51",
  bodyBg: "",
  Light: "",
  darkBg: "",
  inputBorder: "",
  bgImg: "",
  iconText: "",
  body: "",
  ecommercedata: [],
};

export default function reducer(state = initialState, action: any) {
  let { type, payload } = action;

  // Delegate auth-related actions to authReducer
  const authState = authReducer(state.auth, action);

  switch (type) {
    case "ThemeChanger":
      state = payload;
      return state;
      break;
      return state;
    case "ADD_TO_CART":
      state = {
        ...state,
        ...authState,
        ecommercedata: Itemsdata1.filter((idx) => idx.id === payload),
      };
      return {
        ...state,
        auth: authState,
      };
      break;

    case "PRODUCT":
      state.ecommercedata = Itemsdata1.filter((idx) => {
        return idx.id == payload;
      });
      return { ...state, ...authState };
      break;

    default:
      return {
        ...state,
        auth: authState,
      };
  }
}
