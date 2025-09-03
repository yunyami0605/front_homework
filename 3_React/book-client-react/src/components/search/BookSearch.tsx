import { useState, type KeyboardEvent } from "react";
import styles from "./BookSearch.module.scss";
import clsx from "clsx";

type Props = {
  onSearch: (title: string) => void;
};

/**
 * @description 책 제목 검색 컴포넌트
 */
export function BookSearch({ onSearch }: Props) {
  const [title, setTitle] = useState("");

  const handleSearch = () => {
    onSearch(title);
  };

  const onEnterKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(title);
    }
  };

  return (
    <div className={styles.search}>
      <label
        htmlFor="bookTitle"
        className={clsx(styles.label, styles.visuallyHidden)}
      >
        책 제목
      </label>

      <input
        id="bookTitle"
        className={styles.input}
        type="text"
        placeholder="책 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => onEnterKeyDown(e)}
      />
      <button className={styles.button} onClick={handleSearch}>
        검색
      </button>
    </div>
  );
}
