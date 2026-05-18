import React, { useRef, Component, ReactNode, Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- Error Boundary for Fallback Loading --- //
class ErrorBoundary extends Component<{fallback: ReactNode, children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suppress console errors for missing models since they are expected fallbacks
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function RealModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  
  // Clone the scene to allow independent transformations
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Automatically calculate bounding box to normalize scale and center
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      // Normalize size to exactly 10.0 units wide/tall/deep to make them massive
      const scale = 10.0 / maxDim;
      clone.scale.setScalar(scale);
      
      // Offset position so the model's true center sits exactly at 0,0,0
      // This ensures the energy spline passes exactly through the dead center of the massive models
      clone.position.sub(center.multiplyScalar(scale));
    }
    
    return clone;
  }, [scene]);

  return (
    <group ref={meshRef as any}>
      <primitive object={clonedScene} />
      {/* Sci-Fi Showroom Pedestal */}
      <mesh position={[0, -5.2, 0]}>
        <cylinderGeometry args={[6, 7, 0.4, 64]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Pedestal Glow Ring */}
      <mesh position={[0, -5.0, 0]}>
        <cylinderGeometry args={[6.1, 6.1, 0.1, 64]} />
        <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function RealisticModel({ url, Fallback }: { url: string, Fallback: React.FC }) {
  return (
    <ErrorBoundary fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <RealModel url={url} />
      </Suspense>
    </ErrorBoundary>
  );
}

// --- Primitive Materials & Constants --- //
const COLORS = {
  orange: '#E8601C',
  green: '#39FF14',
  white: '#FFFFFF',
};

const Material = ({ color = COLORS.orange }: { color?: string }) => (
  <meshStandardMaterial 
    color={color} 
    emissive={color} 
    emissiveIntensity={0.3} 
    metalness={0.8}
    roughness={0.2}
    transparent
    opacity={0.9}
  />
);

// --- Primitive Fallbacks --- //
// Scales reduced by 50% so they don't clip into the camera

const PrimitiveWindmill = () => {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (bladesRef.current) bladesRef.current.rotation.z -= delta * 2; });
  return (
    <group scale={0.8}>
      <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.1, 0.3, 3, 8]} /><Material color={COLORS.orange} /></mesh>
      <group position={[0, 0.5, 0.2]} ref={bladesRef}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.2, 0.2, 0.2]} /><Material color={COLORS.green} /></mesh>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]} position={[Math.sin(angle) * 0.8, Math.cos(angle) * 0.8, 0]}>
            <boxGeometry args={[0.1, 1.5, 0.05]} />
            <Material color={COLORS.green} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const PrimitivePowerGrid = () => (
  <group scale={0.7}>
    <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.1, 0.6, 3, 4]} /><Material color={COLORS.orange} /></mesh>
    <mesh position={[0, 0, 0]}><boxGeometry args={[2, 0.1, 0.1]} /><Material color={COLORS.green} /></mesh>
    <mesh position={[0, -0.5, 0]}><boxGeometry args={[3, 0.1, 0.1]} /><Material color={COLORS.green} /></mesh>
  </group>
);

const PrimitivePowerUnit = () => (
  <group scale={0.8}>
    <mesh><boxGeometry args={[1.5, 1.5, 1.5]} /><Material color={COLORS.orange} /></mesh>
    <mesh position={[0.5, 1, 0]}><cylinderGeometry args={[0.2, 0.2, 0.5, 8]} /><Material color={COLORS.green} /></mesh>
    <mesh position={[-0.5, 1, 0]}><cylinderGeometry args={[0.2, 0.2, 0.5, 8]} /><Material color={COLORS.green} /></mesh>
  </group>
);

const PrimitiveDistribution = () => (
  <group scale={0.7}>
    <mesh position={[0, -0.5, 0]}><boxGeometry args={[2, 1, 1]} /><Material color={COLORS.orange} /></mesh>
    {[[-0.8, 0.5, 0], [0, 0.5, 0], [0.8, 0.5, 0]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]}><cylinderGeometry args={[0.1, 0.1, 1, 8]} /><Material color={COLORS.green} /></mesh>
    ))}
  </group>
);

