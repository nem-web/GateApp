"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [gateDate, setGateDate] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [weakSubjects, setWeakSubjects] = useState("Graph Theory, TOC");
  return (
    <div className="mx-auto max-w-xl space-y-3">
      <h1 className="text-2xl font-bold">Onboarding</h1>
      <input type="date" className="w-full rounded border px-3 py-2" value={gateDate} onChange={(e) => setGateDate(e.target.value)} />
      <input className="w-full rounded border px-3 py-2" value={branch} onChange={(e) => setBranch(e.target.value)} />
      <input type="number" className="w-full rounded border px-3 py-2" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} />
      <input className="w-full rounded border px-3 py-2" value={weakSubjects} onChange={(e) => setWeakSubjects(e.target.value)} />
      <button className="rounded bg-brand px-4 py-2 text-white" onClick={() => toast.success("Preferences saved")}>Save Preferences</button>
    </div>
  );
}
