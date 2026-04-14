import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, ChevronRight, Star, Tag } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useCart } from "../hooks/useCart";

interface Variant {
  id: number;
  productId: number;
  name: string;
  modelType: string;
  color: string;
  priceDelta: number;
  isDefault: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  modelType: string;
  featured: boolean;
  inStock: boolean;
  variants: Variant[];
}

function DetailModel({ modelType, color }: { modelType: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const targetColor = useRef(new THREE.Color(color));
  const currentColor = useRef(new THREE.Color(color));

  useEffect(() => { targetColor.current = new THREE.Color(color); }, [color]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.z += (pointer.x * 0.12 - meshRef.current.rotation.z) * 0.05;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat?.color) {
      currentColor.current.lerp(targetColor.current, 0.07);
      mat.color.copy(currentColor.current);
    }
  });

  const mat = <meshStandardMaterial color={color} metalness={0.75} roughness={0.18} envMapIntensity={1.5} />;
  const geo = () => {
    switch (modelType) {
      case "figurine": return <capsuleGeometry args={[0.55, 1.2, 12, 24]} />;
      case "box": return <boxGeometry args={[1.4, 1.6, 1.0]} />;
      case "phone": return <boxGeometry args={[0.9, 1.8, 0.12]} />;
      case "gear": return <torusGeometry args={[0.8, 0.32, 12, 30]} />;
      default: return <icosahedronGeometry args={[1.0, 3]} />;
    }
  };
  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.4}>
      <mesh ref={meshRef} castShadow>{geo()}{mat}</mesh>
    </Float>
  );
}

