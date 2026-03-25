// Screen 6 — Summary & Mode Active
export function WireframeScreen6() {
  return (
    <div className="w-full h-full bg-white flex flex-col p-6">
      {/* Header */}
      <div className="w-full text-center pt-8 mb-10">
        <div className="h-6 bg-gray-800 w-52 mx-auto flex items-center justify-center">
          <span className="text-white text-xs">SmartDrive Mode Active</span>
        </div>
      </div>

      {/* Status Card */}
      <div className="border-2 border-gray-600 p-5 mb-8">
        <div className="h-4 bg-gray-700 w-40 mb-3 mx-auto flex items-center justify-center">
          <span className="text-white text-xs">Moderate Mode Applied</span>
        </div>
        <div className="h-2 bg-gray-400 w-48 mx-auto" />
      </div>

      {/* Mini Chart */}
      <div className="mb-8">
        <div className="h-3 bg-gray-600 w-40 mb-4" />
        <div className="border-2 border-gray-500 p-4">
          <div className="flex items-end justify-between gap-1 h-20">
            <div className="flex-1 bg-gray-400 h-10" />
            <div className="flex-1 bg-gray-400 h-14" />
            <div className="flex-1 bg-gray-400 h-8" />
            <div className="flex-1 bg-gray-400 h-16" />
            <div className="flex-1 bg-gray-400 h-12" />
            <div className="flex-1 bg-gray-400 h-18" />
            <div className="flex-1 bg-gray-400 h-10" />
          </div>
          <div className="text-center mt-2">
            <div className="h-2 bg-gray-400 w-32 mx-auto" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 mt-auto pb-8">
        <div className="h-12 bg-gray-800 w-full max-w-xs mx-auto flex items-center justify-center">
          <span className="text-white text-sm">View Dashboard</span>
        </div>
        <div className="h-12 border-2 border-gray-600 w-full max-w-xs mx-auto flex items-center justify-center">
          <span className="text-gray-700 text-sm">Start Analysis Again</span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center pb-4">
        <div className="h-2 bg-gray-400 w-48 mx-auto" />
      </div>
    </div>
  );
}
