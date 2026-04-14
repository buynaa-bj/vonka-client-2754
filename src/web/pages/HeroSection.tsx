import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Layers, Settings, Package } from "lucide-react";
import * as THREE from "three";

// ─── 3D Scene ─────────────────────────────────────────────────────────────────

function PrinterCore({ lit }: { lit: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const { pointer } = useThree();
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    if (!lit) return;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / 2000, 1);
      setBrightness(t);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [lit]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (0.2 + brightness * 0.3);
    meshRef.current.rotation.x += (pointer.y * 0.25 - meshRef.current.rotation.x) * 0.04;
    meshRef.current.rotation.z += (pointer.x * 0.1 - meshRef.current.rotation.z) * 0.04;
    if (glowRef.current) {
      glowRef.current.intensity = brightness * 5 + Math.sin(state.clock.elapsedTime * 2) * 0.4 * brightness;
    }
  });

  return (
    <>
      <pointLight ref={glowRef} position={[0, 0, 0]} color="#FFD600" intensity={0} distance={8} />
      <pointLight position={[3, 2, 2]} color="#FFFFFF" intensity={brightness * 3} />
      <pointLight position={[-3, -2, 1]} color="#FFD600" intensity={brightness * 2} />
      <spotLight position={[0, 6, 0]} color="#FFFFFF" intensity={brightness * 4} angle={0.4} penumbra={0.5} />
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4} enabled={lit}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 4]} />
          <MeshDistortMaterial
            color={new THREE.Color(0.15, 0.12, 0.02)}
            metalness={0.9}
            roughness={0.1}
            distort={0.28 * brightness}
            speed={2}
            envMapIntensity={brightness * 3}
          />
        </mesh>
      </Float>
    </>
  );
}

function OrbitRing({ lit, radius, speed, tilt, color }: { lit: boolean; radius: number; speed: number; tilt: number; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    if (!lit) return;
    let s: number | null = null;
    const fn = (ts: number) => {
      if (!s) s = ts;
      const t = Math.min((ts - s - 600) / 1200, 1);
      if (t > 0) setOpacity(t * 0.5);
      if (t < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
  }, [lit]);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * speed; });
  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 8, 80]} />
        <meshBasicMaterial color={color || "#FFD600"} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function FloatingParticles({ lit }: { lit: boolean }) {
  const count = 120;
  const positions = useRef<Float32Array>((() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.2 + Math.random() * 2;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  })());
  const pointsRef = useRef<THREE.Points>(null);
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    if (!lit) return;
    let s: number | null = null;
    const fn = (ts: number) => {
      if (!s) s = ts;
      const t = Math.min((ts - s) / 2500, 1);
      setOpacity(t * 0.9);
      if (t < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
  }, [lit]);
  useFrame((state) => { if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08; });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FFD600" size={0.025} transparent opacity={opacity} sizeAttenuation />
    </points>
  );
}

