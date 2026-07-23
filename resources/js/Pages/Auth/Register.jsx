import { Head, Link } from '@inertiajs/react';
import { Shield, Lock, ArrowLeft, QrCode } from 'lucide-react';

export default function Register() {
    return (
        <>
            <Head title="Access Restricted" />

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
                                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                            </div>
                            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Access Restricted
                            </h2>
                            <p className="mt-1 text-sm sm:text-base text-slate-500">
                                Public registration is not available
                            </p>
                        </div>

                        {/* Card */}
                        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/50 sm:shadow-2xl">
                            <div className="p-6 sm:p-8">
                                <div className="space-y-4 text-slate-600">
                                    <p className="text-sm sm:text-base">
                                        This system does <strong>not</strong> support public account registration.
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        Employee accounts are created and managed exclusively by the
                                        <strong> Human Resources (HR)</strong> department.
                                    </p>
                                    <div className="rounded-xl bg-indigo-50/80 backdrop-blur-sm p-4 border border-indigo-100/50">
                                        <div className="flex items-start gap-3">
                                            <Lock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-indigo-900">Need access?</p>
                                                <p className="text-sm text-indigo-800">
                                                    Contact your HR administrator to obtain your login credentials.
                                                    Once your account is created, you will receive a username and
                                                    temporary password.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        You will be required to change your password upon your first login.
                                    </p>
                                </div>

                                {/* Back to Login Button */}
                                <div className="mt-6 sm:mt-8">
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                        Back to Login
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
