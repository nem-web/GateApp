"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    atOptions: any;
  }
}

export default function Inline468Ad() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.innerHTML = "";

    window.atOptions = {
      key: "a0d1b9295af4b0aab80fcf495112b7f8",
      format: "iframe",
      width: 468,
      height: 60,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "//contributionhobblenewlywed.com/a0d1b9295af4b0aab80fcf495112b7f8/invoke.js";
    script.async = true;

    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center">
      <div ref={adRef} style={{ width: 468, height: 60 }} />
    </div>
  );
}
