"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";

/* ── Ferrari model ── */
function Ferrari({ isDark }: { isDark: boolean }) {
  const { scene } = useGLTF("/models/ferrari.glb");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    // Apply luxury materials matching three.js car example
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isDark ? 0x0a0a0a : 0x1e3a5f),
      metalness: 1,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });

    const detailsMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x2563eb),
      metalness: 1,
      roughness: 0.5,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0,
    });

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const name = child.name;
      if (name === "body") {
        child.material = bodyMaterial;
      } else if (
        name.startsWith("rim_") ||
        name === "trim"
      ) {
        child.material = detailsMaterial;
      } else if (name === "glass") {
        child.material = glassMaterial;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [scene, isDark]);

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Camera rig driven by scroll ── */
function CameraRig({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const { camera } = useThree();
  const progressRef = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    progressRef.current = v;
  });

  useFrame(() => {
    const t = progressRef.current;

    // Orbit from front-3/4 to side as user scrolls
    const angle = THREE.MathUtils.lerp(-0.8, Math.PI * 0.9, t);
    const radius = THREE.MathUtils.lerp(5.5, 4.5, Math.min(t * 2, 1));
    const height = THREE.MathUtils.lerp(1.6, 1.0, t);

    const targetX = Math.cos(angle) * radius;
    const targetZ = Math.sin(angle) * radius;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (height - camera.position.y) * 0.05;

    camera.lookAt(0, 0.35, 0);
  });

  return null;
}

/* ── Main scene ── */
export default function CarScene({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <Canvas
      camera={{ position: [4.25, 1.4, -4.5], fov: 40, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 0.85 : 1.2,
      }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <CameraRig scrollProgress={scrollProgress} />

      {/* Lighting */}
      <ambientLight intensity={isDark ? 0.15 : 0.6} />
      <spotLight
        position={[10, 8, -5]}
        angle={0.3}
        penumbra={1}
        intensity={isDark ? 1.5 : 2.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={isDark ? 0.5 : 1.0}
        color="#2563EB"
      />

      {/* Car */}
      <Ferrari isDark={isDark} />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={isDark ? 0.5 : 0.25}
        scale={12}
        blur={2.5}
        far={4}
        color={isDark ? "#000000" : "#94A3B8"}
      />

      {/* Environment for reflections */}
      <Environment preset={isDark ? "night" : "city"} />
    </Canvas>
  );
}

useGLTF.preload("/models/ferrari.glb");
