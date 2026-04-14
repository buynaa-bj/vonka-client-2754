import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Cpu, Layers, Zap, Shield } from "lucide-react";

const features = [
  { icon: Cpu, title: "Өндөр нарийвчлал", desc: "0.1mm хүртэлх нарийвчлалтай. FDM болон SLA технологи хоёуланг ашигладаг." },
  { icon: Layers, title: "50+ Material", desc: "PLA, ABS, PETG, TPU, Resin болон бусад өндөр чанарын материал." },
  { icon: Zap, title: "Хурдан хүргэлт", desc: "Ихэнх захиалгыг 3-5 хоногт. Яаралтай бол 24 цагт хийдэг." },
  { icon: Shield, title: "Чанарын баталгаа", desc: "Бүх бүтээгдэхүүн хүргэхийн өмнө чанарын шалгалтаас өнгөрдөг." },
];

const timeline = [
  { year: "2020", event: "Vonka Studio үүсгэн байгуулагдсан" },
  { year: "2021", event: "Анхны FDM принтерийн парк бүрдсэн" },
  { year: "2022", event: "SLA технологи нэмэгдсэн" },
  { year: "2023", event: "500+ захиалга биелүүлсэн" },
  { year: "2024", event: "Multi-material print боломжтой болсон" },
];

export function AboutSection() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: "#F2F2F2" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="section-reveal">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-1 rounded-full" style={{ background: "#FFD600" }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#888888", textTransform: "uppercase" }}>About us</span>
              </div>
              <h2 className="font-black mb-6" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#111111", lineHeight: 1.05 }}>
                VONKA<br />
                <span style={{ WebkitTextStroke: "2px #111111", color: "transparent" }}>STUDIO</span>
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ fontFamily: "'Syne',sans-serif", color: "#666666" }}>
                Монголын анхдагч premium 3D printing studio. Бид таны санааг дижитал файлаас бодит биет болгон хувиргана.
              </p>
              <p className="text-base leading-relaxed mb-10" style={{ fontFamily: "'Syne',sans-serif", color: "#888888" }}>
                Манай баг 4 жилийн туршлагатай. FDM болон SLA технологи хоёуланг эзэмшиж, 50 гаруй төрлийн материалаар ажилладаг.
              </p>

              {/* Timeline */}
              <div className="space-y-4 border-l-2 pl-6" style={{ borderColor: "#FFD600" }}>
                {timeline.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="relative">
                    <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full" style={{ background: "#FFD600", border: "2px solid #F2F2F2" }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#888888" }}>{item.year}</span>
                    <p className="text-sm font-semibold mt-0.5" style={{ fontFamily: "'Syne',sans-serif", color: "#333333" }}>{item.event}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.1)" }}
                  className="p-5 rounded-3xl transition-all duration-300"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)" }}
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#FFD600" }}>
                    <feat.icon size={18} color="#111111" />
                  </div>
                  <h4 className="font-bold text-sm mb-2" style={{ fontFamily: "'Syne',sans-serif", color: "#111111" }}>{feat.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: "'Syne',sans-serif", color: "#888888" }}>{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
