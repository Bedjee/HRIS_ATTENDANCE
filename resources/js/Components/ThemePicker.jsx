import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThemePicker({ currentTheme }) {
    const themes = [
        { name: 'navy', label: 'Navy', color: 'bg-navy-800' },
        { name: 'crimson', label: 'Crimson', color: 'bg-crimson-800' },
        { name: 'brown', label: 'Brown', color: 'bg-brown-800' },
        { name: 'black', label: 'Black', color: 'bg-black-800' },
        { name: 'yellow', label: 'Yellow', color: 'bg-yellow-800' },
        { name: 'green', label: 'Green', color: 'bg-green-800' },
        { name: 'violet', label: 'Violet', color: 'bg-violet-800' },
    ];

    const selectTheme = (theme) => {
        router.patch(
            route('profile.theme.update'),
            { theme: theme },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => {
                    toast.loading('Saving theme...', { id: 'theme-save' });
                },
                onSuccess: () => {
                    toast.success('Theme saved! Reloading...', { id: 'theme-save' });
                    router.reload();
                },
                onError: (errors) => {
                    toast.error('Failed to save theme: ' + (errors?.message || 'Unknown error'), { id: 'theme-save' });
                },
            }
        );
    };

    return (
        <section className="space-y-4">
            <header>
                <h2 className="text-lg font-medium text-gray-900">Theme Preference</h2>
                <p className="mt-1 text-sm text-gray-600">Choose your preferred color theme.</p>
            </header>
            <div className="flex flex-wrap gap-3">
                {themes.map((theme) => (
                    <button
                        key={theme.name}
                        onClick={() => selectTheme(theme.name)}
                        className={`relative flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all hover:shadow-md ${
                            currentTheme === theme.name
                                ? 'border-indigo-500 shadow-md'
                                : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                        <div className={`h-10 w-10 rounded-full ${theme.color} shadow-sm`} />
                        <span className="text-xs font-medium text-gray-700">{theme.label}</span>
                        {currentTheme === theme.name && (
                            <div className="absolute -top-1 -right-1 rounded-full bg-indigo-500 p-0.5 text-white">
                                <Check className="h-3 w-3" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-400">Your theme preference is saved automatically.</p>
        </section>
    );
}