const PrimitiveSatellite = () => {
  const satRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (satRef.current) {
      satRef.current.rotation.y += delta * 0.5;
      satRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });
  return (
    <group ref={satRef} scale={0.8}>
      <mesh><octahedronGeometry args={[0.5, 1]} /><Material color={COLORS.orange} /></mesh>
      <mesh position={[1.2, 0, 0]}><boxGeometry args={[1.5, 0.5, 0.05]} /><Material color={COLORS.green} /></mesh>
      <mesh position={[-1.2, 0, 0]}><boxGeometry args={[1.5, 0.5, 0.05]} /><Material color={COLORS.green} /></mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 4, 0, 0]}><coneGeometry args={[0.4, 0.5, 16]} /><Material color={COLORS.white} /></mesh>
    </group>
  );
};

const PrimitiveCommunication = () => {
  const ringsRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ringsRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      ringsRef.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <group scale={0.8}>
      <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.05, 0.2, 3, 8]} /><Material color={COLORS.orange} /></mesh>
      <group position={[0, 0.5, 0]} ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.5, 0.02, 16, 32]} /><Material color={COLORS.green} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}><torusGeometry args={[0.8, 0.02, 16, 32]} /><Material color={COLORS.green} /></mesh>
      </group>
    </group>
  );
};

const PrimitiveBattery = () => (
  <group scale={0.8}>
    <mesh position={[0, 0, 0]}><boxGeometry args={[1.2, 2, 0.8]} /><Material color={COLORS.orange} /></mesh>
    <mesh position={[0, 0.5, 0.41]}><planeGeometry args={[0.6, 0.4]} /><meshBasicMaterial color={COLORS.green} /></mesh>
    {[-0.5, 0, 0.5].map((y, i) => (
      <mesh key={i} position={[0, y, 0.4]}><boxGeometry args={[1, 0.3, 0.1]} /><Material color={COLORS.green} /></mesh>
    ))}
  </group>
);

const PrimitiveThermal = () => {
  const liquidRef = useRef<THREE.Mesh>(null);
  useFrame((state) => { if (liquidRef.current) liquidRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2; });
  return (
    <group scale={0.8}>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.6, 0.6, 1.5, 16]} /><Material color={COLORS.orange} /></mesh>
      <mesh ref={liquidRef} position={[0, 0, 0]}><cylinderGeometry args={[0.5, 0.5, 1, 16]} /><meshBasicMaterial color={COLORS.green} transparent opacity={0.5} /></mesh>
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}><boxGeometry args={[0.1, 1.8, 1.4]} /><Material color={COLORS.white} /></mesh>
      ))}
    </group>
  );
};

const PrimitiveEVCar = () => (
  <group scale={0.8}>
    <mesh position={[0, -0.3, 0]}><boxGeometry args={[1.8, 0.5, 3]} /><Material color={COLORS.orange} /></mesh>
    <mesh position={[0, 0.3, -0.2]}><boxGeometry args={[1.4, 0.6, 1.5]} /><Material color={COLORS.green} /></mesh>
    {[[-0.9, -0.5, 1], [0.9, -0.5, 1], [-0.9, -0.5, -1], [0.9, -0.5, -1]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><Material color={COLORS.white} /></mesh>
    ))}
  </group>
);

// --- Exported Smart Components --- //
// These automatically look for a realistic GLB file in the public folder.
// If missing, they seamlessly fall back to the Primitive versions above.

export const Windmill = () => <RealisticModel url="/models/windmill.glb" Fallback={PrimitiveWindmill} />;
export const PowerGrid = () => <RealisticModel url="/models/grid.glb" Fallback={PrimitivePowerGrid} />;
export const PowerUnit = () => <RealisticModel url="/models/power_unit.glb" Fallback={PrimitivePowerUnit} />;
export const Distribution = () => <RealisticModel url="/models/distribution.glb" Fallback={PrimitiveDistribution} />;
export const Satellite = () => <RealisticModel url="/models/satellite.glb" Fallback={PrimitiveSatellite} />;
export const Communication = () => <RealisticModel url="/models/communication.glb" Fallback={PrimitiveCommunication} />;
export const Battery = () => <RealisticModel url="/models/battery.glb" Fallback={PrimitiveBattery} />;
export const Thermal = () => <RealisticModel url="/models/thermal.glb" Fallback={PrimitiveThermal} />;
export const EVCar = () => <RealisticModel url="/models/car.glb" Fallback={PrimitiveEVCar} />;
