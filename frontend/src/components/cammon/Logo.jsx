const Logo = ({ darkMode = false, loading = false }) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill={darkMode ? '#1E40AF' : '#DBEAFE'} />
      <rect x="35" y="25" width="8" height="50" fill={darkMode ? 'white' : '#1E3A8A'} rx="2" />
      <rect x="25" y="35" width="50" height="8" fill={darkMode ? 'white' : '#1E3A8A'} rx="2" />
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke={darkMode ? 'white' : '#1E3A8A'}
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="90"
        fontSize="20"
        textAnchor="middle"
        fontFamily="'Poppins', sans-serif"
        fontWeight="600"
        fill={darkMode ? 'white' : '#1E3A8A'}
      >
        EpiTrack
      </text>
    </svg>
  );
};

export default Logo;