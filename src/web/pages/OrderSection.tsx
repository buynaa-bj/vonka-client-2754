import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Package, Wrench, Smartphone, User, ChevronRight } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const orderTypes = [
  { key: "custom", label: "Custom", icon: Wrench, desc: "Өөрийн файлаар" },
  { key: "figurine", label: "Figurine", icon: User, desc: "Дүрс, баримал" },
  { key: "phone-case", label: "Phone Case", icon: Smartphone, desc: "Утасны бүрхэвч" },
  { key: "prototype", label: "Prototype", icon: Package, desc: "Инженерийн" },
];

export function OrderSection({ cartItems, cartTotal, onClearCart }: { cartItems: any[]; cartTotal: number; onClearCart: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", description: "", orderType: "custom" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const ref = useScrollReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: cartItems, total: cartTotal }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      onClearCart();
      setForm({ name: "", email: "", phone: "", description: "", orderType: "custom" });
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-40 w-full flex justify-center relative overflow-hidden " style={{ background: "#0A0A0A" }}>
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,214,0,0.03) 0%, transparent 60%)", filter: "blur(60px)" }} />

      <div className="w-full max-w-5xl px-6 relative z-10">
        <div ref={ref} className="section-reveal">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", letterSpacing: "0.2em", color: "#888888", textTransform: "uppercase" }}>Order</span>
              <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
            </div>
            <h2 className="font-black mb-4" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#FFFFFF", letterSpacing: "0.02em" }}>ЗАХИАЛГА</h2>
            <p style={{ fontFamily: "'Syne',sans-serif", color: "#888888", fontSize: "0.95rem" }}>Мөрөөдлөө биет болгох эхний алхам</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="rounded-[2rem] p-16 text-center max-w-xl mx-auto relative overflow-hidden"
                style={{ background: "rgba(20,20,20,0.6)", border: "1px solid rgba(255,214,0,0.15)", backdropFilter: "blur(20px)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD600] to-transparent opacity-50" />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}>
                  <CheckCircle size={72} color="#FFD600" className="mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,214,0,0.4)]" />
                </motion.div>
                <h3 className="text-3xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Orbitron',sans-serif", color: "#FFFFFF" }}>АМЖИЛТТАЙ!</h3>
                <p className="text-base leading-relaxed" style={{ fontFamily: "'Syne',sans-serif", color: "#AAAAAA" }}>
                  Таны захиалгыг хүлээн авлаа.<br /> Бид тун удахгүй баталгаажуулах болно.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSuccess(false)}
                  className="mt-10 px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200"
                  style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600", border: "1px solid rgba(255,214,0,0.25)", fontFamily: "'Syne',sans-serif" }}
                >
                  Буцах
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Left: Order type + cart */}
                <div className="rounded-[2rem] p-8 relative overflow-hidden" style={{ background: "rgba(25,25,25,0.4)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                  <div className="absolute -top-40 -left-40 w-80 h-80 bg-white opacity-[0.015] blur-[60px] rounded-full pointer-events-none" />

                  <h3 className="font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.85rem", color: "#FFFFFF", letterSpacing: "0.1em" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,214,0,0.15)" }}>
                      <Package size={14} color="#FFD600" />
                    </div>
                    ЗАХИАЛГЫН ТӨРӨЛ
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {orderTypes.map(t => {
                      const isActive = form.orderType === t.key;
                      return (
                        <motion.button
                          key={t.key}
                          type="button"
                          onClick={() => setForm({ ...form, orderType: t.key })}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-4 rounded-2xl text-left relative overflow-hidden transition-all duration-300"
                          style={{
                            background: isActive ? "rgba(255,214,0,0.1)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isActive ? "#FFD600" : "rgba(255,255,255,0.05)"}`,
                            boxShadow: isActive ? "0 8px 32px rgba(255,214,0,0.15)" : "none",
                          }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeOrderBg"
                              className="absolute inset-0 z-0"
                              style={{ background: "radial-gradient(ellipse at top right, rgba(255,214,0,0.2) 0%, transparent 70%)" }}
                            />
                          )}
                          <div className="relative z-10">
                            <t.icon size={16} color={isActive ? "#FFD600" : "#888888"} className="mb-2 transition-colors duration-300" />
                            <p className="text-sm font-bold tracking-wide" style={{ fontFamily: "'Syne',sans-serif", color: isActive ? "#FFFFFF" : "#CCCCCC" }}>{t.label}</p>
                            <p className="mt-0.5" style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.7rem", color: isActive ? "#AAAAAA" : "#666666" }}>{t.desc}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Cart */}
                  {cartItems.length > 0 ? (
                    <div className="p-6 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#888888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Сагсны бараа</p>
                      <div className="space-y-3 mb-5">
                        {cartItems.map((item, i) => (
                          <div key={item.id} className="flex justify-between items-center" style={{ borderBottom: i === cartItems.length - 1 ? "none" : "1px dashed rgba(255,255,255,0.08)", paddingBottom: i === cartItems.length - 1 ? 0 : 12 }}>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#ECECEC" }}>
                              {item.name} <span style={{ color: "#666", fontSize: "0.75rem", marginLeft: 4 }}>× {item.quantity}</span>
                            </span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.85rem", color: "#FFD600", fontWeight: 600 }}>₮{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 flex justify-between items-end" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#888888" }}>Нийт дүн</span>
                        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.05em" }}>₮{cartTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 rounded-2xl flex flex-col items-center justify-center transition-all duration-300" style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                      <Package size={28} color="#444444" className="mb-3" />
                      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#666666" }}>Сагс хоосон байна</p>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.7rem", color: "#444444", marginTop: 4 }}>Та өөрийн файлаар custom захиалга өгөх боломжтой.</p>
                    </div>
                  )}
                </div>

                {/* Right: form */}
                <form onSubmit={handleSubmit} className="rounded-[2rem] p-8 space-y-5 relative overflow-hidden" style={{ background: "rgba(25,25,25,0.4)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                  <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#FFD600] opacity-[0.02] blur-[60px] rounded-full pointer-events-none" />

                  <h3 className="font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.85rem", color: "#FFFFFF", letterSpacing: "0.1em" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,214,0,0.15)" }}>
                      <Send size={14} color="#FFD600" />
                    </div>
                    ХОЛБОО БАРИХ
                  </h3>

                  <div className="space-y-4">
                    {[
                      { key: "name", label: "Нэр", placeholder: "Таны нэр", type: "text" },
                      { key: "email", label: "И-мэйл", placeholder: "example@email.com", type: "email" },
                      { key: "phone", label: "Утас", placeholder: "+976 XXXX XXXX", type: "tel" },
                    ].map(field => (
                      <div key={field.key} className="relative group">
                        <label className="block mb-2 transition-colors duration-300 group-focus-within:text-[#FFD600]" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#888888", textTransform: "uppercase", letterSpacing: "0.15em" }}>{field.label}</label>
                        <input
                          type={field.type}
                          required
                          placeholder={field.placeholder}
                          value={(form as any)[field.key]}
                          onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300 placeholder:text-[#444] focus:bg-[rgba(255,255,255,0.08)] block"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#FFFFFF",
                            fontFamily: "'Syne',sans-serif",
                            fontSize: "0.95rem",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "#FFD600"; e.target.style.boxShadow = "0 0 0 3px rgba(255,214,0,0.15)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>
                    ))}

                    <div className="relative group">
                      <label className="block mb-2 transition-colors duration-300 group-focus-within:text-[#FFD600]" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#888888", textTransform: "uppercase", letterSpacing: "0.15em" }}>Тайлбар</label>
                      <textarea
                        required rows={4}
                        placeholder="Юу хийлгэхийг хүсч байна вэ?"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl outline-none resize-none transition-all duration-300 placeholder:text-[#444] focus:bg-[rgba(255,255,255,0.08)] block"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#FFFFFF",
                          fontFamily: "'Syne',sans-serif",
                          fontSize: "0.95rem",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#FFD600"; e.target.style.boxShadow = "0 0 0 3px rgba(255,214,0,0.15)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: "#FF6666", fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", marginTop: "1rem" }}>
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="w-full py-4 mt-2 rounded-[0.85rem] font-black text-[0.8rem] tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60 relative overflow-hidden group"
                    style={{
                      fontFamily: "'Orbitron',sans-serif",
                      background: "#FFD600",
                      color: "#111111",
                      boxShadow: "0 8px 30px rgba(255,214,0,0.3)",
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.15] transition-opacity duration-300" />

                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send size={15} className="group-hover:translate-x-[-2px] transition-transform duration-300" />
                        ИЛГЭЭХ
                        <ChevronRight size={16} className="absolute right-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
