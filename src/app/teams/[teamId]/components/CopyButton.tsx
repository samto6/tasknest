"use client";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui";

export default function CopyButton({ text }: { text: string }) {
  const { showToast } = useToast();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          showToast("Copied to clipboard!", "success");
        } catch {
          showToast("Failed to copy", "error");
        }
      }}
    >
      Copy
    </Button>
  );
}
