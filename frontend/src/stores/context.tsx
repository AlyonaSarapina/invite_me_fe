import { createContext, useContext } from "react";
import { Instance } from "mobx-state-tree";
import { RootStore } from "./RootStore";

const StoreContext = createContext<Instance<typeof RootStore> | null>(null);

export const StoreProvider = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store: Instance<typeof RootStore>;
}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within a StoreProvider.");
  return store;
};
