import React, { useEffect, useState } from 'react';
import { audioManager } from '../utils/audioManager';
import { Volume2, VolumeX, Play, Pause, Sun, Moon, Music, Sparkles } from 'lucide-react';

interface SoundtrackHUDProps {
  theme: 'day' | 'night';
  onThemeToggle: () => void;
}

export const SoundtrackHUD: React.FC<SoundtrackHUDProps> = ({ theme, onThemeToggle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsub = audioManager.subscribe(() => {
      const state = audioManager.getState();
      setIsPlaying(state.isPlaying);
      setVolume(state.volume);
      setSfxEnabled(state.sfxEnabled);
    });
    return unsub;
  }, []);

  const handlePlayToggle = () => {
    audioManager.playClickSound();
    audioManager.togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioManager.setVolume(val);
  };

  const handleSfxToggle = () => {
    audioManager.playClickSound();
    const next = audioManager.toggleSfx();
    setSfxEnabled(next);
  };

  return (
    <div className="fixed bottom-16 left-4 z-40 select-none">
      {isMinimized ? (
        <button
          onClick={() => {
            audioManager.playClickSound();
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 bg-[#18181b]/95 border-2 border-[#58a038] px-3 py-2 text-white font-pixel text-[10px] shadow-2xl hover:bg-[#27272a] transition-colors"
        >
          <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#58a038] animate-bounce' : 'text-slate-400'}`} />
          <span>TERRARIA JUKEBOX</span>
        </button>
      ) : (
        <div className="bg-[#121217]/95 border-2 border-[#58a038] p-3 shadow-2xl backdrop-blur-md w-72 flex flex-col gap-2.5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#58a038] animate-pulse"></span>
              <span className="font-pixel text-[10px] text-white tracking-wider">TERRARIA OST JUKEBOX</span>
            </div>
            <button
              onClick={() => {
                audioManager.playClickSound();
                setIsMinimized(true);
              }}
              className="font-pixel text-[9px] text-slate-400 hover:text-white px-1"
            >
              [MIN]
            </button>
          </div>

          {/* Currently Playing Track */}
          <div className="bg-black/60 p-2 border border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-silkscreen text-[9px] text-slate-400 uppercase">ACTIVE FREQUENCY</span>
              <span className="font-pixel text-[9px] text-[#58a038] flex items-center gap-1.5 mt-0.5">
                {theme === 'day' ? (
                  <>
                    <Sun className="w-3 h-3 text-yellow-400" />
                    <span>OVERWORLD DAY (MP4/MP3)</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>OVERWORLD NIGHT (MP4/MP3)</span>
                  </>
                )}
              </span>
            </div>
            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-5 px-1">
              <span className={`w-1 bg-[#58a038] ${isPlaying ? 'animate-pulse h-4' : 'h-1.5'}`}></span>
              <span className={`w-1 bg-[#58a038] ${isPlaying ? 'animate-bounce h-5' : 'h-2'}`} style={{ animationDelay: '0.15s' }}></span>
              <span className={`w-1 bg-[#58a038] ${isPlaying ? 'animate-pulse h-3' : 'h-1'}`} style={{ animationDelay: '0.3s' }}></span>
              <span className={`w-1 bg-[#58a038] ${isPlaying ? 'animate-bounce h-4.5' : 'h-2.5'}`} style={{ animationDelay: '0.45s' }}></span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayToggle}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 font-pixel text-[9px] uppercase border transition-colors ${
                isPlaying
                  ? 'bg-[#58a038] text-black border-[#86efac] font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY BGM'}</span>
            </button>

            {/* Day / Night Shift Trigger */}
            <button
              onClick={() => {
                audioManager.playClickSound();
                onThemeToggle();
              }}
              title="Toggle Day / Night audio & lighting"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors"
            >
              {theme === 'day' ? <Moon className="w-3.5 h-3.5 text-indigo-300" /> : <Sun className="w-3.5 h-3.5 text-yellow-300" />}
            </button>

            {/* SFX Toggle */}
            <button
              onClick={handleSfxToggle}
              title={`SFX Effects: ${sfxEnabled ? 'ENABLED' : 'MUTED'}`}
              className={`p-1.5 border transition-colors ${
                sfxEnabled
                  ? 'bg-slate-800 text-[#58a038] border-[#58a038]'
                  : 'bg-slate-900 text-slate-500 border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Slider Row */}
          <div className="flex items-center gap-2 pt-1">
            {volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-700 rounded-none accent-[#58a038] cursor-pointer"
            />
            <span className="font-silkscreen text-[9px] text-slate-400 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="font-silkscreen text-[8px] text-slate-500 flex justify-between items-center pt-1 border-t border-slate-800">
            <span>SOUND: SCOTT LLOYD SHELLY</span>
            <span className="text-[#58a038]">AUTHENTIC</span>
          </div>
        </div>
      )}
    </div>
  );
};

