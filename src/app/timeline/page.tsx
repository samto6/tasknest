"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { getPersonalTimeline, TimelineData } from "@/server-actions/timeline";
import TimelineNav from "@/components/timeline/TimelineNav";

// Lazy load heavy timeline components for better performance
const CalendarGrid = lazy(() => import("@/components/timeline/CalendarGrid"));
const GanttChart = lazy(() => import("@/components/timeline/GanttChart"));
const WeeklyBreakdown = lazy(() => import("@/components/timeline/WeeklyBreakdown"));
const TaskEditModal = lazy(() => import("@/components/timeline/TaskEditModal"));

type View = "calendar" | "gantt" | "weekly";

// Loading skeleton for timeline views
function TimelineLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-surface rounded-lg w-full"></div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-24 bg-surface rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export default function PersonalTimelinePage() {
  const [currentView, setCurrentView] = useState<View>("weekly");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-switch from Gantt to Weekly on mobile
  useEffect(() => {
    if (isMobile && currentView === "gantt") {
      setCurrentView("weekly");
    }
  }, [isMobile, currentView]);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        setIsLoading(true);
        const data = await getPersonalTimeline();
        setTimelineData(data);
      } catch (error) {
        console.error("Failed to load timeline:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-surface rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted">Failed to load timeline data.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 mb-2">My Timeline</h1>
          <p className="text-muted">
            All your tasks and milestones across all projects
          </p>
        </div>

        {/* Stats Summary */}
        {timelineData.tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-surface rounded-[8px] border-2 border-border">
              <div className="text-2xl font-bold text-sage-green">
                {timelineData.tasks.length}
              </div>
              <div className="text-sm text-muted">Total Tasks</div>
            </div>
            <div className="p-4 bg-surface rounded-[8px] border-2 border-border">
              <div className="text-2xl font-bold text-warm-coral">
                {timelineData.tasks.filter((t) => t.status === "in_progress").length}
              </div>
              <div className="text-sm text-muted">In Progress</div>
            </div>
            <div className="p-4 bg-surface rounded-[8px] border-2 border-border">
              <div className="text-2xl font-bold text-soft-lavender">
                {timelineData.tasks.filter((t) => t.status === "done").length}
              </div>
              <div className="text-sm text-muted">Completed</div>
            </div>
            <div className="p-4 bg-surface rounded-[8px] border-2 border-border">
              <div className="text-2xl font-bold text-foreground">
                {timelineData.milestones.length}
              </div>
              <div className="text-sm text-muted">Milestones</div>
            </div>
          </div>
        )}

        {/* View Tabs */}
        <TimelineNav currentView={currentView} onViewChange={setCurrentView} />

        {/* Timeline Views */}
        <Suspense fallback={<TimelineLoadingSkeleton />}>
          {currentView === "calendar" && (
            <CalendarGrid
              tasks={timelineData.tasks}
              milestones={timelineData.milestones}
              onTaskClick={handleTaskClick}
            />
          )}

          {currentView === "gantt" && (
            <GanttChart
              tasks={timelineData.tasks}
              milestones={timelineData.milestones}
              onTaskClick={handleTaskClick}
            />
          )}

          {currentView === "weekly" && (
            <WeeklyBreakdown
              tasks={timelineData.tasks}
              milestones={timelineData.milestones}
              onTaskClick={handleTaskClick}
            />
          )}
        </Suspense>

        {/* Task Edit Modal */}
        <Suspense fallback={null}>
          <TaskEditModal
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={() => {
              // Refetch timeline data after update
              getPersonalTimeline().then(setTimelineData);
            }}
          />
        </Suspense>
      </div>
    </main>
  );
}
