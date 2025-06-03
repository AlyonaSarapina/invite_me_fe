"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { profileSchema, ProfileFormValues } from "@/validation/profileSchema";
import { useStore } from "@/stores/context";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { observer } from "mobx-react";
import ImageUploader from "@/components/ImageUploader";

const UserProfile = () => {
  const { userStore } = useStore();
  const { user, updateUser } = userStore;
  const [editMode, setEditMode] = useState(false);

  const initialValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  };

  useEffect(() => {
    userStore.checkAuth();
  }, [userStore.user]);

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      await updateUser(values);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePhoneChange = (
    setFieldValue: (field: string, value: any) => void,
    value: string
  ) => {
    setFieldValue("phone", value);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-light text-stroke text-outline-dark">
        My Profile
      </h2>
      <div className="card rounded-4 shadow px-3">
        <div className="card-body row g-4">
          <div className="col-lg-4 text-center align-content-center">
            <ImageUploader
              size={200}
              onUpload={userStore.uploadProfilePic}
              iconClassName="fa-circle-user"
              imageUrl={userStore.user?.profile_pic_url as string}
            />
            {user?.role && (
              <span
                className={`badge fw-semibold mt-2 ${
                  user.role === "owner" ? "bg-success" : "bg-primary"
                }`}
                style={{ fontSize: "0.9rem", textTransform: "capitalize" }}
              >
                {user.role}
              </span>
            )}
          </div>

          <div className="col-lg-8 position-relative">
            <Formik
              initialValues={initialValues}
              validationSchema={toFormikValidationSchema(profileSchema)}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting, resetForm }) => (
                <Form>
                  <div className="mt-md-5">
                    <label className="form-label fw-bold">Name</label>
                    {editMode ? (
                      <>
                        <Field
                          name="name"
                          className="form-control"
                          disabled={isSubmitting}
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger small"
                        />
                      </>
                    ) : (
                      <p>{user?.name}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    {editMode ? (
                      <>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          disabled={isSubmitting}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger small"
                        />
                      </>
                    ) : (
                      <p>{user?.email}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone</label>
                    {editMode ? (
                      <>
                        <PhoneInput
                          country={"ua"}
                          value={values.phone}
                          onChange={(val) =>
                            handlePhoneChange(setFieldValue, val)
                          }
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
                      </>
                    ) : (
                      <p>+{user?.phone}</p>
                    )}
                  </div>

                  <div className="d-flex justify-content-end">
                    {editMode ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => {
                            resetForm();
                            setEditMode(false);
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-primary position-absolute bottom-0 end-0"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(UserProfile);
