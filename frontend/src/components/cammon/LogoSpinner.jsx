const LogoSpinner = () => {
  return (
    <svg
      className="animate-spin absolute inset-0 w-full h-full"
      style={{ transform: 'rotate(-90deg)' }}
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="628"
        strokeDashoffset="0"
        className="text-blue-500 dark:text-blue-400"
      />
    </svg>
  );
};

export default LogoSpinner;