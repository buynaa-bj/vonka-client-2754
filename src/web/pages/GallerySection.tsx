import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";

const galleryItems = [
  { id: 1, title: "Dragon Figurine", category: "figurine", accent: "#FFD600" },
  { id: 2, title: "Engine Part", category: "parts", accent: "#111111" },
  { id: 3, title: "Phone Case v2", category: "phone-case", accent: "#FFD600" },
  { id: 4, title: "Product Prototype", category: "prototype", accent: "#333333" },
  { id: 5, title: "Custom Trophy", category: "figurine", accent: "#FFD600" },
  { id: 6, title: "Mechanical Gear Set", category: "parts", accent: "#222222" },
  { id: 7, title: "Miniature Castle", category: "figurine", accent: "#FFD600" },
  { id: 8, title: "Bracket Assembly", category: "parts", accent: "#444444" },
];

const filters = ["all", "figurine", "prototype", "phone-case", "parts"];

function GalleryCard({ item, index }: { item: typeof galleryItems[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
      className="group relative cursor-pointer rounded-3xl overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.07)",
        aspectRatio: index % 5 === 0 ? "3/4" : "1/1",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Abstract art */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 0.97, 1] }}
          transition={{ duration: 5 + index * 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "65%",
            height: "65%",
            background: item.accent === "#FFD600"
              ? "radial-gradient(ellipse at 30% 30%, rgba(255,214,0,0.4) 0%, rgba(255,214,0,0.1) 50%, transparent 70%)"
              : "radial-gradient(ellipse at 30% 30%, rgba(17,17,17,0.15) 0%, rgba(17,17,17,0.05) 50%, transparent 70%)",
            borderRadius: "40% 60% 30% 70% / 50% 30% 70% 50%",
            border: `1px solid ${item.accent === "#FFD600" ? "rgba(255,214,0,0.35)" : "rgba(0,0,0,0.12)"}`,
          }}
        />
        <div
          className="absolute"
          style={{
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            background: item.accent === "#FFD600"
              ? "radial-gradient(circle, rgba(255,214,0,0.5) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)" }}
      >
        <h3 className="font-bold text-sm text-center" style={{ fontFamily: "'Syne',sans-serif", color: "#111111" }}>{item.title}</h3>
        <span
          className="text-xs px-3 py-1 rounded-full font-bold"
          style={{
            background: item.accent === "#FFD600" ? "#FFD600" : "#111111",
            color: item.accent === "#FFD600" ? "#111111" : "#FFFFFF",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {item.category}
        </span>
      </motion.div>

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.95), transparent)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem", color: "#888888" }}>{item.title}</p>
      </div>

      {/* Accent dot top right */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: item.accent }} />
    </motion.div>
  );
}

export function GallerySection() {
  const [filter, setFilter] = useState("all");
  const ref = useScrollReveal();
  const filtered = filter === "all" ? galleryItems : galleryItems.filter(i => i.category === filter);

  return (
    <section id="gallery" className="py-24 relative" style={{ background: "#EBEBEB" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="section-reveal">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#888888", textTransform: "uppercase" }}>Gallery</span>
              </div>
              <h2 className="font-black" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#111111" }}>ГАЛЛЕРЕЙ</h2>
              <p className="mt-2 text-sm" style={{ fontFamily: "'Syne',sans-serif", color: "#888888" }}>Өмнөх ажлуудын дээж</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200"
                  style={{ background: filter === f ? "#FFD600" : "rgba(0,0,0,0.06)", color: filter === f ? "#111111" : "#666666", fontFamily: "'Syne',sans-serif", boxShadow: filter === f ? "0 2px 12px rgba(255,214,0,0.3)" : "none" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => <GalleryCard key={item.id} item={item} index={i} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
