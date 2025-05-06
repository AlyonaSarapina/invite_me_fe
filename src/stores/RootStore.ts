import { types } from "mobx-state-tree";
import { UserStore } from "./UserStore";

export const RootStore = types.model("RootStore", {
  userStore: UserStore,
});
