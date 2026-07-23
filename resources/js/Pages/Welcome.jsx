import { Head, Link } from '@inertiajs/react';
import { Users, Calendar, QrCode, CheckCircle, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy-50 via-white to-indigo-50">
                {/* Decorative blurred circles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-navy-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-navy-300/20 rounded-full blur-3xl"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100/50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="p-2 bg-navy-700 rounded-lg">
                                    <QrCode className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-navy-800">QR Attendance</span>
                            </Link>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
                                    >
                                        Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-gray-600 hover:text-navy-800 transition"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-navy-700 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-tight">
                                QR Event Attendance
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-navy-600 to-indigo-600">
                                    Made Simple
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
                                Eliminate manual attendance with our secure QR code system.
                                Perfect for seminars, meetings, and corporate events.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {!auth.user ? (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-700 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                                        >
                                            Get Started
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Log In
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-700 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-100/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">QR Scanner</span>
                                    </div>
                                    <div className="bg-navy-50 rounded-xl p-8 text-center">
                                        <QrCode className="h-24 w-24 text-navy-700 mx-auto mb-4" />
                                        <p className="text-sm text-gray-500">Scan QR code to check in</p>
                                        <div className="mt-4 bg-white rounded-lg shadow-inner p-4">
                                            <div className="border-2 border-dashed border-navy-300 rounded-lg p-4">
                                                <div className="w-full h-32 bg-navy-100 rounded-lg flex items-center justify-center">
                                                    <div className="w-24 h-24 bg-navy-700 rounded-lg flex items-center justify-center">
                                                        <div className="w-16 h-16 border-2 border-white border-dashed rounded"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-navy-200/30 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative z-10 bg-white/50 backdrop-blur-sm py-16 sm:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
                                Everything You Need
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                A complete solution for event attendance management.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: QrCode,
                                    title: 'QR Scanning',
                                    description: 'Instantly scan employee QR codes with your mobile device.',
                                },
                                {
                                    icon: Users,
                                    title: 'Employee Management',
                                    description: 'Import, manage, and organize employees effortlessly.',
                                },
                                {
                                    icon: Calendar,
                                    title: 'Event Tracking',
                                    description: 'Create events and track attendance in real time.',
                                },
                                {
                                    icon: CheckCircle,
                                    title: 'Reports & Analytics',
                                    description: 'Export reports and gain insights from attendance data.',
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100/50 text-center"
                                >
                                    <div className="mx-auto p-3 bg-gradient-to-br from-navy-50 to-indigo-50 rounded-xl w-fit mb-4">
                                        <feature.icon className="h-8 w-8 text-navy-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-navy-900">{feature.title}</h3>
                                    <p className="mt-2 text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="relative z-10 bg-gradient-to-br from-navy-800 to-indigo-800 py-16 sm:py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Ready to streamline your attendance?
                        </h2>
                        <p className="mt-4 text-lg text-navy-100 max-w-2xl mx-auto">
                            Join organizations that have simplified their event attendance
                            with our QR system.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-8 py-3 bg-white text-navy-800 font-medium rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                                    >
                                        Get Started Now
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-8 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
                                    >
                                        Log In
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-8 py-3 bg-white text-navy-800 font-medium rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-100/50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                        <p>
                            QR Attendance System built by SyntraHR
                        </p>
                        <p className="mt-2">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
