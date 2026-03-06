import { NextResponse } from "next/server";
import crypto from "crypto";
import { placeOrder } from "@/lib/checkout-handler";
import type { CartItem } from "@/lib/cart-context";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
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
                { error: "Unauthorized. You must be logged in." },
                { status: 401 }
            );
        }
        const userId = user.id;

        // Verify the payment signature securely
        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Since payment is valid, store the order firmly in Supabase!
        const { orderId, error } = await placeOrder({
            userId,
            items: items as CartItem[],
            total: total as number,
            shippingAddress: shippingAddress as string,
            contactPhone: contactPhone as string,
            razorpayOrderId: razorpay_order_id as string,
            razorpayPaymentId: razorpay_payment_id as string,
            supabaseClient: supabase,
            status: "Confirmed",
        });

        if (error) {
            throw new Error(error);
        }

        return NextResponse.json(
            { message: "Payment verified successfully", orderId },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
