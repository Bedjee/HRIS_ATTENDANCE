import { Head, Link } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { formatDate, formatTime } from '@/utils/date';
import { getTheme } from '@/utils/themes';
import { Calendar, Clock, Award, History } from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   SCOPED PASKONG PINOY KEYFRAME ANIMATIONS
   ──────────────────────────────────────────────────────────── */

const AttendanceChristmasAnimations = () => (
  <style>{`
    @keyframes attParolSway {
      0%, 100% { transform: rotate(-3.5deg) translateY(0px); }
      50% { transform: rotate(3.5deg) translateY(2px); }
    }
    @keyframes attRaysSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes attCapizBreathe {
      0%, 100% { opacity: 0.72; transform: scale(0.97); }
      50% { opacity: 1; transform: scale(1.04); }
    }
    @keyframes attStarTwinkle {
      0%, 100% { opacity: 0.35; transform: scale(0.8) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(18deg); }
    }
    @keyframes attSparkFloat {
      0% { opacity: 0; transform: translateY(14px) scale(0.6); }
      35% { opacity: 0.9; }
      80% { opacity: 0.65; }
      100% { opacity: 0; transform: translateY(-38px) scale(1.05); }
    }
    @keyframes attBulbChase {
      0%, 100% { opacity: 0.45; transform: scale(0.92); filter: brightness(0.85); }
      45% { opacity: 1; transform: scale(1.18); filter: brightness(1.35); }
    }
    @keyframes attBanderitasWave {
      0%, 100% { transform: skewX(-2deg) scaleY(0.95); }
      50% { transform: skewX(2deg) scaleY(1.05); }
    }
    @keyframes attCardEnter {
      0% { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .att-parol-sway {
      transform-origin: top center;
      animation: attParolSway 5.5s ease-in-out infinite;
    }
    .att-rays-spin {
      transform-origin: 100px 94px;
      animation: attRaysSpin 34s linear infinite;
    }
    .att-capiz-breathe {
      transform-origin: 100px 94px;
      animation: attCapizBreathe 3.2s ease-in-out infinite;
    }
    .att-star-twinkle {
      animation: attStarTwinkle 2.8s ease-in-out infinite;
    }
    .att-spark-float {
      animation: attSparkFloat 4.4s ease-in-out infinite;
    }
    .att-bulb-chase {
      animation: attBulbChase 2.1s ease-in-out infinite;
    }
    .att-banderitas {
      transform-origin: top center;
      animation: attBanderitasWave 3.6s ease-in-out infinite;
    }
    .att-card-enter {
      animation: attCardEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .att-parol-sway,
      .att-rays-spin,
      .att-capiz-breathe,
      .att-star-twinkle,
      .att-spark-float,
      .att-bulb-chase,
      .att-banderitas,
      .att-card-enter {
        animation: none !important;
      }
    }
  `}</style>
);

/** Swaying Capiz Parol accent for the Attendance hero banner. */
const AttendanceParol = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 220"
    className={`att-parol-sway ${className}`}
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="attCapizHalo" cx="0.5" cy="0.43" r="0.5">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="attCapizGold" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    <circle cx="100" cy="94" r="92" fill="url(#attCapizHalo)" className="att-capiz-breathe" />
    <circle
      cx="100"
      cy="94"
      r="64"
      stroke="#fde047"
      strokeOpacity="0.48"
      strokeWidth="1.6"
      strokeDasharray="4 4"
    />

    <g className="att-rays-spin">
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
      fill="url(#attCapizGold)"
      stroke="#fffbeb"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon points="100,44 108,71 92,71" fill="#16a34a" fillOpacity="0.72" />
    <circle cx="100" cy="94" r="11" fill="#fef3c7" />
    <circle cx="100" cy="94" r="4.5" fill="#ffffff" />

    <path d="M87 127 Q81 154 71 184" stroke="#f87171" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M100 120 Q100 156 100 194" stroke="#fde047" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M113 127 Q119 154 129 184" stroke="#4ade80" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

