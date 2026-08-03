"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Target, BarChart3, Globe, ChevronRight, Check, Monitor, Smartphone, Landmark, CreditCard, QrCode } from "lucide-react"

const USD_TO_NIO = 37

const desktopFeatures = [
  { customIcon: "/recursos.svg", text: "Actividades gamificadas (Lecturas, Cuestionarios, Roleplays)" },
  { customIcon: "/students.svg", text: "Gestión de estudiantes con avatares personalizables" },
  { customIcon: "/palabras-dificiles.svg", text: "Bóveda de palabras difíciles con pronunciación" },
  { customIcon: "/progress.png", text: "Seguimiento de progreso con gráficos y auditoría" },
  { customIcon: "/offline.png", text: "Modo offline — funciona sin internet" },
  { customIcon: "/blue-knight.png", text: "Personajes y temas personalizables" },
]

const portalFeatures = [
  { customIcon: "/recursos.svg", text: "Recursos compartidos con enlaces externos" },
  { customIcon: "/agenda.svg", text: "Calendario de agenda para la clase" },
  { customIcon: "/students.svg", text: "Perfiles de estudiantes con campos personalizados" },
  { customIcon: "/palabras-dificiles.svg", text: "Palabras difíciles por estudiante" },
  { customIcon: "/progress.png", text: "Portal de estudiantes con gráficos de progreso" },
  { icon: Monitor, text: "Modo oscuro y diseño responsive" },
]

const plans = [
  {
    name: "Starter",
    usd: 10,
    highlight: false,
    badge: null,
    desktop: true,
    portal: false,
    teachers: "1 profesor",
    students: "Estudiantes ilimitados",
  },
  {
    name: "Teacher",
    usd: 15,
    highlight: true,
    badge: "Más popular",
    desktop: true,
    portal: true,
    teachers: "1 profesor",
    students: "Estudiantes ilimitados",
    tagline: "Menos que una mensualidad de un estudiante",
  },
  {
    name: "Associate",
    usd: 25,
    highlight: false,
    badge: null,
    desktop: true,
    portal: true,
    teachers: "2 profesores",
    students: "Estudiantes ilimitados",
  },
  {
    name: "College",
    usd: 50,
    highlight: false,
    badge: null,
    desktop: true,
    portal: true,
    teachers: "5 profesores",
    students: "Estudiantes ilimitados",
  },
]

const paymentMethods = [
  { icon: Landmark, label: "Banco local Nicaragua" },
  { icon: CreditCard, label: "PayPal" },
  { icon: QrCode, label: "Kash" },
]

