import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function NewPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Background ornaments */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[30%] -right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute top-[40%] -left-[15%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-100/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-violet-100/20 rounded-full blur-3xl"></div>
                </div>

                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}>
                </div>

                {/* Header */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
                    <Link href="/" className="inline-flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
                                <img
                                    src="/favicon.png"
                                    alt="Logo"
                                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                                />
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
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-3 py-6 sm:py-12">
                    <div className="w-full max-w-sm mx-auto sm:max-w-md">
                        {/* Logo & header */}
                        <div className="text-center mb-5 sm:mb-8">
                            <img
                                src="/favicon.png"
                                alt="Logo"
                                className="mx-auto h-12 w-12 sm:h-16 sm:w-16 object-contain"
                            />
                            <h2 className="mt-3 text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Set New Password
                            </h2>
                            <p className="mt-0.5 text-sm sm:text-base text-slate-500">
                                Enter a new password for your account
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/50 sm:shadow-2xl">
                            <div className="p-5 sm:p-8">
                                <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                                    <div>
                                        <InputLabel htmlFor="password" value="New Password" />
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                className="block w-full rounded-xl border-slate-200 pl-9 sm:pl-12 pr-10 sm:pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                                                autoComplete="new-password"
                                                isFocused={true}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
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

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                                                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                            </div>
                                            <TextInput
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="block w-full rounded-xl border-slate-200 pl-9 sm:pl-12 pr-10 sm:pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                                aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                                ) : (
                                                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-1.5" />
                                    </div>

                                    <PrimaryButton
                                        className="w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 py-3 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] text-sm sm:text-base"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Resetting...
                                            </span>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </PrimaryButton>
                                </form>

                                <div className="mt-6 text-center text-sm text-slate-500">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 text-center text-xs text-slate-400">
                            QR Attendance System · Secure
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
