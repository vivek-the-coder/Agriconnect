import { supabase } from "@/lib/supabase"
import type { CartItem } from "@/lib/cart-context"

interface CheckoutData {
    items: CartItem[]
    total: number
    shippingAddress?: string
    contactPhone?: string
}

export async function placeOrder(data: CheckoutData): Promise<{ orderId: string | null; error: string | null }> {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
        return { orderId: null, error: "You must be logged in to place an order." }
    }

    const userId = session.user.id

    // Insert the order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: userId,
            items: data.items.map((item) => ({
                product_id: item.product_id,
                product_type: item.product_type,
                product_name: item.product_name,
                product_image: item.product_image,
                price: item.price,
                quantity: item.quantity,
            })),
            total: data.total,
            status: "Pending",
            shipping_address: data.shippingAddress || null,
            contact_phone: data.contactPhone || null,
        })
        .select()
        .single()

    if (orderError) {
        return { orderId: null, error: orderError.message }
    }

    // Clear the user's cart
    await supabase.from("cart_items").delete().eq("user_id", userId)

    return { orderId: order.id, error: null }
}
