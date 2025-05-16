"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/context";

export function useAuthRedirect() {
  const { userStore } = useStore();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const check = async () => {
      await userStore.checkAuth();
      if (userStore.user) {
        router.replace("/user/restaurants");
      } else {
        setAuthChecked(true);
      }
    };
    check();
  }, []);

  return { authChecked };
}
