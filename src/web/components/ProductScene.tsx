import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

type ModelType = "sphere" | "box" | "figurine" | "phone" | "gear";

const defaultColors: Record<ModelType, string> = {
  sphere: "#FFD600",
  figurine: "#333333",
  box: "#FFD600",
  phone: "#111111",
  gear: "#555555",
};

function ProductModel({ modelType, color }: { modelType: ModelType; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.6;
    meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.04;
  });

  const mat = <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} envMapIntensity={1.2} />;

  switch (modelType) {
    case "figurine":
      return <Float speed={2} floatIntensity={0.4}><mesh ref={meshRef} castShadow><capsuleGeometry args={[0.35, 0.8, 8, 16]} />{mat}</mesh></Float>;
    case "box":
      return <Float speed={1.5} floatIntensity={0.3}><mesh ref={meshRef} castShadow><boxGeometry args={[1, 1.2, 0.8]} />{mat}</mesh></Float>;
    case "phone":
      return <Float speed={1.8} floatIntensity={0.35}><mesh ref={meshRef} castShadow><boxGeometry args={[0.7, 1.4, 0.1]} />{mat}</mesh></Float>;
    case "gear":
      return <Float speed={2.2} floatIntensity={0.4}><mesh ref={meshRef} castShadow><torusGeometry args={[0.6, 0.25, 8, 20]} />{mat}</mesh></Float>;
    default:
      return <Float speed={1.5} floatIntensity={0.4}><mesh ref={meshRef} castShadow><icosahedronGeometry args={[0.8, 2]} />{mat}</mesh></Float>;
  }
}

export function ProductScene({ modelType = "sphere", color }: { modelType: ModelType; color?: string }) {
  const resolvedColor = color || defaultColors[modelType] || "#FFD600";
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.8} color="#FFFFFF" />
      <pointLight position={[3, 3, 3]} intensity={2} color="#FFFFFF" />
      <pointLight position={[-2, -2, 2]} intensity={1.5} color="#FFD600" />
      <spotLight position={[0, 5, 2]} intensity={2} color="#FFFFFF" angle={0.4} />
      <ProductModel modelType={modelType} color={resolvedColor} />
      <Environment preset="warehouse" />
    </Canvas>
  );
}
