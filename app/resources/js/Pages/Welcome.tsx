import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />

            <AuthenticatedLayout>
                <div className="relative bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center py-24">
                            {/* Left Text Content */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                                    Welcome to Your Laravel + React App
                                </h1>
                                <p className="mt-6 text-lg text-gray-600">
                                    You’re running Laravel {laravelVersion} and PHP {phpVersion}.
                                    Build powerful apps fast with Inertia.js and React.
                                </p>
                                <div className="mt-6">
                                    {auth.user ? (
                                        <Link
                                            href="/dashboard"
                                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-indigo-700"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-indigo-700"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="mt-10 lg:mt-0">
                                <img
                                    id="hero-image"
                                    className="w-full rounded-lg shadow-lg"
                                    src="https://picsum.photos/200"
                                    alt="Hero"
                                    onError={handleImageError}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
