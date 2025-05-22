import { RootStore } from "./RootStore";

export const store = RootStore.create({
  userStore: {},
  loginStore: {},
  registerStore: {},
  restaurantStore: {
    restaurants: [],
  },
  bookingStore: {},
});
