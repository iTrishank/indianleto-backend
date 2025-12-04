import { CONTAINER_MAX_WIDTH } from "@/lib/constants";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div 
      className={`w-full mx-auto px-4 md:px-6 lg:px-8 ${className}`}
      style={{ maxWidth: CONTAINER_MAX_WIDTH }}
    >
      {children}
    </div>
  );
}
