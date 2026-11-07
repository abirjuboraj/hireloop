"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Building2, Eye, EyeOff, Lock, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<"seeker" | "employer">("seeker")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Event handler collects form data
    const submissionData = {
      ...formData,
      role,
    }
    console.log("Sign Up Submitted:", submissionData)
  }

  const handleOAuthSignUp = (provider: "google" | "github") => {
    console.log(`OAuth Sign Up with: ${provider}, Role: ${role}`)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#000] px-4 py-12">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 0%, rgba(92,83,254,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(20,20,25,0.8) 0%, transparent 100%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block outline-none">
            <Image
              src="/logo.png"
              alt="HireLoop"
              width={794}
              height={224}
              priority
              className="mx-auto h-9 w-auto"
            />
          </Link>
          <p className="mt-2 text-sm text-white/60">
            Create an account to start your journey
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border border-white/10 bg-[#0e0e12]/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Create an Account
            </CardTitle>
            <CardDescription className="text-sm text-white/60">
              Join thousands of job seekers and top companies
            </CardDescription>

            {/* Role Switcher Pill */}
            <div className="mt-4 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setRole("seeker")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
                  role === "seeker"
                    ? "bg-brand text-white shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <User className="size-3.5" />
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
                  role === "employer"
                    ? "bg-brand text-white shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Building2 className="size-3.5" />
                Employer / Recruiter
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* OAuth Quick Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignUp("google")}
                className="h-10 border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
              >
                <svg className="mr-2 size-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignUp("github")}
                className="h-10 border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
              >
                <svg className="mr-2 size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                GitHub
              </Button>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#0e0e12] px-3 text-xs uppercase tracking-wider text-white/40">
                Or continue with
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-white/80">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10 rounded-lg border-white/10 bg-white/[0.04] pl-9 text-sm text-white placeholder:text-white/30 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand"
                  />
                </div>
              </div>

              {/* Company Name (only if employer) */}
              {role === "employer" && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <Label
                    htmlFor="companyName"
                    className="text-xs font-medium text-white/80"
                  >
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Acme Corp"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="h-10 rounded-lg border-white/10 bg-white/[0.04] pl-9 text-sm text-white placeholder:text-white/30 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-white/80">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 rounded-lg border-white/10 bg-white/[0.04] pl-9 text-sm text-white placeholder:text-white/30 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-white/80"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10 rounded-lg border-white/10 bg-white/[0.04] pr-10 pl-9 text-sm text-white placeholder:text-white/30 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="mt-0.5 border-white/20 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="cursor-pointer text-xs leading-snug font-normal text-white/70"
                >
                  I agree to the{" "}
                  <Link href="#" className="text-brand hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-brand hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white shadow-lg hover:bg-brand/90"
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-white/10 pt-4 text-xs text-white/60">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="ml-1 font-semibold text-brand hover:underline"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
