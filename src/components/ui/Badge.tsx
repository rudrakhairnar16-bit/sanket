import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "teal" | "green" | "red" | "blue" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    gold: "badge-gold",
    teal: "badge-teal",
    green: "badge-green",
    red: "badge-red",
    blue: "badge-blue",
    default: "badge bg-white/10 text-white/70 border border-white/10",
  };

  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}
