import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Calendar,
    QrCode,
    CheckCircle,
    ArrowRight,
    Shield,
    Zap,
    TrendingUp,
    Clock,
    BarChart3,
    Smartphone,
    Building2,
    Sparkles,
    ChevronRight,
    Award,
    Globe,
    LayoutGrid,
} from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen overflow-hidden bg-white">
                {/* Subtle gradient orbs - reduced for mobile */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[30%] -right-[10%] w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-indigo-100/40 rounded-full blur-3xl"></div>
                    <div className="absolute top-[40%] -left-[15%] w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-blue-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-violet-100/20 rounded-full blur-3xl"></div>
                </div>

                {/* Navigation - mobile friendly */}
                <nav className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-gray-100/60 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <Link href="/" className="flex items-center space-x-2 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                                    <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
                                        <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        QR Attendance
                                    </span>
                                    <span className="hidden xs:inline ml-1.5 text-[10px] font-semibold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">
                                        HRIS
                                    </span>
                                </div>
                            </Link>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="group inline-flex items-center px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <span className="hidden xs:inline">Dashboard</span>
                                        <span className="xs:hidden">Home</span>
                                        <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-indigo-50/50"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="group inline-flex items-center px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <span>Register</span>
                                            <Sparkles className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - optimized for mobile */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-16 sm:pb-12 lg:pt-24 lg:pb-20">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            {/* Internal badge - no marketing */}
                            <div className="inline-flex items-center space-x-2 bg-indigo-50/80 backdrop-blur-sm border border-indigo-100/60 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 shadow-sm">
                                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-full w-full bg-indigo-500"></span>
                                </span>
                                <span className="text-[10px] sm:text-xs font-medium text-indigo-700 tracking-wide">
                                    Internal HRIS · Secure
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                                <span className="text-slate-900">Smart QR</span>
                                <br />
                                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Attendance
                                </span>
                                <span className="text-slate-900"> for HR</span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
                                Streamline employee attendance with real‑time QR tracking.
                                Automated check‑ins, instant reports, and full visibility — built for your organization.
                            </p>

                            {/* Internal stats - less "marketing" */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-1">
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-2">
                                        {['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=2', 'https://i.pravatar.cc/40?img=3', 'https://i.pravatar.cc/40?img=4'].map((src, i) => (
                                            <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-slate-700">
                                        <span className="text-indigo-600 font-bold">400+</span> employees
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-500">
                                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                                    <span>Enterprise‑grade</span>
                                </div>
                            </div>

                            {/* CTA buttons - internal tone */}
                            <div className="flex flex-wrap gap-3 sm:gap-4 pt-1">
                                {!auth.user ? (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="group inline-flex items-center px-5 py-2.5 sm:px-7 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                                        >
                                            Register
                                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-5 py-2.5 sm:px-7 sm:py-3.5 border-2 border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold rounded-2xl hover:bg-indigo-50/50 transition-all duration-300 text-sm sm:text-base"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        className="group inline-flex items-center px-5 py-2.5 sm:px-7 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Hero visual - hidden on small screens, but we keep it for tablet+ */}
                        <div className="hidden sm:flex lg:flex justify-center items-center order-1 lg:order-2">
                            <div className="relative w-full max-w-lg">
                                {/* Floating decorative elements - smaller on tablet */}
                                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
                                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
                                </div>
                                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 rounded-2xl -rotate-6 shadow-lg flex items-center justify-center">
                                    <Clock className="h-5 w-5 sm:h-7 sm:w-7 text-blue-500" />
                                </div>

                                {/* Main card */}
                                <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 relative overflow-hidden">
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100/40 rounded-full blur-2xl"></div>
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-100/30 rounded-full blur-2xl"></div>

                                    <div className="relative">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/80"></div>
                                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/80"></div>
                                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/80"></div>
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-mono text-slate-400 ml-1 sm:ml-2">● QR Scanner</span>
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-indigo-100/60">
                                                Live
                                            </span>
                                        </div>

                                        {/* Scanner preview */}
                                        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-slate-100/60">
                                            <div className="relative max-w-[140px] sm:max-w-[180px] mx-auto">
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-xl blur-xl"></div>
                                                <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-inner p-3 sm:p-5 border border-slate-200/50">
                                                    <div className="relative aspect-square bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-300/50">
                                                        <QrCode className="h-14 w-14 sm:h-20 sm:w-20 text-indigo-600" />
                                                        <div className="absolute -top-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-indigo-500 rounded-tl"></div>
                                                        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-indigo-500 rounded-tr"></div>
                                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-indigo-500 rounded-bl"></div>
                                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-indigo-500 rounded-br"></div>
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-1 bg-indigo-200 rounded-full blur-sm"></div>
                                            </div>
                                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-slate-600">
                                                Point camera at QR code to check in
                                            </p>
                                            <div className="mt-2 sm:mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-3">
                                                <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-medium rounded-full border border-emerald-100/50">
                                                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                                    42 checked in
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-50 text-slate-600 text-[10px] sm:text-xs font-medium rounded-full border border-slate-100/50">
                                                    <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                                    12 waiting
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom info */}
                                        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-slate-500 gap-1">
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <span className="flex items-center">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1"></span>
                                                    System online
                                                </span>
                                                <span className="h-3 w-px bg-slate-200 hidden xs:inline"></span>
                                                <span className="flex items-center">
                                                    <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-slate-400" />
                                                    Encrypted
                                                </span>
                                            </div>
                                            <span className="font-mono text-slate-400">v3.2.1</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom floating badge - hidden on small tablet */}
                                <div className="absolute -bottom-6 left-4 sm:left-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-1 sm:p-1.5 bg-indigo-50 rounded-lg">
                                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] sm:text-xs font-medium text-slate-500">Attendance rate</div>
                                        <div className="text-sm sm:text-base font-bold text-slate-800">94.7%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative z-10 bg-slate-50/80 backdrop-blur-sm py-12 sm:py-20 md:py-24 border-t border-white/30">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[800px] h-[300px] sm:h-[400px] bg-indigo-100/20 rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-indigo-100/60 backdrop-blur-sm mb-3 sm:mb-4">
                                Features
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Built for modern HR teams
                            </h2>
                            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                Everything you need to manage attendance effortlessly — from check-in to analytics.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                {
                                    icon: QrCode,
                                    title: 'QR Check-in',
                                    description: 'Instant, contactless check-in with secure QR codes. Works offline too.',
                                    color: 'indigo',
                                },
                                {
                                    icon: Users,
                                    title: 'Employee Directory',
                                    description: 'Centralized employee management with role-based access control.',
                                    color: 'blue',
                                },
                                {
                                    icon: Calendar,
                                    title: 'Event Scheduler',
                                    description: 'Create, manage, and track attendance for any event or shift.',
                                    color: 'violet',
                                },
                                {
                                    icon: BarChart3,
                                    title: 'Analytics & Reports',
                                    description: 'Real-time dashboards and exportable reports for payroll & compliance.',
                                    color: 'emerald',
                                },
                            ].map((feature, idx) => {
                                const colorMap = {
                                    indigo: 'from-indigo-50 to-indigo-100/50 text-indigo-600 border-indigo-100/60',
                                    blue: 'from-blue-50 to-blue-100/50 text-blue-600 border-blue-100/60',
                                    violet: 'from-violet-50 to-violet-100/50 text-violet-600 border-violet-100/60',
                                    emerald: 'from-emerald-50 to-emerald-100/50 text-emerald-600 border-emerald-100/60',
                                };
                                const bgMap = {
                                    indigo: 'bg-indigo-50/80',
                                    blue: 'bg-blue-50/80',
                                    violet: 'bg-violet-50/80',
                                    emerald: 'bg-emerald-50/80',
                                };
                                return (
                                    <div
                                        key={idx}
                                        className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 p-5 sm:p-7 border border-white/50 hover:border-indigo-100/50 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className={`relative inline-flex p-2 sm:p-3 ${bgMap[feature.color]} rounded-xl mb-3 sm:mb-4 border ${colorMap[feature.color].split(' ').slice(2).join(' ')}`}>
                                            <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <h3 className="relative text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="relative text-xs sm:text-sm text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                        <div className="relative mt-3 sm:mt-4 flex items-center text-xs sm:text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                            Learn more
                                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits / Stats Section - internal focused */}
                <section className="relative z-10 bg-white py-12 sm:py-20 md:py-24 border-t border-slate-100/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div>
                                <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-indigo-100/60 backdrop-blur-sm mb-3 sm:mb-4">
                                    Why QR Attendance
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                    Streamline HR operations
                                </h2>
                                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                                    Eliminate manual tracking, reduce errors, and get real-time visibility
                                    into your workforce attendance — all integrated with your HRIS.
                                </p>
                                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                                    {[
                                        'Real-time attendance tracking with GPS verification',
                                        'Automated payroll integration and reporting',
                                        'Role-based access for HR, managers, and employees',
                                        'Audit-ready logs with export capabilities',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start space-x-2.5 sm:space-x-3">
                                            <div className="mt-0.5 p-0.5 sm:p-1 bg-emerald-50 rounded-full border border-emerald-100/50">
                                                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                                            </div>
                                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 sm:mt-8">
                                    <Link
                                        href={route('register')}
                                        className="group inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                                    >
                                        Register
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    { value: '99.9%', label: 'Uptime', icon: Shield },
                                    { value: '< 2s', label: 'Avg. Check-in', icon: Clock },
                                    { value: '30+', label: 'Daily scans', icon: QrCode },
                                    { value: '4.9★', label: 'User rating', icon: Award },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-50/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-slate-100/50 hover:border-indigo-100/50 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                        <div className="inline-flex p-1.5 sm:p-2 bg-white rounded-xl shadow-sm border border-slate-100/50 mb-2 sm:mb-3">
                                            <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                                        </div>
                                        <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
                                        <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Internal Trust / Integrations - replaced with "Our Organization" feel */}
                <section className="relative z-10 bg-slate-50/80 backdrop-blur-sm py-10 sm:py-16 border-t border-white/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400">
                            Part of your HR ecosystem
                        </p>
                        <div className="mt-4 sm:mt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-12 opacity-70">
                            {['Payroll', 'Employee Portal', 'Time Tracking', 'Performance', 'Benefits'].map((name, i) => (
                                <span key={i} className="text-slate-600 font-semibold text-sm sm:text-base md:text-lg tracking-wide">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section - internal tone, no "trial" or "credit card" */}
                <section className="relative z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900"></div>
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-400/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 md:py-28 text-center">
                        <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-200 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/10 backdrop-blur-sm mb-3 sm:mb-4">
                            Get started
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                            Ready to simplify attendance <br className="hidden sm:block" />
                            for your organization?
                        </h2>
                        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
                            Join your colleagues and start using the QR Attendance system today.
                        </p>
                        <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] text-sm sm:text-base"
                                    >
                                        Register
                                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
                                    >
                                        Log In
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] text-sm sm:text-base"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </Link>
                            )}
                        </div>
                        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-indigo-300/80">
                            Secure access for employees and HR administrators.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 bg-white border-t border-slate-100/50 py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                            <div className="flex items-center space-x-2">
                                <div className="p-1 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg">
                                    <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                </div>
                                <span className="text-sm font-bold text-slate-800">QR Attendance</span>
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border border-indigo-100/50">
                                    HRIS
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                                <span>Built by <span className="font-medium text-slate-700">SyntraHR</span></span>
                                <span className="h-3 w-px bg-slate-200 hidden xs:inline"></span>
                                <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                                <span className="h-3 w-px bg-slate-200 hidden xs:inline"></span>
                                <div className="flex items-center space-x-1.5">
                                    <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
                                    <span className="text-[10px] sm:text-xs">Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
