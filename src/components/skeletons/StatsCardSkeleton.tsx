import GlassPanel from "../GlassPanel";
import { Skeleton } from "./Skeleton";

export default function StatsCardSkeleton() {
  return (
    <GlassPanel>
      <Skeleton className="h-10 w-40 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </GlassPanel>
  );
}
