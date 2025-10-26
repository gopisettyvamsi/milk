// components/RazorpayScriptLoader.tsx
"use client";

import { useEffect } from "react";

export default function RazorpayScriptLoader() {
  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById("razorpay-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}