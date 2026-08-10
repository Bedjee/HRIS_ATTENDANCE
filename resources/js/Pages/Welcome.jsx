import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    QrCode,
    CheckCircle,
    ArrowRight,
    Shield,
    Clock,
    Building2,
    Award,
    Landmark,
    UserCheck,
    FileText,
    HelpCircle,
    Menu,
    X,
    Play,
    Mail,
    Phone,
    ArrowUp,
    BarChart3,
    Sparkles,
} from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Live Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Scroll progress & back-to-top
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(progress);
            setShowBackToTop(scrollTop > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll-triggered animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-up');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Count-up animation (plain JS)
    const useCountUp = (end, duration = 2000) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            let startTime;
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, [end, duration]);
        return count;
    };

    const employeeCount = useCountUp(500);
    const deptCount = useCountUp(36);
    const checkinsCount = useCountUp(48);
    const uptimeCount = useCountUp(99.8);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const tourSteps = [
        {
            title: 'Scan QR Code',
            description: 'Employees scan their unique QR code at designated check-in points.',
            icon: QrCode,
        },
        {
            title: 'Instant Verification',
            description: 'The system verifies identity and logs the check-in with a timestamp.',
            icon: CheckCircle,
        },
        {
            title: 'Real-time Tracking',
            description: 'HR and supervisors can monitor attendance in real-time via the dashboard.',
            icon: BarChart3,
        },
    ];

    const testimonials = [
        {
            name: 'Maria Santos',
            title: 'HR Director, Quezon City',
            quote: 'This system eliminated our manual logbooks and saved us 10+ hours of reconciliation work every week.',
            initials: 'MS',
            color: 'blue',
        },
        {
            name: 'Jose Reyes',
            title: 'Department Head, DILG',
            quote: 'Transparency and accountability have improved significantly. We can now track attendance in real-time.',
            initials: 'JR',
            color: 'amber',
        },
    ];




    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-slate-50 font-sans antialiased overflow-x-hidden">
                {/* Scroll Progress Bar */}
                <div
                    className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-blue-600 to-amber-500 transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                ></div>

                {/* Subtle noise texture */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSI0IiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4yIiAvPjwvc3ZnPg==')]"></div>

                {/* Navigation */}
               {/* Navigation – transparent */}
                <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm group-hover:shadow-md transition">
                                    <Landmark className="h-5 w-5 text-white group-hover:scale-110 transition" />
                                </div>
                                <div className="hidden xs:block">
                                    <span className="text-lg font-serif font-bold text-white tracking-tight drop-shadow-sm">
                                        LGU HR Portal
                                    </span>
                                    <span className="block text-[10px] font-medium uppercase tracking-widest text-white/80 -mt-0.5">
                                        Attendance System
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-white/90">
                                            Welcome, <span className="font-medium text-white">{auth.user.name}</span>
                                        </span>
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-medium rounded-lg border border-white/20 shadow-sm transition"
                                        >
                                            Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-medium rounded-lg border border-white/20 shadow-sm transition"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                            </button>
                        </div>
                    </div>
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-slate-900/80 backdrop-blur-md border-t border-white/10 shadow-lg">
                            <div className="px-4 py-4 space-y-3">
                                {auth.user ? (
                                    <>
                                        <div className="text-sm text-white/90 pb-2 border-b border-white/10">
                                            Welcome, <span className="font-medium text-white">{auth.user.name}</span>
                                        </div>
                                        <Link
                                            href={route('dashboard')}
                                            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="flex items-center px-4 py-2 text-sm font-medium text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section – with background image */}
                <section className="relative z-10 overflow-hidden min-h-[600px] flex items-center">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/hero.png" // Replace with your image path
                            alt="LGU Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black-900/70 via-black-900/50 to-transparent"></div>
                        {/* Additional subtle gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>

                    {/* Decorative floating shapes – softened */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl animate-float-slow z-10"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl animate-float-slower z-10"></div>

                    <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        {/* Live Clock & Status Banner – dark glass */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 sm:px-6 sm:py-3 shadow-lg mb-8 animate-on-scroll">
                            <div className="flex items-center space-x-3">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-white/90">System Online</span>
                                <span className="hidden xs:inline-block h-4 w-px bg-white/30"></span>
                                <span className="hidden xs:inline text-xs sm:text-sm text-white/80">
                                    {formattedDate}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-blue-200">
                                <Clock className="h-4 w-4" />
                                <span>{formattedTime}</span>
                                <span className="text-white/40">|</span>
                                <span className="text-white/80">8:00 AM – 5:00 PM</span>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1 space-y-6 animate-on-scroll">
                                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 shadow-sm">
                                    <Shield className="h-4 w-4 text-white" />
                                    <span className="text-xs font-medium text-white tracking-wide">
                                        Official Government Use
                                    </span>
                                </div>

                                {!auth.user ? (
                                    <>
                                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                                            Accurate Attendance
                                            <span className="block text-blue-200">for Public Servants</span>
                                        </h1>
                                        <p className="text-base sm:text-lg text-white/90 max-w-lg leading-relaxed">
                                            Simplify employee check‑ins with QR tech. Ensure transparency and accountability across all LGU departments.
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 pt-1">
                                            <div className="flex items-center space-x-2 text-sm text-white/90">
                                                <UserCheck className="h-5 w-5 text-emerald-400" />
                                                <span><span className="font-bold text-white">{employeeCount}+</span> employees</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-white/90">
                                                <Building2 className="h-5 w-5 text-amber-300" />
                                                <span><span className="font-bold text-white">{deptCount}</span> departments</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <Link
                                                href={route('login')}
                                                className="group relative inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm sm:text-base overflow-hidden"
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition"></span>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Check In Now
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                            </Link>
                                            <button
                                                onClick={() => setShowModal(true)}
                                                className="inline-flex items-center px-6 py-3 border-2 border-white/40 hover:border-white/70 text-white font-medium rounded-lg hover:bg-white/10 transition text-sm sm:text-base"
                                            >
                                                <Play className="mr-2 h-4 w-4" />
                                                Take a Tour
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-6">
                                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                                            Welcome back! <span className="text-blue-200">{auth.user.name}</span>
                                        </h1>

                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
                                        >
                                            Go to Full Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Right column – now empty because image is background; we can add a small decorative element if desired */}
                            <div className="hidden lg:block order-1 lg:order-2"></div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="relative z-10 bg-white/80 backdrop-blur-sm py-16 sm:py-20 border-t border-slate-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 animate-on-scroll">
                            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-100/60 backdrop-blur-sm mb-4">
                                How It Works
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Simple 3-Step Process
                            </h2>
                            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                                From check-in to verification, the entire process takes just seconds.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {tourSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative group bg-slate-50/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 p-6 border border-slate-200/50 hover:border-blue-200/50 text-center animate-on-scroll"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition">
                                        {index + 1}
                                    </div>
                                    <div className="pt-4">
                                        <div className="inline-flex p-3 bg-blue-50 rounded-xl border border-blue-100/60 mb-4 group-hover:bg-blue-100 transition">
                                            <step.icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition" />
                                        </div>
                                        <h3 className="font-serif text-lg font-bold text-slate-800 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="relative z-10 bg-slate-50/80 backdrop-blur-sm py-16 sm:py-20 border-t border-slate-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 animate-on-scroll">
                            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-100/60 backdrop-blur-sm mb-4">
                                Key Features
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Efficient HR for the Public Sector
                            </h2>
                            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                                Tools designed to uphold transparency, accuracy, and service excellence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                            {[
                                {
                                    icon: QrCode,
                                    title: 'QR Check‑in',
                                    description: 'Secure, contactless attendance with unique codes for each employee.',
                                    color: 'blue',
                                },
                                {
                                    icon: Users,
                                    title: 'Employee Records',
                                    description: 'Centralized directory with department and role management.',
                                    color: 'indigo',
                                },
                                {
                                    icon: Calendar,
                                    title: 'Shift & Event Scheduling',
                                    description: 'Plan and monitor attendance for all official activities.',
                                    color: 'amber',
                                },
                                {
                                    icon: FileText,
                                    title: 'Audit Reports',
                                    description: 'Exportable logs for payroll, compliance, and oversight.',
                                    color: 'emerald',
                                },
                            ].map((feature, idx) => {
                                const colorMap = {
                                    blue: 'bg-blue-50 border-blue-100/60 text-blue-700',
                                    indigo: 'bg-indigo-50 border-indigo-100/60 text-indigo-700',
                                    amber: 'bg-amber-50 border-amber-100/60 text-amber-700',
                                    emerald: 'bg-emerald-50 border-emerald-100/60 text-emerald-700',
                                };
                                return (
                                    <div
                                        key={idx}
                                        className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 p-5 border border-slate-200/50 hover:border-blue-200/50 animate-on-scroll"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className={`inline-flex p-2.5 rounded-xl border ${colorMap[feature.color]} mb-3 group-hover:scale-110 transition`}>
                                            <feature.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="relative z-10 bg-white/80 backdrop-blur-sm py-16 sm:py-20 border-t border-slate-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 animate-on-scroll">
                            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-100/60 backdrop-blur-sm mb-4">
                                Testimonials
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Trusted by LGU Leaders
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all hover:-translate-y-1 animate-on-scroll"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${testimonial.color}-100 border-2 border-${testimonial.color}-200 flex items-center justify-center font-bold text-${testimonial.color}-700`}>
                                            {testimonial.initials}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-600 italic leading-relaxed">
                                                "{testimonial.quote}"
                                            </p>
                                            <div className="mt-3">
                                                <p className="text-sm font-bold text-slate-800">{testimonial.name}</p>
                                                <p className="text-xs text-slate-500">{testimonial.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats & Accountability */}
                <section className="relative z-10 bg-slate-50/80 py-16 sm:py-20 border-t border-slate-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1 animate-on-scroll">
                                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-100/60 backdrop-blur-sm mb-4">
                                    Why QR Attendance?
                                </span>
                                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                    Built for Public Accountability
                                </h2>
                                <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                                    Every check‑in is timestamped and logged. Supervisors can monitor
                                    attendance in real time, and employees have full visibility of their records.
                                </p>
                                <div className="mt-6 space-y-3">
                                    {[
                                        'Real‑time tracking with geo‑fencing (optional)',
                                        'Automated payroll and leave integration',
                                        'Role‑based access for HR, department heads, and employees',
                                        'Audit trail for every transaction',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start space-x-2.5">
                                            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm sm:text-base text-slate-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <Link
                                        href={route('register')}
                                        className="group inline-flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition text-sm sm:text-base"
                                    >
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Link>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 animate-on-scroll">
                                {[
                                    { value: `${uptimeCount}%`, label: 'Uptime', icon: Shield },
                                    { value: '< 1s', label: 'Avg. Response', icon: Clock },
                                    { value: `${checkinsCount}+`, label: 'Daily Check‑ins', icon: QrCode },
                                    { value: '4.8★', label: 'User Satisfaction', icon: Award },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/90 backdrop-blur-sm rounded-xl p-5 text-center border border-slate-200/50 hover:border-blue-200/50 transition-shadow hover:shadow-md hover:-translate-y-1"
                                    >
                                        <div className="inline-flex p-2 bg-blue-50 rounded-full mb-2">
                                            <stat.icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="font-serif text-2xl font-bold text-slate-900">{stat.value}</div>
                                        <div className="text-sm text-slate-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By */}
                <section className="relative z-10 bg-white py-12 sm:py-16 border-t border-slate-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Integrated with LGU Systems
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-14 opacity-70">
                            {['Payroll', 'Civil Service', 'Budget', 'Personnel', 'Records'].map((name, i) => (
                                <span key={i} className="text-slate-600 font-medium text-sm sm:text-base tracking-wide">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="relative z-10 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                    <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyek0zNiAyMnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 md:py-28 text-center animate-on-scroll">
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-200 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm mb-4">
                            Join the System
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                            Enable Smarter Attendance <br className="hidden sm:block" />
                            for Your LGU
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-blue-200 max-w-2xl mx-auto">
                            Register today and start managing attendance with transparency and ease.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="group inline-flex items-center px-6 py-3 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition hover:scale-105 text-sm sm:text-base"
                                    >
                                        Register
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition text-sm sm:text-base"
                                    >
                                        Log In
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="group inline-flex items-center px-6 py-3 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition hover:scale-105 text-sm sm:text-base"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                </Link>
                            )}
                        </div>
                        <p className="mt-4 text-xs sm:text-sm text-blue-300/80">
                            Secure access for all government employees and administrators.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 bg-white border-t border-slate-200/50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-200/50">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Landmark className="h-5 w-5 text-amber-700" />
                                    <span className="font-serif font-semibold text-slate-800">LGU HR Portal</span>
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/50">
                                        Official
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Secure attendance management system for local government units.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Quick Links</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li>
                                        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                                    </li>
                                    <li>
                                        <Link href={route('login')} className="hover:text-blue-600 transition">Log In</Link>
                                    </li>
                                    <li>
                                        <Link href={route('register')} className="hover:text-blue-600 transition">Register</Link>
                                    </li>
                                    <li>
                                        <button onClick={() => setShowModal(true)} className="hover:text-blue-600 transition">
                                            Take a Tour
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Support</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <a href="mailto:hr@lgu.gov.ph" className="hover:text-blue-600 transition">hr@lgu.gov.ph</a>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4" />
                                        <span>(02) 8123-4567</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <HelpCircle className="h-4 w-4" />
                                        <span>Help Center</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Legal</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li>
                                        <Link href="#" className="hover:text-blue-600 transition">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-blue-600 transition">Terms of Use</Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-blue-600 transition">Data Security</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
                            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-500">
                                <span>Developed by <span className="font-medium text-slate-700">SyntraHR</span></span>
                                <span className="h-3 w-px bg-slate-200 hidden xs:inline"></span>
                                <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                                <span className="h-3 w-px bg-slate-200 hidden xs:inline"></span>
                                <div className="flex items-center space-x-1">
                                    <Shield className="h-3 w-3 text-slate-400" />
                                    <span className="text-[10px] sm:text-xs">Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Back to Top */}
                {showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </button>
                )}

                {/* Quick Tour Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 z-50 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                                aria-hidden="true"
                                onClick={() => setShowModal(false)}
                            ></div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                                <div className="absolute top-0 right-0 pt-4 pr-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="rounded-lg p-2 hover:bg-slate-100 transition"
                                        aria-label="Close tour"
                                    >
                                        <X className="h-6 w-6 text-slate-500" />
                                    </button>
                                </div>

                                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8 sm:px-10">
                                    <h3 className="font-serif text-2xl font-bold text-white" id="modal-title">
                                        Welcome to LGU HR Portal
                                    </h3>
                                    <p className="mt-2 text-blue-100">
                                        Here's a quick overview of how the attendance system works.
                                    </p>
                                    <div className="mt-4 flex items-center space-x-2">
                                        <div className="flex-1 h-1.5 bg-blue-300/30 rounded-full overflow-hidden">
                                            <div className="h-full w-0 bg-white rounded-full animate-progress"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-8 sm:px-10">
                                    <div className="space-y-6">
                                        {tourSteps.map((step, index) => (
                                            <div key={index} className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100">
                                                    <step.icon className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800">
                                                        Step {index + 1}: {step.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 mt-0.5">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="inline-flex items-center px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition"
                                        >
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS animations */}
            <style>{`
                @keyframes gradient-slow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-slow {
                    background-size: 200% 200%;
                    animation: gradient-slow 15s ease infinite;
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                @keyframes float-slower {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(-3deg); }
                }
                .animate-float-slower {
                    animation: float-slower 12s ease-in-out infinite;
                }
                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-up {
                    opacity: 1 !important;
                    animation: fade-up 0.8s ease-out forwards;
                }
                .animate-on-scroll {
                    opacity: 0;
                }
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-progress {
                    animation: progress 3s ease-in-out forwards;
                }
            `}</style>
        </>
    );
}
