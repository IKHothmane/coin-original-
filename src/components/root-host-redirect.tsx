"use client";

import { useEffect } from "react";

const CAR_SUBDOMAIN = "car.coinoriginal.shop";
const CAR_TARGET_URL = "https://coinoriginal.shop/car";

export function RootHostRedirect() {
  useEffect(() => {
    if (window.location.hostname === CAR_SUBDOMAIN) {
      window.location.replace(CAR_TARGET_URL);
    }
  }, []);

  return null;
}
