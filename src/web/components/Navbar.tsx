import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "../hooks/useCart";

const links = [
  { href: "#hero", label: "Нүүр" },
  { href: "#products", label: "Бүтээгдэхүүн" },
  { href: "#gallery", label: "Галлерей" },
  { href: "#about", label: "Тухай" },
  { href: "#order", label: "Захиалга" },
  { href: "#contact", label: "Холбоо" },
];

export function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full flex justify-center"
        style={{
          background: scrolled ? "rgba(242,242,242,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
          padding: scrolled ? "12px 0" : "20px 0",
        }}
      >
        <div className="w-full max-w-7xl px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3">
            <Logo size={32} />
            <span style={{ fontFamily: "'Orbitron',sans-serif", letterSpacing: "0.15em", fontSize: "0.9rem", fontWeight: 700, color: "#111111" }}>
              VONKA<span style={{ color: "#888888", fontWeight: 400 }}> STUDIO</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm hover:text-black transition-colors duration-200"
                style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", color: "#666666", textTransform: "uppercase" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCartOpen}
              className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ background: "#FFD600", border: "none" }}
            >
              <ShoppingCart size={16} color="#111111" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-mono font-bold"
                  style={{ background: "#111111", color: "#FFD600" }}>
                  {itemCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-[#111111]" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden py-4"
            style={{ background: "#F2F2F2", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block px-8 py-3 text-sm uppercase hover:bg-[rgba(255,214,0,0.12)] transition-colors"
                style={{ fontFamily: "'Syne',sans-serif", color: "#444444", letterSpacing: "0.08em" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
