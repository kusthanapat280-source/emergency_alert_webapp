"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminSessionValid, refreshAdminSession, clearAdminSession } from "./adminSession";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

export function useAdminSession() {
  const router = useRouter();

  useEffect(() => {
    // Guard on mount
    if (!isAdminSessionValid()) {
      clearAdminSession();
      router.replace("/login_admin");
      return;
    }

    // Refresh session on any user activity
    const handleActivity = () => refreshAdminSession();
    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, handleActivity, { passive: true })
    );

    // Check expiry every 30 seconds
    const interval = setInterval(() => {
      if (!isAdminSessionValid()) {
        clearAdminSession();
        router.replace("/login_admin");
      }
    }, 30_000);

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, handleActivity));
      clearInterval(interval);
    };
  }, [router]);
}
