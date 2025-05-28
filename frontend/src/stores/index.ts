import { RootStore } from "./RootStore";

let store: ReturnType<typeof RootStore.create> | null = null;

export function initializeStore() {
  if (store) return store;

  store = RootStore.create({
    userStore: {},
    loginStore: {},
    registerStore: {},
    restaurantStore: {},
    bookingStore: {},
    tableStore: {},
  });

  return store;
}
