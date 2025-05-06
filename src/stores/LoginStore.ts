import { types, flow, Instance, getParent } from "mobx-state-tree";
import { api } from "@/utils/axios";
import { RootStore } from "./RootStore";

export const LoginStore = types
  .model("LoginStore", {
    loading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .actions((self) => {
    const login = flow(function* (email: string, password: string) {
      self.error = undefined;
      self.loading = true;
      try {
        const { data } = yield api.post("/auth/login", { email, password });

        localStorage.setItem("token", data.accessToken);

        const { data: user } = yield api.get("/users/me");

        getParent<typeof RootStore>(self).userStore.setUser(user);
        console.log(data.accessToken, user);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          self.error = "Wrong email or password.";
        } else {
          self.error = "Something went wrong.";
        }
      } finally {
        self.loading = false;
      }
    });

    const logout = () => {
      localStorage.removeItem("token");
    };

    const init = flow(function* () {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const { data: user } = yield api.get("/users/me");
          getParent<typeof RootStore>(self).userStore.setUser(user);
          console.log(user);
        } catch (err) {
          console.error("Failed to restore session", err);
          logout();
        }
      }
    });

    return { logout, login, init };
  })
  .actions((self) => ({
    afterCreate() {
      self.init();
    },
  }));

export interface ILoginStore extends Instance<typeof LoginStore> {}
export const loginStore = LoginStore.create({});
