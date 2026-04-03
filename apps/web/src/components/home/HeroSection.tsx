"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight, Star, Droplets, Shield, Clock } from "lucide-react";

function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* SUV Body */}
      <path
        d="M120 240 C120 240 140 235 160 230 L200 160 C210 145 230 110 270 95 C310 80 380 70 450 68 C520 70 590 80 630 95 C670 110 690 145 700 160 L740 230 C760 235 780 240 780 240 L780 260 C780 265 775 270 770 270 L130 270 C125 270 120 265 120 260 Z"
        fill="url(#bodyGradient)"
        stroke="url(#bodyStroke)"
        strokeWidth="0.5"
      />
      {/* Roof line */}
      <path
        d="M235 105 C250 78 290 55 370 48 C420 45 480 45 530 48 C610 55 650 78 665 105"
        fill="url(#roofGradient)"
        stroke="url(#bodyStroke)"
        strokeWidth="0.5"
      />
      {/* Windshield */}
      <path
        d="M245 105 C260 80 295 60 375 52 C425 49 475 49 525 52 C605 60 640 80 655 105 L630 100 C615 85 580 72 520 67 C480 65 420 65 380 67 C320 72 285 85 270 100 Z"
        fill="url(#glassGradient)"
        opacity="0.6"
      />
      {/* Side windows */}
      <path
        d="M270 100 L250 155 L365 150 L370 68 C320 73 288 86 270 100Z"
        fill="url(#glassGradient)"
        opacity="0.5"
      />
      <path
        d="M630 100 L650 155 L535 150 L530 68 C580 73 612 86 630 100Z"
        fill="url(#glassGradient)"
        opacity="0.5"
      />
      {/* Window pillar */}
      <rect x="370" y="65" width="8" height="88" rx="2" fill="#0a0a0a" opacity="0.8" />
      <rect x="522" y="65" width="8" height="88" rx="2" fill="#0a0a0a" opacity="0.8" />
      {/* Headlights */}
      <ellipse cx="175" cy="215" rx="30" ry="8" fill="url(#headlightGlow)" opacity="0.9" />
      <ellipse cx="725" cy="215" rx="30" ry="8" fill="url(#headlightGlow)" opacity="0.9" />
      {/* DRL light strips */}
      <path d="M148 210 L200 208" stroke="url(#drlGradient)" strokeWidth="2" strokeLinecap="round" />
      <path d="M752 210 L700 208" stroke="url(#drlGradient)" strokeWidth="2" strokeLinecap="round" />
      {/* Front grille */}
      <rect x="380" y="210" width="140" height="35" rx="4" fill="#080808" stroke="#1a1a1a" strokeWidth="0.5" />
      <line x1="400" y1="218" x2="500" y2="218" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
      <line x1="400" y1="225" x2="500" y2="225" stroke="#1a1a1a" strokeWidth="0.5" />
      <line x1="400" y1="232" x2="500" y2="232" stroke="#1a1a1a" strokeWidth="0.5" />
      {/* Wheels */}
      <circle cx="230" cy="272" r="42" fill="#0a0a0a" />
      <circle cx="230" cy="272" r="36" fill="url(#wheelGradient)" />
      <circle cx="230" cy="272" r="20" fill="#111" stroke="#222" strokeWidth="1" />
      <circle cx="230" cy="272" r="8" fill="#C9A84C" opacity="0.3" />
      <circle cx="670" cy="272" r="42" fill="#0a0a0a" />
      <circle cx="670" cy="272" r="36" fill="url(#wheelGradient)" />
      <circle cx="670" cy="272" r="20" fill="#111" stroke="#222" strokeWidth="1" />
      <circle cx="670" cy="272" r="8" fill="#C9A84C" opacity="0.3" />
      {/* Wheel spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={`left-${angle}`}>
          <line
            x1={230 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={272 + 10 * Math.sin((angle * Math.PI) / 180)}
            x2={230 + 33 * Math.cos((angle * Math.PI) / 180)}
            y2={272 + 33 * Math.sin((angle * Math.PI) / 180)}
            stroke="#222"
            strokeWidth="2.5"
          />
        </g>
      ))}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={`right-${angle}`}>
          <line
            x1={670 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={272 + 10 * Math.sin((angle * Math.PI) / 180)}
            x2={670 + 33 * Math.cos((angle * Math.PI) / 180)}
            y2={272 + 33 * Math.sin((angle * Math.PI) / 180)}
            stroke="#222"
            strokeWidth="2.5"
          />
        </g>
      ))}
      {/* Body highlight line */}
      <path
        d="M160 200 C200 195 350 188 450 186 C550 188 700 195 740 200"
        stroke="url(#highlightStroke)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      {/* Lower body trim */}
      <path
        d="M150 250 L750 250"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="40%" stopColor="#111111" />
          <stop offset="60%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
        <linearGradient id="bodyStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="50%" stopColor="#333" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="roofGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2030" />
          <stop offset="50%" stopColor="#0f1520" />
          <stop offset="100%" stopColor="#0a1018" />
        </linearGradient>
        <radialGradient id="headlightGlow">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="drlGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="wheelGradient">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
        <linearGradient id="highlightStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="#C9A84C" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#C9A84C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
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
  const carRotateY = useTransform(scrollYProgress, [0, 0.5], ["-12deg", "0deg"]);
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
                rotateY: carRotateY,
                scale: carScale,
                perspective: 1200,
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            >
              {/* Car shadow on ground */}
              <div className="absolute -bottom-6 left-[10%] right-[10%] h-[30px] bg-black/50 blur-[25px] rounded-[50%]" />

              <CarSilhouette className="w-full h-auto relative z-10 drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]" />

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
