import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, MessageCircle, Building, User } from 'lucide-react';

export default function ForgotPassword() {
    const messengerLink = 'https://m.me/100064538958287';

    return (
        <>
            <Head title="Reset Password" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Decorative background elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[30%] -right-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute top-[40%] -left-[15%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-100/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-violet-100/20 rounded-full blur-3xl"></div>
                </div>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}>
                </div>

                {/* Header with favicon logo */}
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
                                Forgot Credentials?
                            </h2>
                            <p className="mt-0.5 text-sm sm:text-base text-slate-500">
                                We’re here to help you recover your account
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/50 sm:shadow-2xl">
                            <div className="p-5 sm:p-8 space-y-4">
                                {/* Short explanation */}
                                <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 border border-blue-200">
                                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        If you’ve forgotten your username or password, please contact us using one of the options below.
                                    </p>
                                </div>

                                {/* Option 1: Visit HR Office */}
                                <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                                    <Building className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Visit the HR Office</p>
                                        <p className="text-sm text-slate-600">Bring a valid ID for identity verification.</p>
                                    </div>
                                </div>

                                {/* Option 2: Contact via Facebook Messenger */}
                                <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                                    <User className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800">Message us on Facebook</p>
                                        <p className="text-sm text-slate-600">Reach out to the official HRMO Opol page for quick assistance.</p>
                                        <a
                                            href={messengerLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center justify-center w-full rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d65d9] transition-colors"
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Send a Message on Messenger
                                        </a>
                                    </div>
                                </div>

                                {/* Back to Login */}
                                <div className="text-center text-sm text-slate-500 pt-2">
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
