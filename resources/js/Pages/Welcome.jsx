import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Scan,
    Lock,
    Menu,
    X,
    Sparkles,
    Shield,
    Clock,
    Users,
    Play,
    ArrowRight,
    Camera,
    Calendar,
    Mail,
    MapPin,
    Phone,
    CheckCircle,
    Star,
} from 'lucide-react';

/* ---------------------------------- */
/* Compact parol mark (for the logo)  */
/* ---------------------------------- */
function ParolMark({ className = '' }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="pmBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="55%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
            </defs>
            <path
                d="M50 6 L61.2 34.6 L91.9 36.4 L68.1 55.9 L75.9 85.6 L50 69 L24.1 85.6 L31.9 55.9 L8.1 36.4 L38.8 34.6 Z"
                fill="url(#pmBody)"
                stroke="#fffbeb"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
            <path
                d="M50 28 L55.6 42.3 L70.9 43.2 L59.0 52.9 L63.0 67.7 L50 59.5 L37.0 67.7 L41.0 52.9 L29.1 43.2 L44.4 42.3 Z"
                fill="#fffbeb"
                opacity="0.92"
            />
            <circle cx="50" cy="50" r="4.5" fill="#fde68a" />
        </svg>
    );
}

/* ---------------------------------- */
/* Full hanging parol lantern         */
/* ---------------------------------- */
function Parol({ className = '', style }) {
    return (
        <svg viewBox="0 0 100 120" className={className} style={style} aria-hidden="true">
            <defs>
                <radialGradient id="parolBody" cx="50%" cy="40%" r="65%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="35%" stopColor="#fde68a" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b91c1c" />
                </radialGradient>
                <radialGradient id="parolCore" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="60%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </radialGradient>
                <linearGradient id="parolTail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
            </defs>

            {/* radiating light rays */}
            <g stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round">
                <line x1="50" y1="46" x2="50" y2="0" />
                <line x1="50" y1="46" x2="92" y2="20" />
                <line x1="50" y1="46" x2="96" y2="62" />
                <line x1="50" y1="46" x2="8" y2="20" />
                <line x1="50" y1="46" x2="4" y2="62" />
                <line x1="50" y1="46" x2="28" y2="94" />
                <line x1="50" y1="46" x2="72" y2="94" />
                <line x1="50" y1="46" x2="70" y2="0" />
                <line x1="50" y1="46" x2="30" y2="0" />
            </g>

            {/* star body */}
            <path
                d="M50 8 L60 34.3 L88 35.6 L66.2 53.3 L73.5 80.4 L50 65 L26.5 80.4 L33.8 53.3 L12 35.6 L40 34.3 Z"
                fill="url(#parolBody)"
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />

            {/* capiz inner star */}
            <path
                d="M50 28 L55 41.1 L69 41.8 L58.1 50.6 L61.8 64.2 L50 56.5 L38.2 64.2 L41.9 50.6 L31 41.8 L45 41.1 Z"
                fill="url(#parolCore)"
                stroke="#fde68a"
                strokeWidth="0.8"
                strokeLinejoin="round"
            />

            {/* glowing center */}
            <circle cx="50" cy="46" r="10" fill="#fef3c7" opacity="0.35" />
            <circle cx="50" cy="46" r="5.5" fill="#fffbeb" />

            {/* hanging tails */}
            <path d="M43 82 Q40 98 36 112" fill="none" stroke="url(#parolTail)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M57 82 Q60 98 64 112" fill="none" stroke="url(#parolTail)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="113" r="2.2" fill="#fbbf24" />
            <circle cx="64" cy="113" r="2.2" fill="#fbbf24" />
        </svg>
    );
}

