import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-atlas-bg-secondary border border-atlas-border rounded-lg ${
        hover ? "hover:border-atlas-accent-emerald/30 hover:shadow-glow-emerald transition-all cursor-pointer" : ""
      } ${className}`}
      {...props}
    />
  );
}
