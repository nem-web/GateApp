import React from "react";
import ComingSoon2 from "@/components/ComingSoon2";

export default function MockTestsPage() {
  return (
    <div className="min-h-screen bg-[#0e0f14]">
      <ComingSoon2 
        title="Premium Mock Tests"
        description="We are building the most realistic GATE mock test environment with advanced analytics, AIR predictions, and detailed solutions. Stay tuned!"
        backLink="/"
        backText="Back to Home"
      />
    </div>
  );
}