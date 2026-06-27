"use client"

import SpeakButton from "@/components/SpeakButton"

export default function ReadingParagraph({ text }: { text: string }) {
  return (
    <div className="card animate-fade-in-up p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Texto
        </h2>
        <SpeakButton word={text} />
      </div>
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        {text.split("\n").map((paragraph, i) =>
          paragraph.trim() ? (
            <p key={i} className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {paragraph}
            </p>
          ) : (
            <br key={i} />
          ),
        )}
      </div>
    </div>
  )
}
