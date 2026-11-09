import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import HelpAssistant from '@/Components/HelpAssistant';
import { User, Lock, ArrowRight, Eye, EyeOff, Star } from 'lucide-react';

/* ---------------------------------- */
/* Compact parol mark (logo)          */
/* ---------------------------------- */
function ParolMark({ className = '' }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="lmBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="55%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
            </defs>
            <path
                d="M50 6 L61.2 34.6 L91.9 36.4 L68.1 55.9 L75.9 85.6 L50 69 L24.1 85.6 L31.9 55.9 L8.1 36.4 L38.8 34.6 Z"
                fill="url(#lmBody)"
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
                <radialGradient id="lpBody" cx="50%" cy="40%" r="65%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="35%" stopColor="#fde68a" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b91c1c" />
                </radialGradient>
                <radialGradient id="lpCore" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="60%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </radialGradient>
                <linearGradient id="lpTail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
            </defs>

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

            <path
                d="M50 8 L60 34.3 L88 35.6 L66.2 53.3 L73.5 80.4 L50 65 L26.5 80.4 L33.8 53.3 L12 35.6 L40 34.3 Z"
                fill="url(#lpBody)"
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            <path
                d="M50 28 L55 41.1 L69 41.8 L58.1 50.6 L61.8 64.2 L50 56.5 L38.2 64.2 L41.9 50.6 L31 41.8 L45 41.1 Z"
                fill="url(#lpCore)"
                stroke="#fde68a"
                strokeWidth="0.8"
                strokeLinejoin="round"
            />
            <circle cx="50" cy="46" r="10" fill="#fef3c7" opacity="0.35" />
            <circle cx="50" cy="46" r="5.5" fill="#fffbeb" />

            <path d="M43 82 Q40 98 36 112" fill="none" stroke="url(#lpTail)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M57 82 Q60 98 64 112" fill="none" stroke="url(#lpTail)" strokeWidth="2.5" strokeLinecap="round" />
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
            <div className="relative flex justify-between items-start px-1 pt-1">
                {flags.map((f, i) => (
                    <div
                        key={i}
                        className="w-2 h-3 sm:w-2.5 sm:h-4 md:w-3 md:h-5"
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

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const stars = [
        { top: '12%', left: '8%',  size: 2, delay: '0s' },
        { top: '20%', left: '88%', size: 2, delay: '0.7s' },
        { top: '44%', left: '5%',  size: 2, delay: '1.4s' },
        { top: '60%', left: '92%', size: 3, delay: '0.3s' },
        { top: '78%', left: '14%', size: 2, delay: '2.1s' },
        { top: '85%', left: '78%', size: 2, delay: '1.1s' },
        { top: '30%', left: '72%', size: 2, delay: '1.9s' },
    ];

    // Warm golden light motes drifting through the Simbang Gabi sky
    const motes = Array.from({ length: 14 }).map((_, i) => ({
        left: (i * 37 + 13) % 100,
        top: 10 + ((i * 23) % 72),
        size: 3 + (i % 3) * 2,
        delay: (i * 0.7) % 6,
        duration: 5 + (i % 5) * 1.4,
    }));

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#071820] via-[#0a1f2a] to-[#041016]">
                {/* ---- Simbang Gabi night sky ---- */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* warm ambient glows */}
                    <div className="absolute -top-40 -right-32 w-[28rem] h-[28rem] bg-amber-500/20 rounded-full blur-3xl animate-[glowpulse_9s_ease-in-out_infinite]" />
                    <div className="absolute top-1/3 -left-40 w-[26rem] h-[26rem] bg-red-600/15 rounded-full blur-3xl animate-[glowpulse_11s_ease-in-out_infinite]" />
                    <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-emerald-600/15 rounded-full blur-3xl animate-[glowpulse_13s_ease-in-out_infinite]" />

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

                    {/* golden light motes */}
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

                    {/* floating parols — corner decorations */}
                    <Parol
                        className="absolute top-24 left-[10%] w-10 sm:w-16 opacity-70 drop-shadow-[0_0_18px_rgba(251,191,36,0.45)] animate-[sway_9s_ease-in-out_infinite]"
                        style={{ animationDelay: '0s' }}
                    />
                    <Parol
                        className="absolute top-32 right-[8%] w-12 sm:w-20 text-amber-300/80 drop-shadow-[0_0_24px_rgba(251,191,36,0.55)] animate-[sway_7s_ease-in-out_infinite]"
                        style={{ animationDelay: '1.4s' }}
                    />
                    <Parol
                        className="absolute bottom-28 left-[6%] w-8 sm:w-12 opacity-50 drop-shadow-[0_0_14px_rgba(251,191,36,0.35)] animate-[sway_11s_ease-in-out_infinite]"
                        style={{ animationDelay: '2.6s' }}
                    />

                    {/* warm horizon light */}
                    <div className="absolute -bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-amber-800/20 via-amber-700/8 to-transparent blur-2xl animate-[drift_18s_ease-in-out_infinite_alternate]" />

                    {/* subtle warm dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                {/* ---- Header brand ---- */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
                    <Link href="/" className="inline-flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                            <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl shadow-[0_0_22px_-2px_rgba(239,68,68,0.75)]">
                                <ParolMark className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-[0_0_4px_rgba(255,251,235,0.5)]" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent">
                                QR Attendance
                            </span>
                            <span className="hidden xs:inline ml-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300 bg-red-500/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                                HRIS
                            </span>
                        </div>
                    </Link>
                </div>

                {/* ---- Banderitas strip under brand ---- */}
                <div className="relative z-10 mt-4 overflow-hidden">
                    <Banderitas className="h-6 sm:h-7" />
                </div>

                {/* ---- Main content ---- */}
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] px-3 py-6 sm:py-10">
                    <div className="w-full max-w-sm mx-auto sm:max-w-md">
                        {/* Parol + heading */}
                        <div className="text-center mb-5 sm:mb-8">
                            <div className="relative inline-block">
                                <div className="absolute -inset-3 bg-amber-400/25 rounded-full blur-2xl" />
                                <Parol className="relative mx-auto h-16 w-14 sm:h-20 sm:w-16 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-[sway_6s_ease-in-out_infinite]" />
                            </div>
                            <p className="mt-2 font-serif italic text-amber-200/90 text-sm sm:text-base">
                                Maligayang Pasko!
                            </p>
                            <h2 className="mt-1 text-xl sm:text-3xl font-bold text-white tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="mt-0.5 text-sm sm:text-base text-slate-400">
                                Sign in to your account
                            </p>
                        </div>

                        {/* Card */}
                        <div className="relative">
                            {/* warm glowing aura */}
                            <div className="absolute -inset-1.5 bg-gradient-to-br from-amber-500/30 via-red-500/15 to-emerald-500/25 rounded-[1.75rem] blur-xl opacity-70 animate-[glowpulse_8s_ease-in-out_infinite]" />

                            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a1f2a]/90 backdrop-blur-xl border border-amber-400/25 shadow-2xl shadow-black/50">
                                <div className="p-5 sm:p-8">
                                    {status && (
                                        <div className="mb-4 rounded-xl bg-emerald-500/10 backdrop-blur-sm p-3 text-sm font-medium text-emerald-300 border border-emerald-400/30">
                                            {status}
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                                        {/* Username */}
                                        <div>
                                            <InputLabel
                                                htmlFor="username"
                                                value="Username"
                                                className="text-sm font-medium text-slate-300"
                                            />
                                            <div className="relative mt-1">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400/70" />
                                                </div>
                                                <TextInput
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    value={data.username}
                                                    className="block w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 pl-9 sm:pl-12 shadow-sm focus:border-amber-400 focus:ring-amber-400/50 text-sm sm:text-base"
                                                    autoComplete="username"
                                                    isFocused={true}
                                                    onChange={(e) => setData('username', e.target.value)}
                                                    placeholder="Enter your username"
                                                />
                                            </div>
                                            <InputError message={errors.username} className="mt-1.5" />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <InputLabel
                                                htmlFor="password"
                                                value="Password"
                                                className="text-sm font-medium text-slate-300"
                                            />
                                            <div className="relative mt-1">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400/70" />
                                                </div>
                                                <TextInput
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    className="block w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 pl-9 sm:pl-12 pr-10 sm:pr-12 shadow-sm focus:border-amber-400 focus:ring-amber-400/50 text-sm sm:text-base"
                                                    autoComplete="current-password"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Enter your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-500 hover:text-amber-300 transition-colors focus:outline-none focus-visible:text-amber-300"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} className="mt-1.5" />
                                        </div>

                                        {/* Remember Me + Forgot */}
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="rounded border-white/20 bg-white/5 text-red-600 shadow-sm focus:ring-amber-400/60 focus:ring-offset-0"
                                                />
                                                <span className="ml-2 text-sm text-slate-300">
                                                    Remember me
                                                </span>
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors focus:outline-none focus:underline"
                                                >
                                                    Forgot credentials?
                                                </Link>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <PrimaryButton
                                            className="group w-full justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-4 py-3 text-white font-semibold ring-1 ring-amber-300/40 shadow-[0_0_30px_-8px_rgba(239,68,68,0.9)] hover:shadow-[0_0_40px_-6px_rgba(239,68,68,1)] transition-all duration-300 hover:scale-[1.01] text-sm sm:text-base"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <svg
                                                        className="mr-2 h-4 w-4 animate-spin"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Signing in...
                                                </span>
                                            ) : (
                                                <>
                                                    Sign in
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </form>

                                    {/* Footer link */}
                                    <div className="mt-5 text-center text-sm text-slate-400">
                                        Don't have an account?{' '}
                                        <Link
                                            href={route('register')}
                                            className="font-medium text-amber-300 hover:text-amber-200 transition-colors focus:outline-none focus:underline"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Version / greeting */}
                        <div className="mt-5 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
                            <span className="flex items-center gap-1.5">
                                <ParolMark className="h-3.5 w-3.5" />
                                QR Attendance System · Secure
                            </span>
                            <span className="flex items-center gap-1.5 font-serif italic text-amber-200/70">
                                <Star className="h-3 w-3 text-amber-400/80" />
                                Maligayang Pasko at Manigong Bagong Taon
                            </span>
                        </div>
                    </div>
                </div>

                <HelpAssistant />

                {/* Animations */}
                <style>{`
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