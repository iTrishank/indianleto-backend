import { Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function GlobalLoadingOverlay() {
  const { isLoading } = useApp();

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]"
      data-testid="global-loading-overlay"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" data-testid="loading-spinner" />
      </div>
    </div>
  );
}
