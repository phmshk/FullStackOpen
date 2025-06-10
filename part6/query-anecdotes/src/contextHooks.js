import { useContext } from "react";
import AnecdotesContext from "./Context";

export const useNotificationValue = () => {
  const valueAndDispatch = useContext(AnecdotesContext);
  return valueAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const valueAndDispatch = useContext(AnecdotesContext);
  return valueAndDispatch[1];
};
