export function PostSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse mb-4">
      <div className="flex gap-3 mb-3">
        <div className="w-9 h-9 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-3.5 skeleton rounded mb-2 w-1/3" />
          <div className="h-2.5 skeleton rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 skeleton rounded" />
        <div className="h-3 skeleton rounded w-5/6" />
        <div className="h-3 skeleton rounded w-4/6" />
      </div>
    </div>
  );
}