const valueProps = [
  {
    customIcon: "/questionarie_icon.png",
    title: "Ahorra tiempo",
    desc: "Automatiza el seguimiento del progreso de cada estudiante. Olvídate de hojas de cálculo y trabajo manual.",
  },
  {
    customIcon: "/students.svg",
    title: "Personaliza el aprendizaje",
    desc: "Cada estudiante recibe atención personalizada con palabras difíciles, actividades adaptadas y retroalimentación inmediata.",
  },
  {
    customIcon: "/progress.png",
    title: "Mide el progreso",
    desc: "Gráficos detallados por sesión, rachas de actividad y estadísticas acumulativas para tomar decisiones informadas.",
  },
]

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="aspect-video flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-sm text-zinc-400 dark:from-indigo-950 dark:to-indigo-900 dark:text-zinc-500">
      📸 {label}
    </div>
  )
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<"C$" | "$">("C$")
  const formatPrice = (usd: number) => {
    if (currency === "C$") return `C$${usd * USD_TO_NIO}`
    return `$${usd}`
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-950/30" />
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-lg animate-pop-in dark:bg-indigo-950">
            <Image src="/character.svg" alt="ClassroomHub" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            ClassroomHub
          </h1>
          <p className="mx-auto mt-3 max-w-xl animate-fade-in-up text-base text-zinc-500 dark:text-zinc-400 sm:text-lg" style={{ animationDelay: "50ms" }}>
            Aprendizaje gamificado que mide el progreso y le ahorra horas de trabajo al profesor.
          </p>
          <div className="mt-8 flex animate-fade-in-up flex-col items-center gap-3 sm:flex-row sm:justify-center" style={{ animationDelay: "100ms" }}>
            <a
              href="#planes"
              className="btn-primary inline-flex items-center gap-2 text-base"
            >
              Ver planes
              <ChevronRight className="h-4 w-4" />
            </a>
            <Link
              href="/login"
              className="btn-secondary inline-flex items-center gap-2 text-base"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {valueProps.map((p, i) => (
            <div
              key={p.title}
              className="card card-hover animate-fade-in-up p-6 text-center"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950">
                <Image src={p.customIcon} alt="" width={40} height={40} className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{p.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Desktop App Showcase ── */}
      <section className="bg-white py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="animate-fade-in-up text-center text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            Aplicación de Escritorio
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500 dark:text-zinc-400">
            La herramienta principal del profesor. Crea actividades, gestiona estudiantes y realiza seguimiento en tiempo real.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              {desktopFeatures.map((f, i) => (
                <div
                  key={f.text}
                  className="animate-fade-in-up flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
                    <Image src={f.customIcon} alt="" width={40} height={40} className="h-10 w-10" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{f.text}</span>
                </div>
              ))}
            </div>
            <Image src="/ss-desktop.png" alt="Desktop App screenshot" width={640} height={360} className="w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* ── Web Portal Showcase ── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="animate-fade-in-up text-center text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            Portal Web
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500 dark:text-zinc-400">
            El complemento ligero de gestión. Accede desde cualquier navegador para tareas administrativas rápidas.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Image src="/ss-portal.png" alt="Web Portal screenshot" width={640} height={360} className="w-full rounded-xl" />
            <div className="space-y-3">
              {portalFeatures.map((f, i) => (
                <div
                  key={f.text}
                  className="animate-fade-in-up flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
                    {"customIcon" in f ? (
                      <Image src={f.customIcon as string} alt="" width={40} height={40} className="h-10 w-10" />
                    ) : (
                      <f.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How They Work Together ── */}
      <section className="bg-white py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="animate-fade-in-up text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            ¿Cómo funcionan juntos?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-500 dark:text-zinc-400">
            El ecosistema completo para la gestión y seguimiento de tus clases.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-8">
            <div className="animate-fade-in-up rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800" style={{ animationDelay: "50ms" }}>
              <Monitor className="mx-auto h-8 w-8 text-indigo-500" />
              <h3 className="mt-2 text-base font-bold text-zinc-800 dark:text-zinc-100">Escritorio</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Crea y ejecuta actividades en clase. El progreso se registra localmente y se sincroniza automáticamente con la nube.
              </p>
            </div>
            <div className="animate-fade-in-up rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800" style={{ animationDelay: "100ms" }}>
              <Globe className="mx-auto h-8 w-8 text-indigo-500" />
              <h3 className="mt-2 text-base font-bold text-zinc-800 dark:text-zinc-100">Portal</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Gestiona recursos, agenda y perfiles desde cualquier navegador. Los estudiantes consultan su progreso en línea.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-md animate-fade-in-up rounded-xl bg-indigo-50 px-5 py-4 text-sm text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" style={{ animationDelay: "150ms" }}>
            <strong>Datos compartidos:</strong> Los progresos, palabras difíciles y estadísticas se sincronizan entre ambos, manteniendo una experiencia unificada.
          </div>
        </div>
      </section>

      {/* ── Pricing Plans ── */}
      <section id="planes" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="animate-fade-in-up text-center text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            Planes
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-zinc-500 dark:text-zinc-400">
            Elige el plan que mejor se adapte a tus necesidades. Todos incluyen estudiantes ilimitados.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`animate-fade-in-up card relative flex flex-col p-6 transition-all duration-200 hover:-translate-y-1 ${
                  plan.highlight
                    ? "border-indigo-400 shadow-lg shadow-indigo-600/10 ring-2 ring-indigo-400 dark:border-indigo-600 dark:ring-indigo-600"
                    : ""
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{plan.name}</h3>
                  <p className="mt-1">
                    <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{formatPrice(plan.usd)}</span>
                    <span className="text-sm text-zinc-400">/mes</span>
                  </p>
                  {plan.tagline && (
                    <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">{plan.tagline}</p>
                  )}
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.desktop ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"}`}>
                      <Check className={`h-3 w-3 ${plan.desktop ? "" : "opacity-0"}`} />
                    </div>
                    <span className="text-zinc-600 dark:text-zinc-300">App de escritorio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.portal ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"}`}>
                      <Check className={`h-3 w-3 ${plan.portal ? "" : "opacity-0"}`} />
                    </div>
                    <span className="text-zinc-600 dark:text-zinc-300">Portal web</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-zinc-600 dark:text-zinc-300">{plan.teachers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-zinc-600 dark:text-zinc-300">{plan.students}</span>
                  </div>
                </div>

                <button
                  className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                    plan.highlight
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  Elegir {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex animate-fade-in-up items-center justify-center gap-3" style={{ animationDelay: "300ms" }}>
            <span className={`text-sm font-semibold ${currency === "C$" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`}>C$</span>
            <button
              onClick={() => setCurrency(currency === "C$" ? "$" : "C$")}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${currency === "C$" ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-600"}`}
              aria-label="Cambiar moneda"
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${currency === "$" ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-semibold ${currency === "$" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`}>$</span>
          </div>

          <div className="mt-4 flex animate-fade-in-up items-center justify-center gap-6" style={{ animationDelay: "350ms" }}>
            {paymentMethods.map((m) => (
              <div key={m.label} className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500" title={m.label}>
                <m.icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <span className="hidden sm:inline">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/character.svg" alt="ClassroomHub" width={28} height={28} className="h-7 w-7" />
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">ClassroomHub</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Volver al login
          </Link>
        </div>
      </footer>
    </div>
  )
}