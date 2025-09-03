import clsx from "clsx";
import styles from "./MessageContainer.module.scss";
import { useEffect, useState } from "react";

type Props = {
  message: string;
  type: "success" | "error" | "info" | "default";
};

const MessageContainer = ({ message, type = "default" }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={clsx(styles.message, styles[type], visible && styles.show)}>
      {message}
    </div>
  );
};

export default MessageContainer;
