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
    Ghost,
} from 'lucide-react';

/* ---------------------------------- */
/* Decorative bat silhouette          */
/* ---------------------------------- */
function Bat({ className = '', style }) {
    return (
        <svg
            viewBox="0 0 100 40"
            className={className}
            style={style}
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M50 12c-2 0-3.5 1.5-4 3-3-4-8-6-14-6 1.5 2.5 1.5 5 0 7-3-2.5-8-3-12-1 4 2 5 6 4 10-4-1-8 1-10 4 5-1 9 1 11 5 2 4 6 6 10 5 4-1 6-4 7-8 1.5 3 3.5 5 6 6 1-4 2-8 3-11 1 3 2 7 3 11 2.5-1 4.5-3 6-6 1 4 3 7 7 8 4 1 8-1 10-5 2-4 6-6 11-5-2-3-6-5-10-4-1-4 0-8 4-10-4-2-9-1.5-12 1-1.5-2-1.5-4.5 0-7-6 0-11 2-14 6-.5-1.5-2-3-4-3z" />
        </svg>
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

    // QR generation — dark purple code on white for a themed (but scannable) look
    const qrData = auth?.user?.id
        ? `https://hris.lgu.gov.ph/checkin/${auth.user.id}`
        : 'https://hris.lgu.gov.ph/checkin';
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrData
    )}&size=180x180&margin=12&color=2a0f45&bgcolor=ffffff`;

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
        { top: '10%', left: '12%', size: 3, delay: '0s' },
        { top: '18%', left: '32%', size: 2, delay: '0.8s' },
        { top: '8%', left: '58%', size: 2, delay: '1.6s' },
        { top: '24%', left: '72%', size: 3, delay: '0.4s' },
        { top: '36%', left: '6%', size: 2, delay: '2.1s' },
        { top: '44%', left: '88%', size: 2, delay: '1.2s' },
        { top: '62%', left: '18%', size: 2, delay: '0.6s' },
        { top: '70%', left: '48%', size: 3, delay: '1.9s' },
        { top: '56%', left: '64%', size: 2, delay: '2.6s' },
        { top: '80%', left: '78%', size: 2, delay: '1.1s' },
    ];

    return (
        <>
            <Head title="Welcome - HRIS Attendance" />

            <div className="min-h-screen bg-gradient-to-b from-[#0d0718] via-[#150b24] to-[#08040f] font-sans antialiased overflow-x-hidden">

                {/* ========== NAVBAR ========== */}
                <nav className="sticky top-0 z-50 bg-[#0c0616]/80 backdrop-blur-xl border-b border-orange-500/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-[0_0_22px_-2px_rgba(249,115,22,0.75)]">
                                    <Scan className="h-5 w-5" />
                                    <span className="absolute -inset-1 rounded-2xl border border-orange-400/40 animate-[flicker_3s_ease-in-out_infinite]" />
                                </div>
                                <div>
                                    <span className="text-xl font-extrabold text-white tracking-tight">
                                        HRIS
                                    </span>
                                    <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-orange-300/80 -mt-0.5">
                                        Attendance System
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="px-4 py-2 text-sm font-medium rounded-xl text-slate-300 hover:text-orange-300 hover:bg-white/5 transition"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center space-x-3">
                                {/* Live clock (desktop) */}
                                <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-slate-400">
                                    <Calendar className="h-3.5 w-3.5 text-orange-400/70" />
                                    <span>{formattedDate}</span>
                                    <span className="text-orange-400/40">•</span>
                                    <span className="tabular-nums text-orange-200/80">
                                        {formattedTime}
                                    </span>
                                </div>

                                {/* Status pill */}
                                <div className="hidden sm:flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-emerald-400/20">
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
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_-6px_rgba(249,115,22,0.9)] transition"
                                    >
                                        <Lock className="mr-1.5 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_-6px_rgba(249,115,22,0.9)] transition"
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
                                        <X className="h-6 w-6 text-orange-200" />
                                    ) : (
                                        <Menu className="h-6 w-6 text-orange-200" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-[#0c0616]/95 backdrop-blur-lg border-t border-orange-500/20 shadow-2xl">
                            <div className="px-4 py-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-2.5 text-sm font-medium rounded-xl text-slate-300 hover:text-orange-300 hover:bg-white/5 transition"
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
                                        <span className="tabular-nums text-orange-200/80">
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
                </nav>

                {/* ========== HERO SECTION ========== */}
                <section className="relative overflow-hidden">
                    {/* ---- Halloween night sky ---- */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* glows */}
                        <div className="absolute -top-28 -left-24 w-[26rem] h-[26rem] bg-purple-700/25 rounded-full blur-3xl" />
                        <div className="absolute top-10 -right-32 w-[30rem] h-[30rem] bg-orange-600/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-fuchsia-700/15 rounded-full blur-3xl" />

                        {/* moon */}
                        <div className="absolute top-16 right-6 sm:right-16 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-50 to-amber-300 opacity-90 shadow-[0_0_70px_12px_rgba(251,191,36,0.22)]">
                            <span className="absolute top-4 left-5 w-4 h-4 rounded-full bg-amber-400/40" />
                            <span className="absolute bottom-6 right-5 w-5 h-5 rounded-full bg-amber-400/30" />
                            <span className="absolute top-10 right-9 w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                        </div>

                        {/* stars */}
                        {stars.map((star, i) => (
                            <span
                                key={i}
                                className="absolute rounded-full bg-white animate-[twinkle_3.4s_ease-in-out_infinite]"
                                style={{
                                    top: star.top,
                                    left: star.left,
                                    width: star.size,
                                    height: star.size,
                                    animationDelay: star.delay,
                                }}
                            />
                        ))}

                        {/* cobweb — top-left */}
                        <svg
                            viewBox="0 0 100 100"
                            className="absolute -top-2 -left-2 w-32 h-32 sm:w-48 sm:h-48 text-white/[0.08]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.8"
                        >
                            <path d="M0 0 L92 92" />
                            <path d="M0 0 L100 42" />
                            <path d="M0 0 L42 100" />
                            <path d="M0 0 L100 12" />
                            <path d="M22 4 Q15 15 6 22" />
                            <path d="M42 8 Q30 30 10 42" />
                            <path d="M62 12 Q44 44 14 62" />
                            <path d="M82 16 Q58 58 18 82" />
                        </svg>

                        {/* bats */}
                        <Bat
                            className="absolute top-24 left-[10%] w-10 sm:w-14 text-orange-500/30 animate-[floaty_9s_ease-in-out_infinite]"
                            style={{ animationDelay: '0s' }}
                        />
                        <Bat
                            className="absolute top-48 left-[46%] w-8 sm:w-10 text-purple-400/25 animate-[floaty_11s_ease-in-out_infinite]"
                            style={{ animationDelay: '1.5s' }}
                        />
                        <Bat
                            className="absolute top-12 right-[28%] w-6 sm:w-9 text-orange-300/25 animate-[floaty_13s_ease-in-out_infinite]"
                            style={{ animationDelay: '3s' }}
                        />

                        {/* floating ghost */}
                        <Ghost
                            className="absolute bottom-24 left-[8%] w-8 h-8 text-white/[0.07] animate-[floaty_12s_ease-in-out_infinite]"
                            style={{ animationDelay: '2s' }}
                        />

                        {/* ground fog */}
                        <div className="absolute -bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-orange-900/20 via-purple-900/10 to-transparent blur-2xl animate-[drift_16s_ease-in-out_infinite_alternate]" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                            {/* ---- LEFT CONTENT ---- */}
                            <div className="space-y-6 order-2 lg:order-1">
                                <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-400/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
                                    <Sparkles className="h-4 w-4 text-orange-400" />
                                    <span className="text-[10px] sm:text-xs font-bold text-orange-200 tracking-[0.18em]">
                                        OFFICIAL GOVERNMENT SYSTEM
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                                    Smart Attendance
                                    <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]">
                                        for Public Servants
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg text-slate-300/80 max-w-md leading-relaxed">
                                    Secure QR check‑ins, real‑time monitoring, and accurate
                                    records — all in one seamless system.{' '}
                                    <span className="text-orange-300/90 font-medium">
                                        No tricks, just treats.
                                    </span>
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-2xl shadow-[0_0_35px_-8px_rgba(249,115,22,0.9)] transition-all text-sm sm:text-base"
                                    >
                                        <Scan className="mr-2 h-5 w-5" />
                                        Check In Now
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Link>
                                    <button
                                        className="inline-flex items-center justify-center px-6 py-3.5 bg-white/5 backdrop-blur-sm border border-white/15 text-orange-100 font-semibold rounded-2xl hover:bg-white/10 hover:border-orange-400/40 transition text-sm sm:text-base"
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
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-orange-400/20 flex items-center justify-center text-orange-400">
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
                                    {/* glowing aura */}
                                    <div className="absolute -inset-2 bg-gradient-to-br from-orange-500/40 via-fuchsia-500/10 to-purple-600/40 rounded-[2rem] blur-2xl opacity-60" />

                                    <div className="relative bg-[#150b24]/85 backdrop-blur-xl rounded-3xl border border-orange-400/25 shadow-2xl shadow-black/50 p-6 sm:p-8">
                                        <div className="text-center mb-5">
                                            <div className="relative w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_30px_-4px_rgba(249,115,22,0.9)]">
                                                <Scan className="h-8 w-8 text-white" />
                                                <span className="absolute -inset-1 rounded-full border border-orange-300/40 animate-[flicker_2.6s_ease-in-out_infinite]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mt-3">
                                                Quick Check‑In
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                Scan the QR code to record your attendance
                                            </p>
                                        </div>

                                        {/* QR Code with scanning animation */}
                                        <div className="relative flex justify-center mb-5">
                                            <div className="relative inline-block p-2.5 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(249,115,22,0.7)]">
                                                <img
                                                    src={qrImageUrl}
                                                    alt="QR Code"
                                                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg"
                                                />
                                                <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
                                                <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
                                                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
                                                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />
                                                {/* scanning line */}
                                                <div className="absolute inset-2.5 overflow-hidden rounded-lg pointer-events-none">
                                                    <div className="absolute left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_12px_2px_rgba(249,115,22,0.9)] animate-[scan_2.4s_ease-in-out_infinite]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* live date/time */}
                                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 mb-3">
                                            <Calendar className="h-3.5 w-3.5 text-orange-400/80" />
                                            <span>{formattedDate}</span>
                                            <span className="text-orange-400/40">•</span>
                                            <Clock className="h-3.5 w-3.5 text-orange-400/80" />
                                            <span className="tabular-nums text-orange-200/90">
                                                {formattedTime}
                                            </span>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-3 flex items-center justify-center space-x-2 border border-white/10">
                                            <Camera className="h-5 w-5 text-orange-400" />
                                            <span className="text-sm font-medium text-slate-200">
                                                Open camera &amp; scan
                                            </span>
                                        </div>

                                        {/* Quick stats mini cards */}
                                        <div className="grid grid-cols-3 gap-2 mt-5">
                                            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Today
                                                </p>
                                                <p className="text-lg font-bold text-white">
                                                    {stats.checkIns}
                                                </p>
                                            </div>
                                            <div className="bg-orange-500/10 rounded-xl p-3 text-center border border-orange-400/25">
                                                <p className="text-[10px] font-bold text-orange-300/80 uppercase tracking-wider">
                                                    Rate
                                                </p>
                                                <p className="text-lg font-bold text-orange-400">
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
                            <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 shadow-xl shadow-black/30 p-4 sm:p-6 grid grid-cols-3 divide-x divide-white/10">
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
                                    <p className="text-sm font-bold text-orange-300 mt-1">
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
                            className="absolute bottom-0 w-full h-8 sm:h-12 text-[#08040f] fill-current"
                            viewBox="0 0 1440 48"
                            preserveAspectRatio="none"
                        >
                            <path d="M0 48V0h1440v48c-240-20-480-32-720-32S240 28 0 48z" />
                        </svg>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className="bg-[#08040f] text-white border-t border-orange-500/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-28 lg:pb-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-[0_0_20px_-4px_rgba(249,115,22,0.8)]">
                                        <Scan className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-extrabold tracking-tight">
                                            HRIS
                                        </span>
                                        <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-orange-300/70 -mt-0.5">
                                            Attendance System
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                    Smart attendance for public servants. Accountability
                                    meets efficiency.
                                </p>
                            </div>

                            {/* Quick links */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300/80 mb-4">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2.5">
                                    {navLinks.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-slate-400 hover:text-orange-300 transition"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* System */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300/80 mb-4">
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
                                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300/80 mb-4">
                                    Contact
                                </h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li className="flex items-start gap-2.5">
                                        <Mail className="h-4 w-4 text-orange-400/80 mt-0.5 shrink-0" />
                                        <span>hris@lgu.gov.ph</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Phone className="h-4 w-4 text-orange-400/80 mt-0.5 shrink-0" />
                                        <span>(02) 8888‑0000</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <MapPin className="h-4 w-4 text-orange-400/80 mt-0.5 shrink-0" />
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
                            <p className="flex items-center gap-1.5">
                                <Ghost className="h-3.5 w-3.5 text-orange-400/70" />
                                Happy Halloween from the HR Team 🎃
                            </p>
                        </div>
                    </div>
                </footer>

                {/* ========== FLOATING CHECK-IN BUTTON (mobile) ========== */}
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
                    <Link
                        href={route('login')}
                        className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-[0_10px_40px_-8px_rgba(249,115,22,0.9)] active:scale-[0.98] transition-all text-base"
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
                    @keyframes floaty {
                        0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
                        50%      { transform: translate3d(10px, -14px, 0) rotate(-4deg); }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.15; transform: scale(0.8); }
                        50%      { opacity: 1; transform: scale(1.2); }
                    }
                    @keyframes flicker {
                        0%, 100% { opacity: 0.35; }
                        50%      { opacity: 0.9; }
                    }
                    @keyframes drift {
                        from { transform: translateX(-6%); }
                        to   { transform: translateX(6%); }
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