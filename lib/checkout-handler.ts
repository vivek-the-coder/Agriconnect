import { supabase } from "@/lib/supabase"
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

export async function placeOrder({ userId, items, total, shippingAddress, contactPhone, razorpayOrderId, razorpayPaymentId, supabaseClient, status }: CheckoutData): Promise<{ orderId: string | null; error: string | null }> {
    const client = supabaseClient || supabase

    // Insert the order
    const { data: order, error: orderError } = await client
        .from("orders")
        .insert({
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
            razorpay_payment_id: razorpayPaymentId
        })
        .select()
        .single()

    if (orderError) {
        return { orderId: null, error: orderError.message }
    }

    // Clear the user's cart
    await client.from("cart_items").delete().eq("user_id", userId)

    return { orderId: order.id, error: null }
}
