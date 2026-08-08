export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <div className="bg-muted aspect-square animate-pulse rounded-2xl" />
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded-full" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded-full" />
        </div>
      ))}
    </div>
  );
}
