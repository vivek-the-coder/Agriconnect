"use client"

import { useState, useEffect, useCallback } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Package,
    ShoppingBag,
    ClipboardList,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    Loader2,
    CalendarDays,
    Tractor,
    Wheat,
    TrendingUp,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    FileText,
    MapPin,
} from "lucide-react"
import Image from "next/image"



function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
        case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200"
        case "shipped": return "bg-purple-100 text-purple-800 border-purple-200"
        case "delivered": return "bg-green-100 text-green-800 border-green-200"
        case "cancelled": return "bg-red-100 text-red-800 border-red-200"
        case "failed": return "bg-red-100 text-red-800 border-red-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

function getStatusIcon(status: string) {
    switch (status?.toLowerCase()) {
        case "pending": return <Clock className="h-3.5 w-3.5" />
        case "confirmed": return <CheckCircle2 className="h-3.5 w-3.5" />
        case "shipped": return <Truck className="h-3.5 w-3.5" />
        case "delivered": return <CheckCircle2 className="h-3.5 w-3.5" />
        case "cancelled": return <XCircle className="h-3.5 w-3.5" />
        case "failed": return <XCircle className="h-3.5 w-3.5" />
        default: return <Clock className="h-3.5 w-3.5" />
    }
}

export function DashboardContent() {
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string>("")
    const [activeTab, setActiveTab] = useState("orders")
    const [orders, setOrders] = useState<any[]>([])
    const [equipmentListings, setEquipmentListings] = useState<any[]>([])
    const [cropListings, setCropListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [checkingOut, setCheckingOut] = useState(false)
    const { items: cartItems, removeItem, updateQuantity, clearCart, total, itemCount } = useCart()
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
                setUserEmail(user.email || "")
            } else {
                router.push('/login')
            }
        })
        return () => unsubscribe()
    }, [router])

    useEffect(() => {
        if (userId) {
            fetchData()
        }
    }, [userId])

    const fetchData = async () => {
        setLoading(true)
        try {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching data")), 5000))

            // Fetch orders
            const ordersQuery = query(collection(db, "orders"), where("user_id", "==", userId))
            const ordersSnapshot = await Promise.race([getDocs(ordersQuery), timeoutPromise]) as any
            const ordersData = ordersSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
            setOrders(ordersData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))

            // Fetch equipment listings
            const equipQuery = query(collection(db, "equipment"), where("user_id", "==", userId))
            const equipSnapshot = await Promise.race([getDocs(equipQuery), timeoutPromise]) as any
            const equipData = equipSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
            setEquipmentListings(equipData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))

            // Fetch crop listings
            const cropQuery = query(collection(db, "export_crops"), where("user_id", "==", userId))
            const cropSnapshot = await Promise.race([getDocs(cropQuery), timeoutPromise]) as any
            const cropData = cropSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
            setCropListings(cropData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
        } catch (err) {
            console.error("Error fetching dashboard data:", err)
        } finally {
            setLoading(false)
        }
    }



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
        if (cartItems.length === 0) return
        setCheckingOut(true)

        try {
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setCheckingOut(false);
                return;
            }

            const orderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "AgriConnect",
                description: "Agricultural Inputs & Equipment",
                order_id: orderData.id,
                theme: { color: "#16a34a" },
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                items: cartItems,
                                total,
                                userId,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) throw new Error(verifyData.error);

                        clearCart();
                        toast.success("Payment successful! Order placed.");
                        router.push(`/dashboard/invoice/${verifyData.orderId}`);
                    } catch (error: any) {
                        toast.error(error.message || "Payment verification failed");
                        // We don't record failure here because the verification failed, but the payment might have been successful.
                        // Usually signature failure means tampering.
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
                                    items: cartItems,
                                    total,
                                    userId,
                                }),
                            });
                            const failData = await failRes.json();
                            if (failRes.ok && failData.orderId) {
                                router.push(`/dashboard/invoice/${failData.orderId}`);
                            } else {
                                fetchData();
                                toast.error("Payment cancelled.");
                            }
                        } catch (err) {
                            console.error("Failed to record dismissal:", err);
                        }
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", async function (response: any) {
                toast.error(`Payment failed: ${response.error.description}`);
                setCheckingOut(false);
                try {
                    const failRes = await fetch("/api/record-failure", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: orderData.id,
                            items: cartItems,
                            total,
                            userId,
                        }),
                    });
                    const failData = await failRes.json();
                    if (failRes.ok && failData.orderId) {
                        router.push(`/dashboard/invoice/${failData.orderId}`);
                    } else {
                        fetchData();
                    }
                } catch (err) {
                    console.error("Failed to record failure:", err);
                }
            });
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || "An error occurred during checkout");
            setCheckingOut(false);
        }
    }

    const totalListings = equipmentListings.length + cropListings.length

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, <span className="font-medium text-foreground">{userEmail}</span></p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Active Orders</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200/50">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400">{orders.length}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">My Listings</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-orange-700 dark:text-orange-400">{totalListings}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Cart Items</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">{itemCount}</p>
                                </div>
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="flex h-auto w-full overflow-x-auto no-scrollbar justify-start sm:grid sm:grid-cols-3">
                        <TabsTrigger value="orders" className="gap-2 flex-grow sm:flex-grow-0">
                            <ClipboardList className="h-4 w-4 hidden sm:block" />
                            Orders
                        </TabsTrigger>
                        <TabsTrigger value="listings" className="gap-2 flex-grow sm:flex-grow-0">
                            <Package className="h-4 w-4 hidden sm:block" />
                            Listings
                        </TabsTrigger>
                        <TabsTrigger value="cart" className="gap-2 flex-grow sm:flex-grow-0">
                            <ShoppingBag className="h-4 w-4 hidden sm:block" />
                            Cart
                            {itemCount > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{itemCount}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* ===================== MY ORDERS TAB ===================== */}
                    <TabsContent value="orders" className="space-y-4">
                        {loading ? (
                            <div className="py-16 text-center flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Loading your orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <Card className="py-16">
                                <CardContent className="text-center px-4">
                                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                        <ClipboardList className="h-8 sm:h-9 w-8 sm:w-9 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Your order history will appear here once you make a purchase.</p>
                                    <Button variant="outline" onClick={() => setActiveTab("cart")}>Go to Cart</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3 px-4 sm:px-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <CardTitle className="text-base font-semibold">
                                                    Order #{order.id?.slice(0, 8)}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1.5 mt-0.5">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </CardDescription>
                                            </div>
                                            <Badge className={`w-fit flex items-center gap-1 px-3 py-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-4 sm:px-6">
                                        <div className="space-y-3">
                                            {(order.items || []).map((item: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0 gap-4">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {item.product_image ? (
                                                            <div className="relative h-10 w-10 flex-shrink-0">
                                                                <Image src={item.product_image} alt={item.product_name} fill className="rounded-md object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                                                <Package className="h-4 w-4 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="font-medium truncate">{item.product_name}</p>
                                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-primary flex-shrink-0">₹{(item.quantity * item.price).toLocaleString("en-IN")}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex justify-between items-center bg-muted/20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2">
                                            <span className="text-sm font-medium text-muted-foreground">Order Total</span>
                                            <span className="text-lg font-bold text-primary">₹{Number(order.total).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="pt-2">
                                            <Link href={`/dashboard/invoice/${order.id}`} target="_blank" className="block sm:inline">
                                                <Button variant="outline" className="w-full sm:w-auto h-10 text-sm">
                                                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* ===================== MY LISTINGS TAB ===================== */}
                    <TabsContent value="listings" className="space-y-6">
                        {loading ? (
                            <div className="py-16 text-center flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Loading your listings...</p>
                            </div>
                        ) : totalListings === 0 ? (
                            <Card className="py-16">
                                <CardContent className="text-center px-4">
                                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                        <Package className="h-9 w-9 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">No listings yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4">List equipment or crops from their respective pages.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Equipment Listings */}
                                {equipmentListings.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 px-1 flex items-center gap-2">
                                            <Tractor className="h-5 w-5 text-primary" />
                                            Equipment Listings
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {equipmentListings.map((item) => (
                                                <Card key={item.id} className="hover:shadow-md transition-shadow overflow-hidden">
                                                    <div className="h-40 bg-muted overflow-hidden relative">
                                                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                                                        <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90" variant="secondary">
                                                            {item.status || "Available"}
                                                        </Badge>
                                                    </div>
                                                    <CardContent className="p-4 space-y-3">
                                                        <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-bold text-primary">₹{(parseInt(item.price) || 0).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/40">
                                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.location}</span>
                                                            {item.year && <span>• {item.year}</span>}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Crop Listings */}
                                {cropListings.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 mt-8 px-1 flex items-center gap-2">
                                            <Wheat className="h-5 w-5 text-primary" />
                                            Crop Listings
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {cropListings.map((crop) => (
                                                <Card key={crop.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="min-w-0">
                                                                <h4 className="font-semibold truncate">{crop.cropname}</h4>
                                                                <p className="text-xs text-muted-foreground mt-0.5">{crop.variety}</p>
                                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                                                    <MapPin className="h-3 w-3 text-primary/60" />
                                                                    <span className="truncate">{crop.location}</span>
                                                                </div>
                                                            </div>
                                                            {crop.organic && <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200/50 text-[10px] px-1.5 h-5 uppercase tracking-wider font-bold">Organic</Badge>}
                                                        </div>
                                                        <Separator className="bg-border/40" />
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-primary font-bold">{crop.pricerange}</span>
                                                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{crop.quantity}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                                            <span className="truncate">{crop.location}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>

                    {/* ===================== MY CART TAB ===================== */}
                    <TabsContent value="cart" className="space-y-4">
                        {cartItems.length === 0 ? (
                            <Card className="py-16">
                                <CardContent className="text-center px-4">
                                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag className="h-9 w-9 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
                                    <p className="text-sm text-muted-foreground">Browse our marketplace to add items to your cart.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                                {/* Cart Items */}
                                <div className="lg:col-span-2 space-y-3">
                                    {cartItems.map((item) => (
                                        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0 relative">
                                                        {item.product_image ? (
                                                            <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <div className="min-w-0">
                                                                <h4 className="font-semibold text-base truncate">{item.product_name}</h4>
                                                                <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold tracking-wider py-0 px-2">{item.product_type}</Badge>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive -mr-2 -mt-1" onClick={() => removeItem(item.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-4 sm:mt-2">
                                                            <p className="font-bold text-lg text-primary">₹{item.price.toLocaleString("en-IN")}</p>
                                                            <div className="flex items-center gap-1 rounded-lg border border-border/60 p-1 bg-background">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-4 lg:mt-0">
                                    <Card className="sticky top-24 shadow-lg border-primary/10">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg">Order Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                                                    <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Delivery</span>
                                                    <span className="font-bold text-green-600">FREE</span>
                                                </div>
                                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
                                                <div className="flex justify-between items-center text-lg font-bold">
                                                    <span>Total Amount</span>
                                                    <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Button className="w-full font-bold shadow-lg shadow-primary/20 h-12 text-base transition-all hover:scale-[1.02]" size="lg" onClick={handleCheckout} disabled={checkingOut}>
                                                    {checkingOut ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Secure Checkout
                                                            <ArrowRight className="h-5 w-5 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive font-medium" onClick={() => { if (window.confirm("Are you sure you want to clear your cart?")) { clearCart(); toast.info("Cart cleared"); } }}>
                                                    Clear Shopping Cart
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
