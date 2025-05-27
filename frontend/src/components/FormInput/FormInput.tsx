"use client";

import { Field, ErrorMessage } from "formik";
import styles from "./FormInput.module.css";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  disabled = false,
  placeholder = "",
}) => {
  return (
    <div className="form-group mb-3">
      <label className={`form-label ${styles.label}`}>{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-control ${styles.input}`}
      />
      <ErrorMessage name={name} component="div" className="text-danger small" />
    </div>
  );
};

export default FormInput;
