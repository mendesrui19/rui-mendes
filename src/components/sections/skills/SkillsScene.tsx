"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { skillChapters, skillDomains, skills, type Skill, type SkillDomain } from "@/data/site";

const RADIUS = 4.4;
const BG = "#060907";
const GROW_END = 0.16;

type Props = {
  progress: RefObject<number>;
  chapter: number;
  running: boolean;
  reduced: boolean;
};

type Placed = Skill & { angle: number; index: number; color: string };

const damp = THREE.MathUtils.damp;

function barHeight(count: number) {
  return 0.7 + count * 0.8;
}

function layout() {
  const gap = 1.4;
  const slots = skills.length + gap * skillDomains.length;
  const placed: Placed[] = [];
  const centers = {} as Record<SkillDomain, number>;
  let cursor = gap / 2;

  for (const domain of skillDomains) {
    const group = skills.filter((skill) => skill.domain === domain.id);
    const first = cursor;
    for (const skill of group) {
      placed.push({
        ...skill,
        angle: (cursor / slots) * Math.PI * 2 - Math.PI / 2,
        index: placed.length,
        color: domain.color,
      });
      cursor += 1;
    }
    centers[domain.id] = (((first + cursor - 1) / 2) / slots) * Math.PI * 2 - Math.PI / 2;
    cursor += gap;
  }

  return { placed, centers };
}

const { placed, centers } = layout();

function growAt(progress: number, index: number, total: number, reduced: boolean) {
  if (reduced) return 1;
  const delay = (index / total) * 0.55;
  const t = THREE.MathUtils.clamp((progress / GROW_END - delay) / 0.45, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function Bar({
  skill,
  total,
  dim,
  progress,
  reduced,
}: {
  skill: Placed;
  total: number;
  dim: boolean;
  progress: RefObject<number>;
  reduced: boolean;
}) {
  const body = useRef<THREE.Mesh>(null);
  const cap = useRef<THREE.Mesh>(null);
  const label = useRef<THREE.Group>(null);
  const tag = useRef<HTMLDivElement>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const capMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef(dim ? 0 : 1);

  const target = barHeight(skill.used.length);
  const color = useMemo(() => new THREE.Color(skill.color), [skill.color]);
  const hot = useMemo(() => new THREE.Color(skill.color).multiplyScalar(2.4), [skill.color]);
  const x = Math.cos(skill.angle) * RADIUS;
  const z = Math.sin(skill.angle) * RADIUS;

  useFrame((_, delta) => {
    const grown = growAt(progress.current ?? 0, skill.index, total, reduced);
    const height = Math.max(0.001, target * grown);
    glow.current = damp(glow.current, dim ? 0 : 1, 4, delta);

    if (body.current) {
      body.current.scale.y = height;
      body.current.position.y = height / 2;
    }
    if (cap.current) cap.current.position.y = height + 0.002;
    if (label.current) label.current.position.y = height + 0.38;
    if (material.current) {
      material.current.emissiveIntensity = 0.05 + glow.current * 0.32;
      material.current.opacity = 0.25 + glow.current * 0.65;
    }
    if (capMaterial.current) {
      capMaterial.current.color.copy(color).lerp(hot, glow.current);
      capMaterial.current.opacity = 0.3 + glow.current * 0.7;
    }
    if (tag.current) {
      tag.current.style.opacity = String(grown < 0.98 ? 0 : 0.28 + glow.current * 0.72);
    }
  });

  return (
    <group position={[x, 0, z]} rotation={[0, -skill.angle, 0]}>
      <mesh ref={body}>
        <boxGeometry args={[0.52, 1, 0.52]} />
        <meshStandardMaterial
          ref={material}
          color={BG}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.35}
          metalness={0.2}
          transparent
        />
        <Edges threshold={15} color={skill.color} />
      </mesh>
      <mesh ref={cap} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.52, 0.52]} />
        <meshBasicMaterial ref={capMaterial} color={skill.color} toneMapped={false} transparent />
      </mesh>
      <group ref={label}>
        <Html center zIndexRange={[5, 0]} pointerEvents="none">
          <div ref={tag} className="skill-tag" style={{ opacity: 0 }}>
            <span>{skill.name}</span>
            <b style={{ color: skill.color }}>×{skill.used.length}</b>
          </div>
        </Html>
      </group>
    </group>
  );
}

