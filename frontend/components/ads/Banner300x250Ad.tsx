"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    atOptions: any;
  }
}

export default function Banner300x250Ad() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.innerHTML = "";

    window.atOptions = {
      key: "b889b6c3b3c977596c7bc2d22d58a69d",
      format: "iframe",
      width: 300,
      height: 250,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "//contributionhobblenewlywed.com/b889b6c3b3c977596c7bc2d22d58a69d/invoke.js";
    script.async = true;

    adRef.current.appendChild(script);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div
        ref={adRef}
        style={{
          width: 300,
          height: 250,
        }}
      />
    </div>
  );
}