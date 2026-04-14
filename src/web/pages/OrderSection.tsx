import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Package, Wrench, Smartphone, User } from "lucide-react";
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
    <section id="order" className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div ref={ref} className="section-reveal">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#666666", textTransform: "uppercase" }}>Order</span>
              <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
            </div>
            <h2 className="font-black mb-3" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#FFFFFF" }}>ЗАХИАЛГА</h2>
            <p style={{ fontFamily: "'Syne',sans-serif", color: "#666666", fontSize: "0.9rem" }}>Custom захиалга өгөх эсвэл сагснаас checkout хийх</p>
          </div>

          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="rounded-3xl p-16 text-center"
              style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.2)" }}>
              <CheckCircle size={64} color="#FFD600" className="mx-auto mb-6" />
              <h3 className="text-2xl font-black mb-3" style={{ fontFamily: "'Orbitron',sans-serif", color: "#FFFFFF" }}>Захиалга илгэгдлээ!</h3>
              <p style={{ fontFamily: "'Syne',sans-serif", color: "#888888" }}>Бид 24 цагийн дотор тантай холбогдох болно.</p>
              <button onClick={() => setSuccess(false)} className="mt-8 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                style={{ background: "#FFD600", color: "#111111", fontFamily: "'Syne',sans-serif" }}>
                Дахин захиалах
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Order type + cart */}
              <div className="rounded-3xl p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="font-bold mb-5 flex items-center gap-2" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.8rem", color: "#FFFFFF", letterSpacing: "0.1em" }}>
                  <Package size={15} color="#FFD600" /> ЗАХИАЛГЫН ТӨРӨЛ
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {orderTypes.map(t => (
                    <button key={t.key} type="button" onClick={() => setForm({ ...form, orderType: t.key })}
                      className="p-3 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: form.orderType === t.key ? "#FFD600" : "rgba(255,255,255,0.05)",
                        border: form.orderType === t.key ? "none" : "1px solid rgba(255,255,255,0.07)",
                      }}>
                      <t.icon size={14} color={form.orderType === t.key ? "#111111" : "#888888"} />
                      <p className="text-xs font-bold mt-1" style={{ fontFamily: "'Syne',sans-serif", color: form.orderType === t.key ? "#111111" : "#CCCCCC" }}>{t.label}</p>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.68rem", color: form.orderType === t.key ? "#333333" : "#888888" }}>{t.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Cart */}
                {cartItems.length > 0 ? (
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#666666", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Сагсны бараа</p>
                    <div className="space-y-2 mb-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#CCCCCC" }}>{item.name} × {item.quantity}</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.85rem", color: "#FFD600", fontWeight: 700 }}>₮{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#666666" }}>Нийт</span>
                      <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, color: "#FFFFFF" }}>₮{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package size={32} color="#444444" className="mx-auto mb-3" />
                    <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", color: "#555555" }}>Сагс хоосон — custom захиалга өгч болно</p>
                  </div>
                )}
              </div>

              {/* Right: form */}
              <form onSubmit={handleSubmit} className="rounded-3xl p-7 space-y-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.8rem", color: "#FFFFFF", letterSpacing: "0.1em" }}>
                  <Send size={15} color="#FFD600" /> ХОЛБОО БАРИХ
                </h3>

                {[
                  { key: "name", label: "Нэр", placeholder: "Таны нэр", type: "text" },
                  { key: "email", label: "И-мэйл", placeholder: "example@email.com", type: "email" },
                  { key: "phone", label: "Утас", placeholder: "+976 XXXX XXXX", type: "tel" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: "#666666", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF", fontFamily: "'Syne',sans-serif", fontSize: "0.9rem" }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: "#666666", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 6 }}>Тайлбар</label>
                  <textarea required rows={4} placeholder="Юу хийлгэхийг хүсч байна вэ?"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF", fontFamily: "'Syne',sans-serif", fontSize: "0.9rem" }}
                  />
                </div>

                {error && <p style={{ color: "#FF6666", fontFamily: "'Syne',sans-serif", fontSize: "0.85rem" }}>{error}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
                  style={{ fontFamily: "'Orbitron',sans-serif", background: "#FFD600", color: "#111111", letterSpacing: "0.1em", boxShadow: "0 4px 24px rgba(255,214,0,0.3)" }}>
                  {submitting ? <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" /> : <><Send size={14} /> Захиалга илгээх</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
