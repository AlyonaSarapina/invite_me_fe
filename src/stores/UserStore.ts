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
    const checkAuth = flow(function* () {
      const token = localStorage.getItem("token");
      if (!token) return;

      self.loading = true;
      try {
        const { data: user } = yield api.get("/users/me");
        console.log(user);
        self.user = user;
      } catch (err) {
        console.error("Session restore failed", err);
        localStorage.removeItem("token");
      } finally {
        self.loading = false;
      }
    });

    return { checkAuth };
  });

export interface IUserStore extends Instance<typeof UserStore> {}
export const userStore = UserStore.create({});
