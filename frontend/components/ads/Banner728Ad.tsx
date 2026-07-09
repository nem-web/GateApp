"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    atOptions: any;
  }
}

export default function Banner728Ad() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.innerHTML = "";

    window.atOptions = {
      key: "9f8880a9717ff5e14681c714501202b5",
      format: "iframe",
      width: 728,
      height: 90,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "//contributionhobblenewlywed.com/9f8880a9717ff5e14681c714501202b5/invoke.js";
    script.async = true;

    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center">
      <div
        ref={adRef}
        style={{
          width: 728,
          height: 90,
        }}
      />
    </div>
  );
}