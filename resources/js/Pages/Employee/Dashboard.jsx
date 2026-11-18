import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { formatDate, formatTime } from '@/utils/date';
import { getTheme } from '@/utils/themes';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import {
  Calendar,
  Award,
  Clock,
  Download,
  User,
  Building2,
  Layers,
  Sparkles,
  CalendarDays,
  MapPin,
  X,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   PASKONG PINOY DECORATIVE ELEMENTS
   ──────────────────────────────────────────────────────────── */

/**
 * Heirloom Capiz-shell Filipino Parol — bamboo outer ring, faceted
 * stained-glass star, concentric rosette core, and flowing buntot tails.
 */
const Parol = ({ className = '' }) => (
  <svg viewBox="0 0 240 260" className={className} fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="capizHalo" cx="0.5" cy="0.44" r="0.5">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.6" />
        <stop offset="48%" stopColor="#f59e0b" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="capizGold" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="45%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="capizCrimson" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="55%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <linearGradient id="capizEmerald" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="55%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
      <radialGradient id="capizCore" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#f59e0b" />
      </radialGradient>
    </defs>

    {/* Warm incandescent aura */}
    <circle cx="120" cy="112" r="112" fill="url(#capizHalo)" />

    {/* Outer bamboo frame rings */}
    <circle
      cx="120"
      cy="112"
      r="76"
      stroke="#fcd34d"
      strokeOpacity="0.45"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <circle
      cx="120"
      cy="112"
      r="68"
      stroke="#fef3c7"
      strokeOpacity="0.35"
      strokeWidth="1.25"
    />

    {/* Radiating fiesta rays (16 points) */}
    {Array.from({ length: 16 }).map((_, i) => {
      const palette = ['#fcd34d', '#ef4444', '#22c55e', '#fbbf24'];
      return (
        <rect
          key={i}
          x="118.25"
          y="22"
          width="3.5"
          height={i % 2 === 0 ? '20' : '13'}
          rx="1.75"
          fill={palette[i % palette.length]}
          opacity={i % 2 === 0 ? '0.9' : '0.65'}
          transform={`rotate(${i * 22.5} 120 112)`}
        />
      );
    })}

    {/* Secondary 5-point crimson & emerald backing star */}
    <polygon
      points="120,44 134,88 180,88 143,115 157,158 120,132 83,158 97,115 60,88 106,88"
      fill="url(#capizCrimson)"
      fillOpacity="0.88"
      stroke="#fde68a"
      strokeWidth="1.25"
      strokeLinejoin="round"
      transform="rotate(36 120 112) scale(0.84) translate(22.8 21.3)"
    />

    {/* Main 5-point Capiz shell star */}
    <polygon
      points="120,42 137,89 186,89 147,118 161,166 120,137 79,166 93,118 54,89 103,89"
      fill="url(#capizGold)"
      stroke="#fffbeb"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />

    {/* Translucent emerald capiz facet accents on star tips */}
    <polygon
      points="120,52 129,84 111,84"
      fill="url(#capizEmerald)"
      fillOpacity="0.72"
    />
    <polygon
      points="174,93 144,109 138,94"
      fill="url(#capizEmerald)"
      fillOpacity="0.65"
    />
    <polygon
      points="66,93 102,94 96,109"
      fill="url(#capizEmerald)"
      fillOpacity="0.65"
    />

    {/* Inner geometric capiz lattice */}
    <polygon
      points="120,68 130,96 160,96 136,113 145,142 120,124 95,142 104,113 80,96 110,96"
      fill="#fffbeb"
      fillOpacity="0.28"
      stroke="#fffbeb"
      strokeWidth="1.1"
    />
    <circle
      cx="120"
      cy="112"
      r="22"
      fill="none"
      stroke="#fef3c7"
      strokeOpacity="0.7"
      strokeWidth="1"
    />

    {/* Glowing candle-warm center rosette */}
    <circle cx="120" cy="112" r="13" fill="url(#capizCore)" />
    <circle cx="120" cy="112" r="5.5" fill="#ffffff" />

    {/* Traditional flowing buntot (tassel tails) */}
    <path
      d="M104 152 Q98 184 86 218"
      stroke="#ef4444"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M120 144 Q120 185 120 228"
      stroke="#fbbf24"
      strokeWidth="2.75"
      strokeLinecap="round"
    />
    <path
      d="M136 152 Q142 184 154 218"
      stroke="#22c55e"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Diamond buntot tips */}
    <polygon points="86,216 90,224 86,232 82,224" fill="#ef4444" />
    <polygon points="120,226 125,236 120,246 115,236" fill="#fbbf24" />
    <polygon points="154,216 158,224 154,232 150,224" fill="#22c55e" />
  </svg>
);

