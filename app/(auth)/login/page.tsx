import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="animate-fade-in-up text-2xl font-bold text-indigo-600 dark:text-indigo-400">ClassroomHub</h1>
          <p className="mt-1 animate-fade-in text-sm text-zinc-500 dark:text-zinc-400">Portal de gestión</p>
        </div>
        <div className="animate-fade-in-up">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
