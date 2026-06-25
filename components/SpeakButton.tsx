"use client"

import { useState, useEffect, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"

export default function SpeakButton({ word }: { word: string }) {
  const [ready, setReady] = useState(false)
  const [speaking, setSpeaking] = useState(false)

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
    utterance.rate = 0.85

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
  }, [word])

  if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
    return null
  }

  return (
    <button
      onClick={handleSpeak}
      aria-label={`Pronunciar ${word}`}
      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
    >
      {speaking ? (
        <Volume2 className="h-4 w-4 animate-pulse text-indigo-600 dark:text-indigo-400" />
      ) : !ready ? (
        <VolumeX className="h-4 w-4 opacity-50" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </button>
  )
}