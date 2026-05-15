"use client";

import { useEffect, useRef } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

export function InteractionEffects() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || reducedMotion) return;

    const root = document.documentElement;
    const dotElement = dotRef.current;
    const ringElement = ringRef.current;
    const spotlightElement = spotlightRef.current;

    if (!dotElement || !ringElement || !spotlightElement) return;

    const cursorDot = dotElement;
    const cursorRing = ringElement;
    const cursorSpotlight = spotlightElement;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isDown = false;
    let frameId = 0;
    let activeMagnetic: HTMLElement | null = null;
    let activeTilt: HTMLElement | null = null;

    root.classList.add("cursor-enabled");

    function setCursorState(target: EventTarget | null) {
      const element = target instanceof Element ? target : null;
      const isCard = Boolean(
        element?.closest("[data-cursor-card], [data-tilt], .premium-card")
      );
      const isText = Boolean(
        element?.closest("p, h1, h2, h3, h4, h5, h6, blockquote, code, pre")
      );
      const isHover = Boolean(
        element?.closest("a, button, input, textarea, select, [role='button']")
      );

      root.classList.toggle("cursor-card", isCard);
      root.classList.toggle("cursor-text", !isCard && !isHover && isText);
      root.classList.toggle("cursor-hover", isHover);
    }

    function updateMagnetic(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const magnetic = target?.closest<HTMLElement>("[data-magnetic]") ?? null;

      if (activeMagnetic && activeMagnetic !== magnetic) {
        activeMagnetic.style.transform = "";
      }

      activeMagnetic = magnetic;

      if (!magnetic) return;

      const rect = magnetic.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);
      const x = clamp(offsetX * 0.35, -12, 12);
      const y = clamp(offsetY * 0.35, -12, 12);

      magnetic.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function updateTilt(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;

      if (activeTilt && activeTilt !== tilt) {
        activeTilt.style.transform = "";
        activeTilt.style.removeProperty("--tilt-x");
        activeTilt.style.removeProperty("--tilt-y");
      }

      activeTilt = tilt;

      if (!tilt) return;

      const rect = tilt.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -12;
      const rotateY = ((x / rect.width) - 0.5) * 12;

      tilt.style.setProperty("--tilt-x", `${(x / rect.width) * 100}%`);
      tilt.style.setProperty("--tilt-y", `${(y / rect.height) * 100}%`);
      tilt.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    }

    function onPointerMove(event: PointerEvent) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
      cursorSpotlight.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;

      root.classList.add("cursor-ready");
      setCursorState(event.target);
      updateMagnetic(event);
      updateTilt(event);
    }

    function onPointerDown() {
      isDown = true;
      root.classList.add("cursor-down");
    }

    function onPointerUp() {
      isDown = false;
      root.classList.remove("cursor-down");
    }

    function onPointerOut(event: PointerEvent) {
      const related = event.relatedTarget as Node | null;

      if (activeMagnetic && !activeMagnetic.contains(related)) {
        activeMagnetic.style.transform = "";
        activeMagnetic = null;
      }

      if (activeTilt && !activeTilt.contains(related)) {
        activeTilt.style.transform = "";
        activeTilt.style.removeProperty("--tilt-x");
        activeTilt.style.removeProperty("--tilt-y");
        activeTilt = null;
      }
    }

    function animate() {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0) scaleX(${
        isDown ? 0.7 : 1
      }) scaleY(${isDown ? 1.3 : 1})`;

      frameId = requestAnimationFrame(animate);
    }

    const reveals = Array.from(document.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    reveals.forEach((element) => observer.observe(element));
    frameId = requestAnimationFrame(animate);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointerout", onPointerOut);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      root.classList.remove(
        "cursor-enabled",
        "cursor-ready",
        "cursor-hover",
        "cursor-card",
        "cursor-text",
        "cursor-down"
      );
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <>
      <div ref={spotlightRef} className="spotlight" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className="cursor-label">view</span>
      </div>
    </>
  );
}
