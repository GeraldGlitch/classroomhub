"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import DeleteStudentButton from "./DeleteStudentButton"
import CopyCodeButton from "./CopyCodeButton"
import { getAvatarSrc } from "@/lib/avatar"

interface Student {
  id: string
  name: string
  avatar_url: string | null
  access_code: string
}

export default function StudentsList({ students }: { students: Student[] }) {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filtered = !searchTerm
    ? students
    : students.filter((s) => s.name.toLowerCase().includes(searchTerm))

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar estudiantes..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 transition-all duration-150 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        </div>
        <button
          onClick={handleSearch}
          className="press-bouncy rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 active:scale-90 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {searchTerm && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/students.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
            {searchTerm ? "No se encontraron estudiantes" : "No hay estudiantes"}
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "Probá con otro término de búsqueda" : "Añade tu primer estudiante para empezar"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((student, i) => (
            <div
              key={student.id}
              className="card card-hover group animate-fade-in-up flex items-center gap-3 p-4"
              style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            >
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 dark:bg-indigo-950 dark:text-indigo-400 overflow-hidden">
                {student.avatar_url ? (
                  <img src={getAvatarSrc(student.avatar_url)!} alt={student.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-base font-extrabold">{student.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/teacher/students/${student.id}`}
                  className="text-sm font-bold text-zinc-700 hover:text-indigo-600 truncate block dark:text-zinc-300 dark:hover:text-indigo-400"
                >
                  {student.name}
                </Link>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
                    {student.access_code}
                  </span>
                  <CopyCodeButton code={student.access_code} />
                </div>
              </div>
              <DeleteStudentButton id={student.id} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
