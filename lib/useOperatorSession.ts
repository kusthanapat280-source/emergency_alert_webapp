"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOperatorSessionValid, refreshOperatorSession, clearOperatorSession } from "./operatorSession";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

export function useOperatorSession() {
  const router = useRouter();

  useEffect(() => {
    if (!isOperatorSessionValid()) {
      clearOperatorSession();
      router.replace("/operator_login");
      return;
    }

    const handleActivity = () => refreshOperatorSession();
    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, handleActivity, { passive: true })
    );

    const interval = setInterval(() => {
      if (!isOperatorSessionValid()) {
        clearOperatorSession();
        router.replace("/operator_login");
      }
    }, 30_000);

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, handleActivity));
      clearInterval(interval);
    };
  }, [router]);
}
