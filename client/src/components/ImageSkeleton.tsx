interface ImageSkeletonProps {
  className?: string;
}

export function ImageSkeleton({ className = "" }: ImageSkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-muted ${className}`}
      data-testid="image-skeleton"
    />
  );
}
