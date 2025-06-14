// src/components/LogoSpinner.js
const LogoSpinner = () => {
  return (
    <svg
      className="animate-spin absolute inset-0 w-full h-full"
      style={{ transform: 'rotate(-90deg)' }}
      viewBox="0 0 100 100"
    >
      {/* Fundo do círculo (track) */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="251.2" // ≈ 2πr
        strokeDashoffset="0"
        className="text-gray-200 dark:text-gray-700"
      />

      {/* Círculo animado */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeDasharray="251.2"
        strokeLinecap="round"
        className="origin-center"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="251.2;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Definição do gradiente dinâmico */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />   {/* blue-500 */}
          <stop offset="100%" stopColor="#06B6D4" /> {/* cyan-400 */}
        </linearGradient>
      </defs>

      {/* Ponto pulsante no início do círculo */}
      <circle
        cx="90"
        cy="50"
        r="2"
        fill="url(#gradient)"
        className="animate-pulse"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="0 0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default LogoSpinner;