"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";

/* ── Ferrari model ── */
function Ferrari() {
  const { scene } = useGLTF("/models/ferrari.glb");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    // Apply luxury materials matching three.js car example
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a0a0a),
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
  }, [scene]);

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
  return (
    <Canvas
      camera={{ position: [4.25, 1.4, -4.5], fov: 40, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <CameraRig scrollProgress={scrollProgress} />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <spotLight
        position={[10, 8, -5]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.5}
        color="#2563EB"
      />

      {/* Car */}
      <Ferrari />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={12}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* Environment for reflections */}
      <Environment preset="night" />
    </Canvas>
  );
}

useGLTF.preload("/models/ferrari.glb");
