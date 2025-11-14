export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-20 h-20 mb-4">
        {/* Outer Gear - Rotating Clockwise */}
        <svg
          className="animate-spin w-20 h-20 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ animationDuration: '2s' }}
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
        </svg>
        {/* Inner Gear - Rotating Counter-clockwise */}
        <svg
          className="absolute top-2 left-2 w-16 h-16 text-indigo-600 animate-spin-reverse"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ animationDuration: '1.5s' }}
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v3M12 15v3M6.5 6.5l2.12 2.12M15.5 15.5l2.12 2.12M3 12h3M15 12h3M6.5 17.5l2.12-2.12M15.5 6.5l2.12-2.12"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm font-medium">{message}</p>
    </div>
  );
}

