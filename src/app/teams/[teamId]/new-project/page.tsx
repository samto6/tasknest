import { createProjectFromTemplate } from "@/server-actions/projects";
import { redirect } from "next/navigation";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default async function NewProjectPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;

  async function action(form: FormData) {
    "use server";
    const name = String(form.get("name") || "").trim();
    const start = String(form.get("start") || "").trim();
    if (!name || !start) throw new Error("Missing fields");
    const projectId = await createProjectFromTemplate({ team_id: teamId, name, semester_start_date: start });
    redirect(`/projects/${projectId}/tasks`);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 mb-2">New Project</h1>
          <p className="text-muted">Create a project from a semester timeline template</p>
        </div>

        <Card>
          <CardTitle className="mb-2">Project Details</CardTitle>
          <CardDescription className="mb-6">
            The template will automatically generate milestones based on your semester timeline
          </CardDescription>

          <form action={action} className="space-y-6">
            <Input
              name="name"
              label="Project Name"
              placeholder="e.g., Final Project - Mobile App"
              required
            />

            <div>
              <label className="text-sm font-bold uppercase tracking-wide text-foreground mb-2 block">
                Semester Start Date
              </label>
              <input
                type="date"
                name="start"
                required
                className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-[8px] text-foreground transition-all duration-150 focus:border-sage-green focus:outline-none"
              />
              <p className="text-sm text-muted mt-1.5">
                Milestones will be calculated from this date
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Create Project from Template
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
