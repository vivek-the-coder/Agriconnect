"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { PrintInvoiceButton } from "@/components/print-invoice-button"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export default function InvoicePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [order, setOrder] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = "Invoice | AgriConnect"
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login")
                return
            }
            setUser(currentUser)

            try {
                const docRef = doc(db, "orders", id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists() && docSnap.data().user_id === currentUser.uid) {
                    setOrder({ id: docSnap.id, ...docSnap.data() })
                } else {
                    setOrder(null)
                }
            } catch (err) {
                console.error("Error fetching invoice:", err)
                setOrder(null)
            } finally {
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [id, router])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading invoice...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-2">Invoice Not Found</h1>
                <p className="text-muted-foreground mb-6">This order does not exist or you do not have permission to view it.</p>
                <Link href="/dashboard">
                    <Button><ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard</Button>
                </Link>
            </div>
        )
    }

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
    const isPaid = order.razorpay_payment_id != null;

    return (
        <div className="min-h-screen bg-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Print Controls (Hidden when printing via CSS) */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Link href="/dashboard">
                        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
                    </Link>
                    <PrintInvoiceButton />
                </div>

                {/* The Printable Invoice Wrapper */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden print:shadow-none print:rounded-none">

                    {/* Header */}
                    <div className="bg-green-50 p-8 border-b border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">A</span>
                                </div>
                                <h1 className="text-2xl font-bold text-green-800">AgriConnect</h1>
                            </div>
                            <p className="text-sm text-green-700">Empowering Farmers, Connecting Buyers.</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <h2 className="text-3xl font-black text-green-900 uppercase tracking-wider mb-1">INVOICE</h2>
                            <p className="text-sm font-medium text-green-800">#{order.id.split('-')[0]?.toUpperCase() || order.id}</p>
                            <p className="text-sm text-green-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Billing Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To:</h3>
                                <p className="font-semibold text-gray-900">{user?.email}</p>
                                <p className="text-gray-600 text-sm mt-1">Phone: {order.contact_phone || "N/A"}</p>
                            </div>
                            <div className="sm:text-right">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address:</h3>
                                <p className="text-gray-800 text-sm whitespace-pre-wrap">{order.shipping_address || "None specified"}</p>
                            </div>
                        </div>

                        {/* Payment Status Banner */}
                        <div className={`mb-8 p-4 rounded-lg flex items-center justify-between border ${isPaid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                            <div>
                                <p className="font-semibold">{isPaid ? "PAID — RAZORPAY" : "PENDING PAYMENT"}</p>
                                {isPaid && (
                                    <p className="text-xs opacity-80 font-mono mt-1">TXN: {order.razorpay_payment_id}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-80">Order Status</p>
                                <p className="font-bold uppercase">{order.status || 'processing'}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold border-b">Item</th>
                                        <th className="p-4 font-semibold border-b text-center">Qty</th>
                                        <th className="p-4 font-semibold border-b text-right">Price</th>
                                        <th className="p-4 font-semibold border-b text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-200">
                                    {items.map((item: any, idx: number) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="p-4">
                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{item.product_type}</p>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                                            <td className="p-4 text-right text-gray-600">₹{item.price.toLocaleString("en-IN")}</td>
                                            <td className="p-4 text-right font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
                            <div className="mb-6 sm:mb-0 w-full sm:w-1/2">
                                <p className="text-xs text-gray-500 mb-1">Thank you for placing your trust in AgriConnect.</p>
                                <p className="text-xs text-gray-400">If you have any questions concerning this invoice, please contact support@agriconnect.in.</p>
                            </div>
                            <div className="w-full sm:w-1/3 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{(order.total || 0).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                    <span>Total Amount</span>
                                    <span>₹{(order.total || 0).toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Print Styles Injection */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .max-w-3xl, .max-w-3xl * {
                            visibility: visible;
                        }
                        .max-w-3xl {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            box-shadow: none !important;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                    }
                `}} />

            </div>
        </div>
    )
}
