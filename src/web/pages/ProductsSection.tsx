import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Tag, Star, ChevronRight } from "lucide-react";
import { ProductScene } from "../components/ProductScene";
import { useCart } from "../hooks/useCart";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface Variant {
  id: number;
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

const categories = [
  { key: "all", label: "Бүгд" },
  { key: "figurine", label: "Figurine" },
  { key: "prototype", label: "Prototype" },
  { key: "phone-case", label: "Phone Case" },
  { key: "parts", label: "Parts" },
];

function ProductCard({ product, onViewDetail }: { product: Product; onViewDetail: (id: number) => void }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
      className="rounded-3xl overflow-hidden cursor-pointer group"
      style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", transition: "box-shadow 0.3s ease" }}
      onClick={() => onViewDetail(product.id)}
    >
      {/* 3D Preview */}
      <div className="relative h-52 overflow-hidden" style={{ background: "#F7F7F7" }}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#FFD600", borderTopColor: "transparent" }} />
          </div>
        }>
          <ProductScene modelType={(defaultVariant?.modelType || product.modelType) as any} color={defaultVariant?.color} />
        </Suspense>

        {product.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "#FFD600", color: "#111111", fontFamily: "'JetBrains Mono',monospace" }}>
            <Star size={9} fill="#111111" />
            Featured
          </div>
        )}

        {product.variants?.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs"
            style={{ background: "rgba(255,255,255,0.9)", color: "#555555", fontFamily: "'JetBrains Mono',monospace", border: "1px solid rgba(0,0,0,0.08)" }}>
            {product.variants.length} загвар
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)" }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold"
            style={{ background: "#FFD600", color: "#111111", fontFamily: "'Syne',sans-serif" }}>
            <Eye size={14} />
            Дэлгэрэнгүй
          </div>
        </motion.div>

        {/* Color dots */}
        {product.variants?.length > 0 && (
          <div className="absolute bottom-3 left-4 flex gap-1.5">
            {product.variants.slice(0, 5).map((v) => (
              <div key={v.id} className="w-3 h-3 rounded-full" style={{ background: v.color, border: "1.5px solid rgba(0,0,0,0.12)" }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-base" style={{ fontFamily: "'Syne',sans-serif", color: "#111111" }}>
            {product.name}
          </h3>
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0 ml-2"
            style={{ background: "rgba(0,0,0,0.05)", color: "#666666", fontFamily: "'JetBrains Mono',monospace" }}>
            {product.category}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: "'Syne',sans-serif", color: "#888888" }}>
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono font-black text-xl" style={{ color: "#111111" }}>₮{product.price.toLocaleString()}</span>
            <span className="text-xs ml-1" style={{ fontFamily: "'JetBrains Mono',monospace", color: "#AAAAAA" }}>-с</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: added ? "rgba(34,197,94,0.12)" : "#FFD600",
                color: added ? "#16a34a" : "#111111",
                fontFamily: "'Syne',sans-serif",
                border: added ? "1px solid rgba(34,197,94,0.3)" : "none",
              }}
            >
              <ShoppingCart size={12} />
              {added ? "✓" : "Сагс"}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetail(product.id); }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-black hover:text-white"
              style={{ background: "rgba(0,0,0,0.06)", color: "#333333", fontFamily: "'Syne',sans-serif" }}
            >
              Харах
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductsSection({ onViewDetail }: { onViewDetail: (id: number) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const ref = useScrollReveal();

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(data => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  return (
    <section id="products" className="py-24 relative" style={{ background: "#F2F2F2" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="section-reveal">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#888888", textTransform: "uppercase" }}>Products</span>
              </div>
              <h2 className="font-black" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#111111" }}>
                БҮТЭЭГДЭХҮҮН
              </h2>
              <p className="mt-2 text-sm" style={{ fontFamily: "'Syne',sans-serif", color: "#888888" }}>
                Бараа дээр дарж загвар харж, захиалаарай
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    background: filter === cat.key ? "#FFD600" : "rgba(0,0,0,0.06)",
                    color: filter === cat.key ? "#111111" : "#666666",
                    border: "none",
                    boxShadow: filter === cat.key ? "0 2px 12px rgba(255,214,0,0.3)" : "none",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#FFD600", borderTopColor: "transparent" }} />
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onViewDetail={onViewDetail} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
