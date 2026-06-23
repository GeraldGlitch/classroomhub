import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">ClassroomHub</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Portal de gestión</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
