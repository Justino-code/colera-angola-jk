// src/components/LogoLoader.js
import { motion } from 'framer-motion';
import Logo from './Logo';
import LogoSpinner from './LogoSpinner';

const LogoLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative w-36 h-36 mb-8 group">
        {/* Tooltip */}
        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg transition-opacity duration-300 pointer-events-none z-10 after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:transform after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-800">
          EpiTrack - Sistema de Controle Epidemiológico
        </div>

        {/* Loader + Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <LogoSpinner />
          <Logo />
        </motion.div>
      </div>
    </div>
  );
};

export default LogoLoader;
