"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { sanitizeSupabaseStorage } from "@/lib/supabase/cleanup";
import Button from "@/components/ui/Button";

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sanitizeSupabaseStorage();
  }, []);

  const signInWithGitHub = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabaseBrowser().auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) console.error("OAuth error:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-20">
        {/* Floating Shapes Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-soft-lavender/20 rounded-full blur-2xl animate-float" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-sage-green/20 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-warm-coral/20 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-mustard-yellow/20 rounded-full blur-2xl animate-float-delayed" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="heading-display mb-6">
              TaskNest
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-8">
              Tidy teamwork: projects, tasks, and wellness in one place. Built for student teams who want to stay organized without the corporate overhead.
            </p>
            <Button
              size="lg"
              onClick={signInWithGitHub}
              loading={loading}
              className="text-lg px-8 py-4"
            >
              Sign in with GitHub
            </Button>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-20">
            {/* Large Card - Tasks */}
            <div className="md:col-span-2 md:row-span-2 bg-surface border-2 border-border rounded-[12px] p-8 shadow-[6px_6px_0px_rgba(45,49,66,0.15)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-sage-green/20 rounded-[8px] border-2 border-sage-green/40">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-green">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div>
                  <h3 className="heading-3 mb-2">Shared Task Management</h3>
                  <p className="text-muted">Create tasks, assign teammates, set deadlines. Filter by milestone, status, or assignee. Comments with @mentions keep everyone in the loop.</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-[6px] border-l-4 border-sage-green">
                  <div className="w-4 h-4 rounded-full bg-sage-green" />
                  <span className="text-sm font-medium flex-1">Design mockups</span>
                  <span className="text-xs text-muted">Due today</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-[6px] border-l-4 border-warm-gray-300">
                  <div className="w-4 h-4 rounded-full border-2 border-warm-gray-400" />
                  <span className="text-sm font-medium flex-1">User research</span>
                  <span className="text-xs text-muted">This week</span>
                </div>
              </div>
            </div>

            {/* Wellness Card */}
            <div className="bg-surface border-2 border-border rounded-[12px] p-6 shadow-[4px_4px_0px_rgba(45,49,66,0.15)]">
              <div className="p-3 bg-soft-lavender/20 rounded-[8px] border-2 border-soft-lavender/40 w-fit mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-soft-lavender">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">Wellness Check-ins</h3>
              <p className="text-muted text-sm">Daily mood tracking with private notes. See your team&apos;s pulse without compromising privacy.</p>
            </div>

            {/* Gamification Card */}
            <div className="bg-surface border-2 border-border rounded-[12px] p-6 shadow-[4px_4px_0px_rgba(45,49,66,0.15)]">
              <div className="p-3 bg-warm-coral/20 rounded-[8px] border-2 border-warm-coral/40 w-fit mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warm-coral">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">Streaks & Badges</h3>
              <p className="text-muted text-sm">Build momentum with daily check-ins and on-time completions. Unlock achievements as you go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted">
          <p>Built for student teams. Not a mental-health service — just a tool to help you stay organized.</p>
        </div>
      </footer>
    </div>
  );
}
