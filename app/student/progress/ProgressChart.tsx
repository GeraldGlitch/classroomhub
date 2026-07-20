"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Activity, CalendarDays, Flame, TrendingUp } from "lucide-react"
import XPBar from "@/components/ui/XPBar"
import LevelBadge from "@/components/ui/LevelBadge"
import StatChip from "@/components/ui/StatChip"

interface ProgressRecord {
  id: string
  activity_type: string
  activity_title: string
  date: string
  timestamp: string
  metrics: Record<string, unknown> | null
  source: string | null
}

const TYPE_META: Record<string, { color: string; bar: string; bg: string; text: string; label: string }> = {
  questionnaire: { color: "indigo", bar: "bg-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-600 dark:text-indigo-400", label: "Cuestionarios" },
  reading: { color: "emerald", bar: "bg-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400", label: "Lecturas" },
  roleplay: { color: "amber", bar: "bg-amber-500", bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400", label: "Roleplays" },
  words: { color: "rose", bar: "bg-rose-500", bg: "bg-rose-100 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-400", label: "Palabras" },
  vocabulary: { color: "violet", bar: "bg-violet-500", bg: "bg-violet-100 dark:bg-violet-950", text: "text-violet-600 dark:text-violet-400", label: "Vocabulario" },
}

function getTypeMeta(type: string) {
  const key = type?.toLowerCase() ?? ""
  for (const [match, meta] of Object.entries(TYPE_META)) {
    if (key.includes(match) || match.includes(key)) return meta
  }
  return { color: "blue", bar: "bg-blue-500", bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400", label: type || "Actividad" }
}

function extractSuccessRate(metrics: Record<string, unknown> | null): number | null {
  if (!metrics) return null
  const m = metrics as Record<string, number | string>
  if (typeof m.accuracy === "number") return m.accuracy * 100
  if (typeof m.correct === "number" && typeof m.total === "number" && m.total > 0) return (m.correct / m.total) * 100
  return null
}

function extractMetric(metrics: Record<string, unknown> | null): string | null {
  if (!metrics) return null
  const m = metrics as Record<string, number | string>
  if (typeof m.score === "number") return `${m.score} pts`
  if (typeof m.xp === "number") return `${m.xp} XP`
  if (typeof m.accuracy === "number") return `${Math.round(m.accuracy * 100)}%`
  if (typeof m.correct === "number" && typeof m.total === "number") return `${m.correct}/${m.total}`
  if (typeof m.points === "number") return `${m.points} pts`
  return null
}

function formatDate(ts: string): string {
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return d.toLocaleDateString("es", { day: "numeric", month: "short" })
}

function dayKey(ts: string): string {
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export default function ProgressChart({ records }: { records: ProgressRecord[] }) {
  const stats = useMemo(() => {
    const total = records.length
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisWeek = records.filter((r) => new Date(r.timestamp) >= weekAgo).length

    const byType: Record<string, { totalRate: number; count: number }> = {}
    for (const r of records) {
      const key = r.activity_type || "other"
      if (!byType[key]) byType[key] = { totalRate: 0, count: 0 }
      byType[key].count++
      const rate = extractSuccessRate(r.metrics)
      if (rate !== null) {
        byType[key].totalRate += rate
      }
    }
    const typeEntries = Object.entries(byType)
      .map(([type, { totalRate, count }]) => ({ type, avgRate: count > 0 ? totalRate / count : 0, meta: getTypeMeta(type) }))
      .sort((a, b) => b.avgRate - a.avgRate)

    const byDay: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      byDay[d.toISOString().slice(0, 10)] = 0
    }
    for (const r of records) {
      const key = dayKey(r.timestamp)
      if (key in byDay) byDay[key]++
    }
    const dayEntries = Object.entries(byDay).map(([day, count]) => ({ day, count }))
    const maxDay = Math.max(...dayEntries.map((d) => d.count), 1)

    let streak = 0
    const sortedDays = [...dayEntries].sort((a, b) => b.day.localeCompare(a.day))
    for (const { count } of sortedDays) {
      if (count > 0) streak++
      else break
    }

    // XP derivado en cliente desde métricas existentes (sin cambios en DB)
    const xp = records.reduce((sum, r) => {
      const m = r.metrics as Record<string, number> | null
      if (m && typeof m.xp === "number") return sum + m.xp
      if (m && typeof m.score === "number") return sum + m.score
      return sum + 10
    }, 0)
    const level = Math.floor(xp / 100) + 1
    const xpInLevel = xp % 100

    return { total, thisWeek, typeEntries, dayEntries, maxDay, streak, uniqueTypes: typeEntries.length, xp, level, xpInLevel }
  }, [records])

  if (records.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state-icon animate-bob">
          <Image src="/progress.png" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
        </div>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">Aún no hay actividades registradas</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">¡Completa actividades para ver tu progreso aquí!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="panel-hud animate-fade-in-up flex items-center gap-4 p-5">
        <LevelBadge level={stats.level} />
        <div className="flex-1">
          <XPBar value={stats.xpInLevel} max={100} label={`XP · ${stats.xp} total`} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="animate-fade-in-up">
          <StatChip icon={<Activity className="h-5 w-5" />} label="Actividades totales" value={stats.total} accent="mana" />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "50ms" }}>
          <StatChip icon={<CalendarDays className="h-5 w-5" />} label="Esta semana" value={stats.thisWeek} accent="loot" />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <StatChip icon={<Flame className="h-5 w-5" />} label="Racha de días" value={stats.streak} accent="hp" />
        </div>
      </div>

      <div className="card animate-fade-in-up p-6">
        <h3 className="section-title mb-4 text-base">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Últimas 2 semanas
        </h3>
        <div className="flex items-end justify-between gap-1 h-32">
          {stats.dayEntries.map((d, i) => {
            const heightPct = (d.count / stats.maxDay) * 100
            const label = new Date(d.day).toLocaleDateString("es", { weekday: "short" }).slice(0, 1)
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ease-out ${d.count > 0 ? "bg-gradient-to-t from-indigo-500 to-indigo-400" : "bg-zinc-200 dark:bg-zinc-800"}`}
                    style={{ height: `${Math.max(heightPct, d.count > 0 ? 8 : 2)}%`, animationDelay: `${i * 30}ms` }}
                    title={`${d.count} actividades`}
                  />
                </div>
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {stats.typeEntries.length > 0 && (
        <div className="card animate-fade-in-up p-6">
          <h3 className="section-title mb-4 text-base">
            <Activity className="h-5 w-5 text-indigo-500" />
            Tasa de éxito por actividad
          </h3>
          <div className="space-y-3">
            {stats.typeEntries.map((t, i) => {
              const displayRate = Math.round(t.avgRate)
              return (
                <div key={t.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-semibold ${t.meta.text}`}>{t.meta.label}</span>
                    <span className="font-bold text-zinc-600 dark:text-zinc-300">{displayRate}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${t.meta.bar}`}
                      style={{ width: `${displayRate}%`, animationDelay: `${i * 60}ms` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card animate-fade-in-up p-6">
        <h3 className="section-title mb-4 text-base">
          <CalendarDays className="h-5 w-5 text-indigo-500" />
          Actividades recientes
        </h3>
        <div className="space-y-2.5">
          {records.slice(0, 8).map((r, i) => {
            const meta = getTypeMeta(r.activity_type)
            const metric = extractMetric(r.metrics)
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm dark:bg-zinc-800"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.text}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-zinc-800 dark:text-zinc-100">
                    {r.activity_title || meta.label}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDate(r.timestamp)} · {meta.label}
                  </p>
                </div>
                {metric && (
                  <span className={`flex-shrink-0 rounded-full ${meta.bg} ${meta.text} px-2.5 py-0.5 text-xs font-bold`}>
                    {metric}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}