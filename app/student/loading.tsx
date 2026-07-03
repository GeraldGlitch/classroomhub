import Image from "next/image"

export default function StudentLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 shadow-lg shadow-indigo-200/40 dark:bg-indigo-950 dark:shadow-indigo-900/30">
          <Image src="/blue-knight.png" alt="ClassroomHub" width={56} height={56} className="h-14 w-14 animate-bob" />
        </div>
        <p className="animate-fade-in text-sm font-medium text-zinc-400 dark:text-zinc-500">Cargando...</p>
      </div>
    </div>
  )
}
