"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "./button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({ value, onChange, className }) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0); // Muted by default for auto-play
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isYouTube = src?.includes('youtube.com') || src?.includes('youtu.be');

  // Extract YouTube ID
  const getYTId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = isYouTube ? getYTId(src) : null;

  const togglePlay = () => {
    if (isYouTube) {
        setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value / 100;
    if (videoRef.current) videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(prog) ? prog : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 1 : 0);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const setSpeed = (speed) => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  return (
    <motion.div
      className="relative w-full aspect-video mx-auto rounded-xl overflow-hidden bg-black shadow-3xl group/player"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isYouTube ? (
        <div className="absolute inset-0 w-full h-full">
            <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                className="w-full h-full border-0 pointer-events-auto"
                allow="autoplay; encrypted-media; picture-in-picture; accelerometer; clipboard-write; gyroscope"
                allowFullScreen
            />
            {/* Overlay to catch clicks if we want custom UI over it, but iframe usually captures interaction */}
        </div>
      ) : (
        <>
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                src={src}
                onClick={togglePlay}
                autoPlay
                muted={isMuted}
                playsInline
            />

            <AnimatePresence>
                {showControls && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 m-4 bg-black/60 backdrop-blur-md rounded-2xl z-50 transition-all duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                >
                    <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/70 text-[10px] font-bold w-12 text-right">
                        {formatTime(currentTime)}
                    </span>
                    <CustomSlider
                        value={progress}
                        onChange={handleSeek}
                        className="flex-1"
                    />
                    <span className="text-white/70 text-[10px] font-bold w-12 text-left">
                        {formatTime(isFinite(duration) ? duration : 0)}
                    </span>
                    </div>

                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                        onClick={togglePlay}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 h-8 w-8"
                        >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </Button>
                        
                        <div className="flex items-center gap-2 group/vol">
                        <Button
                            onClick={toggleMute}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 h-8 w-8"
                        >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </Button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                            <CustomSlider value={volume * 100} onChange={handleVolumeChange} />
                        </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {[1, 1.5, 2].map((speed) => (
                        <Button
                            key={speed}
                            onClick={() => setSpeed(speed)}
                            variant="ghost"
                            className={cn(
                            "text-[10px] font-bold text-white px-2 h-7 hover:bg-white/10 transition-colors",
                            playbackSpeed === speed && "bg-white/20"
                            )}
                        >
                            {speed}x
                        </Button>
                        ))}
                    </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default VideoPlayer;
