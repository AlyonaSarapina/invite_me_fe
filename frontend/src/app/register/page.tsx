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
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import FormInput from "@/components/FormInput/FormInput";
import { RegisterFormValues } from "@/types/auth";
import styles from "./Form.module.css";
import { toast } from "react-toastify";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  date_of_birth: "",
  role: "client",
};

const RegisterPage = () => {
  const router = useRouter();
  const { authReady } = useRequireAuth();
  const { registerStore } = useStore();
  const { register, error } = registerStore;

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register({
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth : undefined,
      });

      toast.success("Registration completed!🎉");

      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  if (!authReady) {
    return <div className="text-center py-5">Loading...</div>;
  }

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
                className="form-error"
              />
            </div>

            <FormInput
              name="date_of_birth"
              label="Date of birth"
              type="date"
              disabled={isSubmitting}
            />

            <div className="mb-3">
              <label className="form-label d-block">Role</label>
              <div className="form-check form-check-inline">
                <Field
                  className="form-check-input"
                  type="radio"
                  id="clientRole"
                  name="role"
                  value="client"
                  disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="clientRole">
                  Client
                </label>
              </div>
              <div className="form-check form-check-inline">
                <Field
                  className="form-check-input"
                  type="radio"
                  id="ownerRole"
                  name="role"
                  value="owner"
                  disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="ownerRole">
                  Owner
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`btn w-100 ${styles.btnPrimaryCustom}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Create account"}
            </button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link href="/" className={styles.brand}>
                Log in here
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default observer(RegisterPage);
