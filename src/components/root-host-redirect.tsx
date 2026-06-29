"use client";

import { useEffect } from "react";

const CAR_SUBDOMAIN = "car.coinoriginal.shop";
const CAR_TARGET_PATH = "/car";

export function RootHostRedirect() {
  useEffect(() => {
    if (window.location.hostname === CAR_SUBDOMAIN && window.location.pathname === "/") {
      window.location.replace(`${window.location.origin}${CAR_TARGET_PATH}`);
    }
  }, []);

  return null;
}
