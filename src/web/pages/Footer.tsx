import { Logo } from "../components/Logo";

export function Footer() {
  return (
    <footer className="py-10 border-t" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <span style={{ fontFamily: "'Orbitron',sans-serif", letterSpacing: "0.15em", fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>
              VONKA<span style={{ color: "#555555", fontWeight: 400 }}> STUDIO</span>
            </span>
          </div>

          <div className="flex gap-6">
            {[["Нүүр","hero"],["Бүтээгдэхүүн","products"],["Галлерей","gallery"],["Тухай","about"],["Захиалга","order"]].map(([label, id]) => (
              <a key={id} href={`#${id}`}
                className="text-xs uppercase hover:text-white transition-colors"
                style={{ fontFamily: "'Syne',sans-serif", color: "#555555", letterSpacing: "0.06em" }}>
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "#FFD600" }} />
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#444444" }}>© 2024 Vonka Studio</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
