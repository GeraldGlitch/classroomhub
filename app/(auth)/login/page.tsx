import LoginForm from "@/components/LoginForm"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 animate-fade-in text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-lg shadow-indigo-200/50 animate-pop-in dark:bg-indigo-950 dark:shadow-indigo-900/30">
            <Image src="/character.svg" alt="ClassroomHub" width={40} height={40} className="h-10 w-10" />
          </div>
          <h1 className="animate-fade-in-up text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">ClassroomHub</h1>
          <p className="mt-1 animate-fade-in text-sm text-zinc-500 dark:text-zinc-400">Portal de gestión</p>
        </div>
        <div className="animate-fade-in-up">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
