"use client";
import { useTransition } from "react";
import { checkIn } from "@/server-actions/wellness";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import MoodSelector from "./MoodSelector";
import { ConfettiCanvas, useConfetti } from "@/components/ui/Confetti";

export default function CheckInForm() {
  const [isPending, startTransition] = useTransition();
  const { celebrate, show } = useConfetti();

  async function handleSubmit(form: FormData) {
    const mood = Number(form.get("mood"));
    const note = (form.get("note") as string | null) ?? undefined;

    if (![1, 2, 3, 4, 5].includes(mood)) {
      alert("Please select a mood");
      return;
    }

    startTransition(async () => {
      await checkIn(mood as 1 | 2 | 3 | 4 | 5, note);
      celebrate();
    });
  }

  return (
    <>
      <form action={handleSubmit} className="space-y-6">
        <MoodSelector />

        <Textarea
          name="note"
          label="Private Note (Optional)"
          placeholder="Add a private note about your day..."
          rows={4}
          hint="This note is private and only visible to you"
        />

        <Button type="submit" size="lg" className="w-full" loading={isPending}>
          Complete Check-in
        </Button>
      </form>

      <ConfettiCanvas show={show} />
    </>
  );
}
