import { createTeam, joinTeamByCode } from "@/server-actions/teams";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function TeamsPage() {
  async function createTeamAction(form: FormData) {
    "use server";
    await createTeam(form);
  }
  async function joinTeam(form: FormData) {
    "use server";
    const code = (form.get("code") as string | null)?.trim();
    if (!code) throw new Error("Code required");
    await joinTeamByCode(code);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 mb-2">Teams</h1>
          <p className="text-muted">Create a new team or join an existing one</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Team */}
          <Card>
            <div className="mb-6">
              <CardTitle className="mb-2">Create a Team</CardTitle>
              <CardDescription>
                Start a new team to collaborate on projects
              </CardDescription>
            </div>
            <form action={createTeamAction} className="space-y-4">
              <Input
                name="name"
                label="Team Name"
                placeholder="e.g., CS101 Final Project"
                required
              />
              <Button type="submit" className="w-full">
                Create Team
              </Button>
            </form>
          </Card>

          {/* Join Team */}
          <Card>
            <div className="mb-6">
              <CardTitle className="mb-2">Join by Invite Code</CardTitle>
              <CardDescription>
                Use an invite code shared by your teammates
              </CardDescription>
            </div>
            <form action={joinTeam} className="space-y-4">
              <Input
                name="code"
                label="Invite Code"
                placeholder="e.g., abcd1234"
                required
              />
              <Button type="submit" variant="secondary" className="w-full">
                Join Team
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
