"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useActionState } from "react"
import { createEvent } from "./actions"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/Toast"

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
  const titleInputRef = useRef<HTMLInputElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createEvent(formData),
    undefined,
  )

  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) {
        show(state.error, "error")
      } else {
        show("Evento creado", "success")
        closeModal()
      }
    }
    wasPending.current = pending
  }, [pending, state, show])

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const closeModal = useCallback(() => {
    setShowForm(false)
    lastTriggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!showForm) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", onKey)
    titleInputRef.current?.focus()
    return () => document.removeEventListener("keydown", onKey)
  }, [showForm, closeModal])

  function handleDayClick(day: number, e: React.MouseEvent<HTMLButtonElement>) {
    lastTriggerRef.current = e.currentTarget
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
          aria-label="Mes anterior"
          className="flex items-center justify-center rounded-xl p-2 text-zinc-600 transition-all duration-150 hover:bg-zinc-100 active:scale-90 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span key={`${currentYear}-${currentMonth}`} className="animate-fade-in text-base font-bold text-zinc-700 dark:text-zinc-300">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          aria-label="Mes siguiente"
          className="flex items-center justify-center rounded-xl p-2 text-zinc-600 transition-all duration-150 hover:bg-zinc-100 active:scale-90 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {dayNames.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div key={`${currentYear}-${currentMonth}`} className="mt-1 grid animate-fade-in grid-cols-7 gap-1">
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
              onClick={(e) => handleDayClick(day, e)}
              className={`relative rounded-xl p-2 text-sm font-medium transition-all duration-150 hover:bg-indigo-50 hover:scale-105 active:scale-95 dark:hover:bg-indigo-950 ${
                isToday
                  ? "bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <span>{day}</span>
              {dayEvents.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm dark:bg-indigo-500">
                  {dayEvents.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Crear nuevo evento"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm animate-pop-in overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                Nuevo evento — {selectedDate}
              </h3>
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="press-bouncy rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={action} className="space-y-4">
              <input type="hidden" name="event_date" value={selectedDate} />

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Título</label>
                <input
                  ref={titleInputRef}
                  name="title"
                  required
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="input-field mt-1"
                />
              </div>

              {state?.error && <p className="text-sm text-red-500 animate-fade-in">{state.error}</p>}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all duration-150 hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
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
