import React from "react";
import ComingSoon from "@/components/ComingSoon";

export default function SubjectsComingSoonPage() {
  return (
    <ComingSoon 
      title={
        <>
          Subject-Wise <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#818CF8]">PYQs</span>
        </>
      }
      description="We are currently curating, verifying, and digitizing over 20 years of subject-wise GATE questions with detailed step-by-step solutions."
      backUrl="/pyq"
      backText="Back to PYQ Bank"
    />
  );
}