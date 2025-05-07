"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registerSchema } from "@/validation/registerSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { RegisterFormValues } from "@/types/auth";
import styles from "@/styles/Form.module.css";

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  date_of_birth: "",
  role: "client",
};

function RegisterPage() {
  const router = useRouter();
  const { registerStore } = useStore();
  const { register, error } = registerStore;

  const handleSubmit = async (values: RegisterFormValues) => {
    await register({
      ...values,
      date_of_birth: values.date_of_birth ? values.date_of_birth : undefined,
    });

    router.push("/");
  };

  const handlePhoneChange = (
    setFieldValue: (field: string, value: any) => void,
    value: string
  ) => {
    setFieldValue("phone", value);
  };

  return (
    <AuthLayout>
      <h2 className="mb-4 text-center fw-bold">
        Create your <span className={styles.brand}>Invite Me</span> account
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(registerSchema)}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            {error && (
              <div className="alert alert-danger small-text">{error}</div>
            )}

            <FormInput
              name="name"
              label="Full name"
              type="text"
              placeholder="Jack Brown"
              disabled={isSubmitting}
            />

            <FormInput
              name="email"
              label="Email address"
              type="email"
              placeholder="example@email.com"
              disabled={isSubmitting}
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <PhoneInput
                country={"ua"}
                value={values.phone}
                onChange={(val) => handlePhoneChange(setFieldValue, val)}
                inputProps={{
                  name: "phone",
                  required: true,
                  disabled: isSubmitting,
                }}
                inputStyle={{
                  height: "48px",
                  width: "100%",
                  fontSize: "14px",
                }}
                containerStyle={{ width: "100%" }}
                specialLabel=""
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-danger small"
              />
            </div>

            <FormInput
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              disabled={isSubmitting}
            />

            <div className="mb-4">
              <label className="form-label">Role</label>
              <Field
                as="select"
                name="role"
                className="form-control"
                disabled={isSubmitting}
              >
                <option value="client">Client</option>
                <option value="owner">Owner</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-danger small"
              />
            </div>

            <button
              type="submit"
              className={`btn w-100 mb-3 ${styles.btnPrimaryCustom}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p className={`${styles.linkWrapper} text-center`}>
              Already have an account?{" "}
              <Link
                href="/"
                className={`text-decoration-none fw-medium ${styles.brand}`}
              >
                Login here
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}

export default observer(RegisterPage);
