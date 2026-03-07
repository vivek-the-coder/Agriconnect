"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, signOut } from "firebase/auth"
import { Navigation } from "@/components/navigation"
import { toast } from "sonner"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if (!user.emailVerified) {
                await signOut(auth)
                toast.error("Please verify your email before logging in. Check your inbox.")
                setIsLoading(false)
                return
            }

            toast.success("Logged in successfully!")
            router.push("/")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            toast.success("Logged in with Google successfully!")
            router.push("/")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in with Google")
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
                            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</CardTitle>
                            <CardDescription className="text-slate-500 text-lg">
                                Log in to your AgriConnect account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleLogin} className="space-y-5">
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
                                    <div className="flex items-center justify-between ml-1">
                                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
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
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" /> Logging in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Log in <ArrowRight className="h-5 w-5" />
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
                                    <span className="bg-white px-3 text-slate-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                type="button"
                                className="w-full h-12 text-base font-semibold border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>

                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-500 font-medium">New to AgriConnect?</span>
                                </div>
                            </div>
                            <Link href="/signup" className="w-full">
                                <Button variant="outline" className="w-full h-12 text-base font-semibold border-slate-200 hover:bg-slate-50 transition-colors">
                                    Create an account
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
