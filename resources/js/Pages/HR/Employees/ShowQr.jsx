import HRLayout from '@/Layouts/HRLayout';
import { Head, Link } from '@inertiajs/react';

import { Download, Printer } from 'lucide-react';

export default function ShowQr({ auth, employee, qrCodeData }) {
    const downloadPNG = () => {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const link = document.createElement('a');
        // ✅ Use employee's full name for the filename
        const fileName = `${employee.full_name.replace(/\s+/g, '_')}.png`;
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    img.crossOrigin = 'anonymous';
    img.src = qrCodeData;
};

    return (
        <HRLayout user={auth.user}>
            <Head title={`QR Code - ${employee.full_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-center">
                            <h2 className="text-2xl font-bold text-navy-800">QR Code</h2>
                            <p className="mt-2 text-gray-600">
                                {employee.formatted_name} - {employee.department}
                            </p>
                            <div className="mt-6 flex justify-center">
                                <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
                            </div>
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                                <button
                                    onClick={downloadPNG}
                                    className="inline-flex items-center rounded-md bg-navy-700 px-4 py-2 text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PNG
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print QR
                                </button>
                            </div>
                            <div className="mt-4">
                                <Link href={route('hr.employees.index')}>
                                    <span className="text-sm text-gray-600 hover:text-gray-900">Back to Employees</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HRLayout>
    );
}
