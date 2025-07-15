import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const Navbar: React.FC = () => {
    // Get authenticated user from Inertia page props
    const { auth } = usePage().props as { auth: { user: null | { name: string } } };
    const user = auth?.user;

    return (
        <div className="fixed top-0 z-50 w-full bg-white shadow-md">
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo / Brand */}
                <div className="flex-1">
                    <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition duration-300">
                        AtlasStore
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    {/* Cart Dropdown (Always Visible) */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="badge badge-sm indicator-item bg-red-500 text-white">8</span>
                            </div>
                        </div>
                        <div className="dropdown-content mt-3 z-[1] card card-compact w-56 bg-white shadow-lg border border-gray-200">
                            <div className="card-body">
                                <span className="font-semibold text-lg text-gray-800">8 items</span>
                                <span className="text-gray-500">Total : 999 DH</span>
                                <div className="card-actions mt-2">
                                    <Link href="/cart" className="btn btn-primary btn-sm w-full">
                                        View Cart
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional User Section */}
                    {user ? (
                        // If logged in, show profile dropdown
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring ring-indigo-500 ring-offset-2 ring-offset-base-100">
                                    <img
                                        alt="User avatar"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>
                            <ul className="dropdown-content mt-3 z-[1] menu menu-sm p-2 shadow bg-white rounded-box w-52 border border-gray-200">
                                <li>
                                    <Link href="/profile" className="justify-between">
                                        Profile
                                        <span className="badge badge-info">New</span>
                                    </Link>
                                </li>
                                <li><Link href="/settings">Settings</Link></li>
                                <li><Link href="/logout" method="post" as="button">Logout</Link></li>
                            </ul>
                        </div>
                    ) : (
                        // If NOT logged in, show Login and Register buttons
                        <>
                            <Link
                                href="/login"
                                className="btn btn-outline btn-sm text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="btn btn-primary btn-sm"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
