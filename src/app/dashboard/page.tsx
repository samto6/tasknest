import { createTeam } from "@/server-actions/teams";
import { redirect } from "next/navigation";
import Link from "next/link";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DashboardPage() {
  async function createTeamAndGo(form: FormData) {
    "use server";
    const teamId = await createTeam(form);
    redirect(`/teams/${teamId}`);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 mb-2">Dashboard</h1>
          <p className="text-muted">Your overview at a glance</p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Quick Actions - Tall Card */}
          <Card className="md:row-span-2">
            <CardTitle className="mb-4">Quick Actions</CardTitle>
            <div className="space-y-3">
              <Link
                href="/teams"
                className="flex items-center gap-3 p-3 bg-background rounded-[6px] border-2 border-transparent hover:border-sage-green transition-colors group"
              >
                <div className="p-2 bg-sage-green/20 rounded-[6px] group-hover:bg-sage-green/30 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-green">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">View Teams</div>
                  <div className="text-xs text-muted">Manage your projects</div>
                </div>
              </Link>

              <Link
                href="/wellness"
                className="flex items-center gap-3 p-3 bg-background rounded-[6px] border-2 border-transparent hover:border-soft-lavender transition-colors group"
              >
                <div className="p-2 bg-soft-lavender/20 rounded-[6px] group-hover:bg-soft-lavender/30 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-soft-lavender">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Daily Check-in</div>
                  <div className="text-xs text-muted">Track your wellness</div>
                </div>
              </Link>
            </div>
          </Card>

          {/* Streak Card */}
          <Card className="md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="mb-1">Current Streak</CardTitle>
                <CardDescription>Keep it going!</CardDescription>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-4xl font-bold text-warm-coral">0</div>
              <div className="text-muted">days</div>
            </div>
            <div className="mt-2 text-sm text-muted">Check in daily to build your streak</div>
          </Card>

          {/* My Tasks */}
          <Card className="md:col-span-2">
            <CardTitle className="mb-4">My Tasks This Week</CardTitle>
            <div className="space-y-2">
              <div className="text-sm text-muted text-center py-8">
                No tasks yet. Create a team and project to get started.
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card>
            <CardTitle className="mb-4">Badges</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center p-3 bg-background rounded-[6px] border-2 border-border opacity-50">
                <div className="text-2xl mb-1">🏅</div>
                <div className="text-xs text-center text-muted">7-day streak</div>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-background rounded-[6px] border-2 border-border opacity-50">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs text-center text-muted">30-day streak</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Create Team Section */}
        <Card>
          <CardTitle className="mb-4">Create a Team</CardTitle>
          <CardDescription className="mb-6">
            Start a new team to collaborate on projects
          </CardDescription>
          <form action={createTeamAndGo} className="flex gap-3">
            <Input
              name="name"
              placeholder="Enter team name"
              required
              className="flex-1"
            />
            <Button type="submit">
              Create Team
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
