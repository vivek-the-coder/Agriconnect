"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Mail, ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Password reset link sent to your email!")
                setIsSubmitted(true)
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navigation />

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
                    <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
                        <CardHeader className="space-y-1 text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <Sprout className="h-10 w-10" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</CardTitle>
                            <CardDescription className="text-slate-500 text-lg">
                                {isSubmitted
                                    ? "Check your email for the reset link"
                                    : "Enter your email to receive a password reset link"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {!isSubmitted ? (
                                <form onSubmit={handleReset} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                required
                                                className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-base"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" /> Sending link...
                                            </span>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center py-6 space-y-4">
                                    <div className="p-4 rounded-xl bg-green-50 text-green-700 border border-green-100">
                                        <p className="font-medium">Success!</p>
                                        <p className="text-sm mt-1">If an account exists for {email}, you will receive a password reset link shortly.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-slate-600 border-slate-200"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Try another email
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
                            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
