// Screen 3 — Behavior Analysis Explanation
export function WireframeScreen3() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-between p-6">
      {/* Header */}
      <div className="w-full text-center pt-8 mb-12">
        <div className="h-6 bg-gray-800 w-56 mx-auto flex items-center justify-center">
          <span className="text-white text-xs">How SmartDrive Mode Works</span>
        </div>
      </div>

      {/* Flow Steps */}
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6">
        {/* Step 1 */}
        <div className="w-full max-w-xs">
          <div className="h-16 border-2 border-gray-600 flex items-center justify-center mb-2">
            <span className="text-gray-700 text-xs">Learn Your Behavior</span>
          </div>
          <div className="h-2 bg-gray-400 w-4/5 mx-auto" />
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-gray-500" />
          <div className="w-3 h-3 border-t-2 border-r-2 border-gray-500 rotate-[135deg] transform -translate-y-1" />
        </div>

        {/* Step 2 */}
        <div className="w-full max-w-xs">
          <div className="h-16 border-2 border-gray-600 flex items-center justify-center mb-2">
            <span className="text-gray-700 text-xs">Classify Notifications</span>
          </div>
          <div className="h-2 bg-gray-400 w-4/5 mx-auto" />
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-gray-500" />
          <div className="w-3 h-3 border-t-2 border-r-2 border-gray-500 rotate-[135deg] transform -translate-y-1" />
        </div>

        {/* Step 3 */}
        <div className="w-full max-w-xs">
          <div className="h-16 border-2 border-gray-600 flex items-center justify-center mb-2">
            <span className="text-gray-700 text-xs">Smart Alerts Only</span>
          </div>
          <div className="h-2 bg-gray-400 w-4/5 mx-auto" />
        </div>
      </div>

      {/* Button */}
      <div className="w-full pb-8 mt-8">
        <div className="h-12 bg-gray-800 w-full max-w-xs mx-auto flex items-center justify-center">
          <span className="text-white text-sm">Start Analysis</span>
        </div>
      </div>
    </div>
  );
}
