"use client";

import Link from "next/link";
import { observer } from "mobx-react";
import { useStore } from "@/stores/context";
import AuthLayout from "@/components/AuthLayout";
import { Form, Formik } from "formik";
import { loginSchema } from "@/validation/loginSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "@/components/FormInput";
import { LoginFormValues } from "@/types/auth";
import styles from "@/styles/Form.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const { loginStore, userStore } = useStore();
  const { login, error } = loginStore;
  const { authReady } = useRequireAuth();
  const router = useRouter();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);

      await userStore.checkAuth(true);

      router.push("/user/restaurants");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  if (!authReady) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <AuthLayout>
      <h2 className={`mb-4 ${styles.title} text-center`}>
        Welcome back to <span className={`${styles.brand}`}>Invite Me</span>
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(loginSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {error && (
              <div className={`alert alert-danger ${styles.error}`}>
                {error}
              </div>
            )}

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

            <button
              type="submit"
              className={`btn w-100 mb-3 ${styles.btnPrimaryCustom}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <p className={`text-center ${styles.linkWrapper}`}>
              Don't have an account?{" "}
              <Link
                href="/register"
                className={`${styles.link} ${styles.brand}`}
              >
                Sign up here
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default observer(LoginPage);
