import styles from "./BookDetailModal.module.scss";
import type { BookItem } from "../../types";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  book?: BookItem | null;
};

/**
 * @description 도서 상세정보 모달
 */
function BookDetailModal({ isOpen, onClose, book }: Props) {
  if (!isOpen || !book) return null;

  const { detail } = book;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>도서 정보</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {detail.coverImageUrl && (
          <img
            src={detail.coverImageUrl}
            alt={detail.description ?? "book cover"}
            className={styles.cover}
          />
        )}

        <div className={styles.detailItem}>
          <span>출판사:</span> {detail.publisher ?? "-"}
        </div>
        <div className={styles.detailItem}>
          <span>언어:</span> {detail.language ?? "-"}
        </div>
        <div className={styles.detailItem}>
          <span>판:</span> {detail.edition ?? "-"}
        </div>
        <div className={styles.detailItem}>
          <span>페이지:</span> {detail.pageCount}
        </div>
        <div className={styles.detailItem}>
          <span>설명:</span> {detail.description ?? "-"}
        </div>
      </div>
    </div>
  );
}

export default BookDetailModal;
