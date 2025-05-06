import { types } from "mobx-state-tree";
import { UserStore } from "./UserStore";
import { LoginStore } from "./LoginStore";
import { RegisterStore } from "./RegisterStore";

export const RootStore = types.model("RootStore", {
  userStore: UserStore,
  loginStore: LoginStore,
  registerStore: RegisterStore,
});
