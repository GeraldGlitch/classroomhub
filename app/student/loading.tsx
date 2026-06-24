export default function StudentLoading() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="h-8 w-48 animate-shimmer rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4">
            <div className="h-5 w-3/4 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-3 h-4 w-1/2 animate-shimmer rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
