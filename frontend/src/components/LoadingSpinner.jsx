import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  const loadingStages = [
    { text: "Initializing", progress: 0 },
    { text: "Loading resources", progress: 25 },
    { text: "Establishing connection", progress: 50 },
    { text: "Syncing data", progress: 75 },
    { text: "Almost ready", progress: 90 },
    { text: "Complete", progress: 100 }
  ];

  useEffect(() => {
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < loadingStages.length) {
        setLoadingText(loadingStages[currentStage].text);
        setProgress(loadingStages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main loading container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer glow ring */}
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl bg-zinc-700/20 rounded-full" />
          
          {/* Multiple rotating rings */}
          <div className="relative w-32 h-32">
            {/* Outer ring */}
            <svg className="w-32 h-32 absolute inset-0" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(63, 63, 70, 0.3)"
                strokeWidth="1"
              />
            </svg>
            
            {/* Animated ring 1 */}
            <motion.svg 
              className="w-32 h-32 absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="70 213"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#71717a" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Animated ring 2 */}
            <motion.svg 
              className="w-32 h-32 absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="50 188"
              />
              <defs>
                <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a1a1aa" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#52525b" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-8 h-8 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Pulsing dots */}
            {[0, 120, 240].map((rotation, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0'
                }}
                animate={{
                  x: [0, 60 * Math.cos((rotation * Math.PI) / 180)],
                  y: [0, 60 * Math.sin((rotation * Math.PI) / 180)],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading text */}
        <motion.div 
          className="text-center mb-8"
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-light text-white tracking-wide mb-1">
            {loadingText}
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-light">
            Please wait
          </p>
        </motion.div>

        {/* Progress bar container */}
        <div className="w-80 max-w-md">
          {/* Progress bar background */}
          <div className="relative h-1 bg-zinc-800/50 border border-zinc-800 overflow-hidden">
            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Progress fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-zinc-400 via-white to-zinc-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Glow effect on progress bar */}
              <div className="absolute inset-0 bg-white/20 blur-sm" />
            </motion.div>
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-zinc-600 font-light tracking-wide">
              Loading
            </span>
            <motion.span 
              className="text-xs text-zinc-400 font-light tabular-nums"
              key={progress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {progress}%
            </motion.span>
          </div>
        </div>

        {/* Subtle hint text */}
        <motion.p 
          className="text-xs text-zinc-700 font-light mt-12 tracking-wide"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Preparing your experience
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
