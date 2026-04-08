import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold";
}

const variants = {
  default: "bg-gray-100 text-gray-600 border-gray-200",
  success: "bg-green-50 text-green-600 border-green-200",
  warning: "bg-yellow-50 text-yellow-600 border-yellow-200",
  danger: "bg-red-50 text-red-600 border-red-200",
  info: "bg-blue-50 text-blue-600 border-blue-200",
  gold: "bg-gold/10 text-gold border-gold/30",
};

export function Badge({ className, children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
