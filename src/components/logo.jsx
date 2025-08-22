import { cn } from "@/lib/utils";
import { Utensils } from "lucide-react";

export function Logo({ className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Utensils className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold font-headline text-foreground">Food Hub</span>
    </div>
  );
}
