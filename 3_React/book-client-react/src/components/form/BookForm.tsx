import styles from "./BookForm.module.scss";
import InputField from "../input/InputField";
import type { FormType } from "../../types";

type Props = {
  form: FormType;
  handleSubmit: (e: React.FormEvent) => void;
  onChangeForm: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function BookForm({ form, handleSubmit, onChangeForm }: Props) {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.field_line}>
        <InputField
          name={"title"}
          placeholder={"제목"}
          label={"제목"}
          type={"text"}
          onChange={onChangeForm}
          defaultValue={form.title ?? ""}
        />

        <InputField
          name={"author"}
          placeholder={"저자"}
          label={"저자"}
          type={"text"}
          onChange={onChangeForm}
          defaultValue={form.author ?? ""}
        />
      </section>

      <section className={styles.field_line}>
        <InputField
          name={"isbn"}
          placeholder={"isbn"}
          label={"isbn"}
          type={"text"}
          onChange={onChangeForm}
          defaultValue={form.isbn ?? ""}
        />

        <InputField
          name={"price"}
          placeholder={"가격"}
          label={"가격"}
          type={"number"}
          onChange={onChangeForm}
          defaultValue={form.price ?? 0}
        />
      </section>

      <section className={styles.field_line}>
        <InputField
          name={"publishDate"}
          placeholder={"출판 날짜"}
          label={"출판 날짜"}
          type={"date"}
          onChange={onChangeForm}
          value={form.publishDate ?? ""}
        />

        <div className={styles.dummy_field}></div>
      </section>

      <button className={styles.button} type="submit">
        등록
      </button>
    </form>
  );
}
