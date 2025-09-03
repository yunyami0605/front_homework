import type { InputHTMLAttributes } from "react";
import styles from "./InputField.module.scss";

type Props = {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 *@description input field
 */
function InputField({ label, name, onChange, ...props }: Props) {
  return (
    <div className={styles.input_field}>
      <label htmlFor={name}>{label}</label>

      <input
        className={styles.input}
        id={name}
        name={name}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

export default InputField;
