import styles from "./BookEditModal.module.scss";
import type { FormType } from "../../types";
import { BookForm } from "../form/BookForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  form: FormType;
  onChangeForm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

/**
 * @description 도서 수정 모달
 */
export function BookEditModal({
  isOpen,
  onClose,
  form,
  onChangeForm,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>도서 정보 수정</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <BookForm
          form={form}
          handleSubmit={onSubmit}
          onChangeForm={onChangeForm}
        />
      </div>
    </div>
  );
}
