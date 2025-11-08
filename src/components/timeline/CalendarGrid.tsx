"use client";
import { useState } from "react";
import { TimelineTask, TimelineMilestone } from "@/server-actions/timeline";
import Button from "@/components/ui/Button";

type DayData = {
  date: Date;
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
  isCurrentMonth: boolean;
  isToday: boolean;
};

function getDaysInMonth(year: number, month: number): DayData[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = firstDay.getDay();

  // Get days from previous month to fill the first week
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = startDayOfWeek;

  const days: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Previous month days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date,
      tasks: [],
      milestones: [],
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      tasks: [],
      milestones: [],
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    });
  }

  // Next month days to complete the grid (6 weeks)
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      tasks: [],
      milestones: [],
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
    });
  }

  return days;
}

function addTasksToDays(
  days: DayData[],
  tasks: TimelineTask[],
  milestones: TimelineMilestone[]
): DayData[] {
  const dayMap = new Map<string, DayData>();

  days.forEach((day) => {
    const key = day.date.toDateString();
    dayMap.set(key, day);
  });

  // Add tasks to their due dates
  tasks.forEach((task) => {
    if (!task.due_at) return;
    const dueDate = new Date(task.due_at);
    dueDate.setHours(0, 0, 0, 0);
    const key = dueDate.toDateString();
    if (dayMap.has(key)) {
      dayMap.get(key)!.tasks.push(task);
    }
  });

  // Add milestones to their due dates
  milestones.forEach((milestone) => {
    if (!milestone.due_at) return;
    const dueDate = new Date(milestone.due_at);
    dueDate.setHours(0, 0, 0, 0);
    const key = dueDate.toDateString();
    if (dayMap.has(key)) {
      dayMap.get(key)!.milestones.push(milestone);
    }
  });

  return days;
}

type Props = {
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
  onTaskClick?: (taskId: string) => void;
};

export default function CalendarGrid({ tasks, milestones, onTaskClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  let days = getDaysInMonth(year, month);
  days = addTasksToDays(days, tasks, milestones);

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={goToToday} variant="secondary" size="sm" className="flex-1 sm:flex-initial">
            Today
          </Button>
          <Button onClick={goToPreviousMonth} variant="secondary" size="sm" className="flex-1 sm:flex-initial">
            <span className="hidden sm:inline">← Prev</span>
            <span className="sm:hidden">←</span>
          </Button>
          <Button onClick={goToNextMonth} variant="secondary" size="sm" className="flex-1 sm:flex-initial">
            <span className="hidden sm:inline">Next →</span>
            <span className="sm:hidden">→</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border-2 border-border rounded-[8px] overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 bg-surface">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 md:p-3 text-center text-xs md:text-sm font-medium border-b border-r border-border last:border-r-0"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const hasItems = day.tasks.length > 0 || day.milestones.length > 0;

            return (
              <div
                key={index}
                className={`min-h-[80px] md:min-h-[120px] p-1.5 md:p-2 border-b border-r border-border last:border-r-0 ${
                  !day.isCurrentMonth ? "bg-surface/50" : "bg-background"
                } ${
                  day.isToday ? "bg-sage-green/5 border-sage-green border-2" : ""
                }`}
              >
                <div
                  className={`text-xs md:text-sm mb-1 md:mb-2 ${
                    day.isToday
                      ? "font-bold text-sage-green"
                      : day.isCurrentMonth
                      ? "font-medium"
                      : "text-muted"
                  }`}
                >
                  {day.date.getDate()}
                </div>

                {hasItems && (
                  <div className="space-y-1">
                    {/* Milestones */}
                    {day.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="text-[10px] md:text-xs px-1.5 md:px-2 py-1 md:py-1.5 bg-soft-lavender/20 text-soft-lavender rounded-[4px] truncate border border-soft-lavender/30 min-h-[28px] md:min-h-[32px] flex items-center"
                        title={milestone.title}
                      >
                        <span className="hidden sm:inline">🎯 </span>{milestone.title}
                      </div>
                    ))}

                    {/* Tasks - show only 2 on mobile, 3 on desktop */}
                    {day.tasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick?.(task.id)}
                        className={`text-[10px] md:text-xs px-1.5 md:px-2 py-1 md:py-1.5 rounded-[4px] truncate cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px] flex items-center ${
                          task.status === "done"
                            ? "bg-sage-green/20 text-sage-green border border-sage-green/30"
                            : task.status === "in_progress"
                            ? "bg-warm-coral/20 text-warm-coral border border-warm-coral/30"
                            : "bg-surface text-foreground border border-border"
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}

                    {/* Hidden third task on mobile */}
                    <div className="hidden md:block">
                      {day.tasks.length > 2 && day.tasks[2] && (
                        <div
                          onClick={() => onTaskClick?.(day.tasks[2].id)}
                          className={`text-xs px-2 py-1.5 rounded-[4px] truncate cursor-pointer hover:opacity-80 transition-opacity min-h-[32px] flex items-center ${
                            day.tasks[2].status === "done"
                              ? "bg-sage-green/20 text-sage-green border border-sage-green/30"
                              : day.tasks[2].status === "in_progress"
                              ? "bg-warm-coral/20 text-warm-coral border border-warm-coral/30"
                              : "bg-surface text-foreground border border-border"
                          }`}
                          title={day.tasks[2].title}
                        >
                          {day.tasks[2].title}
                        </div>
                      )}
                    </div>

                    {/* More indicator */}
                    {day.tasks.length > 2 && (
                      <div className="text-[10px] md:text-xs text-muted px-1.5 md:px-2">
                        <span className="md:hidden">+{day.tasks.length - 2}</span>
                        <span className="hidden md:inline">+{day.tasks.length > 3 ? day.tasks.length - 3 : 0}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-sage-green/20 border border-sage-green/30"></div>
          <span className="text-muted">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-warm-coral/20 border border-warm-coral/30"></div>
          <span className="text-muted">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-soft-lavender/20 border border-soft-lavender/30"></div>
          <span className="text-muted">Milestone</span>
        </div>
      </div>
    </div>
  );
}
