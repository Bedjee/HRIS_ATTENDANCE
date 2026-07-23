// resources/js/Pages/Employee/QR.jsx
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function QR({ auth, qrCodeData }) {
  const downloadQR = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `qr-${auth.user.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.crossOrigin = 'anonymous';
    img.src = qrCodeData;
  };

  return (
    <EmployeeLayout user={auth.user}>
      <Head title="My QR Code" />



      <div className="py-6">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={route('employee.dashboard')}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-navy-800">My QR Code</h1>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="p-8 text-center">
              <div className="mx-auto max-w-xs">
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
              <p className="mt-4 text-sm text-gray-500">
                This is your permanent QR code. Present it to HR for attendance.
              </p>
              <button
                onClick={downloadQR}
                className="mt-4 inline-flex items-center rounded-lg bg-navy-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download as PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
