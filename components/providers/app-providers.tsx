"use client";

import { Toaster } from "react-hot-toast";
import { InteractionEffects } from "@/components/effects/interaction-effects";
import { NoiseOverlay } from "@/components/effects/noise-overlay";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <ScrollProgress />
        <NoiseOverlay />
        <InteractionEffects />
        {children}
        <Toaster
          position="bottom-right"
          gutter={12}
          toastOptions={{
            className: "codesentinel-toast",
            duration: 4200,
          }}
        />
      </SmoothScroll>
    </ThemeProvider>
  );
}
