"use client";

import { Component, Suspense, useRef, useMemo } from "react";
import type { ReactNode, ErrorInfo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

/* Lazy-load the heavy R3F canvas to keep initial JS bundle small */
const CarScene = dynamic(() => import("./CarScene"), { ssr: false });

/* Catch WebGL / Three.js crashes so the rest of the page still renders */
class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(_: Error, info: ErrorInfo) {
    console.warn("3D scene failed to load:", info);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.12], [0, -50]);
  const sweepX = useTransform(scrollYProgress, [0, 0.8], ["-100%", "200%"]);
  const statsOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.5, 0.65], [25, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-luxury-black">
        {/* ── Background ── */}
        <div className="absolute inset-0 bg-luxury-black" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-gold/[0.06] blur-[160px]" />

        {/* ── 3D Car (R3F Canvas) ── */}
        <div className="absolute inset-0 z-[5]">
          <SceneErrorBoundary>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="h-[2px] w-32 overflow-hidden rounded-full bg-foreground/[0.06]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold/30 to-gold/50"
                      animate={{ width: ["0%", "70%", "90%", "70%"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              }
            >
              <CarScene scrollProgress={scrollYProgress} />
            </Suspense>
          </SceneErrorBoundary>
        </div>

        {/* ── Cinematic overlays ── */}
        <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-luxury-black/80 via-luxury-black/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-luxury-black/70 via-luxury-black/30 to-transparent z-10 pointer-events-none" />
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--app-bg-primary)/0.5_100%)]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, var(--app-bg-primary) 100%)",
          }}
        />

        {/* Light sweep reflection */}
        <motion.div className="absolute inset-0 z-[12] pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-0 bottom-0 w-[300px]"
            style={{
              left: sweepX,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.025), rgba(37,99,235,0.015), transparent)",
              filter: "blur(50px)",
            }}
          />
        </motion.div>

        {/* Floor reflection line */}
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-gold/[0.06] to-transparent z-10" />

        {/* ── Content ── */}
        <div className="relative z-20 flex h-full flex-col items-center pointer-events-none">
          {/* Hero text + CTA */}
          <motion.div
            className="flex flex-col items-center pt-[12vh] sm:pt-[14vh] px-4 pointer-events-auto"
            style={{ opacity: textOpacity, y: textY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.05] px-5 py-2 backdrop-blur-md"
            >
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gold/80">
                Miami&apos;s Premium Mobile Detailing
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="text-foreground">The Art of</span>
              <br />
              <span className="text-gradient-gold">Pristine.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-5 max-w-md text-center text-sm sm:text-base text-foreground/40 leading-relaxed"
            >
              Luxury mobile car wash and detailing, delivered to your door.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.15)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:bg-gold/90"
              >
                Book Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/[0.03] px-7 py-3.5 text-sm font-medium text-foreground/70 backdrop-blur-sm transition-all duration-300 hover:border-gold/20 hover:bg-foreground/[0.06] hover:text-foreground"
              >
                View Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats reveal on scroll */}
          <motion.div
            className="mt-auto mb-[8%] px-4 pointer-events-auto"
            style={{ opacity: statsOpacity, y: statsY }}
          >
            <div className="mx-auto flex items-center justify-center gap-10 sm:gap-14">
              {[
                { value: "500+", label: "Clients" },
                { value: "4.9\u2605", label: "Rating" },
                { value: "2K+", label: "Detailed" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold text-foreground sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-foreground/25">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ opacity: textOpacity }}
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/15">
              Scroll
            </span>
            <motion.div
              className="w-[1px] h-7 bg-gradient-to-b from-gold/30 to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
