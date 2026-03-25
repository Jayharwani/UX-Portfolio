// Screen 5 — Drive Analysis Dashboard
export function WireframeScreen5() {
  return (
    <div className="w-full h-full bg-white flex flex-col p-6">
      {/* Header */}
      <div className="w-full text-center pt-6 mb-8">
        <div className="h-6 bg-gray-800 w-48 mx-auto flex items-center justify-center">
          <span className="text-white text-xs">Your Drive Analysis</span>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="mb-6">
        <div className="w-32 h-32 mx-auto relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="12"
            />
            {/* Segments */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4B5563"
              strokeWidth="12"
              strokeDasharray="75 251"
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#6B7280"
              strokeWidth="12"
              strokeDasharray="50 251"
              strokeDashoffset="-75"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-600 text-xs">chart</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <div className="h-2 bg-gray-400 w-40 mx-auto" />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6 px-4">
        <div className="h-2 bg-gray-400 w-32 mb-3" />
        <div className="flex items-end justify-between gap-2 h-24">
          <div className="flex-1 bg-gray-500 h-16" />
          <div className="flex-1 bg-gray-500 h-20" />
          <div className="flex-1 bg-gray-500 h-12" />
          <div className="flex-1 bg-gray-500 h-24" />
          <div className="flex-1 bg-gray-500 h-14" />
        </div>
        <div className="text-center mt-2">
          <div className="h-2 bg-gray-400 w-48 mx-auto" />
        </div>
      </div>

      {/* Text Card */}
      <div className="border-2 border-gray-600 p-4 mb-6">
        <div className="h-3 bg-gray-700 w-48 mb-2" />
        <div className="h-2 bg-gray-400 w-32" />
      </div>

      {/* Button */}
      <div className="mt-auto pb-6">
        <div className="h-12 bg-gray-800 w-full max-w-xs mx-auto flex items-center justify-center">
          <span className="text-white text-sm">Apply Settings</span>
        </div>
      </div>
    </div>
  );
}
