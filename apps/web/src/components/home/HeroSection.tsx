"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Star, Droplets, Shield, Clock } from "lucide-react";

const SKETCHFAB_MODEL_UID = "312ab6595d3e4ebd8ee1c18ff25fa048"; // Mercedes-AMG SL 63

function SketchfabCar({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Loading shimmer while 3D model loads */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]" />
        </div>
      )}
      <iframe
        title="BWash 3D Car"
        src={`https://sketchfab.com/models/${SKETCHFAB_MODEL_UID}/embed?autostart=1&autospin=0.15&transparent=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_help=0&ui_settings=0&ui_watermark_link=0&ui_watermark=0&ui_annotations=0&ui_hint=0&annotation_cycle=0&scrollwheel=0&ui_color=C9A84C&camera=0&preload=1&dnt=1`}
        className="h-full w-full border-0 pointer-events-none"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease-in-out" }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function MistParticle({
  delay,
  x,
  y,
  size,
  duration,
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/[0.03]"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        filter: `blur(${size / 3}px)`,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0],
        scale: [0.5, 1.2, 1.5, 2],
        y: [0, -30, -60, -100],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: duration * 0.5,
        ease: "easeOut",
      }}
    />
  );
}

function FoamDrip({
  delay,
  x,
}: {
  delay: number;
  x: string;
}) {
  return (
    <motion.div
      className="absolute w-[2px] rounded-full bg-gradient-to-b from-white/20 to-transparent"
      style={{ left: x, top: "45%" }}
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: [0, 0.5, 0.3, 0],
        height: [0, 30, 50, 60],
        y: [0, 10, 25, 40],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeIn",
      }}
    />
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll-driven transforms
  const carScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.85, 1, 1.05]);
  const lightX = useTransform(scrollYProgress, [0, 0.6], ["-60%", "120%"]);
  const foamOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
  const statsOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.5, 0.65], [40, 0]);
  const taglineOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const overlayGlow = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["rgba(201,168,76,0.02)", "rgba(201,168,76,0.06)", "rgba(201,168,76,0.02)"]
  );

  return (
    <div ref={containerRef} className="relative h-[280vh]">
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen overflow-hidden bg-luxury-black">
        {/* Deep background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-luxury-black to-[#080808]" />

        {/* Ambient light orbs */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
          style={{ background: overlayGlow, filter: "blur(120px)" }}
        />
        <div className="absolute top-[60%] left-[20%] h-[200px] w-[200px] rounded-full bg-gold/[0.015] blur-[100px]" />
        <div className="absolute top-[40%] right-[15%] h-[150px] w-[150px] rounded-full bg-white/[0.01] blur-[80px]" />

        {/* Subtle floor reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* ---- HERO CONTENT ---- */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          {/* Top text block - fades on scroll */}
          <motion.div
            className="absolute top-[12%] left-0 right-0 text-center px-4"
            style={{ opacity: textOpacity, y: textY }}
          >
            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-gold/15 bg-gold/[0.04] px-5 py-2 backdrop-blur-sm"
            >
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="text-xs font-medium tracking-widest uppercase text-gold/80">
                Miami&apos;s Premium Mobile Detailing
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="text-white">The Art of</span>
              <br />
              <span className="text-gradient-gold">Pristine.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mx-auto mt-5 max-w-md text-base text-white/35 leading-relaxed"
            >
              Luxury mobile car wash and detailing, delivered to your door.
            </motion.p>
          </motion.div>

          {/* Car container */}
          <div className="relative w-full max-w-4xl mx-auto px-8 mt-[5%]">
            {/* Reflection light sweep */}
            <motion.div
              className="absolute inset-0 z-20 overflow-hidden rounded-2xl pointer-events-none"
              style={{ opacity: 0.7 }}
            >
              <motion.div
                className="absolute top-0 bottom-0 w-[200px]"
                style={{
                  left: lightX,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), rgba(201,168,76,0.03), transparent)",
                  filter: "blur(30px)",
                }}
              />
            </motion.div>

            {/* Car with perspective rotation */}
            <motion.div
              style={{
                scale: carScale,
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            >
              {/* Car shadow on ground */}
              <div className="absolute -bottom-6 left-[10%] right-[10%] h-[30px] bg-black/50 blur-[25px] rounded-[50%]" />

              <SketchfabCar className="w-full aspect-[16/9] relative z-10" />

              {/* Paint sheen overlay */}
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.02) 45%, transparent 60%)",
                }}
                animate={{
                  background: [
                    "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.02) 45%, transparent 60%)",
                    "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 55%, transparent 70%)",
                    "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.02) 45%, transparent 60%)",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Foam / Mist pass */}
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{ opacity: foamOpacity }}
            >
              {/* Mist particles */}
              <MistParticle delay={0} x="20%" y="50%" size={40} duration={4} />
              <MistParticle delay={0.5} x="35%" y="55%" size={25} duration={3.5} />
              <MistParticle delay={1} x="50%" y="48%" size={35} duration={4.5} />
              <MistParticle delay={1.5} x="65%" y="52%" size={30} duration={3.8} />
              <MistParticle delay={0.8} x="75%" y="50%" size={45} duration={4.2} />
              <MistParticle delay={2} x="45%" y="45%" size={20} duration={3.2} />
              <MistParticle delay={1.2} x="25%" y="58%" size={28} duration={3.6} />
              <MistParticle delay={0.3} x="80%" y="48%" size={22} duration={3.9} />
              <MistParticle delay={1.8} x="55%" y="56%" size={32} duration={4.1} />
              <MistParticle delay={2.2} x="40%" y="42%" size={18} duration={3.3} />

              {/* Foam drips */}
              <FoamDrip delay={0.5} x="30%" />
              <FoamDrip delay={1.2} x="45%" />
              <FoamDrip delay={0.8} x="60%" />
              <FoamDrip delay={1.8} x="70%" />
              <FoamDrip delay={2.5} x="38%" />

              {/* Foam sheen across body */}
              <motion.div
                className="absolute left-[15%] right-[15%] top-[40%] h-[20%] rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scaleX: [0.9, 1.1, 0.9],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Scroll-reveal tagline */}
          <motion.p
            className="absolute bottom-[22%] left-0 right-0 text-center text-sm tracking-[0.3em] uppercase text-gold/50 font-light"
            style={{ opacity: taglineOpacity }}
          >
            Perfection, Detailed.
          </motion.p>

          {/* Bottom stats - reveal on scroll */}
          <motion.div
            className="absolute bottom-[8%] left-0 right-0 px-4"
            style={{ opacity: statsOpacity, y: statsY }}
          >
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center justify-center gap-12 sm:gap-16">
                {[
                  { icon: Shield, value: "500+", label: "Clients" },
                  { icon: Star, value: "4.9", label: "Rating" },
                  { icon: Droplets, value: "2K+", label: "Details" },
                  { icon: Clock, value: "Same", label: "Day Service" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <stat.icon className="h-4 w-4 text-gold/30 mx-auto mb-2" />
                    <div className="text-xl font-semibold text-white sm:text-2xl">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-[10px] tracking-widest uppercase text-white/25">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="btn-primary px-8 py-3.5 text-sm group"
                >
                  Book Now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="btn-secondary px-8 py-3.5 text-sm"
                >
                  View Packages
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ opacity: textOpacity }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/15">
              Scroll
            </span>
            <motion.div
              className="w-[1px] h-6 bg-gradient-to-b from-gold/30 to-transparent"
              animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