/** Festive catenary garland of warm Filipino Christmas lights & tiny stars. */
const ChristmasLights = () => {
  const bulbs = [
    { color: '#dc2626', glow: 'rgba(220, 38, 38, 0.55)', y: 2 },
    { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', y: 5 },
    { color: '#16a34a', glow: 'rgba(22, 163, 74, 0.55)', y: 8 },
    { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.65)', y: 10 },
    { color: '#e11d48', glow: 'rgba(225, 29, 72, 0.55)', y: 12 },
    { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', y: 13 },
    { color: '#15803d', glow: 'rgba(21, 128, 61, 0.55)', y: 14 },
    { color: '#fde047', glow: 'rgba(253, 224, 71, 0.7)', y: 14 },
    { color: '#dc2626', glow: 'rgba(220, 38, 38, 0.55)', y: 14 },
    { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', y: 13 },
    { color: '#16a34a', glow: 'rgba(22, 163, 74, 0.55)', y: 12 },
    { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.65)', y: 10 },
    { color: '#e11d48', glow: 'rgba(225, 29, 72, 0.55)', y: 8 },
    { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', y: 5 },
    { color: '#15803d', glow: 'rgba(21, 128, 61, 0.55)', y: 2 },
  ];

  return (
    <div className="relative my-4 py-3" aria-hidden="true">
      {/* Subtle draped wire */}
      <svg
        viewBox="0 0 800 30"
        preserveAspectRatio="none"
        className="pointer-events-none mx-auto h-6 w-full max-w-4xl"
      >
        <path
          d="M 16 6 Q 400 28 784 6"
          fill="none"
          stroke="url(#garlandWire)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="garlandWire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
            <stop offset="20%" stopColor="#b45309" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.65" />
            <stop offset="80%" stopColor="#b45309" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Warm bulbs hanging along the drape */}
      <div className="mx-auto -mt-5 flex max-w-4xl items-start justify-between px-4 sm:px-10">
        {bulbs.map((b, i) => (
          <div
            key={i}
            className="flex flex-col items-center"
            style={{ transform: `translateY(${b.y}px)` }}
          >
            <span className="h-1.5 w-1 rounded-t-sm bg-amber-800/60" />
            <span
              className="h-2.5 w-2 rounded-full motion-safe:animate-pulse"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 0 10px 2px ${b.glow}, 0 2px 6px ${b.glow}`,
                animationDelay: `${i * 180}ms`,
                animationDuration: '2.6s',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Soft Simbang Gabi dawn stars scattered gently across the hero sky. */
const Starlight = () => {
  const stars = [
    { top: '14%', left: '7%', size: 3, delay: 0 },
    { top: '20%', left: '66%', size: 2.5, delay: 450 },
    { top: '58%', left: '14%', size: 2, delay: 900 },
    { top: '76%', left: '76%', size: 3, delay: 1350 },
    { top: '28%', left: '43%', size: 2, delay: 650 },
    { top: '82%', left: '34%', size: 2.5, delay: 1500 },
    { top: '38%', left: '56%', size: 2, delay: 1100 },
    { top: '18%', left: '28%', size: 2, delay: 300 },
  ];

  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-amber-100 motion-safe:animate-pulse"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}ms`,
            animationDuration: '3.2s',
            boxShadow: '0 0 8px 1.5px rgba(253, 230, 138, 0.7)',
          }}
        />
      ))}
    </>
  );
};

/** Subtle woven Capiz & Banderitas trim along the top of the welcome banner. */
const BanderitasTrim = () => {
  const colors = ['#dc2626', '#f59e0b', '#16a34a', '#fde047', '#b91c1c', '#15803d'];
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 flex justify-between overflow-hidden opacity-85"
      aria-hidden="true"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="h-2.5 w-4 shrink-0"
          style={{
            backgroundColor: colors[i % colors.length],
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
        />
      ))}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   DASHBOARD
   ──────────────────────────────────────────────────────────── */

export default function Dashboard({
  auth,
  employee,
  stats,
  attendanceHistory,
  qrCodeData,
  upcomingEvents,
}) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = formatDate(new Date());
  const currentTime = formatTime(new Date());

  const themeName = employee?.theme || 'navy';
  const t = getTheme(themeName);
  const isChristmas = themeName === 'christmas';

  const formatEventTime = (date, time) => {
    if (!date || !time) return '—';
    return formatTime(`${date}T${time}`);
  };

  const downloadQR = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `qr-${employee.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.crossOrigin = 'anonymous';
    img.src = qrCodeData;
  };

  const profilePhoto = employee.profile_photo_url || '/default-avatar.png';
  const openPhotoModal = () => setShowPhotoModal(true);
  const closePhotoModal = () => setShowPhotoModal(false);

  const cardSurface = isChristmas
    ? 'border border-amber-200/80 bg-white/95 shadow-sm shadow-amber-900/5 transition-shadow duration-200 hover:shadow-md hover:shadow-amber-900/10'
    : 'bg-white shadow-sm';

  return (
    <EmployeeLayout user={auth.user}>
      <Head title="Dashboard" />

      <div
        className={`min-h-screen py-5 sm:py-7 lg:py-9 ${
          isChristmas
            ? 'bg-gradient-to-b from-[#fdf8f0] via-[#fcf3e6] to-[#f2f7f3]'
            : ''
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ═══ Welcome Banner (Simbang Gabi & Capiz Parol Hero) ═══ */}
          <div
            className={`relative mb-6 overflow-hidden rounded-2xl p-5 text-white shadow-lg sm:p-7 lg:p-9 ${
              isChristmas
                ? 'bg-gradient-to-br from-[#5c0a14] via-[#7c121f] to-[#0f3d2e] shadow-red-950/25 ring-1 ring-amber-300/40'
                : t.bgSolid
            }`}
          >
            {isChristmas && (
              <>
                {/* Subtle woven Filipino banig/capiz diamond lattice backdrop */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="capizLattice"
                      width="36"
                      height="36"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M18 0 L36 18 L18 36 L0 18 Z"
                        fill="none"
                        stroke="#fef3c7"
                        strokeWidth="1"
                      />
                      <circle cx="18" cy="18" r="2" fill="#fde68a" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#capizLattice)" />
                </svg>

                {/* Fiesta banderitas trim */}
                <BanderitasTrim />

                {/* Radiant Capiz Parol centerpiece */}
                <Parol className="pointer-events-none absolute -bottom-10 -right-6 h-48 w-44 opacity-90 sm:-bottom-8 sm:right-4 sm:h-56 sm:w-52 lg:right-8 lg:h-64 lg:w-60" />

                {/* Dawn stars */}
                <Starlight />

                {/* Warm candlelit Simbang Gabi glow along the bottom */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-amber-500/25 via-amber-400/5 to-transparent" />
              </>
            )}

            <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                {isChristmas && (
                  <p className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wide text-amber-200 sm:text-sm">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Maligayang Pasko at Masaganang Bagong Taon</span>
                  </p>
                )}

                <div className="flex items-center gap-2.5">
                  {!isChristmas && (
                    <Sparkles className="h-4 w-4 shrink-0 text-yellow-300 sm:h-5 sm:w-5" />
                  )}
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl [text-wrap:balance]">
                    {getGreeting()}, {employee.formatted_name}!
                  </h1>
                </div>

                <p
                  className={`mt-1.5 flex flex-wrap items-center gap-x-2 text-xs sm:text-sm ${
                    isChristmas ? 'text-amber-100/90' : t.textAccent
                  }`}
                >
                  <span>{employee.department}</span>
                  <span aria-hidden="true" className="opacity-60">
                    ·
                  </span>
                  <span>{employee.cluster}</span>
                </p>
              </div>

              <div
                className={`relative z-10 flex flex-col items-start text-xs tabular-nums sm:items-end sm:text-sm ${
                  isChristmas ? 'sm:pr-44 lg:pr-52' : ''
                }`}
              >
                <span className={isChristmas ? 'text-amber-200/90' : t.textAccent}>
                  {currentDate}
                </span>
                <span
                  className={`mt-0.5 inline-flex items-center gap-1.5 font-semibold ${
                    isChristmas ? 'text-amber-50' : t.textLight
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 opacity-80" />
                  {currentTime}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ Stats Overview ═══ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className={`rounded-xl p-5 sm:p-6 ${cardSurface}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Events Attended
                  </p>
                  <p
                    className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${
                      isChristmas ? 'text-[#6e121b]' : t.textHeading
                    }`}
                  >
                    {stats.total_events}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isChristmas
                      ? 'bg-red-50 text-red-700 ring-1 ring-red-200/70'
                      : `${t.bgCard} ${t.textCard}`
                  }`}
                >
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-5 sm:p-6 ${cardSurface}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Upcoming Events
                  </p>
                  <p
                    className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${
                      isChristmas ? 'text-[#6e121b]' : t.textHeading
                    }`}
                  >
                    {stats.upcoming_events}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isChristmas
                      ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80'
                      : `${t.bgCard} ${t.textCard}`
                  }`}
                >
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-5 sm:p-6 sm:col-span-2 lg:col-span-1 ${cardSurface}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Attendance Rate
                  </p>
                  <p
                    className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${
                      isChristmas ? 'text-[#14532d]' : t.textHeading
                    }`}
                  >
                    {stats.attendance_rate || '—'}%
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isChristmas
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80'
                      : `${t.bgCard} ${t.textCard}`
                  }`}
                >
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Festive Capiz Light Garland Divider ═══ */}
          {isChristmas && <ChristmasLights />}

          {/* ═══ Profile & Aguinaldo QR Ornament ═══ */}
          <div className={`grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch ${!isChristmas ? 'mt-5' : ''}`}>
            {/* Employee Profile Card */}
            <div className={`flex flex-col justify-between rounded-xl p-5 sm:p-6 ${cardSurface}`}>
              <div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={openPhotoModal}
                    className="group relative shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    aria-label="View full profile photo"
                  >
                    {isChristmas && (
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-300 via-red-500 to-emerald-600 opacity-75 blur-[2px] transition-opacity duration-200 group-hover:opacity-100" />
                    )}
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className={`relative h-16 w-16 rounded-full border-2 object-cover transition-transform duration-200 group-hover:scale-[1.03] sm:h-20 sm:w-20 ${
                        isChristmas ? 'border-amber-50' : 'border-gray-200'
                      }`}
                    />
                  </button>
                  <div className="min-w-0">
                    <h3
                      className={`truncate text-base font-semibold sm:text-lg ${
                        isChristmas ? 'text-[#5c141a]' : t.textHeading
                      }`}
                    >
                      {employee.formatted_name}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {employee.department}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-5 divide-y border-t text-sm ${
                    isChristmas
                      ? 'divide-amber-100/80 border-amber-200/70'
                      : 'divide-gray-100 border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 py-3">
                    <Building2
                      className={`h-4 w-4 shrink-0 ${
                        isChristmas ? 'text-amber-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-gray-600">
                      <strong className="font-medium text-gray-800">Department:</strong>{' '}
                      {employee.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <Layers
                      className={`h-4 w-4 shrink-0 ${
                        isChristmas ? 'text-red-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-gray-600">
                      <strong className="font-medium text-gray-800">Cluster:</strong>{' '}
                      {employee.cluster}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 py-3 pb-0">
                    <User
                      className={`h-4 w-4 shrink-0 ${
                        isChristmas ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-gray-600">
                      <strong className="font-medium text-gray-800">Username:</strong>{' '}
                      {employee.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Card — Framed like a Hanging Parol Ornament */}
            <div
              className={`relative flex flex-col items-center justify-center rounded-xl p-5 text-center sm:p-6 ${
                isChristmas
                  ? 'mt-3 border border-amber-300/80 bg-gradient-to-b from-white via-[#fffcf6] to-amber-50/40 shadow-md shadow-amber-900/10 lg:mt-0'
                  : 'bg-white shadow-sm'
              }`}
            >
              {isChristmas && (
                <div
                  className="pointer-events-none absolute -top-4 left-1/2 flex -translate-x-1/2 flex-col items-center"
                  aria-hidden="true"
                >
                  <div className="h-3.5 w-0.5 bg-gradient-to-b from-amber-300 to-amber-500" />
                  <div className="h-4 w-5 rounded-t-md bg-gradient-to-b from-amber-300 to-amber-500 shadow-sm ring-1 ring-amber-200" />
                </div>
              )}

              <h3
                className={`text-base font-semibold sm:text-lg ${
                  isChristmas ? 'text-[#5c141a]' : t.textHeading
                }`}
              >
                {isChristmas ? 'Your Holiday Pass QR' : 'Your QR Code'}
              </h3>

              <div
                className={`mt-4 inline-flex items-center justify-center rounded-xl bg-white p-3 ${
                  isChristmas
                    ? 'border border-amber-200/90 shadow-inner ring-4 ring-amber-100/60'
                    : ''
                }`}
              >
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="h-36 w-36 object-contain sm:h-44 sm:w-44"
                />
              </div>

              <p className="mt-3 text-xs text-gray-500 sm:text-sm">
                Present this QR code to HR for attendance.
              </p>

              <button
                type="button"
                onClick={downloadQR}
                className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isChristmas
                    ? 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600 shadow-sm shadow-red-900/20 hover:from-red-800 hover:via-red-700 hover:to-amber-700 focus-visible:ring-red-600'
                    : `${t.bgButton} ${t.hoverButton}`
                }`}
              >
                <Download className="h-4 w-4" />
                Download QR (PNG)
              </button>
            </div>
          </div>

          {/* ═══ Upcoming Events ═══ */}
          <div className={`mt-6 rounded-xl p-5 sm:p-6 ${cardSurface}`}>
            <div className="flex items-center justify-between">
              <h3
                className={`flex items-center gap-2 text-base font-semibold sm:text-lg ${
                  isChristmas ? 'text-[#5c141a]' : t.textHeading
                }`}
              >
                <Calendar
                  className={`h-5 w-5 ${isChristmas ? 'text-red-700' : ''}`}
                />
                Upcoming Events
              </h3>
            </div>

            {upcomingEvents.length === 0 ? (
              <div
                className={`mt-4 rounded-xl p-6 text-center ${
                  isChristmas
                    ? 'border border-dashed border-amber-200 bg-amber-50/40 text-amber-900/70'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                <Calendar
                  className={`mx-auto h-10 w-10 ${
                    isChristmas ? 'text-amber-300' : 'text-gray-300'
                  }`}
                />
                <p className="mt-2 text-sm">No upcoming events.</p>
              </div>
            ) : (
              <ul
                className={`mt-4 divide-y ${
                  isChristmas ? 'divide-amber-100' : 'divide-gray-100'
                }`}
              >
                {upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className={`rounded-lg px-2 py-3.5 transition-colors first:pt-2 last:pb-2 ${
                      isChristmas ? 'hover:bg-amber-50/60' : 'hover:bg-gray-50/70'
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isChristmas ? 'text-[#5c141a]' : t.textHeading
                      }`}
                    >
                      {event.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-500 tabular-nums sm:text-sm">
                      <span>{formatDate(event.date)}</span>
                      <span aria-hidden="true" className="text-gray-300">
                        ·
                      </span>
                      <span>at {formatEventTime(event.date, event.time)}</span>
                      <span aria-hidden="true" className="text-gray-300">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin
                          className={`h-3.5 w-3.5 ${
                            isChristmas ? 'text-emerald-700' : 'text-gray-400'
                          }`}
                        />
                        {event.venue}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ═══ Attendance History ═══ */}
          <div className={`mt-6 rounded-xl p-5 sm:p-6 ${cardSurface}`}>
            <div className="flex items-center justify-between">
              <h3
                className={`text-base font-semibold sm:text-lg ${
                  isChristmas ? 'text-[#5c141a]' : t.textHeading
                }`}
              >
                Recent Attendance
              </h3>
              <span className="text-xs font-medium text-gray-400">Last 10</span>
            </div>

            {attendanceHistory.length === 0 ? (
              <div
                className={`mt-4 rounded-xl p-6 text-center ${
                  isChristmas
                    ? 'border border-dashed border-amber-200 bg-amber-50/40 text-amber-900/70'
                    : 'text-gray-500'
                }`}
              >
                <Calendar
                  className={`mx-auto h-10 w-10 ${
                    isChristmas ? 'text-amber-300' : 'text-gray-300'
                  }`}
                />
                <p className="mt-2 text-sm">No attendance records yet.</p>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead
                    className={
                      isChristmas
                        ? 'bg-gradient-to-r from-red-50/90 via-amber-50/80 to-emerald-50/60'
                        : 'bg-gray-50'
                    }
                  >
                    <tr>
                      <th
                        className={`px-3 py-2.5 text-left text-xs font-semibold tracking-wider ${
                          isChristmas ? 'text-[#7c121f]' : 'uppercase text-gray-500'
                        }`}
                      >
                        Event
                      </th>
                      <th
                        className={`px-3 py-2.5 text-left text-xs font-semibold tracking-wider ${
                          isChristmas ? 'text-[#7c121f]' : 'uppercase text-gray-500'
                        }`}
                      >
                        Date
                      </th>
                      <th
                        className={`hidden px-3 py-2.5 text-left text-xs font-semibold tracking-wider sm:table-cell ${
                          isChristmas ? 'text-[#7c121f]' : 'uppercase text-gray-500'
                        }`}
                      >
                        Venue
                      </th>
                      <th
                        className={`px-3 py-2.5 text-left text-xs font-semibold tracking-wider ${
                          isChristmas ? 'text-[#7c121f]' : 'uppercase text-gray-500'
                        }`}
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y bg-white ${
                      isChristmas ? 'divide-amber-100' : 'divide-gray-200'
                    }`}
                  >
                    {attendanceHistory.map((record, index) => (
                      <tr
                        key={index}
                        className={`transition-colors ${
                          isChristmas ? 'hover:bg-amber-50/40' : 'hover:bg-gray-50/70'
                        }`}
                      >
                        <td
                          className={`px-3 py-3 font-medium ${
                            isChristmas ? 'text-[#5c141a]' : t.textHeading
                          }`}
                        >
                          {record.event_title}
                        </td>
                        <td className="px-3 py-3 text-gray-500 tabular-nums">
                          {formatDate(record.event_date)}
                        </td>
                        <td className="hidden px-3 py-3 text-gray-500 sm:table-cell">
                          {record.venue}
                        </td>
                        <td className="px-3 py-3 text-gray-500 tabular-nums">
                          {formatTime(record.time_in)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Photo Modal ═══ */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={closePhotoModal}
        >
          <div
            className="relative w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePhotoModal}
              className="absolute -top-12 right-0 rounded-full p-1 text-white transition-colors hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={profilePhoto}
              alt="Profile"
              className={`h-auto max-h-[90vh] w-full rounded-xl object-contain shadow-2xl ${
                isChristmas ? 'ring-2 ring-amber-300/60' : ''
              }`}
            />
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}