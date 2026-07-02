"use client"

import { useState, useMemo } from "react"

export function useSearchFilter<T extends { title?: string | null; name?: string | null }>(items: T[]) {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filtered = useMemo(() => {
    if (!searchTerm) return items
    return items.filter((item) => {
      const text = (item.title ?? item.name ?? "").toLowerCase()
      return text.includes(searchTerm)
    })
  }, [items, searchTerm])

  const resetSearch = () => {
    setQuery("")
    setSearchTerm("")
  }

  return {
    query,
    setQuery,
    searchTerm,
    handleSearch,
    handleKeyDown,
    filtered,
    resetSearch,
  }
}
