import { types, flow, Instance } from "mobx-state-tree";
import { api } from "@/utils/axios";
import { RegisterFormValues } from "@/types/auth";

export const RegisterStore = types
  .model("RegisterStore", {
    loading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .actions((self) => {
    const register = flow(function* (payload: RegisterFormValues) {
      self.loading = true;
      self.error = undefined;
      try {
        console.log(payload);
        const responce = yield api.post("/auth/register", payload);
        console.log(responce);
      } catch (err: any) {
        self.error =
          err.response?.status === 409
            ? "Email already registered."
            : "Registration failed.";
      } finally {
        self.loading = false;
      }
    });

    return { register };
  });

export interface IRegisterStore extends Instance<typeof RegisterStore> {}
export const registerStore = RegisterStore.create({});
