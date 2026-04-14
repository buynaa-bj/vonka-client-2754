import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Trail } from "@react-three/drei";
import * as THREE from "three";

function CursorReactiveGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (pointer.x * 0.5 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-pointer.y * 0.3 - groupRef.current.rotation.x) * 0.05;
  });

  return <group ref={groupRef}>{null}</group>;
}

function HeroPrinter() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += (pointer.y * 0.2 - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.z += (pointer.x * 0.1 - meshRef.current.rotation.z) * 0.03;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <icosahedronGeometry args={[1.4, 4]} />
        <MeshDistortMaterial
          color="#1a1a3a"
          metalness={0.9}
          roughness={0.1}
          distort={0.3}
          speed={2}
          envMapIntensity={2}
        >
          <color attach="color" args={["#1a1a3a"]} />
        </MeshDistortMaterial>
      </mesh>
    </Float>
  );
}

function OrbitingParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 3;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = height;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7b8cff" size={0.025} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial color="#7b8cff" wireframe opacity={0.08} transparent />
    </mesh>
  );
}

function SmallFloaters() {
  const positions: [number, number, number][] = [
    [-2.5, 0.8, -1], [2.8, -0.5, 0.5], [-1.5, -1.2, 1.2],
    [1.8, 1.5, -0.8], [-3, -0.2, 0.3], [2.2, 0.3, -1.5],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={pos}>
            {i % 3 === 0 ? (
              <octahedronGeometry args={[0.12 + i * 0.02, 0]} />
            ) : i % 3 === 1 ? (
              <boxGeometry args={[0.15, 0.15, 0.15]} />
            ) : (
              <tetrahedronGeometry args={[0.1 + i * 0.01, 0]} />
            )}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#7b8cff" : "#c0c8e0"}
              metalness={0.9}
              roughness={0.1}
              emissive={i % 2 === 0 ? "#3040a0" : "#606880"}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#c0c8e0" />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#7b8cff" />
      <pointLight position={[3, -2, -2]} intensity={1.5} color="#e8e0d0" />
      <spotLight position={[0, 5, 0]} intensity={1} color="#a0b0ff" angle={0.5} />

      <HeroPrinter />
      <OrbitingParticles />
      <GridPlane />
      <SmallFloaters />

      <Environment preset="city" />
    </Canvas>
  );
}
