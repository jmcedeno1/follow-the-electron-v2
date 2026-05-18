import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Windmill, PowerGrid, PowerUnit, Distribution, 
  Satellite, Communication, Battery, Thermal, EVCar 
} from './components/Models3D';

// U-Shaped Room Layout mapping the 9 scenes physically
const SCENE_POSITIONS = [
  new THREE.Vector3(-25, 0, -10),    // 0: Windmill (Left Front)
  new THREE.Vector3(-25, 0, -30),    // 1: Grid (Left Mid)
  new THREE.Vector3(-25, 0, -50),    // 2: Power Unit (Left Back)
  new THREE.Vector3(-10, 0, -65),    // 3: Distribution (Back Wall Left)
  new THREE.Vector3(10, 0, -65),     // 4: Satellite (Back Wall Right)
  new THREE.Vector3(25, 0, -50),     // 5: Communication (Right Back)
  new THREE.Vector3(25, 0, -30),     // 6: Battery (Right Mid)
  new THREE.Vector3(25, 0, -10),     // 7: Thermal (Right Front)
  new THREE.Vector3(0, 0, -35),      // 8: Charging Complete (Center Polestar)
];

const MODELS = [
  Windmill, PowerGrid, PowerUnit, Distribution, 
  Satellite, Communication, Battery, Thermal, EVCar
];

function ShowroomArchitecture() {
  return (
    <group>
      {/* Reflective Blue Floor */}
      <mesh position={[0, -5.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#4A7B9D" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Dark Charcoal Walls */}
      {/* Back Wall */}
      <mesh position={[0, 10, -80]}>
        <planeGeometry args={[120, 40]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-45, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[160, 40]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[45, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[160, 40]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

function FlyingCamera({ targetIndex }: { targetIndex: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(SCENE_POSITIONS, false), []);
  const progressRef = useRef(0);
  
  useFrame((state) => {
    const targetProgress = targetIndex / (SCENE_POSITIONS.length - 1);
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, 0.02);
    
    const cameraPos = curve.getPointAt(progressRef.current);
    const lookAtPos = curve.getPointAt(Math.min(progressRef.current + 0.05, 1));
    
    // Angle the camera to look slightly down at the showroom exhibits
    state.camera.position.lerp(
      new THREE.Vector3(cameraPos.x, cameraPos.y + 6, cameraPos.z + 14), 
      0.1
    );
    state.camera.lookAt(lookAtPos.x, lookAtPos.y - 2, lookAtPos.z);
  });

  return null;
}

function GridNodes() {
  return (
    <>
      {SCENE_POSITIONS.map((pos, i) => {
        const ModelComponent = MODELS[i];
        return (
          <group key={i} position={pos}>
            <ModelComponent />
          </group>
        );
      })}
    </>
  );
}

function PhysicalLEDStrip() {
  const floorPoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(SCENE_POSITIONS, false);
    // Snap the line directly to the floor (-5.39 to avoid Z-fighting)
    return curve.getPoints(300).map(p => new THREE.Vector3(p.x, -5.39, p.z));
  }, []);

  const lineRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (lineRef.current) {
      // Animate the dash offset to simulate a single powerful electric flow
      lineRef.current.material.dashOffset -= delta * 15;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={floorPoints}
      color="#FF5722"
      lineWidth={6}
      dashed={true}
      dashScale={5}
      dashSize={2}
      gapSize={1.5}
    />
  );
}

export function Scene3D({ currentSceneIndex }: { currentSceneIndex: number }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#000000] z-0">
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        {/* Atmospheric Fog blending into the background */}
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 10, 80]} />
        
        {/* Museum/Showroom Lighting */}
        <ambientLight intensity={0.4} color="#FFFFFF" />
        <directionalLight position={[0, 30, 20]} intensity={1.5} color="#FFFFFF" castShadow />
        
        {/* Add spotlights directly above the key nodes to mimic museum tracking lights */}
        {SCENE_POSITIONS.map((pos, i) => (
          <spotLight key={i} position={[pos.x, 20, pos.z]} angle={0.3} penumbra={1} intensity={2} color="#FFFFFF" />
        ))}
        
        <ShowroomArchitecture />
        <GridNodes />
        <PhysicalLEDStrip />
        <FlyingCamera targetIndex={currentSceneIndex} />
      </Canvas>
    </div>
  );
}