function VariantOrbit({ variants, selected, onSelect }: { variants: Variant[]; selected: Variant; onSelect: (v: Variant) => void }) {
  const count = variants.length;
  const radius = count <= 3 ? 90 : count <= 5 ? 110 : 130;

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}>
      {/* Orbit ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: radius * 2, height: radius * 2, border: "1.5px dashed rgba(0,0,0,0.12)", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
      />
      {/* Center glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 40, height: 40, background: `radial-gradient(circle, ${selected.color}60 0%, transparent 70%)`, filter: "blur(8px)", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
      />

      {variants.map((v, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isSel = v.id === selected.id;
        return (
          <motion.button
            key={v.id}
            onClick={() => onSelect(v)}
            className="absolute flex flex-col items-center gap-1.5"
            style={{ left: "50%", top: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ scale: isSel ? 1.35 : 1, boxShadow: isSel ? `0 0 0 3px #FFFFFF, 0 0 0 5px ${v.color}, 0 4px 16px ${v.color}60` : "none" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-full"
              style={{ width: isSel ? 22 : 16, height: isSel ? 22 : 16, background: v.color, border: "2px solid rgba(0,0,0,0.12)" }}
            />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: isSel ? "#111111" : "#888888", whiteSpace: "nowrap", fontWeight: isSel ? 700 : 400 }}>
              {v.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function ProductDetailPage({ productId, onBack }: { productId: number; onBack: () => void }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${productId}`).then(r => r.json()).then((p: Product) => {
      setProduct(p);
      setSelectedVariant(p.variants.find(v => v.isDefault) || p.variants[0]);
    });
  }, [productId]);

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2F2F2" }}>
        <div className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: "#FFD600", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const price = product.price + (selectedVariant.priceDelta || 0);

  const handleAdd = () => {
    addItem({ id: product.id * 100 + selectedVariant.id, name: `${product.name} — ${selectedVariant.name}`, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: "#F2F2F2", minHeight: "100vh", paddingTop: 80 }}>
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-60"
          style={{ fontFamily: "'Syne',sans-serif", color: "#555555" }}
        >
          <motion.span whileHover={{ x: -3 }} className="inline-block"><ArrowLeft size={16} /></motion.span>
          Буцах
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT */}
          <div className="flex flex-col items-center gap-8 sticky top-24">
            {/* 3D canvas */}
            <motion.div
              className="w-full rounded-3xl overflow-hidden relative"
              style={{ height: 420, background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
              layout
            >
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{ background: `radial-gradient(ellipse at 50% 40%, ${selectedVariant.color}20 0%, transparent 60%)`, transition: "background 0.5s" }}
              />
              <Suspense fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-3 animate-spin" style={{ borderColor: "#FFD600", borderTopColor: "transparent" }} />
                </div>
              }>
                <Canvas camera={{ position: [0, 0, 4], fov: 52 }} gl={{ antialias: true, alpha: true }}>
                  <ambientLight intensity={0.9} color="#FFFFFF" />
                  <pointLight position={[4, 4, 4]} intensity={2} color={selectedVariant.color} />
                  <pointLight position={[-4, -3, 2]} intensity={1.5} color="#FFFFFF" />
                  <spotLight position={[0, 6, 2]} intensity={2.5} color="#FFFFFF" angle={0.4} />
                  <DetailModel modelType={selectedVariant.modelType} color={selectedVariant.color} />
                  <Environment preset="warehouse" />
                </Canvas>
              </Suspense>

              {product.featured && (
                <div
                  className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "#FFD600", color: "#111111", fontFamily: "'JetBrains Mono',monospace" }}
                >
                  <Star size={10} fill="#111111" /> Featured
                </div>
              )}
            </motion.div>

            {/* Orbit selector */}
            <div className="flex flex-col items-center gap-2">
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#888888", textTransform: "uppercase" }}>Загвар сонгох</p>
              <VariantOrbit variants={product.variants} selected={selectedVariant} onSelect={setSelectedVariant} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="pt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              {/* Category */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "#FFD600" }}>
                  <Tag size={9} color="#111111" />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#888888", textTransform: "uppercase" }}>{product.category}</span>
              </div>

              {/* Name */}
              <h1 className="font-black leading-tight mb-2" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#111111" }}>
                {product.name}
              </h1>

              {/* Selected variant */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVariant.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: selectedVariant.color, boxShadow: `0 0 8px ${selectedVariant.color}80` }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", color: "#555555" }}>{selectedVariant.name}</span>
                </motion.div>
              </AnimatePresence>

              {/* Accent bar */}
              <div className="w-12 h-1 rounded-full mb-6" style={{ background: "#FFD600" }} />

              {/* Description */}
              <p className="text-base leading-relaxed mb-8" style={{ fontFamily: "'Syne',sans-serif", color: "#666666" }}>{product.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: "Нарийвчлал", value: "0.1mm" },
                  { label: "Material", value: "PLA / ABS / Resin" },
                  { label: "Хугацаа", value: "3–7 хоног" },
                  { label: "Баталгаа", value: "Чанарын баталгаатай" },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#333333", fontWeight: 600 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <AnimatePresence mode="wait">
                <motion.div key={selectedVariant.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-8">
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Үнэ</p>
                  <div className="flex items-baseline gap-3">
                    <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "#111111" }}>₮{price.toLocaleString()}</span>
                    {selectedVariant.priceDelta > 0 && (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem", color: "#888888" }}>+₮{selectedVariant.priceDelta.toLocaleString()}</span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* CTA */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase"
                  style={{
                    fontFamily: "'Orbitron',sans-serif",
                    background: added ? "rgba(34,197,94,0.12)" : "#FFD600",
                    color: added ? "#16a34a" : "#111111",
                    border: added ? "1.5px solid rgba(34,197,94,0.3)" : "none",
                    boxShadow: added ? "none" : "0 4px 24px rgba(255,214,0,0.4)",
                    letterSpacing: "0.08em",
                    transition: "all 0.3s ease",
                  }}
                >
                  <ShoppingCart size={16} />
                  {added ? "Нэмэгдлээ!" : "Сагсанд нэмэх"}
                </motion.button>

                <a
                  href="#order"
                  onClick={onBack}
                  className="px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all duration-200 hover:bg-black hover:text-white"
                  style={{ fontFamily: "'Orbitron',sans-serif", border: "2px solid #111111", color: "#111111", letterSpacing: "0.06em" }}
                >
                  Захиалга
                  <ChevronRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
