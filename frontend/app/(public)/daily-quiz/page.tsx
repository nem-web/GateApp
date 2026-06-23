import React from "react";
import ComingSoon from "@/components/ComingSoon";

export default function DailyQuizComingSoonPage() {
  return (
    <ComingSoon 
      title={
        <>
          Daily GATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#818CF8]">Quiz</span>
        </>
      }
      description="We are building an interactive daily challenge system. Soon, you'll be able to answer 5 curated questions daily, maintain streaks, earn XP, and climb the global leaderboards."
      backUrl="/"
      backText="Back to Home"
    />
  );
}