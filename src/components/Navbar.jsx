'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/store/themeSlice';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProtectedRoute = (path) => {
    if (!user) {
      alert('Please login to access this page.');
      router.push('/auth');
    } else {
      router.push(path);
    }
  };

  return (
    <nav
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-11/12 max-w-7xl border rounded-3xl px-6 py-3 shadow-md z-50 ${
        isDark ? 'bg-black text-white' : 'bg-cyan-200 text-black'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">Logo</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-medium">
          <Link href="/"><li className="cursor-pointer">Home</li></Link>
          <li className="cursor-pointer" onClick={() => handleProtectedRoute('/template')}>Template Store</li>
          <li className="cursor-pointer" onClick={() => handleProtectedRoute('/url-store')}>Url Store</li>
          <Link href="/community"><li className="cursor-pointer">Community</li></Link>
          <li className="cursor-pointer" onClick={() => handleProtectedRoute('/upload')}>Upload Code</li>
          <Link href="/myprofile"><li className="cursor-pointer">Profile</li></Link>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDark ? '🌙' : '☀️'}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDark ? '🌙' : '☀️'}
          </button>
          {user ? (
            <div className="cursor-pointer" onClick={handleLogout}>
              Logout
            </div>
          ) : (
            <Link href="/auth">
              <div className="cursor-pointer">Login</div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-3 font-medium">
          <Link href="/"><li className="cursor-pointer">Home</li></Link>
          <li className="cursor-pointer" onClick={() => handleProtectedRoute('/template-store')}>Template Store</li>
          <li className="cursor-pointer" onClick={() => handleProtectedRoute('/url-store')}>Url Store</li>
          <Link href="/community"><li className="cursor-pointer">Community</li></Link>
          <li className="cursor-pointer" onClick={() => handleProtectedRoute('/upload')}>Upload Code</li>
          <Link href="/myprofile"><li className="cursor-pointer">Profile</li></Link>
          {user ? (
            <li className="cursor-pointer" onClick={handleLogout}>Logout</li>
          ) : (
            <Link href="/auth"><li className="cursor-pointer">Login</li></Link>
          )}
        </ul>
      )}
    </nav>
  );
};

export default DarkModeToggle;
