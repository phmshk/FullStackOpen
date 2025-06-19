import { useDispatch } from "react-redux";
import { notificationAdded, notificationRemoved } from "./notificationSlice";

export const useShowNotification = () => {
  const dispatch = useDispatch();

  return (text, type) => {
    dispatch(notificationAdded({ text, type }));
    setTimeout(() => {
      dispatch(notificationRemoved());
    }, 5000);
  };
};
