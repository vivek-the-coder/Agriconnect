"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useCart } from "@/lib/cart-context"
import { placeOrder } from "@/lib/checkout-handler"
import { toast } from "sonner"
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
} from "lucide-react"
import Image from "next/image"

function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
        case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200"
        case "shipped": return "bg-purple-100 text-purple-800 border-purple-200"
        case "delivered": return "bg-green-100 text-green-800 border-green-200"
        case "cancelled": return "bg-red-100 text-red-800 border-red-200"
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

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUserId(session.user.id)
                setUserEmail(session.user.email || "")
            }
        })
    }, [])

    useEffect(() => {
        if (userId) {
            fetchData()
        }
    }, [userId])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch orders
            const { data: ordersData } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
            setOrders(ordersData || [])

            // Fetch equipment listings
            const { data: equipData } = await supabase
                .from("equipment")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
            setEquipmentListings(equipData || [])

            // Fetch crop listings
            const { data: cropData } = await supabase
                .from("export_crops")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
            setCropListings(cropData || [])
        } catch (err) {
            console.error("Error fetching dashboard data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckout = async () => {
        if (cartItems.length === 0) return
        setCheckingOut(true)
        const { orderId, error } = await placeOrder({ items: cartItems, total })
        setCheckingOut(false)

        if (error) {
            toast.error(error)
            return
        }

        clearCart()
        fetchData()
        setActiveTab("orders")
        toast.success("Order placed successfully!", {
            description: `Order ID: ${orderId?.slice(0, 8)}...`,
        })
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Active Orders</p>
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
                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Orders</p>
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
                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">My Listings</p>
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
                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Cart Items</p>
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
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="orders" className="gap-2">
                            <ClipboardList className="h-4 w-4 hidden sm:block" />
                            My Orders
                        </TabsTrigger>
                        <TabsTrigger value="listings" className="gap-2">
                            <Package className="h-4 w-4 hidden sm:block" />
                            My Listings
                        </TabsTrigger>
                        <TabsTrigger value="cart" className="gap-2">
                            <ShoppingBag className="h-4 w-4 hidden sm:block" />
                            My Cart
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
                                <CardContent className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                        <ClipboardList className="h-9 w-9 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Your order history will appear here once you make a purchase.</p>
                                    <Button variant="outline" onClick={() => setActiveTab("cart")}>Go to Cart</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-base font-semibold">
                                                    Order #{order.id?.slice(0, 8)}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1.5 mt-0.5">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </CardDescription>
                                            </div>
                                            <Badge className={`w-fit flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            {(order.items || []).map((item: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        {item.product_image ? (
                                                            <Image src={item.product_image} alt={item.product_name} width={36} height={36} className="rounded-md object-cover" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{item.product_name}</p>
                                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-primary">₹{(item.quantity * item.price).toLocaleString("en-IN")}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Order Total</span>
                                            <span className="text-lg font-bold text-primary">₹{Number(order.total).toLocaleString("en-IN")}</span>
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
                                <CardContent className="text-center">
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
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Tractor className="h-5 w-5 text-primary" />
                                            Equipment Listings
                                        </h3>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {equipmentListings.map((item) => (
                                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                                    <div className="h-36 bg-muted rounded-t-lg overflow-hidden">
                                                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <CardContent className="p-4 space-y-2">
                                                        <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-primary">₹{(parseInt(item.price) || 0).toLocaleString()}</span>
                                                            <Badge variant="outline">{item.status || "Available"}</Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{item.location} • {item.year}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Crop Listings */}
                                {cropListings.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Wheat className="h-5 w-5 text-primary" />
                                            Crop Listings
                                        </h3>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {cropListings.map((crop) => (
                                                <Card key={crop.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4 space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="font-semibold">{crop.cropname}</h4>
                                                            {crop.organic && <Badge className="bg-green-100 text-green-800 text-xs">Organic</Badge>}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{crop.variety}</p>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-primary font-semibold">{crop.pricerange}</span>
                                                            <span className="text-muted-foreground">{crop.quantity}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{crop.location}</p>
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
                                <CardContent className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag className="h-9 w-9 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
                                    <p className="text-sm text-muted-foreground">Browse our marketplace to add items to your cart.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Cart Items */}
                                <div className="lg:col-span-2 space-y-3">
                                    {cartItems.map((item) => (
                                        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                                        {item.product_image ? (
                                                            <Image src={item.product_image} alt={item.product_name} width={80} height={80} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold truncate">{item.product_name}</h4>
                                                        <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.product_type}</p>
                                                        <p className="font-bold text-primary mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end justify-between">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <div className="flex items-center gap-1 rounded-lg border border-border/60 px-1">
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <Card className="sticky top-24">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Order Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                                                    <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Delivery</span>
                                                    <span className="font-medium text-green-600">Free</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between text-base font-bold">
                                                    <span>Total</span>
                                                    <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                            <Button className="w-full font-semibold shadow-md" size="lg" onClick={handleCheckout} disabled={checkingOut}>
                                                {checkingOut ? "Placing Order..." : "Place Order"}
                                                {!checkingOut && <ArrowRight className="h-4 w-4 ml-2" />}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive" onClick={() => { clearCart(); toast.info("Cart cleared") }}>
                                                Clear Cart
                                            </Button>
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
