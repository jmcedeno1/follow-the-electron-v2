import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  poster: string;
};

export function VideoStage({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80vh] rounded-lg overflow-hidden bg-black"
      style={{ aspectRatio: '16 / 9' }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center top' }}
      />
    </div>
  );
}
