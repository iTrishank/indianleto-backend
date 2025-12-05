import { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  "data-testid"?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  className = "", 
  skeletonClassName = "",
  "data-testid": testId 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative ${skeletonClassName}`} ref={imgRef}>
      {!isLoaded && (
        <div 
          className={`absolute inset-0 animate-pulse bg-muted ${skeletonClassName}`}
          data-testid="image-skeleton"
        />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
          data-testid={testId}
        />
      )}
    </div>
  );
}
