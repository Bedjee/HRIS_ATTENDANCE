import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Palette, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const themes = [
  { name: 'navy', label: 'Navy', color: 'bg-navy-800' },
  { name: 'crimson', label: 'Crimson', color: 'bg-crimson-800' },
  { name: 'brown', label: 'Brown', color: 'bg-brown-800' },
  { name: 'black', label: 'Black', color: 'bg-black-800' },
  { name: 'yellow', label: 'Yellow', color: 'bg-yellow-800' },
  { name: 'green', label: 'Green', color: 'bg-green-800' },
  { name: 'violet', label: 'Violet', color: 'bg-violet-800' },
];

export default function ThemeSwitcher({ currentTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectTheme = (theme) => {
    router.patch(
      route('profile.theme.update'),
      { theme: theme },
      {
        preserveScroll: true,
        preserveState: true,
        onStart: () => toast.loading('Saving theme...', { id: 'theme-switcher' }),
        onSuccess: () => {
          toast.success('Theme updated!', { id: 'theme-switcher' });
          setIsOpen(false);
          router.reload();
        },
        onError: () => {
          toast.error('Failed to update theme.', { id: 'theme-switcher' });
        },
      }
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
        aria-label="Theme switcher"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500">Choose Theme</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => selectTheme(theme.name)}
                    className={`relative flex flex-col items-center rounded-lg border-2 p-2 transition hover:shadow-md ${
                      currentTheme === theme.name
                        ? 'border-indigo-500 shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full ${theme.color} shadow-sm`} />
                    <span className="mt-1 text-[10px] font-medium text-gray-700">
                      {theme.label}
                    </span>
                    {currentTheme === theme.name && (
                      <div className="absolute -top-1 -right-1 rounded-full bg-indigo-500 p-0.5 text-white">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
