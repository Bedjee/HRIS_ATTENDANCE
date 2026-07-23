import { useState } from 'react';
import { router } from '@inertiajs/react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ className = '', children = null }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    router.post(route('logout'), {}, {
      onFinish: () => {
        setLoading(false);
        setShowModal(false);
      },
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ Prevent dropdown from closing
          setShowModal(true);
        }}
        className={className}
        aria-label="Logout"
      >
        {children || <LogOut className="h-5 w-5" />}
      </button>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => !loading && setShowModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText={loading ? 'Logging out...' : 'Logout'}
        cancelText="Cancel"
        type="danger"
        loading={loading}
      />
    </>
  );
}
