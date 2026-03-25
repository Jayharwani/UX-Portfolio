import Component3 from "../imports/3";

export function AIDrivingThumbnail() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0a0e27] via-[#1a237e] to-[#0d1117] overflow-hidden">
      {/* Vibrant gradient orbs - multiple layers */}
      <div className="absolute -top-20 -left-20 w-[70%] h-[70%] bg-gradient-to-br from-blue-500 to-cyan-400 opacity-30 rounded-full blur-[140px]" />
      <div className="absolute -bottom-10 -right-10 w-[60%] h-[60%] bg-gradient-to-tl from-purple-500 to-pink-400 opacity-25 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 rounded-full blur-[100px]" />

      {/* Enhanced grid pattern with glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Decorative glowing elements */}
      <div className="absolute top-[12%] left-[8%] w-16 h-16 border-2 border-cyan-400/60 rounded-xl rotate-12 shadow-[0_0_30px_rgba(34,211,238,0.3)]" />
      <div className="absolute top-[20%] right-[10%] w-20 h-20 border-2 border-blue-400/50 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.4)]">
        <div className="absolute inset-2 border border-blue-300/30 rounded-full" />
      </div>
      <div className="absolute bottom-[18%] left-[12%] w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg rotate-45 shadow-[0_0_25px_rgba(168,85,247,0.4)]" />
      <div className="absolute top-[45%] left-[5%] w-8 h-8 border-2 border-pink-400/40 rounded-md -rotate-12 shadow-[0_0_20px_rgba(244,114,182,0.3)]" />
      <div className="absolute bottom-[35%] right-[8%] w-10 h-10 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)]" />

      {/* Phone mockup centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Enhanced multi-layer glow effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/40 via-cyan-400/50 to-purple-500/40 rounded-[70px] blur-3xl" />
          <div className="absolute -inset-6 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-[65px] blur-2xl" />
          
          {/* Phone frame with metallic look */}
          <div className="relative bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[50px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-600/80">
            {/* Phone notch with detail */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-950 rounded-b-3xl z-20 border-x border-slate-700/50" />
            
            {/* Screen with glow */}
            <div className="relative bg-black rounded-[42px] overflow-hidden shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
              <div className="w-[390px] h-[844px] relative overflow-hidden">
                <div className="absolute inset-0 scale-[1.05] origin-center">
                  <Component3 />
                </div>
                {/* Screen edge glow */}
                <div className="absolute inset-0 rounded-[42px] shadow-[inset_0_0_40px_rgba(59,130,246,0.15)] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Enhanced side buttons */}
          <div className="absolute right-0 top-[120px] w-1 h-12 bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-sm shadow-lg" />
          <div className="absolute right-0 top-[180px] w-1 h-16 bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-sm shadow-lg" />
          <div className="absolute right-0 top-[250px] w-1 h-16 bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-sm shadow-lg" />
          <div className="absolute left-0 top-[160px] w-1 h-8 bg-gradient-to-b from-slate-600 to-slate-700 rounded-r-sm shadow-lg" />
        </div>

        {/* Enhanced AI Badge with glow */}
        <div className="absolute -top-10 -right-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white px-7 py-2.5 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.6)] border-2 border-cyan-300/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-mono">AI Powered</span>
          </div>
        </div>

        {/* Enhanced feature tags with icons */}
        <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border-2 border-cyan-400/40 px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <p className="text-cyan-300 text-sm font-mono">Smart Learning</p>
          </div>
        </div>

        <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border-2 border-blue-400/40 px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.3)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <p className="text-blue-300 text-sm font-mono">Zero Distraction</p>
          </div>
        </div>
        
        {/* Additional floating UI elements */}
        <div className="absolute -top-16 left-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 px-4 py-2 rounded-xl shadow-lg">
          <p className="text-purple-300 text-xs font-mono">iOS App</p>
        </div>
      </div>

      {/* Enhanced particles with varying sizes and colors */}
      {[...Array(25)].map((_, i) => {
        const colors = ['bg-cyan-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400'];
        const sizes = ['w-1 h-1', 'w-1.5 h-1.5', 'w-2 h-2'];
        return (
          <div
            key={i}
            className={`absolute ${sizes[Math.floor(Math.random() * sizes.length)]} ${colors[Math.floor(Math.random() * colors.length)]}/60 rounded-full shadow-[0_0_10px_currentColor]`}
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
          />
        );
      })}

      {/* Glowing lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
      <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
    </div>
  );
}
