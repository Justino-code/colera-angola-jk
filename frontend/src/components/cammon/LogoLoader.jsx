import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import LogoSpinner from './LogoSpinner';
import SyncIcon from './SyncIcon';

const LogoLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="relative w-32 h-32 mb-8 group">
        {/* Tooltip */}
        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300 pointer-events-none z-10 after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:transform after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-800">
          EpiTrack - Sistema de Controle Epidemiológico
        </div>

        {/* Loader + Logo com animação refinada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.4,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <LogoSpinner />
          <Logo loading={true} />
        </motion.div>

        {/* Ícone de sincronizado */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 18,
            delay: 2.3,
            duration: 0.4,
          }}
          className="absolute -bottom-3 -right-3 p-1.5 bg-green-500 rounded-full text-white shadow-lg"
        >
          <SyncIcon />
        </motion.div>
      </div>

      {/* Mensagem opcional */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-sm text-gray-500 dark:text-gray-400 font-medium"
      >
        Carregando sistema...
      </motion.p>
    </div>
  );
};

export default LogoLoader;