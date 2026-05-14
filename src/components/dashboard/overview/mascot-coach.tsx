export function MascotCoach({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 178"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Ambient glow halo */}
      <ellipse cx="80" cy="105" rx="58" ry="52" fill="#4f46e5" opacity="0.10" />

      {/* Ears — behind head */}
      <circle cx="49" cy="32" r="17" fill="#8A5C28" />
      <circle cx="111" cy="32" r="17" fill="#8A5C28" />
      <circle cx="49" cy="32" r="10" fill="#D4875C" />
      <circle cx="111" cy="32" r="10" fill="#D4875C" />

      {/* Head */}
      <circle cx="80" cy="65" r="40" fill="#C4844A" />
      {/* Head underside shadow */}
      <ellipse cx="80" cy="96" rx="36" ry="10" fill="#8A5C28" opacity="0.28" />

      {/* Eyebrows */}
      <path d="M 61 46 Q 68 42 73 46" stroke="#5C3310" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 87 46 Q 92 42 99 46" stroke="#5C3310" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Eyes — white sclera */}
      <circle cx="68" cy="57" r="9.5" fill="white" />
      <circle cx="92" cy="57" r="9.5" fill="white" />
      {/* Pupils */}
      <circle cx="69.5" cy="58.5" r="6" fill="#1A0F08" />
      <circle cx="93.5" cy="58.5" r="6" fill="#1A0F08" />
      {/* Iris highlight (top-left) */}
      <circle cx="71.5" cy="55.5" r="2.5" fill="white" opacity="0.9" />
      <circle cx="95.5" cy="55.5" r="2.5" fill="white" opacity="0.9" />
      {/* Small secondary sparkle */}
      <circle cx="73.5" cy="60" r="1.2" fill="white" opacity="0.55" />
      <circle cx="97.5" cy="60" r="1.2" fill="white" opacity="0.55" />

      {/* Rosy cheeks */}
      <circle cx="55" cy="70" r="8" fill="#D9614A" opacity="0.30" />
      <circle cx="105" cy="70" r="8" fill="#D9614A" opacity="0.30" />

      {/* Snout */}
      <ellipse cx="80" cy="74" rx="18" ry="13" fill="#D4875C" />
      {/* Nose */}
      <ellipse cx="80" cy="68" rx="8.5" ry="5.5" fill="#2A1204" />
      {/* Nose shine */}
      <ellipse cx="76.5" cy="66.5" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.38)" />

      {/* Smile */}
      <path
        d="M 71 79 Q 80 88 89 79"
        stroke="#2A1204"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Dimple dots */}
      <circle cx="71.5" cy="79" r="1.5" fill="#2A1204" />
      <circle cx="88.5" cy="79" r="1.5" fill="#2A1204" />

      {/* Neck */}
      <rect x="67" y="97" width="26" height="14" rx="8" fill="#C4844A" />

      {/* Body / jersey */}
      <ellipse cx="80" cy="140" rx="41" ry="38" fill="#3730A3" />
      {/* Jersey front highlight panel */}
      <path
        d="M 58 108 Q 80 120 102 108 L 99 158 Q 80 165 61 158 Z"
        fill="#4338CA"
        opacity="0.65"
      />
      {/* V-collar */}
      <path
        d="M 70 108 L 80 122 L 90 108"
        stroke="#818CF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Jersey letters */}
      <text
        x="80"
        y="142"
        textAnchor="middle"
        fill="#a5b4fc"
        fontSize="10"
        fontWeight="800"
        letterSpacing="1"
        opacity="0.85"
      >
        CT
      </text>

      {/* Left arm — at rest */}
      <ellipse
        cx="37"
        cy="126"
        rx="14.5"
        ry="27"
        fill="#C4844A"
        transform="rotate(12 37 126)"
      />
      {/* Left fist */}
      <circle cx="30" cy="150" r="10.5" fill="#AE6E38" />

      {/* Right arm — raised, holding dumbbell */}
      <ellipse
        cx="123"
        cy="112"
        rx="14.5"
        ry="27"
        fill="#C4844A"
        transform="rotate(-24 123 112)"
      />
      {/* Right fist */}
      <circle cx="132" cy="91" r="10.5" fill="#AE6E38" />

      {/* Dumbbell */}
      {/* Bar */}
      <rect x="129" y="62" width="5.5" height="32" rx="2.5" fill="#1e1b4b" />
      {/* Top weight plates */}
      <rect x="119" y="60" width="25" height="10" rx="4" fill="#818cf8" />
      <rect x="122" y="58" width="19" height="4" rx="2" fill="#6366f1" />
      {/* Bottom weight plates */}
      <rect x="119" y="84" width="25" height="10" rx="4" fill="#818cf8" />
      <rect x="122" y="92" width="19" height="4" rx="2" fill="#6366f1" />
      {/* Center grip wrap */}
      <rect x="128" y="73" width="7.5" height="10" rx="2.5" fill="#4f46e5" />
      {/* Grip lines */}
      <line x1="130" y1="75.5" x2="134" y2="75.5" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
      <line x1="130" y1="78.5" x2="134" y2="78.5" stroke="#818cf8" strokeWidth="1" opacity="0.7" />
      <line x1="130" y1="81" x2="134" y2="81" stroke="#818cf8" strokeWidth="1" opacity="0.7" />

      {/* Whistle cord */}
      <path
        d="M 70 110 Q 80 118 90 110"
        stroke="#B45309"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="3 2.5"
      />
      {/* Whistle body */}
      <rect x="74" y="116" width="12" height="7" rx="3.5" fill="#F59E0B" />
      {/* Whistle stem */}
      <rect x="83" y="113" width="5.5" height="5" rx="1.5" fill="#D97706" />
      {/* Stem ball */}
      <circle cx="88" cy="112" r="2.5" fill="#F59E0B" />
      {/* Whistle slot */}
      <rect x="75.5" y="118.5" width="7" height="2" rx="1" fill="#B45309" opacity="0.4" />

      {/* Feet */}
      <ellipse cx="63" cy="172" rx="17" ry="7" fill="#8A5C28" />
      <ellipse cx="97" cy="172" rx="17" ry="7" fill="#8A5C28" />
      {/* Toe bumps */}
      <circle cx="53" cy="169" r="4.5" fill="#7A4E22" />
      <circle cx="63" cy="167" r="4.5" fill="#7A4E22" />
      <circle cx="73" cy="169" r="4.5" fill="#7A4E22" />
      <circle cx="87" cy="169" r="4.5" fill="#7A4E22" />
      <circle cx="97" cy="167" r="4.5" fill="#7A4E22" />
      <circle cx="107" cy="169" r="4.5" fill="#7A4E22" />
    </svg>
  )
}
