"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/context";

export function useAuthRedirect() {
  const { userStore } = useStore();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!userStore.authInitialized) {
      userStore.checkAuth().finally(() => {
        if (userStore.user) {
          setAuthChecked(true);
          router.replace("/user/restaurants");
        } else {
          setAuthChecked(true);
        }
      });
    } else {
      setAuthChecked(true);
    }
  }, []);

  return { authChecked };
}
