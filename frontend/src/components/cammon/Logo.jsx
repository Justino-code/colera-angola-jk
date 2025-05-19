import { motion } from 'framer-motion';

const Logo = ({ loading = false }) => {
  return (
    <motion.svg
      className="w-28 h-28"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.5,
      }}
    >
      {/* Fundo circular */}
      <circle cx="50" cy="50" r="45" fill="#DBEAFE" />

      {/* Cruz médica */}
      <rect x="35" y="25" width="8" height="50" fill="#1E3A8A" rx="2" />
      <rect x="25" y="35" width="50" height="8" fill="#1E3A8A" rx="2" />

      {/* Anel externo (opcional) */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />

      {/* Texto */}
      <text
        x="50"
        y="90"
        fontSize="20"
        textAnchor="middle"
        fontFamily="'Poppins', sans-serif"
        fontWeight="600"
        fill="#1E3A8A"
      >
        AV
      </text>

      {/* Efeito opcional no centro */}
      {loading && (
        <circle cx="50" cy="50" r="5" fill="#3B82F6">
          <animate
            attributeName="r"
            values="5;10;5"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </motion.svg>
  );
};

export default Logo;