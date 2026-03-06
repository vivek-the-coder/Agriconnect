import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/checkout-handler";
import type { CartItem } from "@/lib/cart-context";
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            items,
            total,
            shippingAddress,
            contactPhone,
        } = await req.json();

        // 1. Get the authenticated user securely on the server
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const userId = user.id;

        // Store the order as "Failed"
        const { orderId, error } = await placeOrder({
            userId,
            items: items as CartItem[],
            total: total as number,
            shippingAddress: shippingAddress as string,
            contactPhone: contactPhone as string,
            razorpayOrderId: razorpay_order_id as string,
            razorpayPaymentId: "FAILED",
            supabaseClient: supabase,
            status: "Failed",
        });

        if (error) {
            throw new Error(error);
        }

        return NextResponse.json(
            { message: "Failure recorded successfully", orderId },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error recording failure:", error);
        return NextResponse.json(
            { error: "Failed to record payment failure" },
            { status: 500 }
        );
    }
}
