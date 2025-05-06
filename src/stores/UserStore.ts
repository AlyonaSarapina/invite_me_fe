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
    const setUser = (user: IUser) => {
      self.user = user;
    };

    return { setUser };
  });

export interface IUserStore extends Instance<typeof UserStore> {}
export const userStore = UserStore.create({});
