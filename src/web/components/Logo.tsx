export function Logo({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradY" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FFC200" />
        </linearGradient>
      </defs>
      <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" stroke={dark ? "#111111" : "#111111"} strokeWidth="1.5" fill="#FFD600" />
      <path d="M12 14 L20 28 L28 14" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="20" cy="28" r="2" fill="#111111" />
    </svg>
  );
}
