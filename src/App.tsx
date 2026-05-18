import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { scenes, TOTAL_DURATION } from './data/scenes';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = latest * TOTAL_DURATION;
    }
  });

  return (
    <div ref={containerRef} className="relative bg-[#0A0A12]" style={{ height: '900vh' }}>
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/master.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        {scenes.map((scene) => (
          <SceneOverlay key={scene.id} scene={scene} scrollYProgress={scrollYProgress} />
        ))}

        <ScrollProgress scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}

function SceneOverlay({ scene, scrollYProgress }: { scene: typeof scenes[0]; scrollYProgress: any }) {
  const start = scene.startTime / TOTAL_DURATION;
  const end = scene.endTime / TOTAL_DURATION;
  const fadeIn = start + 0.005;
  const fadeOut = end - 0.005;

  const opacity = useTransform(
    scrollYProgress,
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, fadeIn, fadeOut, end],
    [20, 0, 0, -20]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-16 left-16 max-w-md z-10"
    >
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <div className="text-xs tracking-[0.2em] text-[#E8601C] mb-2 font-medium">
          {scene.chapter}
        </div>
        <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
          {scene.title}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          {scene.simple}
        </p>
      </div>
    </motion.div>
  );
}

function ScrollProgress({ scrollYProgress }: { scrollYProgress: any }) {
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
      <motion.div className="h-full bg-[#E8601C]" style={{ width }} />
    </div>
  );
}

export default App;
