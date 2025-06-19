import { useSelector } from "react-redux";
import { selectNotification } from "../features/notificationSlice";

const Notification = () => {
  let classes = {
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };
  const notification = useSelector(selectNotification);

  switch (notification.type) {
    case "error":
      classes.color = "red";
      break;
    case "success":
      classes.color = "green";
      break;
    default:
      classes.color = "black";
  }

  if (notification.text === "") {
    return null;
  }

  return <div style={classes}>{notification.text}</div>;
};

export default Notification;
