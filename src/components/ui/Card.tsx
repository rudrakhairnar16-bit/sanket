"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "spatial" | "bento";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", variant = "glass", hover = false, onClick }: CardProps) {
  const variants = {
    glass: "glass-card",
    spatial: "spatial-card",
    bento: "bento-card",
  };

  return (
    <div
      className={`${variants[variant]} ${hover ? "cursor-pointer hover:bg-white/8 hover:border-white/15 hover:shadow-lg hover:shadow-black/20" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
