import { types, flow, Instance } from "mobx-state-tree";
import { api } from "@/utils/axios";
import { IUser, UserModel } from "./models/UserModel";

export const UserStore = types
  .model("UserStore", {
    user: types.maybe(UserModel),
    loading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .views((self) => ({
    get isOwner() {
      return self.user?.role === "owner";
    },
    get isClient() {
      return self.user?.role === "client";
    },
  }))
  .actions((self) => {
    const setToken = (token: string) => {
      localStorage.setItem("token", token);
    };

    const setUser = (user: IUser) => {
      self.user = user;
    };

    const logout = () => {
      self.user = undefined;
      localStorage.removeItem("token");
    };

    const login = flow(function* (email: string, password: string) {
      self.error = undefined;
      self.loading = true;
      try {
        const { data } = yield api.post("/auth/login", { email, password });

        setToken(data.accessToken);

        const { data: user } = yield api.get("/users/me");

        setUser(user);
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

    const init = flow(function* () {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const { data: user } = yield api.get("/users/me");
          setUser(user);
        } catch (err) {
          console.error("Failed to restore session", err);
          logout();
        }
      }
    });

    return { setToken, setUser, logout, login, init };
  })
  .actions((self) => ({
    afterCreate() {
      self.init();
    },
  }));

export interface IUserStore extends Instance<typeof UserStore> {}
export const userStore = UserStore.create({});
