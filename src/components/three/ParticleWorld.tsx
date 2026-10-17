"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { readStage, stage } from "@/lib/stage";

const vertex = /* glsl */ `
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute float aRand;

  uniform float uTime;
  uniform float uStage;
  uniform float uIntro;
  uniform float uSize;
  uniform vec3 uMouse;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColC;
  uniform float uDim;

  varying vec3 vColor;
  varying float vAlpha;

  float w(float k) {
    float t = clamp((uStage - k) * 1.6 - aRand * 0.6, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float w1 = w(0.0);
    float w2 = w(1.0);
    float w3 = w(2.0);
    float w4 = w(3.0);

    vec3 p = position;
    p = mix(p, aP1, w1);
    p = mix(p, aP2, w2);
    p = mix(p, aP3, w3);
    p = mix(p, aP4, w4);

    // Mid-morph turbulence: particles burst outward, then settle.
    float flux = 4.0 * (w1 * (1.0 - w1) + w2 * (1.0 - w2) + w3 * (1.0 - w3) + w4 * (1.0 - w4));
    float r = aRand * 6.2831;
    p += normalize(p + vec3(0.0001)) * flux * (0.6 + aRand);
    p += vec3(
      sin(uTime * 0.7 + p.y * 1.7 + r),
      cos(uTime * 0.6 + p.z * 1.9 + r),
      sin(uTime * 0.5 + p.x * 1.5 + r)
    ) * (0.035 + flux * 0.25);

    // Intro: collapse in from a wide shell.
    vec3 dir = normalize(vec3(sin(r * 3.1), cos(r * 1.7), sin(r * 2.3)) + vec3(0.0001));
    float it = clamp(uIntro * 1.5 - aRand * 0.5, 0.0, 1.0);
    it = 1.0 - pow(1.0 - it, 3.0);
    p = mix(dir * (9.0 + aRand * 6.0), p, it);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Pointer repulsion in screen-aligned plane.
    vec2 d = world.xy - uMouse.xy;
    float dist = length(d);
    float push = smoothstep(1.6, 0.0, dist);
    world.xy += normalize(d + vec2(0.0001)) * push * 0.75;
    world.z += push * 0.6;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;

    float big = step(0.985, aRand);
    gl_PointSize = uSize * (0.55 + aRand * 0.9 + big * 1.6) / -mv.z;

    float g = smoothstep(-3.0, 3.0, p.x * 0.7 + p.y);
    vColor = mix(uColA, uColB, g);
    vColor = mix(vColor, uColC, big + push * 0.6);
    float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + aRand * 2.0) + r * 4.0);
    vAlpha = twinkle * uDim * (0.55 + it * 0.45);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function gauss(seed: number) {
  const u = Math.max(rand(seed), 1e-6);
  const v = rand(seed + 0.5);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function buildShapes(count: number) {
  const s0 = new Float32Array(count * 3);
  const s1 = new Float32Array(count * 3);
  const s2 = new Float32Array(count * 3);
  const s3 = new Float32Array(count * 3);
  const s4 = new Float32Array(count * 3);
  const rnd = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const side = Math.ceil(Math.sqrt(count));

  const clusters = [
    { c: [-2.9, 0.9, 0], r: 0.95, share: 0.36 },
    { c: [0, -1.25, 0.6], r: 0.85, share: 0.3 },
    { c: [2.9, 0.9, 0], r: 0.75, share: 0.24 },
  ];

  for (let i = 0; i < count; i++) {
    const k = i * 3;
    const a = rand(i + 1);
    rnd[i] = a;

    // 0 · hero: data planet — fibonacci shell with a faint core.
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const th = golden * i;
    const shell = a > 0.12 ? 2.5 : 2.5 * Math.cbrt(rand(i + 7));
    s0[k] = Math.cos(th) * ring * shell;
    s0[k + 1] = y * shell;
    s0[k + 2] = Math.sin(th) * ring * shell;

    // 1 · work: tilted wave terrain.
    const gx = ((i % side) / side - 0.5) * 13;
    const gz = (Math.floor(i / side) / side - 0.5) * 9;
    const gy = Math.sin(gx * 0.7) * Math.cos(gz * 0.8) * 0.45 + Math.sin(gx * 0.23 + gz * 0.4) * 0.35;
    const tilt = 1.05;
    s1[k] = gx;
    s1[k + 1] = gy * Math.cos(tilt) - gz * Math.sin(tilt) - 0.4;
    s1[k + 2] = gy * Math.sin(tilt) + gz * Math.cos(tilt) - 1.5;

    // 2 · skills: three domain clusters wired together.
    let acc = 0;
    let placed = false;
    for (const cl of clusters) {
      acc += cl.share;
      if (a < acc && !placed) {
        s2[k] = cl.c[0] + gauss(i + 11) * cl.r * 0.55;
        s2[k + 1] = cl.c[1] + gauss(i + 13) * cl.r * 0.55;
        s2[k + 2] = cl.c[2] + gauss(i + 17) * cl.r * 0.55;
        placed = true;
      }
    }
    if (!placed) {
      const e = Math.floor(rand(i + 19) * 3);
      const from = clusters[e].c;
      const to = clusters[(e + 1) % 3].c;
      const t = rand(i + 23);
      s2[k] = from[0] + (to[0] - from[0]) * t + gauss(i + 29) * 0.04;
      s2[k + 1] = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * 0.4 + gauss(i + 31) * 0.04;
      s2[k + 2] = from[2] + (to[2] - from[2]) * t + gauss(i + 37) * 0.04;
    }

    // 3 · path: double helix running across the screen.
    const t = (rand(i + 41) - 0.5) * 14;
    if (a < 0.82) {
      const strand = a < 0.41 ? 0 : Math.PI;
      const ang = t * 1.1 + strand;
      s3[k] = t;
      s3[k + 1] = Math.cos(ang) * 1.15 + gauss(i + 43) * 0.05;
      s3[k + 2] = Math.sin(ang) * 1.15 + gauss(i + 47) * 0.05;
    } else {
      const step = Math.round(t / 0.55) * 0.55;
      const ang = step * 1.1;
      const l = rand(i + 53) * 2 - 1;
      s3[k] = step;
      s3[k + 1] = Math.cos(ang) * 1.15 * l;
      s3[k + 2] = Math.sin(ang) * 1.15 * l;
    }

    // 4 · contact: a portal ring.
    const ang = rand(i + 59) * Math.PI * 2;
    const tube = a < 0.85 ? 0.22 : 0.9;
    const rr = 2.8 + gauss(i + 61) * tube;
    s4[k] = Math.cos(ang) * rr;
    s4[k + 1] = Math.sin(ang) * rr;
    s4[k + 2] = gauss(i + 67) * tube * 0.8;
  }

  return { s0, s1, s2, s3, s4, rnd };
}

// Where the cloud sits for each stage on wide screens: [x, y, scale].
const LAYOUT_WIDE = [
  [3.4, 0, 0.82],
  [0, 0, 1],
  [0, 0.4, 1],
  [0, 0, 1],
  [0, 0, 1.2],
];
const LAYOUT_NARROW = [
  [0, 1.9, 0.44],
  [0, 0, 0.55],
  [0, 0.4, 0.36],
  [0, 0, 0.42],
  [0, 0.4, 0.62],
];
const DIM = [[1], [0.55], [0.9], [0.7], [0.6]];

function lerpTable(table: number[][], v: number, col: number) {
  const i = Math.min(table.length - 1, Math.floor(v));
  const j = Math.min(table.length - 1, i + 1);
  const f = v - i;
  return table[i][col] + (table[j][col] - table[i][col]) * f;
}

function Cloud({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const { size, viewport, gl } = useThree();
  const mouse = useRef(new THREE.Vector3(99, 99, 0));
  const intro = useRef(0);

  const { geometry, material } = useMemo(() => {
    const { s0, s1, s2, s3, s4, rnd } = buildShapes(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(s0, 3));
    geometry.setAttribute("aP1", new THREE.BufferAttribute(s1, 3));
    geometry.setAttribute("aP2", new THREE.BufferAttribute(s2, 3));
    geometry.setAttribute("aP3", new THREE.BufferAttribute(s3, 3));
    geometry.setAttribute("aP4", new THREE.BufferAttribute(s4, 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uStage: { value: 0 },
        uIntro: { value: 0 },
        uSize: { value: 30 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uColA: { value: new THREE.Color("#ff5a1f") },
        uColB: { value: new THREE.Color("#8b93ff") },
        uColC: { value: new THREE.Color("#fff4e8") },
        uDim: { value: 1 },
      },
    });
    return { geometry, material };
  }, [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = points.current;
    if (!g) return;
    const u = (g.material as THREE.ShaderMaterial).uniforms;
    const target = readStage();
    stage.value = THREE.MathUtils.damp(stage.value, target, 3.2, dt);
    intro.current = Math.min(1, intro.current + dt / 2.2);

    u.uTime.value = state.clock.elapsedTime;
    u.uStage.value = stage.value;
    u.uIntro.value = intro.current;
    u.uSize.value = 30 * gl.getPixelRatio() * (size.width < 768 ? 1.25 : 1);

    const wide = size.width >= 900;
    const table = wide ? LAYOUT_WIDE : LAYOUT_NARROW;
    const unit = viewport.width / 12;
    g.position.x = THREE.MathUtils.damp(g.position.x, lerpTable(table, stage.value, 0) * Math.min(unit, 1), 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, lerpTable(table, stage.value, 1), 4, dt);
    const s = lerpTable(table, stage.value, 2);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt));

    // Spin on the hero planet and the portal; stay readable elsewhere.
    const spin = Math.max(0, 1 - stage.value) + Math.max(0, stage.value - 3);
    if (spin > 0.05) {
      g.rotation.y += dt * 0.12 * spin;
    } else {
      const home = Math.round(g.rotation.y / (Math.PI * 2)) * Math.PI * 2;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, home, 2, dt);
    }
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, stage.pointer.y * 0.18, 3, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -stage.pointer.x * 0.08, 3, dt);

    u.uDim.value = THREE.MathUtils.damp(u.uDim.value, lerpTable(DIM, stage.value, 0) * (wide ? 1 : 0.75), 4, dt);

    mouse.current.set((stage.pointer.x * viewport.width) / 2, (stage.pointer.y * viewport.height) / 2, 0);
    u.uMouse.value.lerp(mouse.current, Math.min(1, dt * 8));
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function ParticleWorld() {
  const narrow = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const leave = () => {
      stage.pointer.x = 0;
      stage.pointer.y = 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="world" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Cloud count={narrow ? 9000 : 22000} />
      </Canvas>
    </div>
  );
}
