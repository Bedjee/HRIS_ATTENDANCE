import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Download, ArrowLeft } from 'lucide-react';
import { Link, Head } from '@inertiajs/react';
import { getTheme } from '@/utils/themes';

/* ────────────────────────────────────────────────────────────
   SCOPED PASKONG PINOY KEYFRAME ANIMATIONS
   ──────────────────────────────────────────────────────────── */

const QRChristmasAnimations = () => (
  <style>{`
    @keyframes qrParolSway {
      0%, 100% { transform: rotate(-3.5deg) translateY(0px); }
      50% { transform: rotate(3.5deg) translateY(2px); }
    }
    @keyframes qrRaysSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes qrCapizBreathe {
      0%, 100% { opacity: 0.72; transform: scale(0.97); }
      50% { opacity: 1; transform: scale(1.04); }
    }
    @keyframes qrStarTwinkle {
      0%, 100% { opacity: 0.35; transform: scale(0.8) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(18deg); }
    }
    @keyframes qrSparkFloat {
      0% { opacity: 0; transform: translateY(14px) scale(0.6); }
      35% { opacity: 0.9; }
      80% { opacity: 0.65; }
      100% { opacity: 0; transform: translateY(-38px) scale(1.05); }
    }
    @keyframes qrBulbChase {
      0%, 100% { opacity: 0.45; transform: scale(0.92); filter: brightness(0.85); }
      45% { opacity: 1; transform: scale(1.18); filter: brightness(1.35); }
    }
    @keyframes qrBanderitasWave {
      0%, 100% { transform: skewX(-2deg) scaleY(0.95); }
      50% { transform: skewX(2deg) scaleY(1.05); }
    }
    @keyframes qrOrnamentFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }
    @keyframes qrGoldShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes qrCardEnter {
      0% { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .qr-parol-sway {
      transform-origin: top center;
      animation: qrParolSway 5.5s ease-in-out infinite;
    }
    .qr-rays-spin {
      transform-origin: 100px 94px;
      animation: qrRaysSpin 34s linear infinite;
    }
    .qr-capiz-breathe {
      transform-origin: 100px 94px;
      animation: qrCapizBreathe 3.2s ease-in-out infinite;
    }
    .qr-star-twinkle {
      animation: qrStarTwinkle 2.8s ease-in-out infinite;
    }
    .qr-spark-float {
      animation: qrSparkFloat 4.4s ease-in-out infinite;
    }
    .qr-bulb-chase {
      animation: qrBulbChase 2.1s ease-in-out infinite;
    }
    .qr-banderitas {
      transform-origin: top center;
      animation: qrBanderitasWave 3.6s ease-in-out infinite;
    }
    .qr-ornament-float {
      animation: qrOrnamentFloat 4.2s ease-in-out infinite;
    }
    .qr-shimmer-btn {
      background-size: 200% 100%;
      animation: qrGoldShimmer 4.5s linear infinite;
    }
    .qr-card-enter {
      animation: qrCardEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .qr-parol-sway,
      .qr-rays-spin,
      .qr-capiz-breathe,
      .qr-star-twinkle,
      .qr-spark-float,
      .qr-bulb-chase,
      .qr-banderitas,
      .qr-ornament-float,
      .qr-shimmer-btn,
      .qr-card-enter {
        animation: none !important;
      }
    }
  `}</style>
);

