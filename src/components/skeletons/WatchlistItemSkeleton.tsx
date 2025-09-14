import { Skeleton } from "./Skeleton";

export default function WatchlistItemSkeleton() {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg">
      <div>
        <Skeleton className="h-4 w-12 mb-2" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
