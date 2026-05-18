import { useState } from 'react';
import type { Scene } from '../data/scenes';

export function AnnotationCard({ scene }: { scene: Scene }) {
  const [showExpert, setShowExpert] = useState(false);

  return (
    <div className="max-w-md bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <div className="text-xs tracking-[0.2em] text-white/50 mb-2">
        {scene.chapter}
      </div>
      <h2 className="text-2xl font-semibold text-white mb-3">
        {scene.title}
      </h2>
      <p className="text-sm text-white/80 leading-relaxed mb-3">
        {showExpert ? scene.expert : scene.simple}
      </p>
      <button
        onClick={() => setShowExpert(!showExpert)}
        className="text-xs text-white/50 hover:text-white/80 transition"
      >
        {showExpert ? 'Hide expert' : 'Show expert'}
      </button>
    </div>
  );
}