/** Draped chasing Christmas lights divider. */
const AttendanceLightsDivider = () => {
  const bulbs = [
    { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.85)', y: 2 },
    { color: '#fde047', glow: 'rgba(253, 224, 71, 0.9)', y: 6 },
    { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.85)', y: 9 },
    { color: '#fb923c', glow: 'rgba(251, 146, 60, 0.85)', y: 12 },
    { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.85)', y: 14 },
    { color: '#fde047', glow: 'rgba(253, 224, 71, 0.9)', y: 15 },
    { color: '#10b981', glow: 'rgba(16, 185, 129, 0.85)', y: 16 },
    { color: '#fef08a', glow: 'rgba(254, 240, 138, 0.95)', y: 16 },
    { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.85)', y: 16 },
    { color: '#fde047', glow: 'rgba(253, 224, 71, 0.9)', y: 15 },
    { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.85)', y: 14 },
    { color: '#fb923c', glow: 'rgba(251, 146, 60, 0.85)', y: 12 },
    { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.85)', y: 9 },
    { color: '#fde047', glow: 'rgba(253, 224, 71, 0.9)', y: 6 },
    { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.85)', y: 2 },
  ];

  return (
    <div className="relative my-5 py-2" aria-hidden="true">
      <svg
        viewBox="0 0 800 34"
        preserveAspectRatio="none"
        className="pointer-events-none mx-auto h-7 w-full max-w-5xl"
      >
        <defs>
          <linearGradient id="attGarlandWire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0" />
            <stop offset="15%" stopColor="#f59e0b" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 12 6 Q 400 32 788 6"
          fill="none"
          stroke="url(#attGarlandWire)"
          strokeWidth="2"
        />
      </svg>

      <div className="mx-auto -mt-6 flex max-w-5xl items-start justify-between px-4 sm:px-12">
        {bulbs.map((b, i) => (
          <div
            key={i}
            className="flex flex-col items-center"
            style={{ transform: `translateY(${b.y}px)` }}
          >
            <span className="h-2 w-1.5 rounded-t-sm bg-amber-300/80" />
            <span
              className="att-bulb-chase h-3.5 w-2.5 rounded-full"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 0 12px 3px ${b.glow}, 0 0 22px 4px ${b.glow}`,
                animationDelay: `${(i % 4) * 420}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Index({ auth, attendances, summary }) {
  const safeSummary = summary || { total_events: 0, total_attendances: 0, most_recent: null };
  const data = attendances?.data || [];

  const themeName = auth.user?.theme || 'navy';
  const t = getTheme(themeName);
  const isChristmas = themeName === 'christmas';

  return (
    <EmployeeLayout user={auth.user}>
      <Head title="My Attendance" />
      {isChristmas && <AttendanceChristmasAnimations />}

      <div className="py-5 sm:py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          {isChristmas ? (
            <div className="att-card-enter relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#7f101d] via-[#9e1622] to-[#0f4a36] p-5 text-white shadow-xl shadow-black/35 ring-1 ring-amber-300/45 sm:p-7">
              {/* Capiz lattice */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="attCapizLattice"
                    width="34"
                    height="34"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M17 0 L34 17 L17 34 L0 17 Z"
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="1"
                    />
                    <circle cx="17" cy="17" r="1.5" fill="#fde047" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#attCapizLattice)" />
              </svg>

              {/* Fluttering Banderitas */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 flex justify-between overflow-hidden"
                aria-hidden="true"
              >
                {Array.from({ length: 24 }).map((_, i) => {
                  const colors = ['#ef4444', '#facc15', '#22c55e', '#fb923c'];
                  return (
                    <span
                      key={i}
                      className="att-banderitas h-3 w-4 shrink-0"
                      style={{
                        backgroundColor: colors[i % colors.length],
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        animationDelay: `${(i % 5) * 200}ms`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Twinkling Tala Stars & Sparks */}
              {[
                { top: '18%', left: '8%', size: 10, delay: '0ms' },
                { top: '64%', left: '28%', size: 8, delay: '650ms' },
                { top: '24%', left: '62%', size: 11, delay: '1200ms' },
                { top: '72%', left: '72%', size: 9, delay: '400ms' },
              ].map((s, i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="att-star-twinkle pointer-events-none absolute"
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
                { bottom: '12%', left: '16%', delay: '0.2s' },
                { bottom: '10%', left: '46%', delay: '1.3s' },
                { bottom: '14%', left: '76%', delay: '0.8s' },
              ].map((sp, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="att-spark-float pointer-events-none absolute h-1 w-1 rounded-full bg-amber-200"
                  style={{
                    bottom: sp.bottom,
                    left: sp.left,
                    animationDelay: sp.delay,
                    boxShadow: '0 0 8px 2px rgba(251, 191, 36, 0.85)',
                  }}
                />
              ))}

              {/* Swaying Capiz Parol */}
              <AttendanceParol className="pointer-events-none absolute -bottom-10 -right-4 h-40 w-40 opacity-95 sm:right-4 sm:h-44 sm:w-44" />

              {/* Warm candlelight glow */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-amber-400/25 to-transparent"
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-center gap-4 pr-24">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-200 ring-1 ring-amber-300/50 backdrop-blur-sm">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-amber-200">
                    Maligayang Pasko · Attendance Record
                  </p>
                  <h1 className="bg-gradient-to-r from-amber-50 via-yellow-200 to-amber-100 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                    My Attendance
                  </h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 flex items-center">
              <History className={`h-8 w-8 ${t.icon}`} />
              <h1 className={`ml-3 text-2xl font-bold ${t.textHeading}`}>My Attendance</h1>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Events */}
            <div
              className={`att-card-enter relative overflow-hidden rounded-xl p-5 ${
                isChristmas
                  ? 'border border-amber-300/75 bg-gradient-to-br from-[#fffdf9] via-[#fff5f5] to-[#fef3c7]/60 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5'
                  : 'bg-white p-4 shadow-sm'
              }`}
              style={{ animationDelay: '70ms' }}
            >
              {isChristmas && (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-700 via-rose-500 to-amber-400" />
              )}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-stone-500 sm:text-sm">
                    Total Events
                  </span>
                  <p
                    className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${
                      isChristmas ? 'text-[#881320]' : t.textHeading
                    }`}
                  >
                    {safeSummary.total_events || 0}
                  </p>
                </div>
                <div
                  className={
                    isChristmas
                      ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-800 text-amber-100 shadow-md shadow-red-900/25 ring-2 ring-amber-300/60'
                      : ''
                  }
                >
                  <Award className={`h-5 w-5 ${isChristmas ? '' : t.icon}`} />
                </div>
              </div>
            </div>

            {/* Total Attendance */}
            <div
              className={`att-card-enter relative overflow-hidden rounded-xl p-5 ${
                isChristmas
                  ? 'border border-amber-300/75 bg-gradient-to-br from-[#fffdf9] via-[#fffbeb] to-[#fde68a]/40 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5'
                  : 'bg-white p-4 shadow-sm'
              }`}
              style={{ animationDelay: '140ms' }}
            >
              {isChristmas && (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-red-500" />
              )}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-stone-500 sm:text-sm">
                    Total Attendance
                  </span>
                  <p
                    className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${
                      isChristmas ? 'text-[#92400e]' : t.textHeading
                    }`}
                  >
                    {safeSummary.total_attendances || 0}
                  </p>
                </div>
                <div
                  className={
                    isChristmas
                      ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-900/25 ring-2 ring-amber-200/80'
                      : ''
                  }
                >
                  <Calendar className={`h-5 w-5 ${isChristmas ? '' : t.icon}`} />
                </div>
              </div>
            </div>

            {/* Most Recent */}
            <div
              className={`att-card-enter relative overflow-hidden rounded-xl p-5 ${
                isChristmas
                  ? 'border border-amber-300/75 bg-gradient-to-br from-[#fffdf9] via-[#f0fdf4] to-[#fef3c7]/50 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5'
                  : 'bg-white p-4 shadow-sm'
              }`}
              style={{ animationDelay: '210ms' }}
            >
              {isChristmas && (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-400" />
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-stone-500 sm:text-sm">
                    Most Recent
                  </span>
                  {safeSummary.most_recent ? (
                    <div className="mt-1">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isChristmas ? 'text-[#14532d]' : t.textHeading
                        }`}
                      >
                        {safeSummary.most_recent.event_title}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500 tabular-nums">
                        {formatTime(safeSummary.most_recent.time_in)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-stone-500">—</p>
                  )}
                </div>
                <div
                  className={
                    isChristmas
                      ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-amber-100 shadow-md shadow-emerald-900/25 ring-2 ring-amber-300/60'
                      : ''
                  }
                >
                  <Clock className={`h-5 w-5 ${isChristmas ? '' : t.icon}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Chasing Lights Divider */}
          {isChristmas && <AttendanceLightsDivider />}

          {/* Table */}
          <div
            className={`att-card-enter overflow-hidden rounded-xl ${
              isChristmas
                ? 'border border-amber-300/75 bg-[#fffdf9] shadow-xl shadow-black/25'
                : 'mt-6 bg-white shadow-sm'
            }`}
            style={{ animationDelay: '280ms' }}
          >
            {isChristmas && (
              <div className="flex items-center justify-between bg-gradient-to-r from-[#7c121f] via-[#991b1b] to-[#14532d] px-5 py-3 text-white">
                <h2 className="text-base font-semibold text-amber-50">
                  Attendance History
                </h2>
                <span className="text-xs font-medium text-amber-200 tabular-nums">
                  {data.length} {data.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            )}

            <div className="overflow-x-auto">
              {data.length === 0 ? (
                <div
                  className={`p-12 text-center ${
                    isChristmas ? 'bg-amber-50/40 text-amber-900/75' : 'text-gray-500'
                  }`}
                >
                  <History
                    className={`mx-auto h-12 w-12 ${
                      isChristmas ? 'text-amber-300' : 'text-gray-300'
                    }`}
                  />
                  <p className="mt-2 text-sm">No attendance records found.</p>
                </div>
              ) : (
                <table
                  className={`min-w-full divide-y ${
                    isChristmas ? 'divide-amber-200/70' : 'divide-gray-200'
                  }`}
                >
                  <thead
                    className={
                      isChristmas
                        ? 'bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50'
                        : 'bg-gray-50'
                    }
                  >
                    <tr>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${
                          isChristmas ? 'text-[#7c121f]' : 'font-medium uppercase text-gray-500'
                        }`}
                      >
                        Event
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${
                          isChristmas ? 'text-[#7c121f]' : 'font-medium uppercase text-gray-500'
                        }`}
                      >
                        Event Date
                      </th>
                      <th
                        className={`hidden px-4 py-3 text-left text-xs font-semibold tracking-wider sm:table-cell ${
                          isChristmas ? 'text-[#7c121f]' : 'font-medium uppercase text-gray-500'
                        }`}
                      >
                        Venue
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${
                          isChristmas ? 'text-[#7c121f]' : 'font-medium uppercase text-gray-500'
                        }`}
                      >
                        Check-In
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isChristmas
                        ? 'divide-amber-100 bg-[#fffdf9]'
                        : 'divide-gray-200 bg-white'
                    }`}
                  >
                    {data.map((record) => (
                      <tr
                        key={record.id}
                        className={`transition-colors ${
                          isChristmas
                            ? 'even:bg-amber-50/40 hover:bg-amber-100/50'
                            : 'hover:bg-gray-50/70'
                        }`}
                      >
                        <td
                          className={`px-4 py-4 text-sm font-medium ${
                            isChristmas ? 'text-[#5c141a]' : t.textHeading
                          }`}
                        >
                          {record.event_title}
                        </td>
                        <td className="px-4 py-4 text-sm text-stone-500 tabular-nums">
                          {formatDate(record.event_date)}
                        </td>
                        <td className="hidden px-4 py-4 text-sm text-stone-500 sm:table-cell">
                          {record.venue}
                        </td>
                        <td className="px-4 py-4 text-sm text-stone-500 tabular-nums">
                          {formatTime(record.time_in)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {attendances?.links && data.length > 0 && (
              <div
                className={`border-t px-4 py-4 sm:px-6 ${
                  isChristmas
                    ? 'border-amber-200/80 bg-amber-50/35'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {attendances.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors ${
                        link.active
                          ? isChristmas
                            ? 'bg-gradient-to-r from-[#991b1b] to-[#d97706] font-semibold text-amber-50 shadow-sm'
                            : t.activePagination
                          : isChristmas
                            ? 'bg-amber-100/70 text-[#7c121f] hover:bg-amber-200/80'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      disabled={!link.url}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}