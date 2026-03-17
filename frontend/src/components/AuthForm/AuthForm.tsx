import { useForm, type FieldProps } from "../../hooks/useForm";
import styles from "./Authform.module.css";

interface AuthFormProps {
  fields: FieldProps[];
  submitText: string;
  onSubmit: (values: Record<string, string>) => void;
}

export function AuthForm({ fields, submitText, onSubmit }: AuthFormProps) {
  const { values, handleChange, errors, validate } = useForm(fields);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) return;
    onSubmit(values);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <input
            className={styles.input}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={handleChange}
          />

          {errors[field.name] && <p>{errors[field.name]}</p>}
        </div>
      ))}
      <button className={styles.button} type="submit">
        {submitText}
      </button>
    </form>
  );
}
