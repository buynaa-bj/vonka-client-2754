import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const contacts = [
  { icon: Phone, label: "Утас", value: "+976 9999 0000", href: "tel:+97699990000" },
  { icon: Mail, label: "И-мэйл", value: "hello@vonka.mn", href: "mailto:hello@vonka.mn" },
  { icon: MapPin, label: "Хаяг", value: "Улаанбаатар, Монгол", href: "#" },
  { icon: Clock, label: "Цагийн хуваарь", value: "Даваа–Бямба, 9:00–18:00", href: "#" },
];

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
];

export function ContactSection() {
  const ref = useScrollReveal();

  return (
    <section id="contact" className="py-40 relative w-full flex justify-center" style={{ background: "#F2F2F2" }}>
      <div className="w-full max-w-7xl px-6">
        <div ref={ref} className="section-reveal">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6  h-1 rounded-full" style={{ background: "#FFD600" }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#888888", textTransform: "uppercase" }}>Contact</span>
              </div>
              <h2 className="font-black mb-6" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#111111", lineHeight: 1.05 }}>
                ХОЛБОО<br />
                <span style={{ WebkitTextStroke: "2px #111111", color: "transparent" }}>БАРИХ</span>
              </h2>
              <p className="text-base leading-relaxed mb-10" style={{ fontFamily: "'Syne',sans-serif", color: "#666666" }}>
                Асуулт, захиалга эсвэл зүгээр л яриа дугуйлах бол чөлөөтэй холбогдоорой.
              </p>

              <div className="space-y-5">
                {contacts.map((c, i) => (
                  <motion.a
                    key={i} href={c.href}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110" style={{ background: "#FFD600" }}>
                      <c.icon size={16} color="#111111" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.label}</p>
                      <p className="font-semibold transition-colors" style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem", color: "#333333" }}>{c.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="flex gap-3 mt-10">
                {socials.map((s, i) => (
                  <a key={i} href={s.href}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-black hover:text-white"
                    style={{ background: "rgba(0,0,0,0.07)", color: "#333333" }}>
                    <s.icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: decorative map */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden h-80"
                style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
              >
                {/* Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                {/* Pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#FFD600", boxShadow: "0 0 40px rgba(255,214,0,0.4)" }}>
                      <MapPin size={22} color="#111111" />
                    </div>
                    <div className="px-4 py-2 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                      <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#111111" }}>Vonka Studio</p>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.75rem", color: "#888888" }}>Улаанбаатар</p>
                    </div>
                  </motion.div>
                </div>

                {/* Pulse rings */}
                {[1, 2, 3].map(ring => (
                  <motion.div key={ring} className="absolute rounded-full"
                    style={{ width: ring * 80, height: ring * 80, border: "1.5px solid rgba(255,214,0,0.3)", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
                    animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: ring * 0.4 }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
