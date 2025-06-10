/* eslint-disable react/prop-types */
import { createContext, useReducer, useRef } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_NOTIFICATION":
      return action.payload;
    case "HIDE_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const AnecdotesContext = createContext();

export const AnecdotesContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  const timeoutIdRef = useRef();

  const showNotification = (message, seconds = 5) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    notificationDispatch({ type: "SHOW_NOTIFICATION", payload: message });

    timeoutIdRef.current = setTimeout(() => {
      notificationDispatch({ type: "HIDE_NOTIFICATION" });
    }, seconds * 1000);
  };

  return (
    <AnecdotesContext.Provider value={[notification, showNotification]}>
      {props.children}
    </AnecdotesContext.Provider>
  );
};

export default AnecdotesContext;
