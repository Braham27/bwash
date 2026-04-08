import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="mb-4 rounded-full bg-luxury-gray p-4 text-foreground/30">
        {icon || <FileQuestion className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground/80">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-foreground/40">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
