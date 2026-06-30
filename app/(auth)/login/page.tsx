import LoginForm from "@/components/LoginForm"
import Image from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 pb-24 sm:pb-28">
      <div className="w-full max-w-sm">
        <div className="mb-8 animate-fade-in text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-lg shadow-indigo-200/50 animate-pop-in dark:bg-indigo-950 dark:shadow-indigo-900/30">
            <Image src="/character.svg" alt="ClassroomHub" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <h1 className="animate-fade-in-up text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">ClassroomHub</h1>
          <p className="mt-1 animate-fade-in text-sm text-zinc-500 dark:text-zinc-400">Portal de gestión</p>
        </div>
        <div className="animate-fade-in-up">
          <LoginForm />
        </div>
      </div>

      <Link
        href="/pricing"
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in-up press-bouncy flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-600/40 active:scale-95 sm:bottom-6"
        style={{ animationDelay: "0.3s" }}
      >
        <Sparkles className="h-4 w-4" />
        ¿Eres profesor o escuela? Ver planes
      </Link>
    </div>
  )
}
