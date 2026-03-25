// Screen 1 — Welcome & Setup Introduction
export function WireframeScreen1() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-between p-6">
      {/* Header */}
      <div className="w-full text-center pt-8">
        <div className="h-6 bg-gray-800 w-48 mx-auto mb-3 flex items-center justify-center">
          <span className="text-white text-xs">SmartDrive Mode</span>
        </div>
        <div className="h-3 bg-gray-400 w-64 mx-auto" />
      </div>

      {/* Illustration placeholder */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-48 h-48 rounded-full border-4 border-gray-400 flex items-center justify-center">
          <span className="text-gray-500 text-xs">Illustration</span>
        </div>
      </div>

      {/* Description */}
      <div className="w-full mb-8">
        <div className="h-3 bg-gray-400 w-56 mx-auto mb-2" />
        <div className="h-3 bg-gray-400 w-48 mx-auto" />
      </div>

      {/* Button */}
      <div className="w-full pb-8">
        <div className="h-12 bg-gray-800 w-full max-w-xs mx-auto flex items-center justify-center">
          <span className="text-white text-sm">Start Setup</span>
        </div>
      </div>
    </div>
  );
}
