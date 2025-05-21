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

      const isGuestRoute = pathname === "/" || pathname === "/register";

      if (userStore.user && isGuestRoute) {
        router.replace("/user/restaurants");
      }

      if (!userStore.user && pathname !== "/" && pathname !== "/register") {
        router.replace("/");
      }
    };

    check();
  }, []);

  return {
    authReady: authChecked && userStore.authInitialized && !userStore.loading,
  };
}
