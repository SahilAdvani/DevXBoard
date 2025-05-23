'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/store/themeSlice';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Template Store', onClick: () => handleProtectedRoute('/template') },
    { label: 'URL Store', onClick: () => handleProtectedRoute('/url-store') },
    { label: 'Community', href: '/community' },
    { label: 'Upload Code', onClick: () => handleProtectedRoute('/upload') },
    { label: 'Profile', href: '/myprofile' },
    { label: 'About Us', href: '/aboutus' },
    { label: 'Contact Us', href: '/contactus' },
    { label: 'Privacy Policy', href: '/privacypolicy' }
  ];

  const glassStyle = isDark
    ? 'bg-black/40 backdrop-blur-lg text-white'
    : 'bg-white/70 backdrop-blur-lg text-black';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl px-6 py-4 rounded-full shadow-xl z-50 overflow-visible ${glassStyle}`}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-wide hover:opacity-80 transition">
          DevXBoard
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-[16px] font-medium">
          {navLinks.map((item) =>
            item.href ? (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-cyan-500 transition-all"
                >
                  {item.label}
                </Link>
              </li>
            ) : (
              <li
                key={item.label}
                onClick={item.onClick}
                className="cursor-pointer hover:text-cyan-500 transition-all"
              >
                {item.label}
              </li>
            )
          )}
        </ul>

        {/* Desktop Controls */}
        <div className="hidden md:flex gap-4 items-center">
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded-full transition">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
            className={`fixed top-0 right-0 w-4/5 max-w-sm h-full z-[60] p-6 flex flex-col gap-6 md:hidden ${isDark ? 'bg-white text-black' : 'bg-black/90 text-white'
              } backdrop-blur-2xl shadow-lg`}
          >
            <div className="flex justify-end">
              <button onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <ul className="flex flex-col gap-4 font-semibold text-lg">
              {navLinks.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-cyan-500 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setMenuOpen(false);
                    }}
                    className="cursor-pointer hover:text-cyan-500 transition"
                  >
                    {item.label}
                  </li>
                )
              )}

              <li
                onClick={() => {
                  setMenuOpen(false);
                  user ? handleLogout() : router.push('/auth');
                }}
                className="cursor-pointer hover:text-cyan-500 transition"
              >
                {user ? 'Logout' : 'Login'}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
