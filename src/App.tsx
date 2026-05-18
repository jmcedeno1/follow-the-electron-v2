import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scenes } from './data/scenes';
import { Scene3D } from './Scene3D';

function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const nextScene = useCallback(() => {
    setCurrentSceneIndex((prev) => Math.min(prev + 1, scenes.length - 1));
  }, []);

  const prevScene = useCallback(() => {
    setCurrentSceneIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextScene();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prevScene();
    };

    let wheelTimeout: any;
    const handleWheel = (e: WheelEvent) => {
      if (wheelTimeout) return;
      if (e.deltaY > 50) {
        nextScene();
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 1000);
      } else if (e.deltaY < -50) {
        prevScene();
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [nextScene, prevScene]);

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="relative bg-[#0A1128] text-white selection:bg-[#39FF14]/30 h-screen w-screen overflow-hidden">
      
      {/* 3D WebGL Background Scene */}
      <Scene3D currentSceneIndex={currentSceneIndex} />
      
      {/* Cinematic Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/20 to-[#0A1128]/80 pointer-events-none mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-10" />

      {/* HUD Elements */}
      <div className="absolute top-8 left-12 z-20 pointer-events-none flex items-center space-x-4">
        <div className="w-12 h-12 border-2 border-[#39FF14]/50 rounded-full flex items-center justify-center border-glow">
          <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_#39FF14]" />
        </div>
        <div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-[#39FF14]/80">EMRC SHOWROOM</div>
          <div className="text-sm tracking-widest font-semibold">FOLLOW THE ELECTRON</div>
        </div>
      </div>

      <div className="absolute top-8 right-12 z-20 pointer-events-none text-right">
        <div className="text-[10px] font-mono tracking-[0.3em] text-white/50 mb-1">SYSTEM STATUS</div>
        <div className="flex items-center space-x-2 justify-end">
          <div className="text-xs font-mono tracking-widest text-[#39FF14] neon-glow">ONLINE</div>
          <div className="w-1 h-4 bg-[#39FF14] shadow-[0_0_10px_#39FF14]" />
        </div>
      </div>

      {/* Scene Content */}
      <AnimatePresence mode="wait">
        <SceneOverlay key={currentScene.id} scene={currentScene} />
      </AnimatePresence>

      {/* Electron Progress */}
      <DiscreteProgress currentIndex={currentSceneIndex} total={scenes.length} />
      
      {/* Showroom Watermark */}
      <div className="absolute bottom-8 right-12 z-20 pointer-events-none">
        <div className="text-[10px] font-mono tracking-[0.4em] text-white/30">V2.0 // KEMPOWER INTEGRATION</div>
      </div>
    </div>
  );
}

function SceneOverlay({ scene }: { scene: typeof scenes[0] }) {
  const [showExpert, setShowExpert] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-20 left-12 md:left-24 max-w-lg z-30"
    >
      <div className="glass-panel p-8 relative overflow-hidden group">
        {/* Accent Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8601C] to-[#39FF14] opacity-80" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs font-mono tracking-[0.3em] text-[#E8601C] mb-3 flex items-center space-x-3"
        >
          <span>{scene.chapter}</span>
          <span className="w-8 h-[1px] bg-[#E8601C]/50" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl font-bold text-white mb-6 tracking-tight font-sans leading-tight"
        >
          {scene.title}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base text-white/90 leading-relaxed mb-8 font-light min-h-[80px]"
        >
          {showExpert ? scene.expert : scene.simple}
        </motion.p>

        {/* Interactive Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button 
            onClick={() => setShowExpert(!showExpert)}
            className="flex items-center space-x-3 text-xs font-mono tracking-widest hover:text-[#39FF14] transition-colors group/btn"
          >
            <span className={`w-2 h-2 rounded-full ${showExpert ? 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]' : 'bg-white/30'} transition-all`} />
            <span className={showExpert ? 'text-[#39FF14]' : 'text-white/50'}>
              {showExpert ? 'EXPERT MODE ACTIVE' : 'ENABLE EXPERT MODE'}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DiscreteProgress({ currentIndex, total }: { currentIndex: number; total: number }) {
  const width = `${((currentIndex + 1) / total) * 100}%`;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#0A1128] z-40">
      <motion.div 
        className="h-full bg-gradient-to-r from-[#E8601C] via-[#39FF14] to-[#39FF14] relative transition-all duration-700 ease-in-out" 
        style={{ width }} 
      >
        {/* Glowing Head of the Electron Flow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#39FF14,0_0_30px_#39FF14]" />
      </motion.div>
    </div>
  );
}

export default App;
