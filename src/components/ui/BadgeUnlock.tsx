"use client";
import { useEffect, useState } from "react";

interface BadgeUnlockProps {
  emoji: string;
  description: string;
}

export function BadgeUnlock({ emoji, description }: BadgeUnlockProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-bounce-in pointer-events-auto">
        <div className="bg-mustard-yellow/20 border-4 border-mustard-yellow rounded-[12px] p-8 shadow-[8px_8px_0px_rgba(45,49,66,0.3)] backdrop-blur-sm">
          <div className="text-center">
            <div className="text-7xl mb-4 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
              {emoji}
            </div>
            <h3 className="heading-3 mb-2 text-mustard-yellow">Badge Unlocked!</h3>
            <p className="text-foreground font-medium">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