/* ---------------------------------- */
/* Banderitas bunting                 */
/* ---------------------------------- */
function Banderitas({ className = '' }) {
    const palette = ['#dc2626', '#fbbf24', '#16a34a', '#f59e0b', '#ef4444', '#22c55e'];
    const count = 24;
    const flags = Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1);
        return {
            color: palette[i % palette.length],
            sag: Math.sin(Math.PI * t) * 12,
            delay: `${(i % 7) * 0.28}s`,
        };
    });

    return (
        <div className={`relative w-full ${className}`} aria-hidden="true">
            {/* the sagging string */}
            <svg
                className="absolute inset-x-0 top-0 w-full h-6 text-amber-300/45"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                fill="none"
            >
                <path
                    d="M0 2 Q 50 18 100 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
            {/* flags */}
            <div className="relative flex justify-between items-start px-1 pt-1">
                {flags.map((f, i) => (
                    <div
                        key={i}
                        className="w-2.5 h-4 sm:w-3.5 sm:h-5 md:w-4 md:h-6"
                        style={{
                            marginTop: `${f.sag}px`,
                            backgroundColor: f.color,
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                            transformOrigin: 'top center',
                            animation: 'flagsway 3.2s ease-in-out infinite',
                            animationDelay: f.delay,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    // QR generation — warm dark red on white, still perfectly scannable
    const qrData = auth?.user?.id
        ? `https://hris.lgu.gov.ph/checkin/${auth.user.id}`
        : 'https://hris.lgu.gov.ph/checkin';
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrData
    )}&size=180x180&margin=12&color=7f1d1d&bgcolor=ffffff`;

    const stats = {
        checkIns: 486,
        departments: 36,
        attendancePercent: 97.2,
        lastCheckIn: '08:02 AM',
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '#features' },
        { name: 'Departments', href: '#departments' },
        { name: 'Contact', href: '#contact' },
    ];

    const stars = [
        { top: '8%',  left: '9%',  size: 2, delay: '0s' },
        { top: '16%', left: '28%', size: 2, delay: '1.1s' },
        { top: '6%',  left: '52%', size: 2, delay: '2.0s' },
        { top: '22%', left: '68%', size: 3, delay: '0.5s' },
        { top: '34%', left: '4%',  size: 2, delay: '2.4s' },
        { top: '46%', left: '92%', size: 2, delay: '1.5s' },
        { top: '64%', left: '14%', size: 2, delay: '0.8s' },
        { top: '72%', left: '44%', size: 3, delay: '2.1s' },
        { top: '58%', left: '60%', size: 2, delay: '2.8s' },
        { top: '82%', left: '80%', size: 2, delay: '1.3s' },
    ];

    // Warm golden light motes drifting through the night air
    const motes = Array.from({ length: 16 }).map((_, i) => ({
        left: (i * 37 + 11) % 100,
        top: 12 + ((i * 23) % 68),
        size: 3 + (i % 3) * 2,
        delay: (i * 0.7) % 6,
        duration: 5 + (i % 5) * 1.4,
    }));

    return (
        <>
            <Head title="Welcome - HRIS Attendance" />

            <div className="min-h-screen bg-gradient-to-b from-[#071820] via-[#0a1f2a] to-[#041016] font-sans antialiased overflow-x-hidden">

                {/* ========== NAVBAR ========== */}
                <nav className="sticky top-0 z-50 bg-[#071820]/85 backdrop-blur-xl border-b border-amber-400/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 shadow-[0_0_24px_-2px_rgba(239,68,68,0.7)]">
                                    <ParolMark className="h-6 w-6 drop-shadow-[0_0_6px_rgba(255,251,235,0.6)]" />
                                    <span className="absolute -inset-1 rounded-2xl border border-amber-300/40 animate-[flicker_3s_ease-in-out_infinite]" />
                                </div>
                                <div>
                                    <span className="text-xl font-extrabold text-white tracking-tight">
                                        HRIS
                                    </span>
                                    <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-amber-300/80 -mt-0.5">
                                        Attendance System
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="px-4 py-2 text-sm font-medium rounded-xl text-slate-300 hover:text-amber-300 hover:bg-white/5 transition"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-slate-400">
                                    <Calendar className="h-3.5 w-3.5 text-amber-400/70" />
                                    <span>{formattedDate}</span>
                                    <span className="text-amber-400/40">•</span>
                                    <span className="tabular-nums text-amber-200/90">
                                        {formattedTime}
                                    </span>
                                </div>

                                <div className="hidden sm:flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-emerald-400/25">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                                    </span>
                                    <span className="text-xs font-medium text-emerald-200">
                                        Online
                                    </span>
                                </div>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-semibold rounded-xl ring-1 ring-amber-300/30 shadow-[0_0_20px_-6px_rgba(239,68,68,0.9)] transition"
                                    >
                                        <Lock className="mr-1.5 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-semibold rounded-xl ring-1 ring-amber-300/30 shadow-[0_0_20px_-6px_rgba(239,68,68,0.9)] transition"
                                    >
                                        <Lock className="mr-1.5 h-4 w-4" />
                                        Log In
                                    </Link>
                                )}

                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 rounded-xl hover:bg-white/10 transition"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? (
                                        <X className="h-6 w-6 text-amber-200" />
                                    ) : (
                                        <Menu className="h-6 w-6 text-amber-200" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-[#071820]/95 backdrop-blur-lg border-t border-amber-400/20 shadow-2xl">
                            <div className="px-4 py-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-2.5 text-sm font-medium rounded-xl text-slate-300 hover:text-amber-300 hover:bg-white/5 transition"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                                    <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-400 bg-white/5 rounded-xl">
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            System Online
                                        </span>
                                        <span className="tabular-nums text-amber-200/90">
                                            {formattedTime}
                                        </span>
                                    </div>
                                    <div className="px-4 py-2 text-xs text-slate-500">
                                        {formattedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Banderitas strip under the navbar */}
                    <div className="bg-[#08141b]/60 border-t border-amber-400/10">
                        <Banderitas className="h-8 sm:h-9 overflow-hidden" />
                    </div>
                </nav>

                {/* ========== HERO SECTION ========== */}
                <section className="relative overflow-hidden">
                    {/* ---- Simbang Gabi night sky ---- */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* warm ambient glows */}
                        <div className="absolute -top-28 -left-24 w-[28rem] h-[28rem] bg-amber-500/20 rounded-full blur-3xl animate-[glowpulse_9s_ease-in-out_infinite]" />
                        <div className="absolute top-10 -right-32 w-[32rem] h-[32rem] bg-red-600/15 rounded-full blur-3xl animate-[glowpulse_11s_ease-in-out_infinite]" />
                        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-emerald-600/15 rounded-full blur-3xl animate-[glowpulse_13s_ease-in-out_infinite]" />

                        {/* distant twinkling stars */}
                        {stars.map((star, i) => (
                            <span
                                key={i}
                                className="absolute rounded-full bg-amber-100 animate-[twinkle_3.4s_ease-in-out_infinite]"
                                style={{
                                    top: star.top,
                                    left: star.left,
                                    width: star.size,
                                    height: star.size,
                                    animationDelay: star.delay,
                                }}
                            />
                        ))}

                        {/* drifting golden light motes */}
                        {motes.map((m, i) => (
                            <span
                                key={`mote-${i}`}
                                className="absolute rounded-full bg-amber-300 shadow-[0_0_12px_2px_rgba(251,191,36,0.55)]"
                                style={{
                                    left: `${m.left}%`,
                                    top: `${m.top}%`,
                                    width: m.size,
                                    height: m.size,
                                    animation: `warmfloat ${m.duration}s ease-in-out infinite`,
                                    animationDelay: `${m.delay}s`,
                                }}
                            />
                        ))}

                        {/* floating parols — the heart of Filipino Christmas */}
                        <Parol
                            className="absolute top-14 right-[6%] w-14 sm:w-20 text-amber-300/80 drop-shadow-[0_0_24px_rgba(251,191,36,0.5)] animate-[sway_7s_ease-in-out_infinite]"
                            style={{ animationDelay: '0s' }}
                        />
                        <Parol
                            className="absolute top-40 left-[4%] w-10 sm:w-14 opacity-70 drop-shadow-[0_0_18px_rgba(251,191,36,0.4)] animate-[sway_9s_ease-in-out_infinite]"
                            style={{ animationDelay: '1.4s' }}
                        />
                        <Parol
                            className="absolute bottom-28 right-[22%] w-8 sm:w-12 opacity-55 drop-shadow-[0_0_14px_rgba(251,191,36,0.35)] animate-[sway_11s_ease-in-out_infinite]"
                            style={{ animationDelay: '2.6s' }}
                        />

                        {/* warm horizon light */}
                        <div className="absolute -bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-amber-800/20 via-amber-700/8 to-transparent blur-2xl animate-[drift_18s_ease-in-out_infinite_alternate]" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                            {/* ---- LEFT CONTENT ---- */}
                            <div className="space-y-6 order-2 lg:order-1">
                                <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-amber-400/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
                                    <Sparkles className="h-4 w-4 text-amber-300" />
                                    <span className="text-[10px] sm:text-xs font-bold text-amber-200 tracking-[0.18em]">
                                        MALIGAYANG PASKO • SIMBANG GABI 2026
                                    </span>
                                </div>

                                <div>
                                    <p className="font-serif italic text-amber-200/90 text-sm sm:text-base mb-2">
                                        Maligayang Pasko!
                                    </p>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                                        Smart Attendance
                                        <br />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-red-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]">
                                            for Public Servants
                                        </span>
                                    </h1>
                                </div>

                                <p className="text-base sm:text-lg text-slate-300/80 max-w-md leading-relaxed">
                                    Secure QR check‑ins, real‑time monitoring, and accurate
                                    records — all in one seamless system.{' '}
                                    <span className="text-amber-300/90 font-medium">
                                        Maligayang Pasko mula sa amin sa HR!
                                    </span>
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl ring-1 ring-amber-300/40 shadow-[0_0_35px_-8px_rgba(239,68,68,0.9)] transition-all text-sm sm:text-base"
                                    >
                                        <Scan className="mr-2 h-5 w-5" />
                                        Check In Now
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Link>
                                    <button
                                        className="inline-flex items-center justify-center px-6 py-3.5 bg-white/5 backdrop-blur-sm border border-white/15 text-amber-100 font-semibold rounded-2xl hover:bg-white/10 hover:border-amber-400/40 transition text-sm sm:text-base"
                                        onClick={() => alert('Learn More clicked')}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Learn More
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
                                    {[
                                        { icon: Shield, label: 'Secure QR' },
                                        { icon: Clock, label: 'Real‑time' },
                                        { icon: Users, label: 'Multi‑Dept' },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-amber-400/20 flex items-center justify-center text-amber-300">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-slate-200">
                                                {label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ---- RIGHT QR CARD ---- */}
                            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                                <div className="relative w-full max-w-sm">
                                    {/* warm parol aura */}
                                    <div className="absolute -inset-3 bg-gradient-to-br from-amber-500/40 via-red-500/15 to-emerald-500/30 rounded-[2rem] blur-2xl opacity-70 animate-[glowpulse_8s_ease-in-out_infinite]" />

                                    <div className="relative bg-[#0a1f2a]/90 backdrop-blur-xl rounded-3xl border border-amber-400/25 shadow-2xl shadow-black/50 p-6 sm:p-8">
                                        <div className="text-center mb-5">
                                            {/* parol hovering above the card */}
                                            <div className="relative w-20 h-24 mx-auto mb-1">
                                                <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl" />
                                                <Parol className="relative w-full h-full drop-shadow-[0_0_20px_rgba(251,191,36,0.55)] animate-[sway_6s_ease-in-out_infinite]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">
                                                Quick Check‑In
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                Scan the QR code to record your attendance
                                            </p>
                                        </div>

                                        {/* QR Code with scanning animation */}
                                        <div className="relative flex justify-center mb-5">
                                            <div className="relative inline-block p-2.5 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(251,191,36,0.8)]">
                                                <img
                                                    src={qrImageUrl}
                                                    alt="QR Code"
                                                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg"
                                                />
                                                <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-red-600 rounded-tl-xl" />
                                                <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-red-600 rounded-tr-xl" />
                                                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-red-600 rounded-bl-xl" />
                                                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-red-600 rounded-br-xl" />
                                                <div className="absolute inset-2.5 overflow-hidden rounded-lg pointer-events-none">
                                                    <div className="absolute left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_12px_2px_rgba(239,68,68,0.9)] animate-[scan_2.4s_ease-in-out_infinite]" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 mb-3">
                                            <Calendar className="h-3.5 w-3.5 text-amber-400/80" />
                                            <span>{formattedDate}</span>
                                            <span className="text-amber-400/40">•</span>
                                            <Clock className="h-3.5 w-3.5 text-amber-400/80" />
                                            <span className="tabular-nums text-amber-200/90">
                                                {formattedTime}
                                            </span>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-3 flex items-center justify-center space-x-2 border border-white/10">
                                            <Camera className="h-5 w-5 text-amber-300" />
                                            <span className="text-sm font-medium text-slate-200">
                                                Open camera &amp; scan
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mt-5">
                                            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Today
                                                </p>
                                                <p className="text-lg font-bold text-white">
                                                    {stats.checkIns}
                                                </p>
                                            </div>
                                            <div className="bg-amber-500/10 rounded-xl p-3 text-center border border-amber-400/25">
                                                <p className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                                                    Rate
                                                </p>
                                                <p className="text-lg font-bold text-amber-300">
                                                    {stats.attendancePercent}%
                                                </p>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Last
                                                </p>
                                                <p className="text-sm font-bold text-white pt-1">
                                                    {stats.lastCheckIn}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---- Bottom stats bar ---- */}
                        <div className="mt-12 lg:mt-16">
                            <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-amber-400/15 shadow-xl shadow-black/30 p-4 sm:p-6 grid grid-cols-3 divide-x divide-white/10">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        System
                                    </p>
                                    <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                                        <span className="text-sm font-bold text-white">
                                            Online
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Check‑Ins
                                    </p>
                                    <p className="text-sm font-bold text-amber-300 mt-1">
                                        {stats.checkIns}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Departments
                                    </p>
                                    <p className="text-sm font-bold text-white mt-1">
                                        {stats.departments}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider into footer */}
                    <div className="relative h-8 sm:h-12">
                        <svg
                            className="absolute bottom-0 w-full h-8 sm:h-12 text-[#041016] fill-current"
                            viewBox="0 0 1440 48"
                            preserveAspectRatio="none"
                        >
                            <path d="M0 48V0h1440v48c-240-20-480-32-720-32S240 28 0 48z" />
                        </svg>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className="bg-[#041016] text-white border-t border-amber-400/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-28 lg:pb-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 shadow-[0_0_20px_-4px_rgba(239,68,68,0.8)]">
                                        <ParolMark className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-extrabold tracking-tight">
                                            HRIS
                                        </span>
                                        <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-amber-300/70 -mt-0.5">
                                            Attendance System
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                    Smart attendance for public servants. Accountability
                                    meets efficiency — this Pasko and beyond.
                                </p>
                            </div>

                            {/* Quick links */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/80 mb-4">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2.5">
                                    {navLinks.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-slate-400 hover:text-amber-300 transition"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* System */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/80 mb-4">
                                    System
                                </h4>
                                <ul className="space-y-2.5 text-sm text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-400/80" />
                                        Secure QR check‑in
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-400/80" />
                                        Real‑time monitoring
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-400/80" />
                                        Multi‑department support
                                    </li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/80 mb-4">
                                    Contact
                                </h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li className="flex items-start gap-2.5">
                                        <Mail className="h-4 w-4 text-amber-400/80 mt-0.5 shrink-0" />
                                        <span>hris@lgu.gov.ph</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Phone className="h-4 w-4 text-amber-400/80 mt-0.5 shrink-0" />
                                        <span>(02) 8888‑0000</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <MapPin className="h-4 w-4 text-amber-400/80 mt-0.5 shrink-0" />
                                        <span>Municipal Hall, HR Office</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                            <p>
                                © {new Date().getFullYear()} HRIS — Local Government
                                Unit. All rights reserved.
                            </p>
                            <p className="flex items-center gap-1.5 font-serif italic text-amber-200/70">
                                <Star className="h-3.5 w-3.5 text-amber-400/80" />
                                Maligayang Pasko at Manigong Bagong Taon 🎄
                            </p>
                        </div>
                    </div>
                </footer>

                {/* ========== FLOATING CHECK-IN BUTTON (mobile) ========== */}
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
                    <Link
                        href={route('login')}
                        className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl ring-1 ring-amber-300/40 shadow-[0_10px_40px_-8px_rgba(239,68,68,0.9)] active:scale-[0.98] transition-all text-base"
                    >
                        <Scan className="mr-2 h-5 w-5" />
                        Check In Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                {/* ========== ANIMATIONS ========== */}
                <style>{`
                    @keyframes scan {
                        0%   { top: 0; }
                        50%  { top: calc(100% - 2px); }
                        100% { top: 0; }
                    }
                    @keyframes sway {
                        0%, 100% { transform: rotate(-3deg) translateY(0); }
                        50%      { transform: rotate(3deg) translateY(-6px); }
                    }
                    @keyframes flagsway {
                        0%, 100% { transform: rotate(-2deg); }
                        50%      { transform: rotate(2deg); }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.15; transform: scale(0.8); }
                        50%      { opacity: 1; transform: scale(1.2); }
                    }
                    @keyframes warmfloat {
                        0%, 100% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0.2; }
                        50%      { transform: translate3d(8px, -20px, 0) scale(1.15); opacity: 0.9; }
                    }
                    @keyframes flicker {
                        0%, 100% { opacity: 0.35; }
                        50%      { opacity: 0.9; }
                    }
                    @keyframes glowpulse {
                        0%, 100% { opacity: 0.45; transform: scale(0.96); }
                        50%      { opacity: 0.8;  transform: scale(1.04); }
                    }
                    @keyframes drift {
                        from { transform: translateX(-5%); }
                        to   { transform: translateX(5%); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        *, *::before, *::after {
                            animation-duration: 0.001ms !important;
                            animation-iteration-count: 1 !important;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}