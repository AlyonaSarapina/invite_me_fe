"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/stores/context";
import { autorun } from "mobx";

export function useRequireAuth() {
  const { userStore } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    userStore.checkAuth();
  }, []);

  useEffect(() => {
    const dispose = autorun(() => {
      if (userStore.authInitialized && !userStore.user && pathname !== "/") {
        router.replace("/");
      }
    });

    return () => dispose();
  }, [pathname, userStore]);

  return {
    authReady: userStore.authInitialized && !userStore.loading,
  };
}
