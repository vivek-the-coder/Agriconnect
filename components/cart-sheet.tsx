"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { auth } from "@/lib/firebase"

// Add a type declaration for the Razorpay window object
declare global {
    interface Window {
        Razorpay: {
            new(options: RazorpayOptions): RazorpayInstance;
        };
    }
}

interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    theme: { color: string };
    handler: (response: RazorpayResponse) => Promise<void>;
    modal: {
        ondismiss: () => Promise<void>;
    };
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

export function CartSheet() {
    const { items, removeItem, updateQuantity, clearCart, itemCount, total, isOpen, setIsOpen } = useCart()
    const [checkingOut, setCheckingOut] = useState(false)

    const router = useRouter()

    const loadRazorpayScript = useCallback(() => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, []);

    const handleCheckout = async () => {
        if (items.length === 0) return
        setCheckingOut(true)

        try {
            // 1. Load Razorpay script
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setCheckingOut(false);
                return;
            }

            // 2. Create Order on Backend
            const orderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error);

            // 3. Initialize Razorpay Checkout
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "AgriConnect",
                description: "Agricultural Inputs & Equipment",
                order_id: orderData.id,
                theme: { color: "#16a34a" },
                handler: async function (response: RazorpayResponse) {
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                items,
                                total,
                                userId: auth.currentUser?.uid,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) throw new Error(verifyData.error);

                        clearCart();
                        setIsOpen(false);
                        toast.success("Payment successful! Order placed.");
                        router.push(`/dashboard/invoice/${verifyData.orderId}`);
                    } catch (error: unknown) {
                        const message = error instanceof Error ? error.message : "Payment verification failed";
                        toast.error(message);
                    }
                },
                modal: {
                    ondismiss: async function () {
                        setCheckingOut(false);
                        try {
                            const failRes = await fetch("/api/record-failure", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id: orderData.id,
                                    items,
                                    total,
                                    userId: auth.currentUser?.uid,
                                }),
                            });
                            const failData = await failRes.json();
                            if (failRes.ok && failData.orderId) {
                                setIsOpen(false);
                                router.push(`/dashboard/invoice/${failData.orderId}`);
                            } else {
                                toast.error("Payment cancelled.");
                            }
                        } catch (err) {
                            console.error("Failed to record dismissal:", err);
                        }
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", async function (response: { error: { description: string } }) {
                toast.error(`Payment failed: ${response.error.description}`);
                setCheckingOut(false);
                try {
                    const failRes = await fetch("/api/record-failure", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: orderData.id,
                            items,
                            total,
                            userId: auth.currentUser?.uid,
                        }),
                    });
                    const failData = await failRes.json();
                    if (failRes.ok && failData.orderId) {
                        setIsOpen(false);
                        router.push(`/dashboard/invoice/${failData.orderId}`);
                    }
                } catch (err) {
                    console.error("Failed to record failure:", err);
                }
            });
            setIsOpen(false);
            // Delay opening Razorpay to ensure Sheet overlay is fully removed
            setTimeout(() => {
                rzp.open();
            }, 100);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An error occurred during checkout";
            toast.error(message);
            setCheckingOut(false);
        }
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
            <SheetContent className="flex flex-col h-[100dvh] w-full sm:max-w-md p-0 gap-0 overflow-hidden bg-background">
                <SheetHeader className="p-6 pb-2 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Your Cart
                        {itemCount > 0 && (
                            <span className="text-xs font-normal text-muted-foreground">({itemCount} items)</span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col min-h-0 relative">
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
                        <div className="flex flex-col h-full overflow-hidden">
                            {/* Scrollable Container with Native Scroll */}
                            <div className="flex-1 w-full overflow-y-auto overscroll-contain px-6 py-4 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-border/80 transition-all group">
                                        {/* Image Container */}
                                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 relative">
                                            {item.product_image ? (
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-semibold text-foreground truncate">{item.product_name}</h4>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{item.product_type}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 -mr-1 -mt-1 text-muted-foreground hover:text-destructive shrink-0"
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm font-bold text-primary">₹{item.price.toLocaleString("en-IN")}</p>
                                                <div className="flex items-center gap-1 bg-background rounded-lg border border-border/60 p-0.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-2.5 w-2.5" />
                                                    </Button>
                                                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-2.5 w-2.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Sticky Footer */}
                            <div className="p-6 space-y-4 bg-background border-t shrink-0 shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.05)]">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-base font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                <SheetFooter className="flex-col gap-2 sm:flex-col pb-2">
                                    <Button
                                        className="w-full font-semibold shadow-md h-12"
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
                                        className="w-full text-muted-foreground hover:text-destructive py-1 h-8"
                                        onClick={() => {
                                            clearCart()
                                            toast.info("Cart cleared")
                                        }}
                                    >
                                        Clear Cart
                                    </Button>
                                </SheetFooter>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
