"use client"

import { Check, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type JobPost,
} from "@/lib/types"
import { cn } from "@/lib/utils"

type FiltersSidebarProps = {
  /** Jobs currently shown — used to derive the count badge next to each option. */
  jobs: JobPost[]
}

export function FiltersSidebar({ jobs }: FiltersSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [remoteOnly, setRemoteOnly] = useState(false)

  const activeCount =
    (selectedType ? 1 : 0) + (selectedCategory ? 1 : 0) + (remoteOnly ? 1 : 0)

  // Only one job type can be active — clicking it again clears the selection.
  // TODO: push this filter into the search params so the server refetches (functionality on you)
  const handleSelectType = (type: string) =>
    setSelectedType((previous) => (previous === type ? null : type))

  // Only one category can be active — clicking it again clears the selection.
  const handleSelectCategory = (category: string) =>
    setSelectedCategory((previous) => (previous === category ? null : category))

  const handleToggleRemote = () => setRemoteOnly((previous) => !previous)

  const handleClearAll = () => {
    setSelectedType(null)
    setSelectedCategory(null)
    setRemoteOnly(false)
  }

  return (
    <div className="relative">
      {/* Mobile toggle — the panel itself is hidden below `lg` until opened */}
      <button
        type="button"
        onClick={() => setMobileOpen((previous) => !previous)}
        className="flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-brand px-1.5 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <aside
        className={cn(
          "rounded-2xl border border-border bg-card p-5 lg:static lg:shadow-none",
          mobileOpen
            ? "absolute top-full right-0 left-0 z-30 mt-2 block max-h-[70vh] overflow-y-auto shadow-2xl"
            : "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Job Type — single select */}
        <section className="mt-5">
          <h3 className="text-sm font-semibold">Job Type</h3>
          <div
            role="radiogroup"
            aria-label="Job type"
            className="mt-2.5 space-y-1"
          >
            {JOB_TYPES.map((type) => (
              <FilterRadio
                key={type}
                name="job-type"
                label={type}
                count={jobs.filter((job) => job.jobType === type).length}
                checked={selectedType === type}
                onSelect={() => handleSelectType(type)}
              />
            ))}
          </div>
        </section>

        {/* Category — single select */}
        <section className="mt-5 border-t border-border/60 pt-4">
          <h3 className="text-sm font-semibold">Category</h3>
          <div
            role="radiogroup"
            aria-label="Category"
            className="mt-2.5 space-y-1"
          >
            {JOB_CATEGORIES.map((category) => (
              <FilterRadio
                key={category}
                name="category"
                label={category}
                count={jobs.filter((job) => job.category === category).length}
                checked={selectedCategory === category}
                onSelect={() => handleSelectCategory(category)}
              />
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="mt-5 border-t border-border/60 pt-4">
          <h3 className="text-sm font-semibold">Location</h3>
          <div className="mt-2.5">
            <FilterCheckbox
              label="Remote"
              checked={remoteOnly}
               count={jobs.filter((job) => job.isRemote).length}
              onToggle={handleToggleRemote}
            />
          </div>
        </section>
      </aside>
    </div>
  )
}

/** Square checkbox row with an optional count badge (used for boolean options). */
function FilterCheckbox({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string
  count?: number
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      className="group flex w-full items-center gap-2.5 rounded-lg py-1.5 text-sm"
    >
      <span
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
          checked
            ? "border-brand bg-brand"
            : "border-border group-hover:border-muted-foreground"
        )}
      >
        {checked && <Check className="size-3 stroke-3 text-white" />}
      </span>
      <span className={cn(checked ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      {typeof count === "number" && (
        <span className="ms-auto text-xs text-muted-foreground">{count}</span>
      )}
    </button>
  )
}

/** Circle dot row for single-select (radio-style) filter options. */
function FilterRadio({
  name,
  label,
  count,
  checked,
  onSelect,
}: {
  name: string
  label: string
  count?: number
  checked: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      name={name}
      aria-checked={checked}
      className="group flex w-full items-center gap-2.5 rounded-lg py-1.5 text-sm"
    >
      <span
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded-full border transition-colors",
          checked
            ? "border-brand"
            : "border-border group-hover:border-muted-foreground"
        )}
      >
        {checked && <span className="size-2 rounded-full bg-brand" />}
      </span>
      <span className={cn(checked ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      {typeof count === "number" && (
        <span className="ms-auto text-xs text-muted-foreground">{count}</span>
      )}
    </button>
  )
}