function SmallOrbiters({ lit }: { lit: boolean }) {
  const shapes = [
    { pos: [-2.8, 0.6, -1] as [number,number,number], color: "#FFD600", scale: 0.13 },
    { pos: [2.6, -0.4, 0.8] as [number,number,number], color: "#111111", scale: 0.10 },
    { pos: [-1.8, -1.4, 1.5] as [number,number,number], color: "#FFC200", scale: 0.11 },
    { pos: [1.6, 1.8, -1.2] as [number,number,number], color: "#333333", scale: 0.09 },
    { pos: [-3.2, -0.3, 0.2] as [number,number,number], color: "#FFD600", scale: 0.08 },
    { pos: [2.4, 0.5, -2] as [number,number,number], color: "#888888", scale: 0.12 },
  ];
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    if (!lit) return;
    let s: number | null = null;
    const fn = (ts: number) => {
      if (!s) s = ts;
      const t = Math.min((ts - s - 400) / 1600, 1);
      if (t > 0) setOpacity(t);
      if (t < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
  }, [lit]);
  return (
    <>
      {shapes.map((sh, i) => (
        <Float key={i} speed={1 + i * 0.4} floatIntensity={0.6} rotationIntensity={0.8}>
          <mesh position={sh.pos} scale={sh.scale * opacity}>
            {i % 3 === 0 ? <octahedronGeometry args={[1]} /> : i % 3 === 1 ? <tetrahedronGeometry args={[1]} /> : <boxGeometry args={[1,1,1]} />}
            <meshStandardMaterial color={sh.color} metalness={0.8} roughness={0.15} emissive={sh.color} emissiveIntensity={0.2 * opacity} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function GridFloor({ lit }: { lit: boolean }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    if (!lit) return;
    let s: number | null = null;
    const fn = (ts: number) => {
      if (!s) s = ts;
      const t = Math.min((ts - s - 200) / 1800, 1);
      if (t > 0) setOpacity(t * 0.18);
      if (t < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
  }, [lit]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[24, 24, 24, 24]} />
      <meshBasicMaterial color="#FFD600" wireframe transparent opacity={opacity} />
    </mesh>
  );
}

function Scene({ lit, scrollY }: { lit: boolean; scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = scrollY * 0.003;
      groupRef.current.rotation.x = scrollY * 0.0004;
    }
  });
  return (
    <group ref={groupRef}>
      <ambientLight intensity={lit ? 0.6 : 0.05} color="#FFFFFF" />
      <PrinterCore lit={lit} />
      <OrbitRing lit={lit} radius={2.2} speed={0.4} tilt={0.3} color="#FFD600" />
      <OrbitRing lit={lit} radius={3.0} speed={-0.25} tilt={1.0} color="#333333" />
      <OrbitRing lit={lit} radius={3.8} speed={0.15} tilt={0.6} color="#FFD600" />
      <FloatingParticles lit={lit} />
      <SmallOrbiters lit={lit} />
      <GridFloor lit={lit} />
      {lit && <Sparkles count={50} size={1.5} speed={0.3} opacity={0.6} color="#FFD600" scale={9} />}
      <Environment preset="warehouse" />
    </group>
  );
}

// ─── Scroll Slides ─────────────────────────────────────────────────────────

const scrollSlides = [
  {
    id: 0, from: "left", icon: Zap,
    title: "PRINT", sub: "THE FUTURE",
    desc: "Таны санааг дижитал файлаас\nбодит биет болгон хувиргана",
    stat: "0.1mm нарийвчлал",
    accent: "#FFD600",
  },
  {
    id: 1, from: "right", icon: Layers,
    title: "50+", sub: "МАТЕРИАЛ",
    desc: "PLA · ABS · PETG · TPU\nResin болон бусад premium материал",
    stat: "FDM + SLA технологи",
    accent: "#111111",
  },
  {
    id: 2, from: "left", icon: Settings,
    title: "CUSTOM", sub: "ЗАХИАЛГА",
    desc: "Figurine, prototype, phone case\nболон аливаа custom parts",
    stat: "3–7 хоногт хүргэлт",
    accent: "#FFD600",
  },
  {
    id: 3, from: "right", icon: Package,
    title: "500+", sub: "ЗАХИАЛГА",
    desc: "Монголын анхдагч premium\n3D printing studio",
    stat: "Чанарын баталгаатай",
    accent: "#111111",
  },
];

function ScrollSlide({ slide, index, scrollY, windowH }: {
  slide: typeof scrollSlides[0];
  index: number;
  scrollY: number;
  windowH: number;
}) {
  const slideStart = windowH + index * windowH;
  const progress = Math.max(0, Math.min(1, (scrollY - slideStart) / (windowH * 0.65)));
  const exitProgress = Math.max(0, Math.min(1, (scrollY - (slideStart + windowH * 0.55)) / (windowH * 0.45)));
  const isLeft = slide.from === "left";
  const entryX = isLeft ? -130 + progress * 130 : 130 - progress * 130;
  const exitY = -exitProgress * 50;
  const opacity = Math.min(progress * 2, 1) * (1 - exitProgress);
  if (opacity < 0.01) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: isLeft ? "4%" : "auto",
        right: isLeft ? "auto" : "4%",
        top: "50%",
        transform: `translate(${entryX}px, calc(-50% + ${exitY}px))`,
        opacity,
        maxWidth: 360,
        width: "88%",
      }}
    >
      <div
        className="rounded-3xl p-6 md:p-8"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          border: `2px solid ${slide.accent === "#FFD600" ? "rgba(255,214,0,0.4)" : "rgba(17,17,17,0.12)"}`,
          boxShadow: slide.accent === "#FFD600"
            ? "0 20px 60px rgba(255,214,0,0.2), 0 4px 20px rgba(0,0,0,0.08)"
            : "0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: slide.accent, flexShrink: 0 }}
        >
          <slide.icon size={20} color={slide.accent === "#FFD600" ? "#111111" : "#FFFFFF"} />
        </div>

        <div className="mb-3">
          <div className="font-black leading-none" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", color: "#111111" }}>
            {slide.title}
          </div>
          <div className="text-sm tracking-widest mt-1 font-bold" style={{ fontFamily: "'Orbitron',sans-serif", color: slide.accent === "#FFD600" ? "#CC9900" : "#555555", letterSpacing: "0.2em" }}>
            {slide.sub}
          </div>
        </div>

        <div className="w-12 h-1 rounded-full mb-4" style={{ background: slide.accent }} />

        <p className="text-sm leading-relaxed mb-4 whitespace-pre-line" style={{ fontFamily: "'Syne',sans-serif", color: "#666666" }}>
          {slide.desc}
        </p>

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: slide.accent === "#FFD600" ? "rgba(255,214,0,0.15)" : "rgba(17,17,17,0.07)",
            color: slide.accent === "#FFD600" ? "#AA7700" : "#333333",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: slide.accent === "#FFD600" ? "#FFD600" : "#111111" }} />
          {slide.stat}
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export function HeroSection() {
  const [phase, setPhase] = useState<"dark" | "lighting" | "lit" | "text">("dark");
  const [scrollY, setScrollY] = useState(0);
  const [windowH, setWindowH] = useState(800);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("lighting"), 1000);
    const t2 = setTimeout(() => setPhase("lit"), 2800);
    const t3 = setTimeout(() => setPhase("text"), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    setWindowH(window.innerHeight);
    const r = () => setWindowH(window.innerHeight);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const lit = phase !== "dark";
  const showText = phase === "text";
  const totalScrollH = windowH * (1 + scrollSlides.length);
  const heroFade = Math.max(0, 1 - scrollY / (windowH * 0.45));
  const heroScale = 1 - Math.min(scrollY / (windowH * 0.5), 1) * 0.06;

  return (
    <div id="hero" style={{ height: totalScrollH }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#F2F2F2" }}>

        {/* 3D Canvas */}
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${heroScale})`, transition: "transform 0.05s linear" }}
        >
          <Canvas camera={{ position: [0, 0, 5.5], fov: 58 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
            <Scene lit={lit} scrollY={scrollY} />
          </Canvas>
        </div>

        {/* Light radial bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,214,0,0.12) 0%, transparent 65%)" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Dark intro overlay */}
        <AnimatePresence>
          {phase === "dark" && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              style={{ background: "#111111" }}
            />
          )}
        </AnimatePresence>

        {/* Flash on lighting */}
        <AnimatePresence>
          {phase === "lighting" && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,214,0,0.25) 0%, transparent 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.3] }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Hero text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          style={{ opacity: heroFade }}
        >
          <AnimatePresence>
            {showText && (
              <motion.div className="text-center px-4">
                {/* Main title */}
                <div className="mb-2 overflow-hidden">
                  {[
                    { text: "VONKA", delay: 0, color: "#111111" },
                    { text: "STUDIO", delay: 0.1, color: "#111111" },
                  ].map((line) => (
                    <motion.div
                      key={line.text}
                      initial={{ y: 110, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.85, delay: line.delay, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: "'Orbitron',sans-serif",
                        fontSize: "clamp(3.5rem, 12vw, 9rem)",
                        fontWeight: 900,
                        lineHeight: 0.95,
                        letterSpacing: "-0.02em",
                        color: line.text === "VONKA" ? "#111111" : "transparent",
                        WebkitTextStroke: line.text === "STUDIO" ? "2px #111111" : "none",
                        display: "block",
                      }}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </div>

                {/* Yellow accent bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: 4, background: "#FFD600", borderRadius: 2, width: "160px", margin: "12px auto 16px" }}
                />

                {/* Subtitles */}
                {[
                  { text: "Print the Future", delay: 0.32, bold: true },
                  { text: "Mongolia's Premier 3D Studio", delay: 0.46, bold: false },
                ].map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: line.delay, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: line.bold ? "'Orbitron',sans-serif" : "'Syne',sans-serif",
                      fontSize: "0.78rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: line.bold ? "#333333" : "#888888",
                      fontWeight: line.bold ? 600 : 400,
                    }}
                  >
                    {line.text}
                  </motion.p>
                ))}

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.65 }}
                  className="flex items-center justify-center gap-3 mt-10 pointer-events-auto"
                >
                  <a
                    href="#products"
                    className="px-8 py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:scale-105"
                    style={{
                      fontFamily: "'Orbitron',sans-serif",
                      background: "#FFD600",
                      color: "#111111",
                      letterSpacing: "0.1em",
                      boxShadow: "0 4px 30px rgba(255,214,0,0.45)",
                    }}
                  >
                    Бүтээгдэхүүн
                  </a>
                  <a
                    href="#order"
                    className="px-8 py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:bg-black hover:text-white"
                    style={{
                      fontFamily: "'Orbitron',sans-serif",
                      border: "2px solid #111111",
                      color: "#111111",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Захиалга
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll slides */}
        {showText && scrollSlides.map((slide, i) => (
          <ScrollSlide key={slide.id} slide={slide} index={i} scrollY={scrollY} windowH={windowH} />
        ))}

        {/* Scroll hint */}
        <AnimatePresence>
          {showText && scrollY < windowH * 0.08 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 pointer-events-none"
            >
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#999999", textTransform: "uppercase" }}>scroll</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ChevronDown size={16} color="#999999" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        {showText && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
            {[{ color: "#FFD600" }, ...scrollSlides.map(s => ({ color: s.accent }))].map((dot, i) => {
              const active = i === 0
                ? scrollY < windowH * 0.3
                : scrollY >= windowH * (0.8 + (i - 1)) && scrollY < windowH * (1.8 + (i - 1));
              return (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active ? 6 : 4,
                    height: active ? 22 : 5,
                    background: active ? dot.color : "rgba(0,0,0,0.15)",
                    boxShadow: active ? `0 0 8px ${dot.color}80` : "none",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Bottom blend */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, transparent, #F2F2F2)" }}
        />
      </div>
    </div>
  );
}
