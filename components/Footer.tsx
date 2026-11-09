import Image from "next/image"
import Link from "next/link"

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/browse-jobs" },
      { label: "Worker AI", href: "#" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "#" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "#" },
      { label: "Career library", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "#" },
      { label: "Newsroom", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-[#000] border-t border-white/[0.08] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column (Left) */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block outline-none">
              <Image
                src="/logo.png"
                alt="HireLoop"
                width={794}
                height={224}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              The AI-native career platform. Built for people who take their work
              seriously.
            </p>
          </div>

          {/* Navigation Links Columns (Right) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-[#6366f1]">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/[0.08] pt-8 sm:flex-row">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <Link
              href="#"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-[#16161c] text-white transition-colors hover:border-white/40 hover:bg-[#202028]"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>

            {/* Pinterest */}
            <Link
              href="#"
              aria-label="Pinterest"
              className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-[#16161c] text-white transition-colors hover:border-white/40 hover:bg-[#202028]"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.38.03-3.41.14-.95.94-3.99.94-3.99s-.24-.48-.24-1.2c0-1.12.65-1.96 1.46-1.96.69 0 1.02.52 1.02 1.14 0 .69-.44 1.73-.67 2.69-.19.8.4 1.46 1.19 1.46 1.43 0 2.53-1.51 2.53-3.69 0-1.93-1.39-3.28-3.37-3.28-2.3 0-3.64 1.72-3.64 3.5 0 .69.27 1.44.6 1.84.07.08.08.15.06.24-.06.26-.2.82-.23.94-.04.15-.13.18-.3.11-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.52 2.21 5.52 5.17 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.03l-.56 2.13c-.2.78-.75 1.75-1.12 2.34A12 12 0 1 0 12 0z" />
              </svg>
            </Link>

            {/* LinkedIn */}
            <Link
              href="#"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-[#16161c] text-white transition-colors hover:border-white/40 hover:bg-[#202028]"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-col items-center gap-2 text-xs text-white/40 sm:flex-row sm:gap-6">
            <p>Copyright 2024 &ndash;Programming Hero</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="transition-colors hover:text-white/70">
                Terms & Policy
              </Link>
              <span>-</span>
              <Link href="#" className="transition-colors hover:text-white/70">
                Privacy Guideline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
