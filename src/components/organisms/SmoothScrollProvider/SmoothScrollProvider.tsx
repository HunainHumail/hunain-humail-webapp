"use client";

import { type ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";

export interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useLenis();
  return children;
}
