import { types } from "mobx-state-tree";
import { UserStore } from "./UserStore";
import { LoginStore } from "./LoginStore";
import { RestaurantStore } from "./RestaurantStore";
import { RegisterStore } from "./RegisterStore";

export const RootStore = types
  .model("RootStore", {
    userStore: UserStore,
    loginStore: LoginStore,
    registerStore: RegisterStore,
    restaurantStore: RestaurantStore,
  })
  .actions((self) => ({
    afterCreate() {
      self.userStore.checkAuth();
    },
  }));
