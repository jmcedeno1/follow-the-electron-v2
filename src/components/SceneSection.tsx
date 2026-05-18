import type { Scene } from '../data/scenes';
import { AnnotationCard } from './AnnotationCard';
import { VideoStage } from './VideoStage';

export function SceneSection({ scene, index }: { scene: Scene; index: number }) {
  const videoOnRight = index % 2 === 0;

  return (
    <section
      className="h-screen w-full snap-start grid grid-cols-2 gap-12 items-center px-16 bg-[#0A0A12]"
    >
      {videoOnRight ? (
        <>
          <div className="flex justify-end">
            <AnnotationCard scene={scene} />
          </div>
          <VideoStage src={scene.videoSrc} poster={scene.posterSrc} />
        </>
      ) : (
        <>
          <VideoStage src={scene.videoSrc} poster={scene.posterSrc} />
          <div className="flex justify-start">
            <AnnotationCard scene={scene} />
          </div>
        </>
      )}
    </section>
  );
}
