import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import HelpAssistant from '@/Components/HelpAssistant';
import { LogIn, User, Lock, ArrowRight, Eye, EyeOff, Ghost } from 'lucide-react';

/* Bat silhouette (reused from welcome page) */
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
        { top: '12%', left: '8%', size: 3, delay: '0s' },
        { top: '20%', left: '88%', size: 2, delay: '0.7s' },
        { top: '44%', left: '5%', size: 2, delay: '1.4s' },
        { top: '60%', left: '92%', size: 3, delay: '0.3s' },
        { top: '78%', left: '14%', size: 2, delay: '2.1s' },
        { top: '85%', left: '78%', size: 2, delay: '1.1s' },
        { top: '30%', left: '72%', size: 2, delay: '1.9s' },
    ];

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0d0718] via-[#150b24] to-[#08040f]">
                {/* ---- Halloween night sky ---- */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* glows */}
                    <div className="absolute -top-40 -right-32 w-[28rem] h-[28rem] bg-purple-700/25 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 -left-40 w-[26rem] h-[26rem] bg-orange-600/15 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-fuchsia-700/15 rounded-full blur-3xl" />

                    {/* moon */}
                    <div className="absolute top-14 right-6 sm:right-16 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-50 to-amber-300 opacity-90 shadow-[0_0_70px_12px_rgba(251,191,36,0.22)]">
                        <span className="absolute top-3 left-4 w-3.5 h-3.5 rounded-full bg-amber-400/40" />
                        <span className="absolute bottom-5 right-4 w-4 h-4 rounded-full bg-amber-400/30" />
                        <span className="absolute top-9 right-7 w-2 h-2 rounded-full bg-amber-400/40" />
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

                    {/* cobweb top-left */}
                    <svg
                        viewBox="0 0 100 100"
                        className="absolute -top-2 -left-2 w-28 h-28 sm:w-40 sm:h-40 text-white/[0.08]"
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

                    {/* cobweb bottom-right */}
                    <svg
                        viewBox="0 0 100 100"
                        className="absolute -bottom-2 -right-2 w-24 h-24 sm:w-36 sm:h-36 text-white/[0.06] rotate-180"
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
                        className="absolute top-24 left-[14%] w-9 sm:w-12 text-orange-500/30 animate-[floaty_9s_ease-in-out_infinite]"
                        style={{ animationDelay: '0s' }}
                    />
                    <Bat
                        className="absolute top-40 right-[28%] w-7 sm:w-10 text-purple-400/25 animate-[floaty_11s_ease-in-out_infinite]"
                        style={{ animationDelay: '1.8s' }}
                    />
                    <Bat
                        className="absolute bottom-32 left-[6%] w-6 sm:w-9 text-orange-300/25 animate-[floaty_13s_ease-in-out_infinite]"
                        style={{ animationDelay: '3.2s' }}
                    />

                    {/* floating ghost */}
                    <Ghost
                        className="absolute bottom-20 right-[10%] w-8 h-8 text-white/[0.07] animate-[floaty_12s_ease-in-out_infinite]"
                        style={{ animationDelay: '2s' }}
                    />

                    {/* ground fog */}
                    <div className="absolute -bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-orange-900/20 via-purple-900/10 to-transparent blur-2xl animate-[drift_16s_ease-in-out_infinite_alternate]" />

                    {/* subtle dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                {/* ---- Header brand ---- */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
                    <Link href="/" className="inline-flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                            <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-[0_0_22px_-2px_rgba(249,115,22,0.75)]">
                                <img
                                    src="/favicon.png"
                                    alt="Logo"
                                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                                />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-orange-200 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                                QR Attendance
                            </span>
                            <span className="hidden xs:inline ml-1.5 text-[10px] font-semibold uppercase tracking-widest text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-400/30">
                                HRIS
                            </span>
                        </div>
                    </Link>
                </div>

                {/* ---- Main content ---- */}
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-3 py-6 sm:py-12">
                    <div className="w-full max-w-sm mx-auto sm:max-w-md">
                        {/* Logo + heading */}
                        <div className="text-center mb-5 sm:mb-8">
                            <div className="relative inline-block">
                                <div className="absolute -inset-3 bg-orange-500/20 rounded-full blur-2xl" />
                                <img
                                    src="/favicon.png"
                                    alt="Logo"
                                    className="relative mx-auto h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-[0_0_18px_rgba(249,115,22,0.6)]"
                                />
                            </div>
                            <h2 className="mt-3 text-xl sm:text-3xl font-bold text-white tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="mt-0.5 text-sm sm:text-base text-slate-400">
                                Sign in to your account
                            </p>
                        </div>

                        {/* Card */}
                        <div className="relative">
                            {/* glowing aura */}
                            <div className="absolute -inset-1.5 bg-gradient-to-br from-orange-500/30 via-fuchsia-500/10 to-purple-600/30 rounded-[1.75rem] blur-xl opacity-60" />

                            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#150b24]/85 backdrop-blur-xl border border-orange-400/25 shadow-2xl shadow-black/50">
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
                                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400/70" />
                                                </div>
                                                <TextInput
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    value={data.username}
                                                    className="block w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 pl-9 sm:pl-12 shadow-sm focus:border-orange-400 focus:ring-orange-400/50 text-sm sm:text-base"
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
                                            <div className="relative mt-1">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400/70" />
                                                </div>
                                                <TextInput
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    className="block w-full rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 pl-9 sm:pl-12 pr-10 sm:pr-12 shadow-sm focus:border-orange-400 focus:ring-orange-400/50 text-sm sm:text-base"
                                                    autoComplete="current-password"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Enter your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-500 hover:text-orange-300 transition-colors focus:outline-none focus-visible:text-orange-300"
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
                                                    className="rounded border-white/20 bg-white/5 text-orange-500 shadow-sm focus:ring-orange-400/60 focus:ring-offset-0"
                                                />
                                                <span className="ml-2 text-sm text-slate-300">
                                                    Remember me
                                                </span>
                                            </label>
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium text-orange-300 hover:text-orange-200 transition-colors focus:outline-none focus:underline"
                                            >
                                                Forgot credentials?
                                            </Link>
                                        </div>

                                        {/* Submit */}
                                        <PrimaryButton
                                            className="group w-full justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 px-4 py-3 text-white font-semibold shadow-[0_0_30px_-8px_rgba(249,115,22,0.9)] hover:shadow-[0_0_40px_-6px_rgba(249,115,22,1)] transition-all duration-300 hover:scale-[1.01] text-sm sm:text-base"
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
                                            className="font-medium text-orange-300 hover:text-orange-200 transition-colors focus:outline-none focus:underline"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Version info */}
                        <div className="mt-5 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                            <Ghost className="h-3.5 w-3.5 text-orange-400/60" />
                            QR Attendance System · Secure
                        </div>
                    </div>
                </div>

                <HelpAssistant />

                {/* Animations */}
                <style>{`
                    @keyframes floaty {
                        0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
                        50%      { transform: translate3d(10px, -14px, 0) rotate(-4deg); }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.15; transform: scale(0.8); }
                        50%      { opacity: 1; transform: scale(1.2); }
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