"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS = [
  { value: "most-recent", label: "Most Recent" },
  { value: "highest-salary", label: "Highest Salary" },
  { value: "lowest-salary", label: "Lowest Salary" },
  { value: "most-applicants", label: "Most Applicants" },
]

export function SortSelect() {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value)

  // TODO: push this into the ?sort= search param so the server refetches (functionality on you)
  const handleSortChange = (value: string) => {
    setSortBy(value)
    console.log("Sorting jobs by:", value)
  }

  return (
    <Select value={sortBy} onValueChange={(value) => handleSortChange(String(value))}>
      <SelectTrigger className="h-9 w-37.5 rounded-lg text-sm">
        <SelectValue>
          {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
