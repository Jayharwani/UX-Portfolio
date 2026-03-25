// Screen 2 — Enable SmartDrive Mode
export function WireframeScreen2() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-between p-6">
      {/* Header */}
      <div className="w-full text-center pt-8 mb-12">
        <div className="h-6 bg-gray-800 w-56 mx-auto mb-3 flex items-center justify-center">
          <span className="text-white text-xs">Enable SmartDrive Mode</span>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-16 h-8 border-2 border-gray-600 rounded-full relative">
            <div className="w-6 h-6 bg-gray-600 rounded-full absolute right-1 top-0.5" />
          </div>
          <span className="text-gray-600 text-xs">ON</span>
        </div>

        {/* Description */}
        <div className="w-full max-w-xs space-y-2 mb-8">
          <div className="h-2 bg-gray-400 w-full" />
          <div className="h-2 bg-gray-400 w-4/5 mx-auto" />
          <div className="h-2 bg-gray-400 w-3/4 mx-auto" />
        </div>

        {/* Learn More */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-500 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">i</span>
          </div>
          <div className="h-3 bg-gray-500 w-20" />
        </div>
      </div>

      {/* Button */}
      <div className="w-full pb-8">
        <div className="h-12 bg-gray-800 w-full max-w-xs mx-auto flex items-center justify-center">
          <span className="text-white text-sm">Continue</span>
        </div>
      </div>
    </div>
  );
}
