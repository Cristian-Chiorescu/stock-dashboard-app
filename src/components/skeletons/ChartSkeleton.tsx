import GlassPanel from "../GlassPanel";
import { Skeleton } from "./Skeleton";

export default function ChartSkeleton() {
  return (
    <GlassPanel>
      <div className="flex justify-end gap-2 mb-6">
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-7 w-10" />
      </div>
      <Skeleton className="h-48 sm:h-60 w-full" />
    </GlassPanel>
  );
}
