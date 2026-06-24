export default function TeacherLoading() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="h-8 w-64 animate-shimmer rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-1/2 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-8 w-8 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-3 h-4 w-1/4 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4">
            <div className="h-5 w-2/3 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-3 h-4 w-1/2 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
