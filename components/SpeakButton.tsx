"use client"

import { useState, useEffect, useCallback } from "react"
import { Volume2, VolumeX, Turtle } from "lucide-react"

export default function SpeakButton({
  word,
  rate = 0.85,
  slowRate = 0.5,
}: {
  word: string
  rate?: number
  slowRate?: number
}) {
  const [ready, setReady] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) setReady(true)
    }

    checkVoices()
    window.speechSynthesis.addEventListener("voiceschanged", checkVoices)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", checkVoices)
  }, [])

  const handleSpeak = useCallback(() => {
    const synth = window.speechSynthesis
    if (!synth) return

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "en-US"
    utterance.rate = slow ? slowRate : rate

    const voices = synth.getVoices()
    const enVoice =
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en"))
    if (enVoice) utterance.voice = enVoice

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e.error, "| voices:", voices.length)
      setSpeaking(false)
    }

    synth.speak(utterance)
    synth.resume()
  }, [word, slow, rate, slowRate])

  const toggleSlow = useCallback(() => {
    setSpeaking(false)
    setSlow((s) => !s)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
    return null
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleSpeak}
        aria-label={`Pronunciar ${word}`}
        className="press-bouncy rounded-lg p-2 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
      >
        {speaking ? (
          <Volume2 className="h-5 w-5 animate-pulse text-indigo-600 dark:text-indigo-400" />
        ) : !ready ? (
          <VolumeX className="h-5 w-5 opacity-50" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button>
      {ready && (
        <button
          onClick={toggleSlow}
          aria-label={`Reproducir a velocidad ${slow ? "normal" : "lenta"}`}
          aria-pressed={slow}
          title={`Velocidad ${slow ? "normal" : "0.5x"}`}
          className={`press-bouncy inline-flex items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-bold transition-colors active:scale-90 ${
            slow
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
              : "text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
          }`}
        >
          <Turtle className="h-4 w-4" />
          0.5x
        </button>
      )}
    </div>
  )
}