"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { placeOrder } from "@/lib/checkout-handler"
import { useState } from "react"
import Image from "next/image"

export function CartSheet() {
    const { items, removeItem, updateQuantity, clearCart, itemCount, total, isOpen, setIsOpen } = useCart()
    const [checkingOut, setCheckingOut] = useState(false)

    const handleCheckout = async () => {
        if (items.length === 0) return
        setCheckingOut(true)
        const { orderId, error } = await placeOrder({ items, total })
        setCheckingOut(false)

        if (error) {
            toast.error(error)
            return
        }

        clearCart()
        setIsOpen(false)
        toast.success("Order placed successfully!", {
            description: `Order ID: ${orderId?.slice(0, 8)}... — Total: ₹${total.toLocaleString("en-IN")}`,
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2 min-h-[44px] min-w-[44px]" aria-label="Open cart">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-200">
                            {itemCount > 99 ? "99+" : itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Your Cart
                        {itemCount > 0 && (
                            <span className="text-xs font-normal text-muted-foreground">({itemCount} items)</span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Your cart is empty</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Browse our seeds, tools, and equipment to add items to your cart.
                        </p>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-4 py-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-border/80 transition-colors">
                                        {/* Image */}
                                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                            {item.product_image ? (
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-foreground truncate">{item.product_name}</h4>
                                            <p className="text-xs text-muted-foreground capitalize">{item.product_type}</p>
                                            <p className="text-sm font-semibold text-primary mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                                        </div>

                                        {/* Quantity + Remove */}
                                        <div className="flex flex-col items-end justify-between">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <div className="flex items-center gap-1 bg-background rounded-lg border border-border/60 px-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-4 space-y-4">
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <SheetFooter className="flex-col gap-2 sm:flex-col">
                                <Button
                                    className="w-full font-semibold shadow-md"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={checkingOut}
                                >
                                    {checkingOut ? "Placing Order..." : "Place Order"}
                                    {!checkingOut && <ArrowRight className="h-4 w-4 ml-2" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                        clearCart()
                                        toast.info("Cart cleared")
                                    }}
                                >
                                    Clear Cart
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
