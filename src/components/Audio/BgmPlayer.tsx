import React, { useState, useEffect, useRef } from 'react';
import { SUNO_BGM_PLAYLIST, BgmTrack, fetchLiveSunoTracks } from '../../core/bgm';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ListMusic,
  ExternalLink,
  X,
  Sparkles,
  Repeat,
  Shuffle,
  RefreshCw,
  Search,
} from 'lucide-react';

export const BgmPlayer: React.FC = () => {
  const [playlist, setPlaylist] = useState<BgmTrack[]>(SUNO_BGM_PLAYLIST);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('guandan_bgm_volume');
    return saved !== null ? parseFloat(saved) : 0.35;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('guandan_bgm_muted');
    return saved === 'true';
  });
  const [isLoopAll, setIsLoopAll] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack: BgmTrack = playlist[currentTrackIndex] || playlist[0] || SUNO_BGM_PLAYLIST[0];

  // Auto-fetch live tracks on mount
  useEffect(() => {
    handleSyncLiveTracks();
  }, []);

  const handleSyncLiveTracks = async () => {
    setIsSyncing(true);
    try {
      const live = await fetchLiveSunoTracks();
      if (live && live.length > 0) {
        setPlaylist(live);
      }
    } catch (err) {
      console.warn('Sync live suno error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!audioRef.current && currentTrack) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.loop = false;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('guandan_bgm_volume', volume.toString());
    localStorage.setItem('guandan_bgm_muted', isMuted.toString());
  }, [volume, isMuted]);

  // Handle track change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = isMuted ? 0 : volume;
      if (wasPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }
  }, [currentTrackIndex, playlist]);

  // Audio track ended listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isShuffle) {
        const nextIndex = Math.floor(Math.random() * playlist.length);
        setCurrentTrackIndex(nextIndex);
      } else if (isLoopAll) {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [isLoopAll, isShuffle, playlist]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'guandan_anthem', label: '掼蛋出征' },
    { id: 'classical_epic', label: '国风史诗' },
    { id: 'ambient_folk', label: '民谣旅途' },
    { id: 'worship_lyric', label: '诗意抒情' },
  ];

  const filteredPlaylist = playlist.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tags && t.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="relative flex items-center">
      {/* Compact Navbar Pill */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-xl px-1.5 sm:px-2 py-0.5 shadow-sm transition-all text-xs">
        {/* Equalizer / Animated Sound Icon */}
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 p-0.5"
          title="背景音乐播放列表 (Suno 专属原创)"
        >
          {isPlaying ? (
            <div className="flex items-end space-x-0.5 h-3.5 w-3.5">
              <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2"></span>
              <span className="w-0.5 bg-rose-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3.5"></span>
              <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5"></span>
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Current Song Title */}
        <div
          onClick={() => setShowDrawer(!showDrawer)}
          className="cursor-pointer max-w-[80px] sm:max-w-[120px] lg:max-w-[150px] truncate text-[11px] font-bold text-slate-200 hover:text-amber-300 select-none"
          title={currentTrack?.title}
        >
          {currentTrack?.title || 'Suno 音乐电台'}
        </div>

        {/* Mini Play / Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? (
            <Pause className="w-2.5 h-2.5 fill-current" />
          ) : (
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Mini Next Button */}
        <button
          onClick={handleNext}
          className="hidden sm:inline-block text-slate-400 hover:text-white p-0.5 transition-transform active:scale-90"
          title="下一首"
        >
          <SkipForward className="w-3 h-3" />
        </button>

        {/* Playlist Toggle */}
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className={`p-0.5 transition-colors ${
            showDrawer ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="打开音乐电台面板"
        >
          <ListMusic className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expandable Audio Control Drawer / Modal */}
      {showDrawer && (
        <div className="absolute right-0 top-11 z-50 w-72 sm:w-88 bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-2xl p-3.5 space-y-3 animate-fade-in text-slate-100 text-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="text-xs font-black text-white">Suno 掼蛋专属背景音乐 ({playlist.length} 首)</h4>
                <p className="text-[10px] text-slate-400">Michael Living AI 原创国风与战歌全集</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleSyncLiveTracks}
                className="p-1 text-slate-400 hover:text-amber-400 transition-transform active:scale-90"
                title="动态同步 Suno 最新发布曲目"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Playing Track Info */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                {currentTrack?.categoryLabel || '国风'}
              </span>
              <span className="text-[10px] text-slate-500">
                {isPlaying ? '正在播放 🎵' : '已暂停'}
              </span>
            </div>
            <div className="text-xs font-black text-amber-300 leading-snug">
              {currentTrack?.title}
            </div>
            {currentTrack?.tags && (
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {currentTrack.tags}
              </p>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1 rounded text-xs transition-colors ${
                  isShuffle ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="随机播放"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handlePrev}
                className="text-slate-300 hover:text-white p-1 transition-transform active:scale-90"
                title="上一首"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="text-slate-300 hover:text-white p-1 transition-transform active:scale-90"
                title="下一首"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLoopAll(!isLoopAll)}
                className={`p-1 rounded text-xs transition-colors ${
                  isLoopAll ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="循环列表"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Volume Slider & Mute Toggle */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white p-0.5"
                title={isMuted ? '取消静音' : '静音'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono w-7 text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Search Bar in Drawer */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 145 首曲目（如：满江红、加州、向山、如梦令）..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-0.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Playlist Scroll Area */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>曲目列表 ({filteredPlaylist.length} 首)</span>
              <span className="text-[9px] text-amber-400/80">点击即播</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredPlaylist.map((track, idx) => {
                const isSelected = playlist[currentTrackIndex]?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      const realIndex = playlist.findIndex((t) => t.id === track.id);
                      if (realIndex !== -1) {
                        setCurrentTrackIndex(realIndex);
                        setIsPlaying(true);
                      }
                    }}
                    className={`p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-[10px] font-mono text-slate-500 w-5 text-right shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs truncate">{track.title}</span>
                    </div>

                    {isSelected && isPlaying && (
                      <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black shrink-0">
                        播放中
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Artist Link to Suno Profile */}
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>创作者：Michael Living AI</span>
            <a
              href="https://suno.com/@michaellivingai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-0.5 font-bold"
            >
              <span>Suno 音乐主页</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
