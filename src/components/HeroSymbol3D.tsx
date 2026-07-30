import { Component, Suspense, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MODEL_URL = '/models/ymirr-symbol.gltf';

/**
 * The loaded gltf's own transforms put it well off-centre and at an
 * arbitrary scale (it was exported from a larger scene). Rather than hand-
 * tune magic numbers, we measure the real bounding box on load and derive a
 * centering offset + uniform scale that fits it to a fixed target size —
 * robust to the model being re-exported slightly differently later.
 */
function CenteredModel({ spinning }: { spinning: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxAxis = Math.max(size.x, size.y, size.z, 0.0001);
    const targetSize = 2.6; // world units — tuned against the camera distance below
    const scale = targetSize / maxAxis;
    return { clone, center, scale };
  }, [scene]);

  // Idle life: a very slow self-rotation plus a barely-perceptible vertical
  // bob, paused while the user is actively dragging (handled by the parent
  // toggling `spinning`) and skipped entirely under reduced-motion.
  useFrame((state, delta) => {
    if (!group.current) return;
    if (spinning && !reduced) {
      group.current.rotation.y += delta * 0.09;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.035;
    }
  });

  return (
    <group ref={group}>
      <group
        scale={prepared.scale}
        position={[
          -prepared.center.x * prepared.scale,
          -prepared.center.y * prepared.scale,
          -prepared.center.z * prepared.scale,
        ]}
      >
        <primitive object={prepared.clone} />
      </group>
    </group>
  );
}

/** Procedural studio lighting — soft cyan/white light panels baked into a
 *  runtime environment map. Deliberately avoids drei's HDRI presets (which
 *  fetch a file from a CDN at runtime); everything here is generated
 *  in-scene, so the hero never depends on external network access and the
 *  reflections stay on-brand (cyan/white, no warm tones). */
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#eaf7fc" position={[0, 3, 2]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#1abae3" position={[-3, 0, 2]} scale={[2, 3, 1]} rotation-y={Math.PI / 3} />
        <Lightformer form="rect" intensity={1.1} color="#4199de" position={[3, -1, 1.5]} scale={[2, 2.5, 1]} rotation-y={-Math.PI / 3} />
        <Lightformer form="ring" intensity={0.6} color="#ffffff" position={[0, 0, -4]} scale={3} />
      </Environment>
      <directionalLight position={[2, 3, 4]} intensity={0.5} color="#eaf7fc" />
    </>
  );
}

/**
 * Drag-to-rotate rig: OrbitControls orbits the camera around the model
 * (visually identical to spinning the object, and far more battle-tested
 * than hand-rolled pointer math), giving free 360° rotation, built-in
 * inertia/damping on release, and native mouse + touch support. Idle
 * auto-rotation of the model itself pauses the instant the user grabs it and
 * resumes on release.
 */
function Rig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const [spinning, setSpinning] = useState(true);

  return (
    <>
      <CenteredModel spinning={spinning} />
      <OrbitControls
        ref={controls}
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.45}
        onStart={() => setSpinning(false)}
        onEnd={() => setSpinning(true)}
      />
    </>
  );
}

/** Catches WebGL/context or GLTF-parse failures and falls back to the flat
 *  brand mark rather than leaving a blank hero. */
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function FlatMarkFallback() {
  return (
    <div className="hero-symbol3d__fallback">
      <img src="/brand/ymirr-mark.svg" alt="Ymirr™" width={168} height={186} />
    </div>
  );
}

/**
 * The interactive 3D hero symbol. Renders `model.gltf` inside a transparent,
 * retina-aware canvas so the existing dark-navy/grid-line hero backdrop
 * shows through untouched. Wrapped in Suspense (loading) and an error
 * boundary (WebGL unavailable / load failure) so the hero is never left
 * blank.
 */
export function HeroSymbol3D() {
  return (
    <div className="hero-symbol3d" role="img" aria-label="Ymirr™ symbol — drag to rotate">
      <ModelErrorBoundary fallback={<FlatMarkFallback />}>
        <Suspense fallback={<FlatMarkFallback />}>
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 5.4], fov: 32 }}
            // 'pan-y' lets a vertical-dominant touch gesture fall through to
            // native page scroll before JS sees it; a horizontal-dominant
            // drag still reaches OrbitControls for rotation. Plain 'none'
            // captured every touch over the canvas, blocking page scroll
            // whenever a finger started on the hero symbol.
            style={{ touchAction: 'pan-y' }}
          >
            <StudioLighting />
            <Rig />
          </Canvas>
        </Suspense>
      </ModelErrorBoundary>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
