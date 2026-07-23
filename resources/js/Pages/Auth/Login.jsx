import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { LogIn, User, Lock, QrCode, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
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

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen overflow-hidden bg-white">
                {/* Decorative gradient orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[30%] -right-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-100/40 rounded-full blur-3xl"></div>
                    <div className="absolute top-[40%] -left-[15%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-blue-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-violet-100/20 rounded-full blur-3xl"></div>
                </div>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}>
                </div>

                {/* Simple header */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                    <Link href="/" className="inline-flex items-center space-x-2 group">
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
                </div>

                {/* Main content */}
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 sm:py-12">
                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100/60 shadow-sm">
                                <LogIn className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                            </div>
                            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="mt-1 text-sm sm:text-base text-slate-500">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* Card */}
                        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/50 sm:shadow-2xl">
                            <div className="p-6 sm:p-8">
                                {status && (
                                    <div className="mb-4 rounded-xl bg-emerald-50/80 backdrop-blur-sm p-3 text-sm font-medium text-emerald-800 border border-emerald-100/50">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                                    {/* Username */}
                                    <div>
                                        <InputLabel htmlFor="username" value="Username" className="text-sm font-medium text-slate-700" />
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                            </div>
                                            <TextInput
                                                id="username"
                                                type="text"
                                                name="username"
                                                value={data.username}
                                                className="block w-full rounded-xl border-slate-200 pl-9 sm:pl-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
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
                                        <div className="flex items-center justify-between">
                                            <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-slate-700" />
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline transition-colors"
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="block w-full rounded-xl border-slate-200 pl-9 sm:pl-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                        <InputError message={errors.password} className="mt-1.5" />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 focus:ring-offset-0"
                                            />
                                            <span className="ml-2 text-sm text-slate-600">Remember me</span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <PrimaryButton
                                        className="group w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 py-3 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

                                {/* Footer */}
                                <div className="mt-6 text-center text-sm text-slate-500">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:underline"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Version Info */}
                        <div className="mt-6 text-center text-xs text-slate-400">
                            QR Attendance System · Secure
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
