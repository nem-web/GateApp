"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { AIPanel } from "@/components/ai-panel";

function SortItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners} className="rounded border p-2 text-sm">
      {id}
    </div>
  );
}

export default function StudyPlanPage() {
  const [items, setItems] = useState(["Maths - 8AM", "Algorithms - 10AM", "OS - 2PM"]);
  const [seconds, setSeconds] = useState(1500);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Study Plan & Timetable</h1>
      <AIPanel title="Generate Weekly Plan" endpoint="/api/ai/study-plan" payload={{ gateDate: "2027-02-01", weak: ["Graph Theory"] }} />
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
      <AIPanel title="Reschedule Missed Sessions" endpoint="/api/ai/reschedule" payload={{ missed: items }} />
    </div>
  );
}
