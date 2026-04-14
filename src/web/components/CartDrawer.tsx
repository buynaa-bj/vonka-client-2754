import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQty, total } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/07">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FFD600" }}>
                  <ShoppingBag size={16} color="#111111" />
                </div>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.8rem", letterSpacing: "0.12em", color: "#111111" }}>
                  САГС
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/05 rounded-lg transition-colors">
                <X size={18} color="#555555" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-[#888888]">
                  <ShoppingBag size={48} className="opacity-20" color="#111111" />
                  <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem" }}>Сагс хоосон байна</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 rounded-2xl flex gap-4"
                    style={{ background: "#F7F7F7", border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: "#FFD600" }}
                    >
                      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.7rem", color: "#111111", fontWeight: 700 }}>3D</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ fontFamily: "'Syne',sans-serif", color: "#111111" }}>{item.name}</p>
                      <p className="text-sm mt-0.5 font-mono font-bold" style={{ color: "#FFD600", WebkitTextStroke: "0.5px #CC9900" }}>₮{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/08 transition-colors"
                        style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                        <Minus size={11} color="#333333" />
                      </button>
                      <span className="w-6 text-center text-sm font-mono font-bold" style={{ color: "#111111" }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/08 transition-colors"
                        style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                        <Plus size={11} color="#333333" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-1 p-1 hover:text-red-500 transition-colors" style={{ color: "#BBBBBB" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-black/07 space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "'Syne',sans-serif", color: "#888888", fontSize: "0.85rem" }}>Нийт дүн</span>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#111111" }}>₮{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  style={{ fontFamily: "'Orbitron',sans-serif", background: "#FFD600", color: "#111111", letterSpacing: "0.1em", boxShadow: "0 4px 24px rgba(255,214,0,0.35)" }}
                >
                  Захиалах
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
