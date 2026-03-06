"use client"

import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingCartButton() {
    const { itemCount, setIsOpen, isOpen } = useCart()

    if (itemCount === 0 || isOpen) return null

    return (
        <div className="fixed bottom-6 right-6 z-[40] lg:hidden animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            <Button
                className="h-14 px-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.25)] bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-3 border border-white/20"
                onClick={() => setIsOpen(true)}
            >
                <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="font-bold text-base tracking-tight">View Cart</span>
                <div className="flex items-center justify-center bg-white text-primary rounded-full h-6 min-w-[24px] px-1.5 text-xs font-black shadow-inner">
                    {itemCount > 99 ? "99+" : itemCount}
                </div>
            </Button>
        </div>
    )
}
