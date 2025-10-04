"use client";
import { useEffect, useState } from "react";

const COLORS = [
  "#84A98C", // sage green
  "#B4A7D6", // soft lavender
  "#F4978E", // warm coral
  "#F2CC8F", // mustard yellow
  "#81B29A", // mint green
];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
}

export function useConfetti() {
  const [show, setShow] = useState(false);

  const celebrate = () => {
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  return { celebrate, show };
}

export function ConfettiCanvas({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
      setPieces(newPieces);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 w-2 h-2 animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
