"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const MODEL_UID = "312ab6595d3e4ebd8ee1c18ff25fa048";
const EMBED_FALLBACK = `https://sketchfab.com/models/${MODEL_UID}/embed?autostart=1&autospin=0.12&transparent=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_help=0&ui_settings=0&ui_watermark_link=0&ui_watermark=0&ui_annotations=0&ui_hint=0&annotation_cycle=0&scrollwheel=0&camera=0&preload=1&dnt=1`;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const apiRef = useRef<any>(null);
  const startCam = useRef<{ position: number[]; target: number[] } | null>(
    null,
  );
  const endCam = useRef<{ position: number[]; target: number[] } | null>(null);
  const rafId = useRef(0);
  const prevT = useRef(-1);

  const [loaded, setLoaded] = useState(false);
  const [usingApi, setUsingApi] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll-driven transforms
  const textOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.12], [0, -50]);
  const sweepX = useTransform(scrollYProgress, [0, 0.8], ["-100%", "200%"]);
  const statsOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.5, 0.65], [25, 0]);

  // Initialize Sketchfab Viewer API
  const initViewer = useCallback(() => {
    const iframe = iframeRef.current;
    const SF = (window as any).Sketchfab;
    if (!iframe || !SF) return;

    const client = new SF(iframe);
    client.init(MODEL_UID, {
      success: (api: any) => {
        apiRef.current = api;
        api.start();
        api.addEventListener("viewerready", () => {
          setUsingApi(true);
          // Read default camera, then compute scroll rotation endpoints
          api.getCameraLookAt((_err: unknown, cam: any) => {
            if (!cam) {
              setLoaded(true);
              return;
            }
            startCam.current = {
              position: [...cam.position],
              target: [...cam.target],
            };
            // ~75° rotation around the target in the XZ plane
            const dx = cam.position[0] - cam.target[0];
            const dz = cam.position[2] - cam.target[2];
            const r = Math.sqrt(dx * dx + dz * dz);
            const a0 = Math.atan2(dz, dx);
            const a1 = a0 - Math.PI * 0.42;
            endCam.current = {
              position: [
                cam.target[0] + r * Math.cos(a1),
                cam.position[1] * 0.88,
                cam.target[2] + r * Math.sin(a1),
              ],
              target: [...cam.target],
            };
            setLoaded(true);
          });
        });
      },
      error: () => {
        // Fallback to embed URL
        if (iframeRef.current) {
          iframeRef.current.src = EMBED_FALLBACK;
          iframeRef.current.onload = () => setLoaded(true);
        }
      },
      autostart: 1,
      transparent: 1,
      ui_controls: 0,
      ui_infos: 0,
      ui_stop: 0,
      ui_inspector: 0,
      ui_help: 0,
      ui_settings: 0,
      ui_watermark_link: 0,
      ui_watermark: 0,
      ui_annotations: 0,
      ui_hint: 0,
      ui_color: "000000",
      annotation_cycle: 0,
      scrollwheel: 0,
      camera: 0,
      preload: 1,
      dnt: 1,
    });
  }, []);

  // Timeout fallback: if API doesn't load in 8s, use embed
  useEffect(() => {
    const id = setTimeout(() => {
      if (!loaded && iframeRef.current && !usingApi) {
        iframeRef.current.src = EMBED_FALLBACK;
        iframeRef.current.onload = () => setLoaded(true);
      }
    }, 8000);
    return () => clearTimeout(id);
  }, [loaded, usingApi]);

  // Scroll-driven camera rotation
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (p) => {
      if (!apiRef.current || !startCam.current || !endCam.current) return;
      // Map 0–60% scroll to full camera rotation
      const t = Math.min(Math.max(p / 0.6, 0), 1);
      if (Math.abs(t - prevT.current) < 0.005) return;
      prevT.current = t;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const s = startCam.current!;
        const e = endCam.current!;
        apiRef.current?.setCameraLookAt(
          s.position.map((v, i) => lerp(v, e.position[i], t)),
          s.target.map((v, i) => lerp(v, e.target[i], t)),
          0,
        );
      });
    });
    return () => {
      unsub();
      cancelAnimationFrame(rafId.current);
    };
  }, [scrollYProgress]);

  return (
    <>
      <Script
        src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"
        onLoad={initViewer}
        strategy="afterInteractive"
      />

      <div ref={containerRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#040404]">
          {/* ── Background ── */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#050505] to-[#030303]" />
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-gold/[0.02] blur-[160px]" />

          {/* ── 3D Car ── */}
          <div className="absolute inset-0 z-[5]">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="h-[2px] w-32 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold/30 to-gold/50"
                      animate={{ width: ["0%", "70%", "90%", "70%"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="BWash 3D Car"
              className="h-full w-full border-0"
              style={{
                opacity: loaded ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                pointerEvents: "none",
              }}
              allow="autoplay; fullscreen; xr-spatial-tracking"
            />
          </div>

          {/* ── Cinematic overlays ── */}
          <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 pointer-events-none" />
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
            }}
          />

          {/* Light sweep reflection */}
          <motion.div className="absolute inset-0 z-[12] pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 w-[300px]"
              style={{
                left: sweepX,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.025), rgba(201,168,76,0.015), transparent)",
                filter: "blur(50px)",
              }}
            />
          </motion.div>

          {/* Floor reflection line */}
          <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-gold/[0.06] to-transparent z-10" />

          {/* ── Content ── */}
          <div className="relative z-20 flex h-full flex-col items-center">
            {/* Hero text + CTA */}
            <motion.div
              className="flex flex-col items-center pt-[12vh] sm:pt-[14vh] px-4"
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
                <span className="text-white">The Art of</span>
                <br />
                <span className="text-gradient-gold">Pristine.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-5 max-w-md text-center text-sm sm:text-base text-white/40 leading-relaxed"
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
                  className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:bg-gold/90"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gold/20 hover:bg-white/[0.06] hover:text-white"
                >
                  View Services
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats reveal on scroll */}
            <motion.div
              className="mt-auto mb-[8%] px-4"
              style={{ opacity: statsOpacity, y: statsY }}
            >
              <div className="mx-auto flex items-center justify-center gap-10 sm:gap-14">
                {[
                  { value: "500+", label: "Clients" },
                  { value: "4.9\u2605", label: "Rating" },
                  { value: "2K+", label: "Detailed" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-bold text-white sm:text-2xl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-white/25">
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
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/15">
                Scroll
              </span>
              <motion.div
                className="w-[1px] h-7 bg-gradient-to-b from-gold/30 to-transparent"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scaleY: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
