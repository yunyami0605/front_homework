import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={styles["loading-overlay"]}>
      <div className={styles.loading}>로딩 중...</div>
    </div>
  );
};

export default LoadingSpinner;
