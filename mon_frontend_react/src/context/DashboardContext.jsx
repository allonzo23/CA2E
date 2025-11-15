import { createContext, useContext, useReducer, useEffect } from "react";
import { getTabId } from "../utils/tabId";

const DashboardContext = createContext();

const initialState = {
  user: null,
  token: null,
  activeMenu: "home",
  drawerOpen: false,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case "UPDATE_MENU":
      return { ...state, activeMenu: action.payload };
    case "TOGGLE_DRAWER":
      return { ...state, drawerOpen: !state.drawerOpen };
    case "LOGOUT":
      return { ...initialState, loading: false };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const tabId = getTabId();

    const storedUser = sessionStorage.getItem(`user_${tabId}`);
    const storedToken = sessionStorage.getItem(`token_${tabId}`);

    if (storedUser && storedToken) {
      dispatch({
        type: "SET_USER",
        payload: { user: JSON.parse(storedUser), token: storedToken },
      });
    } else {
      dispatch({ type: "STOP_LOADING" });
    }
  }, []);

  const updateUser = (user, token) => {
    const tabId = getTabId();
    sessionStorage.setItem(`user_${tabId}`, JSON.stringify(user));
    sessionStorage.setItem(`token_${tabId}`, token);
    dispatch({ type: "SET_USER", payload: { user, token } });
  };

  const updateMenu = (menuKey) => {
    if (menuKey === "toggleDrawer") {
      dispatch({ type: "TOGGLE_DRAWER" });
    } else {
      dispatch({ type: "UPDATE_MENU", payload: menuKey });
    }
  };

  const logout = () => {
    const tabId = getTabId();
    sessionStorage.removeItem(`user_${tabId}`);
    sessionStorage.removeItem(`token_${tabId}`);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <DashboardContext.Provider
      value={{ state, updateUser, updateMenu, logout, loading: state.loading }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
