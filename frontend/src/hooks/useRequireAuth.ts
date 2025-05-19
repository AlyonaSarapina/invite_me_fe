"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/stores/context";

export function useRequireAuth() {
  const { userStore } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const check = async () => {
      await userStore.checkAuth(true);
      setAuthChecked(true);

      if (!userStore.user && pathname !== "/") {
        router.replace("/");
      }

      if (pathname === "/" && userStore.user) {
        router.replace("/user/restaurants");
      }
    };

    check();
  }, []);

  return {
    authReady: authChecked && userStore.authInitialized && !userStore.loading,
  };
}
