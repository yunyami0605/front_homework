import type { BookItem } from "../../types";
import styles from "./BookTable.module.scss";

type Props = {
  books: BookItem[];
  onDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    book: BookItem
  ) => void;
  onEdit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    book: BookItem
  ) => void;
  onSelect: (book: BookItem) => void;
};

/**
 * @description 도서 목록을 표시하는 테이블
 */
export function BookTable({ books, onDelete, onEdit, onSelect }: Props) {
  const onClickTr = (item: BookItem) => {
    onSelect(item);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>ID</th>
          <th className={styles.th}>제목</th>
          <th className={styles.th}>저자</th>
          <th className={styles.th}>ISBN</th>
          <th className={styles.th}>가격</th>
          <th className={styles.th}>출판일</th>
          <th className={styles.th}>액션</th>
        </tr>
      </thead>

      <tbody>
        {books.map((book) => (
          <tr
            key={book.id}
            className={styles.tr}
            onClick={() => onClickTr(book)}
          >
            <td className={styles.td}>{book.id}</td>
            <td className={styles.td}>{book.title ?? "-"}</td>
            <td className={styles.td}>{book.author ?? "-"}</td>
            <td className={styles.td}>{book.isbn ?? "-"}</td>
            <td className={styles.td}>
              {book.price !== null ? `${book.price}원` : "-"}
            </td>
            <td className={styles.td}>{book.publishDate ?? "-"}</td>

            <td className={styles.td}>
              <button
                className={styles.editBtn}
                onClick={(e) => onEdit(e, book)}
              >
                수정
              </button>

              <button
                className={styles.deleteBtn}
                onClick={(e) => onDelete(e, book)}
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
