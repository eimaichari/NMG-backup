import styles from './PageLoader.module.css';

export default function PageLoader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={styles.mark}>
        <span className={styles.n}>N</span>
        <span className={styles.m}>M</span>
        <span className={styles.g}>G</span>
      </div>
      <div className={styles.line} aria-hidden="true" />
    </div>
  );
}
