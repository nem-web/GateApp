"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { AIPanel } from "@/components/ai-panel";
import { GATE_SUBJECTS } from "@/lib/constants";

function SortItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      suppressHydrationWarning
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="rounded border p-2 text-sm"
    >
      {id}
    </div>
  );
}

export default function StudyPlanPage() {
  const [items, setItems] = useState(["Maths - 8AM", "Algorithms - 10AM", "OS - 2PM"]);
  const [seconds, setSeconds] = useState(1500);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("22:00");
  const [fullDayFree, setFullDayFree] = useState(false);
  const [studyStyle, setStudyStyle] = useState("Balanced");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Engineering Mathematics", "Algorithms"]);

  const selectedSubjectSummary = selectedSubjects.length ? selectedSubjects.join(", ") : "No subjects selected";
  const reschedulePayload = useMemo(
    () => ({
      missed: items,
      fullDayFree,
      startTime,
      endTime,
      hoursPerDay,
      selectedSubjects,
      studyStyle,
    }),
    [endTime, fullDayFree, hoursPerDay, items, selectedSubjects, startTime, studyStyle],
  );

  function toggleSubject(subject: string) {
    setSelectedSubjects((current) =>
      current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject],
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Study Plan & Timetable</h1>
      <div className="card space-y-4">
        <div>
          <h2 className="font-semibold">Reschedule preferences</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            These values are sent with the AI reschedule request: {hoursPerDay}h/day, {startTime}-{endTime},{" "}
            {fullDayFree ? "full day free" : "normal day"}, {studyStyle.toLowerCase()} style.
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Request preview: subjects [{selectedSubjectSummary}], missed sessions [{items.join(", ")}].
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2 text-sm">
            <span className="font-medium">Time of study per day: {hoursPerDay}h</span>
            <input
              type="range"
              min={1}
              max={12}
              value={hoursPerDay}
              onChange={(event) => setHoursPerDay(Number(event.target.value))}
              onInput={(event) => setHoursPerDay(Number(event.currentTarget.value))}
              className="w-full accent-brand"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Starting time</span>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              onInput={(event) => setStartTime(event.currentTarget.value)}
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Stop by</span>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              onInput={(event) => setEndTime(event.currentTarget.value)}
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
            <input
              type="checkbox"
              checked={fullDayFree}
              onChange={(event) => setFullDayFree(event.target.checked)}
              className="accent-brand"
            />
            Full day free
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <p className="mb-2 text-sm font-medium">Selected subjects</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {GATE_SUBJECTS.map((subject) => (
                <label key={subject} className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="accent-brand"
                  />
                  {subject}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Current focus: {selectedSubjectSummary}</p>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Study style</span>
            <select
              value={studyStyle}
              onChange={(event) => setStudyStyle(event.target.value)}
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            >
              <option>Light</option>
              <option>Balanced</option>
              <option>Heavy</option>
            </select>
          </label>
        </div>
      </div>

      <AIPanel
        title="Generate Weekly Plan"
        endpoint="/api/ai/study-plan"
        payload={{
          gateDate: "2027-02-01",
          weak: selectedSubjects,
          hoursPerDay,
          startTime,
          endTime,
          fullDayFree,
          studyStyle,
        }}
      />
      <div className="card">
        <h2 className="mb-2 font-semibold">Drag & Drop Sessions</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={(ev) => {
          const { active, over } = ev;
          if (!over || active.id === over.id) return;
          const oldIdx = items.indexOf(active.id as string);
          const newIdx = items.indexOf(over.id as string);
          setItems(arrayMove(items, oldIdx, newIdx));
        }}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">{items.map((i) => <SortItem key={i} id={i} />)}</div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="card">
        <h2 className="mb-2 font-semibold">Pomodoro</h2>
        <p className="text-2xl">{Math.floor(seconds / 60)}:{`${seconds % 60}`.padStart(2, "0")}</p>
        <div className="mt-2 flex gap-2">
          <button className="rounded bg-brand px-3 py-1 text-xs text-white" onClick={() => setSeconds((s) => Math.max(0, s - 60))}>-1 min</button>
          <button className="rounded border px-3 py-1 text-xs" onClick={() => setSeconds(1500)}>Reset</button>
        </div>
      </div>
      <AIPanel title="Reschedule Missed Sessions" endpoint="/api/ai/reschedule" payload={reschedulePayload} />
    </div>
  );
}
