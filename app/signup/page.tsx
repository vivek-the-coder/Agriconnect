"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { toast } from "sonner"

export default function SignUpPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Account created! Please check your email for verification.")
                router.push("/login")
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
                            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create Account</CardTitle>
                            <CardDescription className="text-slate-500 text-lg">
                                Join the largest farmer community
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSignUp} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700 ml-1">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-base"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
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
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            required
                                            minLength={8}
                                            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-base"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2 px-1 pt-1 mb-2">
                                    <div className="mt-0.5 border-t-2 border-primary/20 bg-primary/5 p-1 rounded">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        By clicking Sign up, you agree to our <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" /> Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Sign up <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-500 font-medium">Already have an account?</span>
                                </div>
                            </div>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-12 text-base font-semibold border-slate-200 hover:bg-slate-50 transition-colors">
                                    Log in here
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
