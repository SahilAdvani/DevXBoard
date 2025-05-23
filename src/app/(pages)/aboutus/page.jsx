'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaEnvelope // for mail icon
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';

const AboutClient = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);

  const containerClasses = isDark
    ? 'bg-slate-900 text-white'
    : 'bg-white text-gray-900';

  const sectionClasses = 'max-w-6xl mx-auto py-16 px-6';

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
    <Navbar/>
    <motion.div
      className={`${containerClasses} min-h-screen pt-20`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Hero Section */}
      <section className={`${sectionClasses} text-center`}>
        <h1 className="text-4xl font-bold mb-4">
          Empowering Developers, One Line of Code at a Time
        </h1>
        <p className="text-lg max-w-xl mx-auto">
          DevXBoard is your ultimate community platform to organize, share, and discover essential code templates, dev tools, and much more.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* Our Mission */}
      <section className={`${sectionClasses}`}>
        <motion.blockquote
          className={`border-l-4 pl-6 italic font-semibold text-lg mb-6 ${
            isDark ? 'border-cyan-400' : 'border-cyan-600'
          }`}
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Our mission is to democratize access to reusable code, accelerate development workflows, and foster a vibrant ecosystem of developer collaboration.
        </motion.blockquote>
        <p className="max-w-3xl leading-relaxed">
          At DevXBoard, we believe every developer deserves a seamless way to store, share, and build upon community-driven resources. By empowering developers with advanced tools and GPT-powered automation, we make coding faster, smarter, and more enjoyable.
        </p>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* What We Offer */}
      <section className={`${sectionClasses}`}>
        <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: '🔁', title: 'Template Sharing', desc: 'Upload and share reusable code templates, publicly or privately.' },
            { icon: '🧠', title: 'GPT-Powered Metadata', desc: 'Auto-generate titles, tags, and summaries to enhance discoverability.' },
            { icon: '🧰', title: 'Dev Tool Repository', desc: 'Organize and share essential developer tools and resources.' },
            { icon: '🔒', title: 'Private/Public Upload Control', desc: 'Control access to your uploads with privacy settings.' },
            { icon: '🧑‍🤝‍🧑', title: 'Community Contributions', desc: 'Collaborate, learn, and grow with a thriving developer community.' },
          ].map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              className={`p-6 rounded-lg shadow-md ${
                isDark ? 'bg-slate-800' : 'bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* Our Values */}
      <section className={`${sectionClasses} text-center`}>
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🌍', text: 'Open Source Spirit' },
            { icon: '👩‍💻', text: 'Developer First' },
            { icon: '🔐', text: 'Privacy & Ownership' },
            { icon: '📚', text: 'Learning by Sharing' },
          ].map(({ icon, text }) => (
            <motion.div
              key={text}
              className={`p-6 rounded-lg shadow-md ${
                isDark ? 'bg-slate-800' : 'bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-5xl mb-3">{icon}</div>
              <p className="font-semibold">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* Call to Action */}
      <section className={`${sectionClasses} text-center`}>
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Contribute your templates or dev tool links and become part of a growing community that’s shaping the future of software development.
        </p>
        <button
          onClick={() => (window.location.href = '/auth')}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Start Contributing
        </button>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* Social Media Links */}
      <section className={`${sectionClasses} text-center`}>
        <h3 className="text-xl font-semibold mb-4">Connect with us</h3>
        <div className="flex justify-center gap-8 text-cyan-500">
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-cyan-700"
          >
            <FaGithub size={32} />
          </a>
          <a
            href="https://linkedin.com/in/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-cyan-700"
          >
            <FaLinkedin size={32} />
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-cyan-700"
          >
            <FaTwitter size={32} />
          </a>
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-cyan-700"
          >
            <FaInstagram size={32} />
          </a>
          <a
            href="mailto:support@devxboard.com"
            aria-label="Email"
            className="hover:text-cyan-700"
          >
            <FaEnvelope size={32} />
          </a>
        </div>
      </section>
    </motion.div>
    </>
  );
};

export default AboutClient;
