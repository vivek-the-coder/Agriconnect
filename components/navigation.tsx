"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Sprout, LogOut, User, Settings } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Government Schemes", href: "/schemes" },
  { name: "Export Hub", href: "/export-hub" },
  { name: "Farmer Community", href: "/community" },
  { name: "Tools & Machines", href: "/tools" },
  { name: "Seeds & Tissue Culture", href: "/seeds" },
  { name: "Used Equipment Shop", href: "/used-equipment" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Sprout className="h-6 w-6 sm:h-8 sm:h-8 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">AgriConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-2 border-l border-border/40 pl-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-semibold max-w-[100px] truncate">{user.email}</span>
                  </div>
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-semibold text-primary hover:text-primary hover:bg-primary/5">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 min-h-[44px] min-w-[44px]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border/40">
            <div className="px-2 pt-4 pb-6 space-y-2 bg-background/95 backdrop-blur-sm">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3 px-4 py-4 rounded-lg bg-primary/5 text-primary border border-primary/10">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-semibold truncate">{user.email}</span>
                      </div>
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start font-semibold text-muted-foreground min-h-[48px]">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    </div>
                    <Button variant="outline" onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full justify-center font-semibold text-destructive border-destructive/20 hover:bg-destructive/5 min-h-[48px]">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full justify-center font-semibold text-primary border-primary/20 min-h-[48px]">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                      <Button className="w-full justify-center font-semibold shadow-md min-h-[48px]">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
