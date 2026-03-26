import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "CYBERNETIC_HORIZON.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "NEON_GRID_RUNNER.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "DIGITAL_AFTERGLOW.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="w-full border-2 border-fuchsia-500/60 bg-black/80 p-4 flex flex-col gap-4 relative overflow-hidden">
      {/* Glitchy background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500/30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-cyan-500/30"></div>
      
      <div className="border-b-2 border-cyan-500/40 pb-2">
        <p className="text-cyan-400 text-lg uppercase tracking-widest font-sans mb-1 glitch" data-text="AUDIO_STREAM">AUDIO_STREAM</p>
        <div className="bg-gray-900 p-2 border border-gray-800">
          <p className="text-xl font-sans text-fuchsia-400 truncate">
            {isPlaying ? "> " : "|| "}{currentTrack.title}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-cyan-500 hover:text-white hover:bg-cyan-500 transition-colors p-1 border border-transparent hover:border-cyan-400"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-fuchsia-500 hover:text-white hover:bg-fuchsia-500 transition-colors p-2 border border-fuchsia-500"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-cyan-500 hover:text-white hover:bg-cyan-500 transition-colors p-1 border border-transparent hover:border-cyan-400"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-1/3">
          <button onClick={toggleMute} className="text-gray-500 hover:text-cyan-400">
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="flex-1 h-1 bg-gray-800 appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleNext}
      />
    </div>
  );
}
