"use client";

import { Field, ErrorMessage } from "formik";

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
};

export default function FormInput({
  label,
  name,
  type = "text",
  disabled = false,
  placeholder = "",
}: FormInputProps) {
  return (
    <div className="form-group mb-3">
      <label
        className="form-label"
        style={{ fontSize: "14px", fontWeight: 500 }}
      >
        {label}
      </label>
      <Field
        name={name}
        type={type}
        className="form-control"
        placeholder={placeholder}
        disabled={disabled}
        style={{
          height: "48px",
          borderRadius: "6px",
          fontSize: "14px",
        }}
      />
      <ErrorMessage name={name} component="div" className="text-danger small" />
    </div>
  );
}
