"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

// TODO: derive TOTAL_PAGES and the current page from the API response (functionality on you)
const TOTAL_PAGES = 7

/** Static demo layout matching the design: 1 2 3 … 7. */
const PAGE_ITEMS: (number | "ellipsis")[] = [1, 2, 3, "ellipsis", TOTAL_PAGES]

export function Pagination() {
  const [page, setPage] = useState(1)

  // TODO: push this into the ?page= search param so the server refetches (functionality on you)
  const handlePageChange = (next: number) => {
    setPage(next)
    console.log("Going to page:", next)
  }

  const pageButtonClass = (isActive: boolean) =>
    cn(
      "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm transition-colors",
      isActive
        ? "border-transparent bg-white font-semibold text-black"
        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
    )

  return (
    <nav
      aria-label="Jobs pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={pageButtonClass(false)}
      >
        <ChevronLeft className="size-4" />
      </button>

      {PAGE_ITEMS.map((item) =>
        item === "ellipsis" ? (
          <span key="ellipsis" className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => handlePageChange(item)}
            className={pageButtonClass(item === page)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === TOTAL_PAGES}
        className={pageButtonClass(false)}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
