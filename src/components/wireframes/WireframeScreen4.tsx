// Screen 4 — Analysis In Progress
export function WireframeScreen4() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-between p-6">
      {/* Header */}
      <div className="w-full text-center pt-8 mb-12">
        <div className="h-6 bg-gray-800 w-56 mx-auto flex items-center justify-center">
          <span className="text-white text-xs">Behavior Analysis Active</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="relative mb-8">
          {/* Concentric circles */}
          <div className="w-40 h-40 border-4 border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-28 h-28 border-4 border-gray-500 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-700 text-lg">68%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="w-full max-w-xs space-y-2 text-center">
          <div className="h-3 bg-gray-400 w-4/5 mx-auto" />
          <div className="h-3 bg-gray-400 w-3/4 mx-auto" />
          <div className="h-3 bg-gray-400 w-2/3 mx-auto" />
        </div>
      </div>

      {/* Button (disabled) */}
      <div className="w-full pb-8">
        <div className="h-12 bg-gray-300 w-full max-w-xs mx-auto flex items-center justify-center border-2 border-gray-400">
          <span className="text-gray-500 text-sm">Return Home</span>
        </div>
      </div>
    </div>
  );
}
