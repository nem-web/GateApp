"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Clarity.init("xbf8ke4e60");
    }
  }, []);

  return null;
}