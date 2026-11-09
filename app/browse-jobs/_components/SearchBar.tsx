"use client"

import { Search } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")

  // TODO: push the query into the ?q= search param so the server refetches (functionality on you)
  const handleSearch = () => {
    console.log("Searching jobs for:", query)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        handleSearch()
      }}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by job title, keywords..."
          className="h-11 rounded-lg pl-10"
        />
      </div>
      <Button
        type="submit"
        className="h-11 shrink-0 rounded-lg bg-white text-sm font-semibold text-black hover:bg-white/90"
      >
        Search Jobs
      </Button>
    </form>
  )
}
