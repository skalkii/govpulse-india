"use client";

import { Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export interface WhatsAppShareProps {
  text: string;
  label?: string;
}

export function WhatsAppShare({ text, label = "Share on WhatsApp" }: WhatsAppShareProps) {
  const href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      <Share2 className="size-4" />
      {label}
    </a>
  );
}