function Floor() {
  const grid = useMemo(() => {
    const helper = new THREE.PolarGridHelper(7.2, 24, 6, 96, "#1d3a2b", "#12241b");
    const materials = Array.isArray(helper.material) ? helper.material : [helper.material];
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.7;
    });
    return helper;
  }, []);

  useEffect(() => () => grid.dispose(), [grid]);

  return (
    <group>
      <primitive object={grid} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[RADIUS - 0.42, RADIUS + 0.42, 128]} />
        <meshBasicMaterial color="#63e2a0" transparent opacity={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.55, 0.6, 96]} />
        <meshBasicMaterial color="#63e2a0" toneMapped={false} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Rig({
  progress,
  chapter,
  centers,
  reduced,
}: {
  progress: RefObject<number>;
  chapter: number;
  centers: Record<SkillDomain, number>;
  reduced: boolean;
}) {
  const { camera, size } = useThree();
  const state = useRef({ angle: -Math.PI / 2, radius: 16, height: 11 });
  const look = useRef(new THREE.Vector3(0, 1.2, 0));
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = progress.current ?? 0;
    const current = skillChapters[chapter];
    const next = skillChapters[chapter + 1];
    const local = THREE.MathUtils.clamp((p - current.start) / ((next?.start ?? 1) - current.start), 0, 1);
    const wide = THREE.MathUtils.clamp(1.35 / (size.width / size.height), 1, 1.9);

    let angle: number;
    let radius: number;
    let height: number;

    if (current.id === "intro") {
      angle = -Math.PI / 2 + local * 0.5;
      radius = 15.5;
      height = 10.5 - local * 2;
      lookTarget.set(0, 0.6, 0);
    } else if (current.id === "all") {
      angle = -Math.PI / 2 + 0.9 + local * 1.1;
      radius = 14.5;
      height = 7.5;
      lookTarget.set(0, 0.8, 0);
    } else {
      angle = centers[current.id] + (local - 0.5) * 0.45;
      radius = 13.6;
      height = 5 + local * 0.6;
      lookTarget.set(Math.cos(angle) * RADIUS * 0.3, 1.2, Math.sin(angle) * RADIUS * 0.3);
    }

    const speed = reduced ? 12 : 2.2;
    let deltaAngle = angle - state.current.angle;
    deltaAngle = Math.atan2(Math.sin(deltaAngle), Math.cos(deltaAngle));
    state.current.angle += deltaAngle * (1 - Math.exp(-speed * delta));
    state.current.radius = damp(state.current.radius, radius * wide, speed, delta);
    state.current.height = damp(state.current.height, height * wide, speed, delta);

    camera.position.set(
      Math.cos(state.current.angle) * state.current.radius,
      state.current.height,
      Math.sin(state.current.angle) * state.current.radius,
    );
    look.current.lerp(lookTarget, 1 - Math.exp(-speed * delta));
    camera.lookAt(look.current);  });

  return null;
}

export default function SkillsScene({ progress, chapter, running, reduced }: Props) {
  const active = skillChapters[chapter]?.id;
  const focus = active === "web" || active === "backend" || active === "ai" ? active : null;

  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 11, 16], fov: 36, near: 0.1, far: 70 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 15, 32]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 4]} intensity={0.8} />
      <pointLight position={[0, 4, 0]} intensity={18} distance={14} color="#63e2a0" />

      <Floor />
      {placed.map((skill) => (
        <Bar
          key={skill.name}
          skill={skill}
          total={placed.length}
          dim={focus !== null && skill.domain !== focus}
          progress={progress}
          reduced={reduced}
        />
      ))}
      {!reduced && (
        <Sparkles count={70} scale={[16, 7, 16]} position={[0, 3, 0]} size={2.2} speed={0.25} opacity={0.45} color="#63e2a0" />
      )}

      <Rig progress={progress} chapter={chapter} centers={centers} reduced={reduced} />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.25} />
        <Vignette offset={0.28} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
