import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ message, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Loader2
        className={`${sizeClasses[size]} text-emerald-400 animate-spin mb-4`}
      />
      {message && (
        <p className={`text-slate-400 ${textSizeClasses[size]}`}>{message}</p>
      )}
    </div>
  );
}
