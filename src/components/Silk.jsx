"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  forwardRef,
  useRef,
  useMemo,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";

const hexToNormalizedRGB = (hex) => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Slightly cheaper noise (fewer sin calls) — still reads as silk.
const fragmentShader = /* glsl */ `
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

float noise(vec2 texCoord) {
  vec2 r = sin(texCoord * 12.9898);
  return fract(r.x * r.y * 43758.5453);
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy * 0.5);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  float tOffset = uSpeed * uTime;

  uv.y += 0.03 * sin(8.0 * uv.x - tOffset);

  float pattern = 0.6 +
    0.4 * sin(
      5.0 * (uv.x + uv.y + cos(3.0 * uv.x + 5.0 * uv.y) + 0.02 * tOffset) +
      sin(16.0 * (uv.x + uv.y - 0.1 * tOffset))
    );

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms, fps }, ref) {
  const { viewport } = useThree();
  const accum = useRef(0);
  const minDelta = 1 / Math.max(12, fps);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport.width, viewport.height]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    accum.current += delta;
    if (accum.current < minDelta) return;
    const step = Math.min(accum.current, 0.08);
    accum.current = 0;
    mesh.material.uniforms.uTime.value += 0.1 * step;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

function subscribeRenderCaps() {
  return () => {};
}

function isLowPowerClient() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const saveData = navigator.connection?.saveData === true;
  const cores = navigator.hardwareConcurrency || 4;
  return saveData || cores <= 4 || coarse;
}

function getClientDpr() {
  return isLowPowerClient() ? 1 : Math.min(1.25, window.devicePixelRatio || 1);
}

function getClientFps() {
  return isLowPowerClient() ? 20 : 28;
}

/**
 * Full-bleed silk shader background.
 * `active` pauses the WebGL loop when the hero is off-screen / tab hidden.
 */
const Silk = ({
  speed = 5,
  scale = 1,
  color = "#7B7481",
  noiseIntensity = 1.5,
  rotation = 0,
  active = true,
}) => {
  const meshRef = useRef();
  const dpr = useSyncExternalStore(subscribeRenderCaps, getClientDpr, () => 1);
  const fps = useSyncExternalStore(subscribeRenderCaps, getClientFps, () => 28);

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: hexToNormalizedRGB(color) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation],
  );

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      gl={{
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 10 }}
      style={{ width: "100%", height: "100%", display: "block" }}
      // Avoid resizing thrash while soft-keyboard / URL bar moves on mobile.
      resize={{ debounce: 200, scroll: false }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} fps={fps} />
    </Canvas>
  );
};

export default Silk;
