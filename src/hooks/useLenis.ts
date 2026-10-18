"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useLenis(): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let destroyed = false;
    let lenisInstance: InstanceType<
      Awaited<typeof import("lenis")>["default"]
    > | null = null;
    let onTick: ((time: number) => void) | null = null;
    let gsapRef: typeof import("gsap").gsap | null = null;

    const init = async () => {
      const [lenisModule, scrollTriggerModule, gsapModule] = await Promise.all([
        import("lenis"),
        import("gsap/ScrollTrigger"),
        import("gsap"),
        import("lenis/dist/lenis.css"),
      ]);
      const Lenis = lenisModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      const gsap = gsapModule.default;

      if (destroyed) {
        return;
      }

      gsapRef = gsap;
      gsap.registerPlugin(ScrollTrigger);

      lenisInstance = new Lenis({
        autoRaf: false,
      });

      lenisInstance.on("scroll", ScrollTrigger.update);

      onTick = (time: number) => {
        lenisInstance?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    };

    void init();

    return () => {
      destroyed = true;
      if (onTick && gsapRef) {
        gsapRef.ticker.remove(onTick);
      }
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, [reducedMotion]);
}
