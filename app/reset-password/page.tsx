"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Lock, Loader2, ArrowRight } from "lucide-react"
import { auth } from "@/lib/firebase"
import { confirmPasswordReset } from "firebase/auth"
import { Navigation } from "@/components/navigation"
import { toast } from "sonner"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            const searchParams = new URLSearchParams(window.location.search)
            const oobCode = searchParams.get('oobCode')

            if (!oobCode) {
                toast.error("Invalid or missing password reset code.")
                return
            }

            await confirmPasswordReset(auth, oobCode, password)
            toast.success("Password updated successfully!")
            router.push("/login")
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
                            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Set New Password</CardTitle>
                            <CardDescription className="text-slate-500 text-lg">
                                Enter your new password below
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleUpdatePassword} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">New Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-base"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-base"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                            <Loader2 className="h-5 w-5 animate-spin" /> Updating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Update Password <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
