"use client"

import { useState } from "react"
import { useActionState } from "react"
import { createEvent } from "./actions"
import { X } from "lucide-react"

interface AgendaEvent {
  id: string
  title: string
  description: string | null
  event_date: string
}

export default function AgendaCalendar({ events }: { events: AgendaEvent[] }) {
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear())

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createEvent(formData),
    undefined,
  )

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  function handleDayClick(day: number) {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(date)
    setShowForm(true)
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  function getEventsForDay(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.event_date === dateStr)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="rounded-lg px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
        >
          ◀
        </button>
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="rounded-lg px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {dayNames.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayEvents = getEventsForDay(day)
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === currentMonth &&
            new Date().getFullYear() === currentYear

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative rounded-lg p-2 text-sm transition-colors hover:bg-indigo-50 dark:bg-indigo-950 ${
                isToday ? "bg-indigo-100 dark:bg-indigo-950 font-semibold text-indigo-700" : "text-zinc-700"
              }`}
            >
              <span>{day}</span>
              {dayEvents.length > 0 && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-500" />
              )}
            </button>
          )
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
                Nuevo evento — {selectedDate}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={action} className="space-y-4">
              <input type="hidden" name="event_date" value={selectedDate} />

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Título</label>
                <input
                  name="title"
                  required
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {pending ? "Guardando..." : "Crear evento"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
