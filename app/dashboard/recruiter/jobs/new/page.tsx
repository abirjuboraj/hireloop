"use client"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobForm,
} from "@/lib/types"
import { cn } from "@/lib/utils"

const initialForm: JobForm = {
  title: "",
  companyName: "",
  category: JOB_CATEGORIES[0],
  jobType: "Full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "per hour",
  responsibilities: "",
  qualifications: "",
}

export default function PostJobPage() {
  const [form, setForm] = useState<JobForm>(initialForm)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const setField = <K extends keyof JobForm>(key: K, value: JobForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO: connect to the jobs API
    console.log("Publishing job:", form)
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-foreground"
            >
              Manage Jobs
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">Create New Listing</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Post a New Job
          </h1>
          <p className="text-muted-foreground">
            Fill in the position specifications to attract qualified talent
            across your network.
          </p>
        </div>
      </div>

      <form
        id="post-job-form"
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        {/* 1. Basic Information */}
        <FormSection title="1. Basic Information">
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Job Title <span className="text-brand">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Frontend Developer"
              required
              className="h-10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">
                Company Name <span className="text-brand">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="companyName"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="HirePulse Network"
                  required
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>
                Job Category <span className="text-brand">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setField("category", String(value))}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>
              Job Type <span className="text-brand">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setField("jobType", type)}
                  aria-pressed={form.jobType === type}
                  className={cn(
                    "h-10 rounded-lg border text-sm font-medium transition-colors",
                    form.jobType === type
                      ? "border-brand bg-brand/15 text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </FormSection>

        {/* 2. Location, Compensation & Timeline */}
        <FormSection title="2. Location, Compensation & Timeline">
          {/* Remote toggle */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <Globe className="size-4 text-brand" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Remote Work Allowed (isRemote)
                </p>
                <p className="text-xs text-muted-foreground">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
            </div>
            <Switch
              checked={form.isRemote}
              onCheckedChange={(checked) => setField("isRemote", checked)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="location">
                Job Location{" "}
                <span className="text-muted-foreground">(location)</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="New York, USA"
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deadline">
                Application Deadline{" "}
                <span className="text-muted-foreground">(deadline)</span>
              </Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="h-10 cursor-pointer pl-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="minSalary">Min Salary / Rate</Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-brand">
                  €
                </span>
                <Input
                  type="number"
                  id="minSalary"
                  name="minSalary"
                  value={form.minSalary}
                  onChange={handleChange}
                  placeholder="25"
                  className="h-10 pl-7"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maxSalary">Max Salary / Rate</Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-brand">
                  €
                </span>
                <Input
                  type="number"
                  id="maxSalary"
                  name="maxSalary"
                  value={form.maxSalary}
                  onChange={handleChange}
                  placeholder="40"
                  className="h-10 pl-7"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select
                value={form.frequency}
                onValueChange={(value) => setField("frequency", String(value))}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_FREQUENCIES.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormSection>

        {/* 3. Responsibilities & Requirements */}
        <FormSection title="3. Responsibilities & Requirements">
          <div className="space-y-1.5">
            <Label htmlFor="responsibilities">
              Key Responsibilities <span className="text-brand">*</span>
            </Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qualifications">
              Qualifications &amp; Requirements{" "}
              <span className="text-brand">*</span>
            </Label>
            <Textarea
              id="qualifications"
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              required
              rows={5}
              placeholder="• 3+ years of experience with React, TypeScript, and modern state architectures
• Solid understanding of DOM performance and component-driven designs
• Experience working closely with product teams and UI/UX designers"
            />
          </div>
        </FormSection>

        <section className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            form="post-job-form"
            size="lg"
            className="rounded-full bg-brand font-semibold hover:bg-brand/85"
          >
            Publish Job
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </section>
      </form>
    </div>
  )
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <span className="size-1.5 rounded-full bg-brand" />
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}
