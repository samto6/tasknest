"use client";
import { useState } from "react";

const moods = [
  { value: 1, emoji: "😢", label: "Very Bad", color: "dusty-rose" },
  { value: 2, emoji: "😕", label: "Bad", color: "warm-gray-400" },
  { value: 3, emoji: "😐", label: "Okay", color: "mustard-yellow" },
  { value: 4, emoji: "🙂", label: "Good", color: "sage-green" },
  { value: 5, emoji: "😄", label: "Great", color: "mint-green" },
];

export default function MoodSelector() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <input type="hidden" name="mood" value={selected ?? ""} required />

      <div className="grid grid-cols-5 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => setSelected(mood.value)}
            className={`
              group
              flex flex-col items-center justify-center
              p-4 rounded-[8px]
              border-2 transition-all duration-200
              ${
                selected === mood.value
                  ? `border-${mood.color} bg-${mood.color}/10 shadow-[4px_4px_0px_var(--color-${mood.color})]`
                  : "border-border hover:border-muted"
              }
            `}
          >
            <div
              className={`text-4xl mb-2 transition-transform duration-200 ${
                selected === mood.value ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              {mood.emoji}
            </div>
            <div className="text-xs font-medium text-center">{mood.label}</div>
          </button>
        ))}
      </div>

      {selected === null && (
        <p className="text-sm text-muted text-center">Select your mood to continue</p>
      )}
    </div>
  );
}
