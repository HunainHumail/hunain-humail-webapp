"use client";

import { useEffect, useState } from "react";
import {
  AVATAR_FLIP_INTERVAL_MS,
  avatarFlipFaces,
  type AvatarFlipFaces,
} from "@/lib/utils/avatarFlip";

export interface UseAvatarFlipOptions {
  reducedMotion: boolean;
  paused: boolean;
}

export interface UseAvatarFlipResult extends AvatarFlipFaces {
  canFlip: boolean;
}

export function useAvatarFlip(
  count: number,
  { reducedMotion, paused }: UseAvatarFlipOptions,
): UseAvatarFlipResult {
  const canFlip = count >= 2 && !reducedMotion;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!canFlip || paused) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setStep((current) => current + 1);
    }, AVATAR_FLIP_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
    };
  }, [canFlip, paused]);

  return {
    canFlip,
    ...avatarFlipFaces(canFlip ? step : 0, count),
  };
}
