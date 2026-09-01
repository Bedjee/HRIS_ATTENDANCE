import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Shield,
    Clock,
    BarChart3,
    Users,
    Scan,
    Lock,
    Play,
    Camera,
    Phone,
    Mail,
    MapPin,
    CheckCircle,
    ArrowRight,
    Menu,
    X,
    Circle,
    Calendar,
    Activity,
    Sparkles,
} from 'lucide-react';

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

    // QR generation (same as original)
    const qrData = auth?.user?.id
        ? `https://hris.lgu.gov.ph/checkin/${auth.user.id}`
        : 'https://hris.lgu.gov.ph/checkin';
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=180x180&margin=12`;

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

    return (
        <>
            <Head title="Welcome - HRIS Attendance" />
            <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-white to-[#eef3fa] font-sans antialiased overflow-x-hidden">

                {/* ========== NAVBAR ========== */}
                <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1769E0] to-[#0B2554] text-white shadow-md shadow-blue-200">
                                    <Scan className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-extrabold text-[#0B2554] tracking-tight">HRIS</span>
                                    <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#526581] -mt-0.5">
                                        Attendance System
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="px-4 py-2 text-sm font-medium rounded-xl text-[#526581] hover:text-[#0B2554] hover:bg-white/60 transition"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center space-x-3">
                                {/* Status pill */}
                                <div className="hidden sm:flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-sm">
                                    <div className="relative flex items-center">
                                        <Circle className="h-2.5 w-2.5 text-emerald-500 fill-emerald-500" />
                                        <span className="absolute inset-0 animate-ping h-2.5 w-2.5 rounded-full bg-emerald-500 opacity-40" />
                                    </div>
                                    <span className="text-xs font-medium text-[#0B2554]">Online</span>
                                </div>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-[#1769E0] hover:bg-[#0B2554] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 transition"
                                    >
                                        <Lock className="mr-1.5 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 bg-[#1769E0] hover:bg-[#0B2554] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 transition"
                                    >
                                        <Lock className="mr-1.5 h-4 w-4" />
                                        Log In
                                    </Link>
                                )}

                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 rounded-xl hover:bg-white/50 transition"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? <X className="h-6 w-6 text-[#0B2554]" /> : <Menu className="h-6 w-6 text-[#0B2554]" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white/80 backdrop-blur-lg border-t border-white/30 shadow-lg">
                            <div className="px-4 py-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-2.5 text-sm font-medium rounded-xl text-[#526581] hover:text-[#0B2554] hover:bg-white/60 transition"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-2 border-t border-gray-200/50">
                                    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-[#526581] bg-white/60 rounded-xl">
                                        <Circle className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                                        <span>System Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ========== HERO SECTION ========== */}
                <section className="relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 -left-20 w-72 h-72 bg-[#1769E0]/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#0B2554]/5 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* LEFT CONTENT */}
                            <div className="space-y-6 order-2 lg:order-1">
                                <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 shadow-sm">
                                    <Sparkles className="h-4 w-4 text-[#1769E0]" />
                                    <span className="text-xs font-bold text-[#0B2554] tracking-widest">
                                        OFFICIAL GOVERNMENT SYSTEM
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                                    <span className="text-[#0B2554]">Smart Attendance</span>
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1769E0] to-[#0B2554]">
                                        for Public Servants
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg text-[#64748B] max-w-md leading-relaxed">
                                    Secure QR check‑ins, real‑time monitoring, and accurate records — all in one seamless system.
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex items-center justify-center px-6 py-3.5 bg-[#1769E0] hover:bg-[#0B2554] text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all text-sm sm:text-base"
                                    >
                                        <Scan className="mr-2 h-5 w-5" />
                                        Check In Now
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Link>
                                    <button
                                        className="inline-flex items-center justify-center px-6 py-3.5 bg-white/80 backdrop-blur-sm border border-white/60 text-[#0B2554] font-semibold rounded-2xl hover:bg-white transition text-sm sm:text-base shadow-sm"
                                        onClick={() => alert('Learn More clicked')}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Learn More
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-[#1769E0] border border-white/40">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-[#0B2554]">Secure QR</span>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300/60 hidden sm:block" />
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-[#1769E0] border border-white/40">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-[#0B2554]">Real‑time</span>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300/60 hidden sm:block" />
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-[#1769E0] border border-white/40">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-[#0B2554]">Multi‑Dept</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT QR CARD */}
                            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                                <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1769E0]/20 to-[#0B2554]/20 rounded-3xl blur-xl opacity-30" />

                                    <div className="relative">
                                        <div className="text-center mb-5">
                                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#1769E0] to-[#0B2554] flex items-center justify-center shadow-lg shadow-blue-200">
                                                <Scan className="h-8 w-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#0B2554] mt-3">Quick Check‑In</h3>
                                            <p className="text-sm text-[#64748B]">
                                                Scan the QR code to record your attendance
                                            </p>
                                        </div>

                                        {/* QR Code with scanning animation */}
                                        <div className="relative flex justify-center mb-5">
                                            <div className="relative inline-block p-2 bg-white rounded-2xl shadow-inner border border-gray-200/50">
                                                <img
                                                    src={qrImageUrl}
                                                    alt="QR Code"
                                                    className="w-36 h-36 sm:w-40 sm:h-40"
                                                />
                                                <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-[#1769E0] rounded-tl-xl"></div>
                                                <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-[#1769E0] rounded-tr-xl"></div>
                                                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-[#1769E0] rounded-bl-xl"></div>
                                                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-[#1769E0] rounded-br-xl"></div>
                                                {/* Scanning line animation */}
                                                <div className="absolute inset-2 overflow-hidden rounded-xl pointer-events-none">
                                                    <div className="absolute left-0 right-0 h-0.5 bg-[#1769E0] shadow-[0_0_10px_#1769E0] animate-[scan_2s_ease-in-out_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center space-x-2 border border-white/40">
                                            <Camera className="h-5 w-5 text-[#1769E0]" />
                                            <span className="text-sm font-medium text-[#0B2554]">Open camera &amp; scan</span>
                                        </div>

                                        {/* Quick stats mini cards */}
                                        <div className="grid grid-cols-3 gap-2 mt-5">
                                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-white/40">
                                                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Today</p>
                                                <p className="text-lg font-bold text-[#0B2554]">{stats.checkIns}</p>
                                            </div>
                                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-white/40">
                                                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Rate</p>
                                                <p className="text-lg font-bold text-[#1769E0]">{stats.attendancePercent}%</p>
                                            </div>
                                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-white/40">
                                                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Last</p>
                                                <p className="text-sm font-bold text-[#0B2554]">{stats.lastCheckIn}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom stats bar */}
                        <div className="mt-12 lg:mt-16">
                            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-4 sm:p-6 grid grid-cols-3 divide-x divide-gray-200/50">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">System</p>
                                    <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-sm font-bold text-[#0B2554]">Online</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Check‑Ins</p>
                                    <p className="text-sm font-bold text-[#0B2554] mt-1">{stats.checkIns}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Departments</p>
                                    <p className="text-sm font-bold text-[#0B2554] mt-1">{stats.departments}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider */}
                    <div className="relative h-8 sm:h-12">
                        <svg className="absolute bottom-0 w-full h-8 sm:h-12 text-white/80 fill-current" viewBox="0 0 1440 48" preserveAspectRatio="none">
                            <path d="M0 48V0h1440v48c-240-20-480-32-720-32S240 28 0 48z" />
                        </svg>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className="bg-[#0B2554] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 text-white">
                                        <Scan className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-extrabold tracking-tight">HRIS</span>
                                        <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 -mt-0.5">
                                            Attendance System
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                                    Smart attendance for public servants. Accountability meets efficiency.
                                </p>
                            </div>

                        </div>
                    </div>
                </footer>

                {/* ========== FLOATING CHECK-IN BUTTON (mobile) ========== */}
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
                    <Link
                        href={route('login')}
                        className="flex items-center justify-center w-full px-6 py-4 bg-[#1769E0] hover:bg-[#0B2554] text-white font-bold rounded-2xl shadow-2xl shadow-blue-400/50 transition-all text-base"
                    >
                        <Scan className="mr-2 h-5 w-5" />
                        Check In Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                {/* Add custom keyframes for scanning animation */}
                <style>{`
                    @keyframes scan {
                        0% { top: 0; }
                        50% { top: calc(100% - 2px); }
                        100% { top: 0; }
                    }
                `}</style>
            </div>
        </>
    );
}