/** Swaying Capiz Parol accent for the QR Pass header. */
const QRParol = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 220"
    className={`qr-parol-sway ${className}`}
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="qrCapizHalo" cx="0.5" cy="0.43" r="0.5">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="qrCapizGold" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    <circle cx="100" cy="94" r="92" fill="url(#qrCapizHalo)" className="qr-capiz-breathe" />
    <circle
      cx="100"
      cy="94"
      r="64"
      stroke="#fde047"
      strokeOpacity="0.48"
      strokeWidth="1.6"
      strokeDasharray="4 4"
    />

    <g className="qr-rays-spin">
      {Array.from({ length: 14 }).map((_, i) => {
        const palette = ['#fde047', '#ef4444', '#22c55e'];
        return (
          <rect
            key={i}
            x="98.5"
            y="16"
            width="3"
            height={i % 2 === 0 ? '18' : '11'}
            rx="1.5"
            fill={palette[i % 3]}
            opacity="0.9"
            transform={`rotate(${(i * 360) / 14} 100 94)`}
          />
        );
      })}
    </g>

    <polygon
      points="100,36 112,72 150,72 119,95 131,132 100,110 69,132 81,95 50,72 88,72"
      fill="#dc2626"
      fillOpacity="0.9"
      stroke="#fde68a"
      strokeWidth="1.2"
      transform="rotate(36 100 94) scale(0.84) translate(19 17.8)"
    />
    <polygon
      points="100,34 114,74 156,74 122,98 134,138 100,114 66,138 78,98 44,74 86,74"
      fill="url(#qrCapizGold)"
      stroke="#fffbeb"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon points="100,44 108,71 92,71" fill="#16a34a" fillOpacity="0.72" />
    <circle cx="100" cy="94" r="11" fill="#fef3c7" />
    <circle cx="100" cy="94" r="4.5" fill="#ffffff" />

    {/* Buntot tassels */}
    <path d="M87 127 Q81 154 71 184" stroke="#f87171" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M100 120 Q100 156 100 194" stroke="#fde047" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M113 127 Q119 154 129 184" stroke="#4ade80" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export default function QR({ auth, qrCodeData }) {
  const themeName = auth.user?.theme || 'navy';
  const t = getTheme(themeName);
  const isChristmas = themeName === 'christmas';

  const downloadQR = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qr-${auth.user.username}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.crossOrigin = 'anonymous';
    img.src = qrCodeData;
  };

  return (
    <EmployeeLayout user={auth.user}>
      <Head title="My QR Code" />
      {isChristmas && <QRChristmasAnimations />}

      <div className="py-6 sm:py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center gap-4">
            <Link
              href={route('employee.dashboard')}
              aria-label="Back to dashboard"
              className={`inline-flex items-center justify-center rounded-full p-2 transition-all duration-200 ${
                isChristmas
                  ? 'bg-white/10 text-amber-200 ring-1 ring-amber-300/35 hover:bg-amber-400/20 hover:text-amber-50'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1
  className={`text-2xl font-bold tracking-tight ${
    isChristmas
      ? 'text-[#5c141a]'
      : t.textHeading
  }`}
>
  My QR Code
</h1>

{isChristmas && (
  <p className="mt-0.5 text-xs font-medium text-[#5c141a]/80">
    Paskong Pinoy Attendance Pass · {auth.user.username}
  </p>
)}
            </div>
          </div>

          {/* QR Card */}
          <div
            className={`qr-card-enter overflow-hidden rounded-2xl ${
              isChristmas
                ? 'border-2 border-amber-300/80 bg-gradient-to-b from-[#fffdf8] via-[#fff8eb] to-[#fef3c7]/55 shadow-2xl shadow-black/35'
                : 'bg-white shadow-lg'
            }`}
          >
            {/* Festive Simbang Gabi Header Strip */}
            {isChristmas && (
              <div className="relative overflow-hidden bg-gradient-to-br from-[#7f101d] via-[#9e1622] to-[#0f4a36] px-6 py-6 text-white">
                {/* Capiz diamond lattice */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="qrCapizLattice"
                      width="32"
                      height="32"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M16 0 L32 16 L16 32 L0 16 Z"
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="1"
                      />
                      <circle cx="16" cy="16" r="1.5" fill="#fde047" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#qrCapizLattice)" />
                </svg>

                {/* Fluttering Banderitas */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 flex justify-between overflow-hidden"
                  aria-hidden="true"
                >
                  {Array.from({ length: 18 }).map((_, i) => {
                    const colors = ['#ef4444', '#facc15', '#22c55e', '#fb923c'];
                    return (
                      <span
                        key={i}
                        className="qr-banderitas h-3 w-4 shrink-0"
                        style={{
                          backgroundColor: colors[i % colors.length],
                          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                          animationDelay: `${(i % 4) * 200}ms`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Twinkling Tala Stars & Sparks */}
                {[
                  { top: '22%', left: '10%', size: 10, delay: '0ms' },
                  { top: '65%', left: '22%', size: 8, delay: '600ms' },
                  { top: '28%', left: '68%', size: 11, delay: '1100ms' },
                ].map((s, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="qr-star-twinkle pointer-events-none absolute"
                    style={{
                      top: s.top,
                      left: s.left,
                      width: s.size,
                      height: s.size,
                      animationDelay: s.delay,
                    }}
                  >
                    <path
                      d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                      fill="#fef08a"
                    />
                  </svg>
                ))}
                {[
                  { bottom: '10%', left: '18%', delay: '0.2s' },
                  { bottom: '14%', left: '54%', delay: '1.4s' },
                  { bottom: '8%', left: '78%', delay: '0.9s' },
                ].map((sp, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="qr-spark-float pointer-events-none absolute h-1 w-1 rounded-full bg-amber-200"
                    style={{
                      bottom: sp.bottom,
                      left: sp.left,
                      animationDelay: sp.delay,
                      boxShadow: '0 0 8px 2px rgba(251, 191, 36, 0.8)',
                    }}
                  />
                ))}

                {/* Swaying Parol */}
                <QRParol className="pointer-events-none absolute -bottom-8 -right-4 h-36 w-36 opacity-95 sm:right-2" />

                <div className="relative z-10 pr-24">
                  <p className="text-xs font-semibold tracking-wide text-amber-200">
                    Maligayang Pasko
                  </p>
                  <h2 className="mt-0.5 text-lg font-bold text-amber-50 sm:text-xl">
                    Holiday Attendance QR Pass
                  </h2>
                </div>
              </div>
            )}

            {/* Chasing Fairy Lights Divider */}
            {isChristmas && (
              <div
                className="pointer-events-none flex items-center justify-between border-b border-amber-200/80 bg-amber-50/70 px-6 py-2.5"
                aria-hidden="true"
              >
                {Array.from({ length: 14 }).map((_, i) => {
                  const bulbs = [
                    { color: '#ef4444', glow: 'rgba(239,68,68,0.85)' },
                    { color: '#facc15', glow: 'rgba(250,204,21,0.9)' },
                    { color: '#22c55e', glow: 'rgba(34,197,94,0.85)' },
                    { color: '#fb923c', glow: 'rgba(251,146,60,0.85)' },
                  ];
                  const b = bulbs[i % bulbs.length];
                  return (
                    <span
                      key={i}
                      className="qr-bulb-chase h-2.5 w-2 rounded-full"
                      style={{
                        backgroundColor: b.color,
                        boxShadow: `0 0 10px 2px ${b.glow}`,
                        animationDelay: `${(i % 4) * 380}ms`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* QR Display Body */}
            <div className="relative p-6 text-center sm:p-8">
              {/* Hanging Satin Ribbon Ornament Bow above QR */}
              {isChristmas && (
                <div
                  className="qr-ornament-float pointer-events-none mx-auto -mt-2 mb-3 flex flex-col items-center"
                  aria-hidden="true"
                >
                  <div className="h-3 w-3 rounded-full border-2 border-amber-400 bg-amber-200/70 shadow-sm" />
                  <svg viewBox="0 0 64 26" className="-mt-1 h-6 w-14 drop-shadow">
                    <path
                      d="M32 13 C22 2, 6 2, 8 14 C10 22, 24 18, 32 13 Z"
                      fill="#dc2626"
                      stroke="#fde68a"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M32 13 C42 2, 58 2, 56 14 C54 22, 40 18, 32 13 Z"
                      fill="#b91c1c"
                      stroke="#fde68a"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="32"
                      cy="13"
                      r="5"
                      fill="#f59e0b"
                      stroke="#fffbeb"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
              )}

              <div
                className={`mx-auto max-w-xs ${
                  isChristmas
                    ? 'rounded-2xl border-2 border-amber-300/90 bg-white p-4 shadow-md ring-4 ring-red-100/80'
                    : ''
                }`}
              >
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className={`h-auto w-full rounded-lg ${
                    isChristmas ? '' : 'border border-gray-200'
                  }`}
                />
              </div>

              <p
                className={`mt-5 text-sm ${
                  isChristmas ? 'text-stone-600' : 'text-gray-500'
                }`}
              >
                Your permanent QR code. Present it to HR for attendance.
              </p>

              <button
                type="button"
                onClick={downloadQR}
                className={`mt-5 inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isChristmas
                    ? 'qr-shimmer-btn bg-gradient-to-r from-[#991b1b] via-[#d97706] to-[#15803d] shadow-md shadow-red-900/30 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-amber-500'
                    : `${t.bgButton} ${t.hoverButton}`
                }`}
              >
                <Download className="mr-2 h-4 w-4" />
                Download as PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}