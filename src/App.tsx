import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans scanlines">
      <div className="noise"></div>
      
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start justify-center mt-8">
        
        {/* Left/Center: Game */}
        <div className="flex-shrink-0 flex flex-col items-center w-full lg:w-auto">
          <SnakeGame />
        </div>

        {/* Right: Music Player */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          <MusicPlayer />
          
          <div className="border-2 border-cyan-500/40 p-4 bg-black/50">
            <h3 className="text-fuchsia-500 text-xl font-sans uppercase tracking-widest mb-2 border-b-2 border-fuchsia-500/40 pb-1 glitch" data-text="SYS.INFO">
              SYS.INFO
            </h3>
            <ul className="space-y-2 text-lg font-sans text-gray-400">
              <li className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-cyan-400 animate-pulse">ONLINE</span>
              </li>
              <li className="flex justify-between">
                <span>AUDIO:</span>
                <span className="text-fuchsia-400">AI.GEN</span>
              </li>
              <li className="flex justify-between">
                <span>SECTOR:</span>
                <span className="text-white">GRID-04</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
