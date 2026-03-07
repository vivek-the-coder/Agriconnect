import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore"
import type { CartItem } from "@/lib/cart-context"

interface CheckoutData {
    userId: string
    items: CartItem[]
    total: number
    shippingAddress?: string
    contactPhone?: string
    razorpayOrderId: string
    razorpayPaymentId: string
    supabaseClient?: any
    status?: string
}

export async function placeOrder({ userId, items, total, shippingAddress, contactPhone, razorpayOrderId, razorpayPaymentId, status }: CheckoutData): Promise<{ orderId: string | null; error: string | null }> {
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            user_id: userId,
            items: items.map((item) => ({
                product_id: item.product_id,
                product_type: item.product_type,
                product_name: item.product_name,
                product_image: item.product_image,
                price: item.price,
                quantity: item.quantity,
            })),
            total: total,
            status: status || "Pending",
            shipping_address: shippingAddress || null,
            contact_phone: contactPhone || null,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            created_at: new Date().toISOString()
        })

        // Clear the user's cart from Firestore
        const q = query(collection(db, "cart_items"), where("user_id", "==", userId))
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching data")), 5000))
        const snapshot = await Promise.race([getDocs(q), timeoutPromise]) as any
        snapshot.forEach(async (d: any) => {
            await deleteDoc(d.ref)
        })

        return { orderId: docRef.id, error: null }
    } catch (orderError: any) {
        console.error("placeOrder Firebase Error:", orderError)
        return { orderId: null, error: orderError.message }
    }
}
