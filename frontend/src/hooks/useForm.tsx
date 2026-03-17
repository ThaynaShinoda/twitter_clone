import { useState } from "react";

export interface FieldProps {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

export function useForm(fields: FieldProps[]) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.name];

      if (field.required && !value) {
        newErrors[field.name] = "Campo obrigatório";
      }

      if (field.minLength && value.length < field.minLength) {
        newErrors[field.name] = `Mínimo ${field.minLength} caracteres`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  return { values, errors, validate, handleChange };
}
