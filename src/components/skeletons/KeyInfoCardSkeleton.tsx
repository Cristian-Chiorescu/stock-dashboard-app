import GlassPanel from "../GlassPanel";
import { Skeleton } from "./Skeleton";

export default function KeyInfoCardSkeleton() {
  return (
    <GlassPanel>
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-4 w-10 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="mt-4 flex items-baseline gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </GlassPanel>
  );
}
