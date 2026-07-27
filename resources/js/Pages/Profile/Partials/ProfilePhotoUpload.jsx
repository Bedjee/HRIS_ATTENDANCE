import { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Camera, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePhotoUpload({ employee }) {
    const [preview, setPreview] = useState(employee.profile_photo_url || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const { data, setData, post, processing } = useForm({
        photo: null,
    });

    const handleFileChange = (e, source = 'file') => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setData('photo', file);
        setPreview(URL.createObjectURL(file));
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.photo) return;
        post(route('profile.photo.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile photo updated successfully!');
                router.reload();
            },
            onError: (errors) => {
                toast.error(errors?.message || 'Failed to update profile photo.');
            },
        });
    };

    const clearPhoto = () => {
        setSelectedFile(null);
        setData('photo', null);
        setPreview(employee.profile_photo_url || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Photo</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Upload or take a photo to help HR identify you during attendance.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo preview and upload buttons – responsive */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="relative shrink-0">
                        <img
                            src={preview || '/default-avatar.png'}
                            alt="Profile"
                            className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover sm:h-24 sm:w-24"
                        />
                        {preview && preview !== employee.profile_photo_url && (
                            <button
                                type="button"
                                onClick={clearPhoto}
                                className="absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto">
                        <label
                            htmlFor="photo-upload"
                            className="inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload from Gallery
                            <input
                                ref={fileInputRef}
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'file')}
                                className="hidden"
                            />
                        </label>
                        <label
                            htmlFor="photo-capture"
                            className="inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 sm:w-auto"
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                            <input
                                ref={cameraInputRef}
                                id="photo-capture"
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => handleFileChange(e, 'camera')}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Submit button (only shows when a new photo is selected) */}
                {selectedFile && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
                        >
                            {processing ? 'Uploading...' : 'Save Photo'}
                        </button>
                        <button
                            type="button"
                            onClick={clearPhoto}
                            className="w-full text-sm text-gray-500 hover:text-gray-700 sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}
