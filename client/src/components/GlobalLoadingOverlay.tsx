import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TIMEOUT_MS = 5000;

export function GlobalLoadingOverlay() {
  const { isLoading, setIsLoading } = useApp();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowError(true);
        setIsLoading(false);
      }, TIMEOUT_MS);
    } else {
      setShowError(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, setIsLoading]);

  const handleDismiss = () => {
    setShowError(false);
  };

  if (!isLoading && !showError) return null;

  return (
    <>
      {isLoading && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]"
          data-testid="global-loading-overlay"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-foreground" data-testid="loading-spinner" />
          </div>
        </div>
      )}

      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Loading Error
            </DialogTitle>
            <DialogDescription>
              The content took too long to load. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDismiss} data-testid="button-dismiss-error">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
