import { cn } from "@/lib/utils";

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

export function Table({ className, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-luxury-border">
      <table className={cn("w-full text-sm", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ className, children }: TableProps) {
  return (
    <thead className={cn("border-b border-luxury-border bg-luxury-gray/50", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children }: TableProps) {
  return <tbody className={cn("divide-y divide-luxury-border", className)}>{children}</tbody>;
}

export function TableRow({ className, children }: TableProps) {
  return (
    <tr className={cn("transition-colors hover:bg-foreground/[0.02]", className)}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <th className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/50", className)}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, colSpan }: { className?: string; children: React.ReactNode; colSpan?: number }) {
  return <td className={cn("px-4 py-3 text-foreground/80", className)} colSpan={colSpan}>{children}</td>;
}
